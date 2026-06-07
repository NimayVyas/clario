import { mockSources } from "../data/mockSources";
import { SourceConnectorCard } from "../components/sources/SourceConnectorCard";

export function Sources() {
  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-2xl font-semibold text-slate-950">Sources</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">Clario is designed to use compliant data sources including public APIs, approved feeds, partner integrations, manual uploads, and sources where collection is permitted.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockSources.map((source) => <SourceConnectorCard key={source.id} source={source} />)}
      </div>
    </div>
  );
}
