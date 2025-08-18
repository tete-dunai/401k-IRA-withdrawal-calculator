import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { computeNri, computeRor } from "./lib/calc";
import { FX } from "./lib/bracket";

function App() {
  const [selectedOption, setSelectedOption] = useState<"yes" | "no" | null>(null);
  const [amount, setAmount] = useState("");
  const [selectedFund, setSelectedFund] = useState<"401k" | "Roth 401k" | "IRA" | "Roth IRA" | null>(null);

  const navigate = useNavigate();

  const parseAmountUSD = (s: string): number => {
    const num = Number((s || "").replace(/[^0-9]/g, ""));
    return Number.isFinite(num) ? num : 0;
  };

  const formatUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  const handleCalculate = () => {
    const A = parseAmountUSD(amount);
    const early = selectedOption === "yes";

    const res = computeNri(A, early);
    const ror = computeRor(A, early);

    const nriResult = {
      usaTax: formatUSD(res.usaTaxUSD),
      indiaTax: formatINR(0),
      penalty: formatUSD(res.penaltyUSD),
      totalDeducted: formatUSD(res.totalDeductedUSD),
      totalReceivable: formatUSD(res.receivableUSD),
    };

    const rorResult = {
      usaTax: formatUSD(ror.usaTaxUSD),
      indiaTax: formatINR(ror.indiaTaxUSD * FX),
      penalty: formatUSD(ror.penaltyUSD),
      totalDeducted: formatUSD(ror.totalDeductedUSD),
      totalReceivable: formatUSD(ror.receivableUSD),
    };

    navigate("/results", { state: { nriResult, rnorResult: nriResult, rorResult } });
  };

  return (
    <div className="min-h-screen bg-white">
      <div class="bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold mt-4 text-center">401k / IRA Withdrawal Calculator</h1>
      <p className="text-center mt-8 text-xl">Are you withdrawing before 59½ age ?</p>
      <div className="flex justify-center mt-6 gap-12">
        <button
          onClick={() => setSelectedOption("yes")}
          className={`rounded-[16px] px-7 py-2 text-base font-medium cursor-pointer transition-[border-color,box-shadow,background-color] duration-200 ${
            selectedOption === "yes"
              ? "bg-[#e6ffed] shadow-[0_0_10px_2px_#9ae6b4] border border-transparent"
              : "bg-gray-50 border border-gray-100 shadow-sm hover:border-gray-200"
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => setSelectedOption("no")}
          className={`rounded-[16px] px-7 py-2 text-base font-medium cursor-pointer transition-[border-color,box-shadow,background-color] duration-200 ${
            selectedOption === "no"
              ? "bg-[#ffecec] shadow-[0_0_10px_2px_#feb2b2] border border-transparent"
              : "bg-gray-50 border border-gray-100 shadow-sm hover:border-gray-200"
          }`}
        >
          No
        </button>
      </div>
      <p className="text-center mt-8 text-xl">Amount withdrawing from the fund ?</p>
      <div className="flex justify-center mt-4">
        <input
          type="text"
          value={amount ? "$" + amount : ""}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            setAmount(formatted);
          }}
          className="border-2 border-gray-100 focus:border-green-50 focus:shadow-[0_0_10px_2px_#9ae6b4] rounded-[16px] px-4 py-2 text-center text-lg focus:outline-none focus:bg-green-50"
          placeholder="Enter amount $ "
        />
      </div>
      <p className="text-center mt-8 text-xl">What is your retirement fund investment?</p>
      <div className="flex justify-center mt-6 gap-4 flex-wrap">
        {["401k", "Roth 401k", "IRA", "Roth IRA"].map((fund) => (
          <button
            key={fund}
            onClick={() => setSelectedFund(fund as "401k" | "Roth 401k" | "IRA" | "Roth IRA")}
            className={`rounded-[16px] px-4 py-2 text-base font-medium cursor-pointer transition-[border-color,box-shadow,background-color] duration-200 ${
              selectedFund === fund
                ? "bg-[#e6ffed] shadow-[0_0_10px_2px_#9ae6b4] border border-transparent"
                : "bg-gray-50 border border-gray-100 shadow-sm hover:border-gray-200"
            }`}
          >
            {fund}
          </button>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleCalculate}
          className="bg-[#4ffdc9] text-gray-900 rounded-[16px] px-7 py-2 text-base font-medium hover:bg-[#52f3c2] transition-colors duration-200"
        >
          Calculate
        </button>
      </div>
      <div className="mb-10"></div>
      </div>
    </div>
  );
}

export default App;
