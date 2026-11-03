import { Check, ArrowRight } from "lucide-react";
import CmsImage from "./CmsImage";
import PillarVideo from "./PillarVideo";
import Reveal from "./Reveal";
import { DEFAULT_IMAGE_CONFIGS } from "../utils/imageDefaults";

// Brand pillars. Copy is locked (see docs/redesign/PRD.md §4): restyle only.
const PILLAR_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4";

const card = "flex min-h-[440px] flex-col justify-between bg-white p-6 md:p-8 h-full";
const iconBox = "relative h-12 w-12 overflow-hidden border border-border-theme bg-white";
const title = "mb-6 font-serif text-2xl font-light tracking-wide";
const item = "flex gap-3 items-start";
const check = "w-4 h-4 text-primary shrink-0 mt-0.5";
const itemText = "text-xs text-text-muted font-light leading-relaxed";
const link =
  "group/link mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-primary hover:underline underline-offset-8";
const linkArrow = "w-3.5 h-3.5 rotate-[-45deg] transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5";

export default function Features() {
  const headerSegments = [
    {
      text: "Wearable scripture forged for silent battles. ",
      className: "text-primary font-light",
    },
    {
      text: "Dark. Sacred. Spare. Speaks in fragments.",
      className: "text-text-dim font-light italic font-serif",
    },
  ];

  return (
    <section id="features" className="bg-white px-4 py-24 sm:px-6 md:py-32 lg:px-10 border-t border-border-theme">
      {/* Header Container */}
      <div className="mx-auto mb-16 max-w-4xl text-center">
        <span className="mb-5 block text-[11px] uppercase tracking-[0.3em] text-primary">
          THE SIGNATURE PILLARS
        </span>
        <h2 className="text-2xl leading-snug sm:text-3xl md:text-4xl">
          {headerSegments.map((seg) => (
            <span key={seg.text} className={seg.className}>
              {seg.text}
            </span>
          ))}
        </h2>
      </div>

      {/* Flat 4-column grid; each cell draws its right/bottom hairline, the grid draws top/left. */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 border-l border-t border-border-theme md:grid-cols-2 lg:grid-cols-4">

        {/* Card 1 - Video Card */}
        <Reveal fadeOnly className="h-full border-b border-r border-border-theme">
          <div className="relative flex min-h-[440px] h-full flex-col justify-end overflow-hidden bg-black p-6 text-white md:p-8">
            <PillarVideo
              src={PILLAR_VIDEO}
              poster={DEFAULT_IMAGE_CONFIGS.scripture.lightUrl}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Card Content */}
            <div className="relative">
              <span className="text-[10px] text-white/70 tracking-[0.25em] block mb-2 uppercase">
                Artifact Showcase
              </span>
              <h3 className="font-serif italic text-3xl font-light leading-none">
                Sacred silhouettes.
              </h3>
            </div>
          </div>
        </Reveal>

        {/* Card 2 - Struggle */}
        <Reveal fadeOnly delay={60} className="h-full border-b border-r border-border-theme">
          <div className={card}>
            <div>
              {/* Icon Header */}
              <div className="flex items-center justify-between mb-10">
                <div className={iconBox}>
                  <CmsImage slot="struggle" fallback={DEFAULT_IMAGE_CONFIGS.struggle.lightUrl} alt="Struggle Icon" sizes="48px" className="object-cover" />
                </div>
                <span className="text-xs text-text-dim tracking-wider">
                  01
                </span>
              </div>

              {/* Title */}
              <h3 className={title}>
                01. Armored Build
              </h3>

              {/* Checklist */}
              <ul className="space-y-4">
                <li className={item}>
                  <Check className={check} strokeWidth={1.5} />
                  <span className={itemText}>
                    Engineered with 480GSM ultra-heavyweight cotton canvas and combed loopback weave.
                  </span>
                </li>
                <li className={item}>
                  <Check className={check} strokeWidth={1.5} />
                  <span className={itemText}>
                    Structured contours and dropped shoulders that drape to act as a physical shield.
                  </span>
                </li>
                <li className={item}>
                  <Check className={check} strokeWidth={1.5} />
                  <span className={itemText}>
                    Distressed raw edge hems symbolizing lifetime resilience and the weight of struggle.
                  </span>
                </li>
              </ul>
            </div>

            {/* Learn More Link */}
            <div>
              <a href="#about" className={link}>
                <span>DESCEND FURTHER</span>
                <ArrowRight className={linkArrow} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Card 3 - Faith */}
        <Reveal fadeOnly delay={120} className="h-full border-b border-r border-border-theme">
          <div className={card}>
            <div>
              {/* Icon Header */}
              <div className="flex items-center justify-between mb-10">
                <div className={iconBox}>
                  <CmsImage slot="faith" fallback={DEFAULT_IMAGE_CONFIGS.faith.lightUrl} alt="Faith Icon" sizes="48px" className="object-cover" />
                </div>
                <span className="text-xs text-text-dim tracking-wider">
                  02
                </span>
              </div>

              {/* Title */}
              <h3 className={title}>
                02. Hidden Inscriptions
              </h3>

              {/* Checklist */}
              <ul className="space-y-4">
                <li className={item}>
                  <Check className={check} strokeWidth={1.5} />
                  <span className={itemText}>
                    Private scripture fragments printed on the interior lining of collars and hoods.
                  </span>
                </li>
                <li className={item}>
                  <Check className={check} strokeWidth={1.5} />
                  <span className={itemText}>
                    High-density oxblood and matte black gothic calligraphy chest embroidery.
                  </span>
                </li>
                <li className={item}>
                  <Check className={check} strokeWidth={1.5} />
                  <span className={itemText}>
                    A personal dialogue between the garment and your skin, representing silent faith.
                  </span>
                </li>
              </ul>
            </div>

            {/* Learn More Link */}
            <div>
              <a href="#about" className={link}>
                <span>READ SCRIPTA</span>
                <ArrowRight className={linkArrow} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Card 4 - Transcendence */}
        <Reveal fadeOnly delay={180} className="h-full border-b border-r border-border-theme">
          <div className={card}>
            <div>
              {/* Icon Header */}
              <div className="flex items-center justify-between mb-10">
                <div className={iconBox}>
                  <CmsImage slot="transcendence" fallback={DEFAULT_IMAGE_CONFIGS.transcendence.lightUrl} alt="Transcendence Icon" sizes="48px" className="object-cover" />
                </div>
                <span className="text-xs text-text-dim tracking-wider">
                  03
                </span>
              </div>

              {/* Title */}
              <h3 className={title}>
                03. Archival Relics
              </h3>

              {/* Checklist */}
              <ul className="space-y-4">
                <li className={item}>
                  <Check className={check} strokeWidth={1.5} />
                  <span className={itemText}>
                    Limited production runs of exactly 64 hand-numbered replicas per silhouette.
                  </span>
                </li>
                <li className={item}>
                  <Check className={check} strokeWidth={1.5} />
                  <span className={itemText}>
                    Custom hand-numbered leather patches and woven interior tracking codes.
                  </span>
                </li>
                <li className={item}>
                  <Check className={check} strokeWidth={1.5} />
                  <span className={itemText}>
                    Each garment stands as a certified relic of struggle, faith, and transcendence.
                  </span>
                </li>
              </ul>
            </div>

            {/* Learn More Link */}
            <div>
              <a href="#about" className={link}>
                <span>ENTER THE RITUAL</span>
                <ArrowRight className={linkArrow} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
