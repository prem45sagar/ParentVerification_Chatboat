import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';

const InsightsWidget = ({ data }) => {
  if (!data) return null;

  return (
    <div className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl p-4 md:p-5 shadow-sm text-[#ececec]">
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#f59e0b]/20 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-[#f59e0b]" />
        </div>
        <h3 className="font-semibold text-[15px]">Performance Insights</h3>
      </div>

      <div className={`grid grid-cols-1 ${data.showStrong !== false && data.showWeak !== false ? 'md:grid-cols-2' : ''} gap-3 mb-4`}>
        {data.showStrong !== false && (
          <div className="bg-[#1E1E1E] rounded-lg p-3 border border-white/5 border-l-2 border-l-[#10b981]">
          <h4 className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" /> Strong Subjects
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.strongSubjects && data.strongSubjects.length > 0 ? (
              data.strongSubjects.map((sub, i) => (
                <span key={i} className="px-2 py-1 bg-[#10b981]/10 text-[#10b981] text-sm rounded-md font-medium">
                  {sub}
                </span>
              ))
            ) : (
              <span className="text-sm text-[#6e6e6e]">No data available</span>
            )}
          </div>
        </div>
        )}

        {data.showWeak !== false && (
        <div className="bg-[#1E1E1E] rounded-lg p-3 border border-white/5 border-l-2 border-l-[#ef4444]">
          <h4 className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-[#ef4444]" /> Weak Subjects
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.weakSubjects && data.weakSubjects.length > 0 ? (
              data.weakSubjects.map((sub, i) => (
                <span key={i} className="px-2 py-1 bg-[#ef4444]/10 text-[#ef4444] text-sm rounded-md font-medium">
                  {sub}
                </span>
              ))
            ) : (
              <span className="text-sm text-[#6e6e6e]">No data available</span>
            )}
          </div>
        </div>
        )}
      </div>

    </div>
  );
};

export default InsightsWidget;
