import Reveal from "./Reveal";

// Brand story. Copy is locked (see docs/redesign/PRD.md §4): restyle only.
export default function About() {
  const headingSegments = [
    {
      text: "Derived from the Hebrew Gibbor, ",
      className: "font-light",
    },
    {
      text: "a mighty warrior, hero, ",
      className: "text-primary font-light",
    },
    {
      text: "Ghubor makes wearable scripture for people fighting battles nobody sees.",
      className: "font-light",
    },
  ];

  // Concise body text
  const bodyText =
    "Ghubor makes wearable scripture for the silent battles nobody else sees. Each garment stands as a concrete testament of struggle, faith, and transcendence—meticulously engineered to feel like armor, constructed to become second skin.";

  return (
    <section id="about" className="bg-white px-6 py-24 md:py-32 border-t border-border-theme">
      <Reveal className="mx-auto max-w-[880px] text-center">
        {/* Small Category Label */}
        <span className="mb-8 inline-block text-[11px] uppercase tracking-[0.3em] text-primary">
          The Mythos & Foundation
        </span>

        {/* Main Heading Segmented and Styled */}
        <h2 className="text-3xl leading-[1.15] tracking-tight sm:text-4xl md:text-5xl">
          {headingSegments.map((seg) => (
            <span key={seg.text} className={seg.className}>
              {seg.text}
            </span>
          ))}
        </h2>

        {/* Divider */}
        <div className="mx-auto my-12 h-px w-16 bg-primary/30" />

        <p className="mx-auto max-w-2xl text-base font-light leading-relaxed tracking-wide text-text-muted md:text-lg">
          {bodyText}
        </p>

        {/* Brand Foundation Emotional Pillars Summary */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-4 border-t border-border-theme pt-8">
          <div>
            <h4 className="text-[10px] sm:text-xs font-bold text-primary tracking-widest uppercase">Struggle</h4>
            <p className="text-[9px] sm:text-[10px] text-text-dim font-light mt-1.5 uppercase tracking-wider">The weight of human</p>
          </div>
          <div>
            <h4 className="text-[10px] sm:text-xs font-bold text-primary tracking-widest uppercase">Faith</h4>
            <p className="text-[9px] sm:text-[10px] text-text-dim font-light mt-1.5 uppercase tracking-wider">Belief without proof</p>
          </div>
          <div>
            <h4 className="text-[10px] sm:text-xs font-bold text-primary tracking-widest uppercase">Transcendence</h4>
            <p className="text-[9px] sm:text-[10px] text-text-dim font-light mt-1.5 uppercase tracking-wider">Armor becomes skin</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
