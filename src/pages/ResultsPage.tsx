
import { Link, useLocation } from "react-router-dom";
import ResultsContainer from "../components/ResultsContainer";

// Local type matching the ResultsContainer `data` prop shape
export type CardData = {
  usaTax: string;
  indiaTax: string;
  penalty: string;
  totalDeducted: string;
  totalReceivable: string;
};

// Router state shape when navigating to this page
type LocationState = {
  nriResult?: CardData;
  rnorResult?: CardData;
  rorResult?: CardData;
};

export default function ResultsPage() {
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const { nriResult, rnorResult, rorResult } = state;
  const hasAny = Boolean(nriResult || rnorResult || rorResult);

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#213547] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Results</h1>
          <Link
            to="/"
            className="bg-[#4ffdc9] text-gray-900 rounded-[12px] px-4 py-2 text-sm font-medium hover:bg-[#52f3c2] transition-colors"
          >
            ← Recalculate
          </Link>
        </div>

        {!hasAny && (
          <div className="bg-[#ffffff] border border-[#1f2530] rounded-xl p-6 text-sm text-gray-300">
            No results found. Go back and calculate first.
          </div>
        )}

        {nriResult && (
          <ResultsContainer title="NRI" data={nriResult} />
        )}
        {rnorResult && (
          <ResultsContainer title="RNOR" data={rnorResult} />
        )}
        {rorResult && (
          <ResultsContainer title="ROR" data={rorResult} />
        )}
      </div>
    </div>
  );
}
