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
    <div className="w-full px-6 sm:px-6 pt-6 pb-10 max-w-[600px] mx-auto">
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
          <ResultsContainer title="NRI" data={nriResult} className="w-full max-w-[480px] sm:max-w-[900px] mx-auto my-10" />
        )}
        {rnorResult && (
          <ResultsContainer title="RNOR" data={rnorResult} className="w-full max-w-[480px] sm:max-w-[900px] mx-auto my-10" />
        )}
        {rorResult && (
          <ResultsContainer title="ROR" data={rorResult} className="w-full max-w-[480px] sm:max-w-[900px] mx-auto my-10" />
        )}
      <p className="text-sm text-[#213547] mt-8 text-center">
        Disclaimer: These are estimated trial values. Please consult experts to derive accurate calculations.
      </p>
    </div>
  );
}
