import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Resolve DHL Credentials (payload settings override process.env variables)
    const apiKey = body.apiKey || process.env.DHL_API_KEY;
    const apiSecret = body.apiSecret || process.env.DHL_API_SECRET;
    const accountNumber = body.accountNumber || process.env.DHL_API_ACCOUNT_NUMBER;
    const isProduction = body.isProduction !== undefined ? body.isProduction : (process.env.DHL_IS_PRODUCTION === "true");

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "DHL API Key and Secret must be configured." },
        { status: 400 }
      );
    }

    if (!accountNumber) {
      return NextResponse.json(
        { error: "DHL Shipper Account Number is required to create shipments." },
        { status: 400 }
      );
    }

    // 2. Set base URL based on sandbox/production environment
    const baseUrl = isProduction
      ? "https://express.api.dhl.com/mydhlapi"
      : "https://express.api.dhl.com/mydhlapi/test";

    // 3. Format shipping date (must be in the future - we'll set it to 2 hours from now)
    const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
    // DHL expects: YYYY-MM-DDTHH:mm:ssZ (ISO 8601 format, removing milliseconds)
    const plannedShippingDateAndTime = futureDate.toISOString().replace(/\.\d{3}/, "");

    // 4. Assemble shipper and receiver postal address arrays safely
    const shipperStreet = body.shipperDetails.street || "";
    const receiverStreet = body.receiverDetails.street || "";

    // 5. Construct payload for DHL Express API
    const dhlPayload = {
      plannedShippingDateAndTime,
      pickup: {
        isRequested: false
      },
      productCode: body.productCode || "P", // "P" is standard Express Worldwide parcel
      accounts: [
        {
          typeCode: "shipper",
          number: accountNumber
        }
      ],
      customerDetails: {
        shipperDetails: {
          postalAddress: {
            postalCode: String(body.shipperDetails.postalCode || ""),
            cityName: body.shipperDetails.city || "",
            countryCode: (body.shipperDetails.countryCode || "IN").toUpperCase(),
            streetLines: [
              shipperStreet.slice(0, 45), // DHL Max street line length limit is usually 45
            ]
          },
          contactInformation: {
            fullName: body.shipperDetails.contactName || "Warehouse Staff",
            phone: body.shipperDetails.phone || "0000000000",
            email: body.shipperDetails.email || "warehouse@ghubor.com",
            companyName: body.shipperDetails.companyName || `Ghubor Warehouse ${body.shipperDetails.warehouseNo || ""}`
          }
        },
        receiverDetails: {
          postalAddress: {
            postalCode: String(body.receiverDetails.postalCode || ""),
            cityName: body.receiverDetails.city || "",
            countryCode: (body.receiverDetails.countryCode || "IN").toUpperCase(),
            streetLines: [
              receiverStreet.slice(0, 45)
            ]
          },
          contactInformation: {
            fullName: body.receiverDetails.fullName || "Recipient Customer",
            phone: body.receiverDetails.phone || "0000000000",
            email: body.receiverDetails.email || "customer@example.com"
          }
        }
      },
      content: {
        packages: [
          {
            typeCode: body.packageDetails.typeCode || "3BP", // e.g. "3BP" cardboard box
            weight: parseFloat(body.packageDetails.weight) || 0.5,
            dimensions: {
              length: parseInt(body.packageDetails.length) || 10,
              width: parseInt(body.packageDetails.width) || 10,
              height: parseInt(body.packageDetails.height) || 10
            }
          }
        ],
        isCustomsDeclarable: body.customsDeclarable || false,
        description: body.packageDetails.description || "Ghubor Apparel Shipment",
        ...(body.customsDeclarable ? {
          declaredValue: parseFloat(body.declaredValue) || 10.0,
          declaredValueCurrency: body.declaredValueCurrency || "INR"
        } : {})
      },
      outputImageProperties: {
        printerDPI: 300,
        encodingFormat: "pdf",
        imageOptions: [
          {
            typeCode: "label",
            templateName: "ECOM26_A6_001", // Standard 4x6 label
            isRequested: true,
            hideInstruction: true
          }
        ]
      }
    };

    // 6. Basic Authentication encoding
    const authString = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    // 7. Make API request
    const response = await fetch(`${baseUrl}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authString}`,
        "DHL-API-Key": apiKey
      },
      body: JSON.stringify(dhlPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DHL API Error Response:", data);
      
      // Extract DHL specific error message
      const errorMsg = data.detail || 
                       (data.additionalDetails && data.additionalDetails[0]?.message) || 
                       data.message || 
                       "DHL API Shipment Creation failed.";
      return NextResponse.json({ error: errorMsg, details: data }, { status: response.status });
    }

    // 8. Extract tracking number and label PDF Base64 content
    const shipmentTrackingNumber = data.shipmentTrackingNumber;
    let labelPdfBase64 = "";

    if (data.documents && Array.isArray(data.documents)) {
      const labelDoc = data.documents.find((d: any) => d.typeCode === "label" || d.typeCode === "waybill");
      if (labelDoc) {
        labelPdfBase64 = labelDoc.content;
      }
    }

    const trackingUrl = `https://www.dhl.com/en/express/tracking.html?AWB=${shipmentTrackingNumber}`;

    return NextResponse.json({
      success: true,
      shipmentTrackingNumber,
      trackingUrl,
      labelPdfBase64,
      dhlData: data
    });

  } catch (error: any) {
    console.error("DHL shipment route handler exception:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
