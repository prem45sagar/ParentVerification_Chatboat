import React from 'react';

const AttendanceWidget = ({ data }) => {
  // Fallback to empty defaults if data is not yet available
  const overall   = data?.overall ?? 0;
  const subjects  = data?.subjects ?? [];
  const notice    = data?.notice ?? '';

  return (
    <div className="w-full text-white/90 text-[15px] font-light leading-relaxed tracking-wide space-y-4">
      <div>
        <strong className="font-medium text-white">Overall Attendance:</strong>{' '}
        <span className={overall < 75 ? 'text-red-400 font-medium' : 'text-emerald-400 font-medium'}>
          {overall}%
        </span>
      </div>

      <div className="pt-2">
        <strong className="font-medium text-white block mb-2">Subject Breakdown:</strong>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[#d1d5db]">
          {subjects.map((sub, idx) => (
            <li key={idx}>
              {sub.name}:{' '}
              <strong className={sub.warning ? 'text-red-400' : 'text-white'}>
                {sub.current}%
              </strong>
              {sub.warning && (
                <span className="text-red-400/80 text-sm italic ml-2">(Below required 75%)</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {notice && (
        <p className="pt-2 text-[#d1d5db]">
          <em>Notice:</em> {notice}
        </p>
      )}
    </div>
  );
};

export default AttendanceWidget;
