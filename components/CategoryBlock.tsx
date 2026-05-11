import AssetCard from './AssetCard';
import type { DayBriefing } from '@/lib/types';
import type { CategoryMeta } from '@/lib/slugs';
import { getAsset } from '@/lib/slugs';

interface Props {
  category: CategoryMeta;
  briefing: DayBriefing | null;
}

export default function CategoryBlock({ category, briefing }: Props) {
  return (
    <section className="category-block">
      <div className="category-header">
        <div className="left">
          <span className="category-name">{category.label}</span>
          <span className="category-count">{category.countLabel}</span>
        </div>
      </div>
      <div className="asset-grid">
        {category.slugs.map(slug => {
          const meta = getAsset(slug);
          if (!meta) return null;
          return (
            <AssetCard
              key={slug}
              meta={meta}
              briefing={briefing?.assets[slug]}
            />
          );
        })}
      </div>
    </section>
  );
}
