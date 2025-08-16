import React from 'react';

type ResultsData = {
  usaTax: string | number;
  indiaTax: string | number;
  penalty: string | number;
  totalDeducted: string | number;
  totalReceivable: string | number;
};

type ResultsContainerProps = {
  title: string;
  data: ResultsData;
};

const ResultsContainer: React.FC<ResultsContainerProps> = ({ title, data }) => {
  return (
    <div className="bg-green-50 rounded-[16px] p-4 pb-4 pt-3 mt-8 mx-auto max-w-3xl border border-green-200 shadow-[0_0_10px_2px_#9ae6b4]">
      <div className="text-lg font-medium text-gray-900 text-center mb-3">{title}</div>
      <div className="grid grid-cols-3 text-center gap-1">
        <div>
          <div className="text-sm font-medium">USA Tax</div>
          <div className="bg-white rounded-[16px] py-1.5 shadow w-48 mx-auto">{data.usaTax}</div>
        </div>
        <div>
          <div className="text-sm font-medium">India Tax</div>
          <div className="bg-white rounded-[16px] py-1.5 shadow w-48 mx-auto">{data.indiaTax}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Penalty</div>
          <div className="bg-white rounded-[16px] py-1.5 shadow w-48 mx-auto">{data.penalty}</div>
        </div>
      </div>
      <div className="flex justify-center gap-10 mt-3 text-center">
        <div>
          <div className="text-sm font-medium">Total Deducted</div>
          <div className="bg-white rounded-[16px] py-1.5 shadow mt-1.5 w-48 mx-auto min-h-[32px]">{data.totalDeducted}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Total Receivable</div>
          <div className="bg-white rounded-[16px] py-1.5 shadow mt-1.5 w-48 mx-auto min-h-[32px]">{data.totalReceivable}</div>
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;