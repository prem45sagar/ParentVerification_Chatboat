import React from 'react';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function gradeColor(grade) {
  if (['S', 'A+'].includes(grade)) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
  if (['A', 'B'].includes(grade))  return 'text-sky-400     bg-sky-500/10     border-sky-500/25';
  if (grade === 'C')               return 'text-amber-400   bg-amber-500/10   border-amber-500/25';
  if (grade === 'D')               return 'text-orange-400  bg-orange-500/10  border-orange-500/25';
  return                                   'text-red-400     bg-red-500/10     border-red-500/25';
}

function barColor(pct) {
  if (pct >= 75) return 'bg-emerald-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function statusBadge(st) {
  if (st === 'Completed') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (st === 'Backlog')   return 'text-red-400     bg-red-500/10     border-red-500/20';
  if (st === 'Repeated')  return 'text-orange-400  bg-orange-500/10  border-orange-500/20';
  return 'text-[#a0a0a0] bg-white/5 border-white/10';
}

/* ─── Subject-Marks view ──────────────────────────────────────────────────── */
function SubjectMarksView({ data }) {
  const subjects = data?.subjects ?? [];
  const cgpa     = data?.currentCGPA ?? '—';
  const sem      = data?.semester ?? '';

  return (
    <div className="w-full space-y-5">
      {/* Header strip */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-white/40 font-medium">
            Semester {sem} · Subject-wise Marks
          </p>
          <p className="text-xs text-[#6e6e6e] mt-0.5">
            Internal /30 &nbsp;·&nbsp; External /70 &nbsp;·&nbsp; Total /100
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-white/30">CGPA</p>
          <p className={`text-xl font-bold ${cgpa >= 8.5 ? 'text-emerald-400' : cgpa >= 6.5 ? 'text-amber-400' : 'text-red-400'}`}>
            {cgpa}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-white/8">
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10" style={{ background: '#111' }}>
              <tr>
                <th className="py-2.5 px-4 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Subject</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider text-center">Int</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider text-center">Ext</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider text-center">Total</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider text-center">Grade</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider text-center hidden sm:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {subjects.map((s, i) => {
                const totalPct = (s.total / 100) * 100;
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 min-w-0">
                      <p className="text-[12px] text-white/85 font-medium leading-snug truncate max-w-[140px]">{s.subject}</p>
                      {/* Mini progress bar */}
                      <div className="mt-1.5 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barColor(totalPct)}`}
                          style={{ width: `${totalPct}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-[12px] text-white/70 font-mono">{s.internal}</td>
                    <td className="py-3 px-3 text-center text-[12px] text-white/70 font-mono">{s.external}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[12px] font-bold ${s.total >= 60 ? 'text-emerald-400' : s.total >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                        {s.total}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${gradeColor(s.grade)}`}>
                        {s.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center hidden sm:table-cell">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${statusBadge(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <p className="text-[10px] text-[#4a4a4a] text-center">
        Marks are derived from SGPA. Int = Internal (max 30) · Ext = External (max 70)
      </p>
    </div>
  );
}

/* ─── Default (CGPA / Semester / Year) view ──────────────────────────────── */
function DefaultPerformanceView({ data }) {
  const cgpa          = data?.currentCGPA ?? '—';
  const credits       = data?.creditsCompleted ?? 0;
  const grades        = data?.recentGrades ?? [];
  const status        = data?.status ?? '—';
  const totalBacklogs = data?.totalBacklogs ?? 0;
  const isOverallView = ['Excellent', 'Good', 'Average', 'Needs Improvement'].includes(status);

  return (
    <div className="w-full text-white/90 text-[15px] font-light leading-relaxed tracking-wide space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`${isOverallView ? 'col-span-2' : ''} bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center`}>
          <span className="text-xs uppercase tracking-widest text-white/50 mb-1">Current CGPA</span>
          <span className={`text-2xl font-semibold ${cgpa >= 8.5 ? 'text-emerald-400' : cgpa >= 6.5 ? 'text-yellow-400' : 'text-red-400'}`}>
            {cgpa}
          </span>
        </div>

        {!isOverallView && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-white/50 mb-1">Total Backlogs</span>
            <span className={`text-2xl font-semibold ${totalBacklogs > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {totalBacklogs}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs uppercase tracking-widest text-white/50 font-medium">Detailed Performance</span>
          <span className="text-[11px] px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 uppercase tracking-tighter">
            {status}
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="max-h-[240px] overflow-y-auto">
            {grades.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 z-10">
                  <tr>
                    <th className="py-3 px-4 text-[11px] font-medium text-white/40 uppercase tracking-wider">Subject / Period</th>
                    <th className="py-3 px-4 text-[11px] font-medium text-white/40 uppercase tracking-wider text-center">Grade</th>
                    <th className="py-3 px-4 text-[11px] font-medium text-white/40 uppercase tracking-wider text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {grades.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-white/80 font-medium text-sm truncate max-w-[150px]">
                        {item.subject}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${gradeColor(item.grade)}`}>
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-white/70 font-mono text-sm">
                        {typeof item.points === 'number' ? item.points.toFixed(2) : item.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-white/30 text-xs italic">
                No detailed breakdown available
              </div>
            )}
          </div>
        </div>
      </div>

      {!isOverallView && (
        <p className="text-[12px] text-white/40 italic px-1">
          Credits Completed: <span className="text-white/60 font-medium">{credits}</span>
        </p>
      )}
    </div>
  );
}

/* ─── Root widget ─────────────────────────────────────────────────────────── */
const AcademicPerformanceWidget = ({ data }) => {
  if (data?.view === 'subject_marks') {
    return <SubjectMarksView data={data} />;
  }
  return <DefaultPerformanceView data={data} />;
};

export default AcademicPerformanceWidget;
