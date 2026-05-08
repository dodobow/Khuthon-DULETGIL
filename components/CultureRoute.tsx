interface CultureRouteProps {
  selectedRegion: string
  selectedRelayRegion: string
  selectedRelayTitle: string
}

export default function CultureRoute({
  selectedRegion,
  selectedRelayRegion,
  selectedRelayTitle,
}: CultureRouteProps) {
  return (
    <section className="rounded-2xl border border-cyan-400/30 bg-white/10 p-4">
      <div className="space-y-3 text-center">
        <p className="text-sm font-bold text-cyan-300">
          내가 만든 문화 연결
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-lg font-black text-white">
          <span>{selectedRegion}</span>
          <span className="text-cyan-300">→</span>
          <span>{selectedRelayRegion}</span>
        </div>
        <p className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
          {selectedRelayTitle}
        </p>
      </div>
    </section>
  )
}
