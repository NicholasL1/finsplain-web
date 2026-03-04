interface PageHeroProps {
  readonly title: string;
  readonly subtitle: string;
  readonly badge?: string;
}

export default function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 overflow-hidden">
      {/* Centered emerald glow orb — vertically centered so blur fades before reaching section edges */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 text-center max-w-2xl relative">
        {badge && (
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              {badge}
            </span>
          </div>
        )}
        <h1 className="font-heading text-[40px] sm:text-[48px] font-bold text-foreground mb-4 leading-tight tracking-tight">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
      </div>

      {/* Bottom fade — dissolves orb ambient into the next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-b from-transparent to-background pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
