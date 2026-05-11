import type { BriefingSection } from '@/lib/types';

interface Props {
  section: BriefingSection;
}

export default function BriefingPanel({ section }: Props) {
  return (
    <div id={section.anchor} className="briefing-grid">
      <div className="briefing-section past">
        <div className="accent-bar" />
        <div className="briefing-label">Past</div>
        <div className="briefing-sub">What happened</div>
        <div className="briefing-body">{section.past}</div>
      </div>

      <div className="briefing-section why">
        <div className="accent-bar" />
        <div className="briefing-label">Why</div>
        <div className="briefing-sub">Why it matters</div>
        <div className="briefing-body">{section.why}</div>
      </div>

      <div className="briefing-section watch">
        <div className="accent-bar" />
        <div className="briefing-label">Watch</div>
        <div className="briefing-sub">What to watch</div>
        <div className="briefing-body">{section.watch}</div>
      </div>
    </div>
  );
}
