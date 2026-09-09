import TimelineActivityExample from './activity';

export default function TimelineDensityExample() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      {(['comfortable', 'compact'] as const).map((density) => (
        <section key={density} className="grid content-start gap-4">
          <h3 className="m-0 text-sm font-medium">
            {density === 'compact' ? '좁은 간격' : '기본 간격'}
          </h3>
          <TimelineActivityExample density={density} />
        </section>
      ))}
    </div>
  );
}
