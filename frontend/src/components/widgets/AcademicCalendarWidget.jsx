import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  CalendarDays, Download, ChevronDown, ChevronUp,
  Bell, BellRing, X, Gift, BookOpen, AlertCircle, Star, Clock
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   EXACT data extracted from the official Vignan's FSTR Academic Calendar
   2025-26 · Semester II · B.Tech 2nd, 3rd & 4th Year

   Exam entries with the SAME name on consecutive / near-consecutive days are
   collapsed into ONE range entry {dateStart, dateEnd, label, type}.
   Single-day events use dateStart === dateEnd (or just dateStart).
───────────────────────────────────────────────────────────────────────────── */
const CALENDAR_EVENTS = [
  // ── Academic milestones ──────────────────────────────────────────────────
  { dateStart: '2025-12-22', label: 'Commencement of Module-1 (II Sem)', type: 'academic' },
  { dateStart: '2026-02-21', label: 'Commencement of Module-2',          type: 'academic' },

  // ── Holidays ─────────────────────────────────────────────────────────────
  { dateStart: '2025-12-25', label: 'Holiday – Christmas',               type: 'holiday' },
  { dateStart: '2026-01-14', label: 'Holiday – Bhogi',                   type: 'holiday' },
  { dateStart: '2026-01-15', label: 'Holiday – Pongal',                  type: 'holiday' },
  { dateStart: '2026-01-16', label: 'Holiday – Kanuma',                  type: 'holiday' },
  { dateStart: '2026-01-17', label: 'Additional Holiday',                type: 'holiday' },
  { dateStart: '2026-01-26', label: 'Holiday – Republic Day',            type: 'holiday' },
  { dateStart: '2026-02-15', label: 'Holiday – Mahashivaratri',          type: 'holiday' },
  { dateStart: '2026-02-16', label: 'Additional Holiday',                type: 'holiday' },
  { dateStart: '2026-03-04', label: 'Holiday – Holi',                    type: 'holiday' },
  { dateStart: '2026-03-19', label: 'Holiday – Ugadi',                   type: 'holiday' },
  { dateStart: '2026-03-21', label: 'Holiday – Ramzan',                  type: 'holiday' },
  { dateStart: '2026-03-26', label: 'Holiday – Srirama Navami',          type: 'holiday' },
  { dateStart: '2026-04-03', label: 'Holiday – Good Friday',             type: 'holiday' },
  { dateStart: '2026-04-05', label: 'Holiday – Dr. Babu Jagjivan Ram Jayanthi', type: 'holiday' },
  { dateStart: '2026-04-14', label: 'Holiday – Ambedkar Jayanthi',       type: 'holiday' },
  { dateStart: '2026-05-27', label: 'Holiday – Bakrid',                  type: 'holiday' },

  // ── Exams / Targets (range-consolidated) ─────────────────────────────────
  { dateStart: '2026-01-19', dateEnd: '2026-01-20', label: 'M1 Pre-Target 1',   type: 'exam' },
  // M1 Target 1: Sat 31-Jan, Mon 2-Feb, Tue 3-Feb
  { dateStart: '2026-01-31', dateEnd: '2026-02-03', label: 'M1 Target 1',        type: 'exam' },
  // M1 Target 3: Sat 14-Feb, then Tue 17-Feb (gap = holiday Mon 16-Feb)
  { dateStart: '2026-02-14', dateEnd: '2026-02-17', label: 'M1 Target 3',        type: 'exam' },
  // M1 Target 4: Wed 18-Feb – Fri 20-Feb
  { dateStart: '2026-02-18', dateEnd: '2026-02-20', label: 'M1 Target 4',        type: 'exam' },
  // M2 Pre-Target 1: Mon 16-Mar – Tue 17-Mar
  { dateStart: '2026-03-16', dateEnd: '2026-03-17', label: 'M2 Pre-Target 1',    type: 'exam' },
  // M2 Target 1: Wed 1-Apr, Thu 2-Apr, Sat 4-Apr (Good Friday gap 3-Apr)
  { dateStart: '2026-04-01', dateEnd: '2026-04-04', label: 'M2 Target 1',        type: 'exam' },
  // M1 Target 3 (second occurrence): Fri 17-Apr
  { dateStart: '2026-04-17', label: 'M1 Target 3',                               type: 'exam' },
  // M2 Target 3: Sat 18-Apr
  { dateStart: '2026-04-18', label: 'M2 Target 3',                               type: 'exam' },
  // M2 Target 4: Mon 20-Apr – Wed 22-Apr
  { dateStart: '2026-04-20', dateEnd: '2026-04-22', label: 'M2 Target 4',        type: 'exam' },

  // ── Assessments ──────────────────────────────────────────────────────────
  // Preparation & Summative Assessment (P-Based): Thu 23-Apr – Sat 25-Apr, Mon 27-Apr – Wed 29-Apr
  { dateStart: '2026-04-23', dateEnd: '2026-04-25', label: 'Preparation & Summative Assessment (P-Based)', type: 'assessment' },
  { dateStart: '2026-04-27', dateEnd: '2026-04-29', label: 'Preparation & Summative Assessment (P-Based)', type: 'assessment' },
  // Summative Assessment (L-Based): Thu 30-Apr – Sat 9-May, then Mon 11-May – Wed 13-May
  { dateStart: '2026-04-30', dateEnd: '2026-05-09', label: 'Summative Assessment (L-Based)',              type: 'assessment' },
  { dateStart: '2026-05-11', dateEnd: '2026-05-13', label: 'Summative Assessment (L-Based)',              type: 'assessment' },
];

/* ─── Config ─────────────────────────────────────────────────────────────── */
const TYPE_CONFIG = {
  holiday:    { icon: Gift,         color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25',  dot: 'bg-emerald-400',  label: 'Holiday' },
  exam:       { icon: BookOpen,     color: 'text-sky-400',     bg: 'bg-sky-500/10 border-sky-500/25',          dot: 'bg-sky-400',      label: 'Exam / Target' },
  assessment: { icon: AlertCircle,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/25',      dot: 'bg-amber-400',    label: 'Assessment' },
  academic:   { icon: Star,         color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/25',    dot: 'bg-violet-400',   label: 'Academic' },
};

const NOTIF_TYPE_CONFIG = {
  warning: { bg: 'bg-orange-500/15 border-orange-500/30', color: 'text-orange-300', icon: '⚠️' },
  holiday: { bg: 'bg-emerald-500/15 border-emerald-500/30', color: 'text-emerald-300', icon: '🏖️' },
  info:    { bg: 'bg-sky-500/15 border-sky-500/30', color: 'text-sky-300', icon: 'ℹ️' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function parseDate(str) { return new Date(str + 'T00:00:00'); }
function fmtDate(str) {
  const d = parseDate(str);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtRange(start, end) {
  if (!end || start === end) return fmtDate(start);
  const s = parseDate(start), e = parseDate(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} – ${e.getDate()} ${MONTHS[e.getMonth()]} ${e.getFullYear()}`;
  }
  return `${fmtDate(start)} – ${fmtDate(end)}`;
}
function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.ceil((parseDate(dateStr) - today) / 86400000);
}
function daysUntilEnd(endStr, startStr) {
  // For range events, show countdown to start; if started show "Ongoing"
  return daysUntil(startStr);
}

function groupByMonth(events) {
  const map = {};
  events.forEach(ev => {
    const d = parseDate(ev.dateStart);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map[key]) map[key] = { year: d.getFullYear(), month: d.getMonth(), events: [] };
    map[key].events.push(ev);
  });
  return Object.values(map).sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
}

/* ─── Main widget ─────────────────────────────────────────────────────────── */
const AcademicCalendarWidget = ({ data }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBell,     setShowBell]     = useState(false);
  const [notifications, setNotifications] = useState([]);
  const bellRef = useRef(null);

  /* Fetch admin notifications on mount */
  useEffect(() => {
    fetch('http://localhost:5001/api/notifications')
      .then(r => r.json())
      .then(d => { if (d.success) setNotifications(d.notifications); })
      .catch(() => {});
  }, []);

  /* Poll every 60 s for new notifications */
  useEffect(() => {
    const id = setInterval(() => {
      fetch('http://localhost:5001/api/notifications')
        .then(r => r.json())
        .then(d => { if (d.success) setNotifications(d.notifications); })
        .catch(() => {});
    }, 60000);
    return () => clearInterval(id);
  }, []);

  /* Close bell panel when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setShowBell(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const today = useMemo(() => { const t = new Date(); t.setHours(0,0,0,0); return t; }, []);

  /* Events in next 60 days */
  const upcoming = useMemo(() => {
    return CALENDAR_EVENTS.filter(ev => {
      const d = daysUntil(ev.dateStart);
      const endDate = ev.dateEnd ? parseDate(ev.dateEnd) : parseDate(ev.dateStart);
      // Show if end date is in future and start date is within 60 days OR already started but not ended
      return (endDate >= today) && d <= 60;
    });
  }, [today]);

  const monthGroups = useMemo(() => groupByMonth(upcoming), [upcoming]);

  /* Download original calendar */
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/academic_calendar.jpg';
    link.download = 'Vignan_Academic_Calendar_2025-26_Semester-II.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const unreadCount = notifications.length;

  return (
    <div className="w-full bg-[#232323] border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20 flex-shrink-0">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-white leading-tight">Academic Calendar 2025-26</h3>
          <p className="text-xs text-[#a0a0a0] font-medium uppercase tracking-widest mt-0.5">
            B.Tech · Semester II · Vignan's FSTR Vadlamudi
          </p>
        </div>

        {/* ── Bell button ── */}
        <div className="relative flex-shrink-0" ref={bellRef}>
          <button
            onClick={() => setShowBell(v => !v)}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
              showBell
                ? 'bg-[#8b5cf6]/20 border border-[#8b5cf6]/40'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
            title="Holiday / Schedule Notifications"
          >
            {unreadCount > 0
              ? <BellRing className="w-4 h-4 text-amber-400" style={{ animation: 'wiggle 2s ease-in-out infinite' }} />
              : <Bell className={`w-4 h-4 ${showBell ? 'text-[#a370f7]' : 'text-[#707070]'}`} />}
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* ── Notification panel ── */}
          {showBell && (
            <div
              className="absolute right-0 top-[46px] w-[300px] rounded-2xl z-50 overflow-hidden"
              style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-[#8b5cf6]" />
                  <span className="text-[12px] font-semibold text-white/80 tracking-wide">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[9px] font-bold bg-[#8b5cf6] text-white px-1.5 py-0.5 rounded-md">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowBell(false)}
                  className="w-5 h-5 rounded-md bg-white/5 hover:bg-white/12 flex items-center justify-center transition-colors group"
                >
                  <X className="w-3 h-3 text-[#606060] group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Body */}
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="w-8 h-8 text-[#333] mx-auto mb-3" />
                  <p className="text-[12px] text-[#555] font-medium">No notifications yet</p>
                  <p className="text-[10px] text-[#3a3a3a] mt-1">Admins will post holiday updates here</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n, idx) => {
                    const typeMap = {
                      holiday: { dot: '#10b981', tag: 'Holiday',  tagBg: 'rgba(16,185,129,0.12)', tagColor: '#34d399' },
                      warning: { dot: '#f97316', tag: 'Schedule', tagBg: 'rgba(249,115,22,0.12)', tagColor: '#fb923c' },
                      info:    { dot: '#38bdf8', tag: 'Notice',   tagBg: 'rgba(56,189,248,0.12)', tagColor: '#7dd3fc' },
                    };
                    const t = typeMap[n.type] || typeMap.info;
                    return (
                      <div
                        key={n.id}
                        className="px-4 py-3 hover:bg-white/[0.02] transition-colors"
                        style={{ borderBottom: idx < notifications.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Dot */}
                          <div className="mt-[5px] flex-shrink-0">
                            <span className="block w-2 h-2 rounded-full" style={{ background: t.dot, boxShadow: `0 0 6px ${t.dot}80` }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Tag + time */}
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                style={{ background: t.tagBg, color: t.tagColor }}
                              >
                                {t.tag}
                              </span>
                              <span className="text-[9px] text-[#484848] flex-shrink-0">{n.createdAt}</span>
                            </div>
                            {/* Message */}
                            <p className="text-[12px] text-[#d0d0d0] leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="px-4 py-2 text-[9px] text-[#383838] text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                Posted by Academic Admin · auto-refreshes every 60 s
              </div>
            </div>
          )}
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#8b5cf6]/15 hover:bg-[#8b5cf6]/25 border border-[#8b5cf6]/30 text-[#c4b5fd] hover:text-white text-[12px] font-semibold transition-all duration-200 flex-shrink-0"
          title="Download original calendar"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
      </div>

      {/* ── Inline alert banners (show when notifications exist) ── */}
      {notifications.length > 0 && (
        <div className="mb-5 space-y-2">
          {notifications.map(n => {
            const typeMap = {
              holiday: { icon: '🏖️', accent: '#10b981', tagBg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', tag: 'Holiday Update' },
              warning: { icon: '⚠️', accent: '#f97316', tagBg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.2)',  tag: 'Schedule Change' },
              info:    { icon: 'ℹ️', accent: '#38bdf8', tagBg: 'rgba(56,189,248,0.08)',   border: 'rgba(56,189,248,0.2)',   tag: 'Admin Notice' },
            };
            const t = typeMap[n.type] || typeMap.info;
            return (
              <div
                key={n.id}
                className="flex items-start gap-3 px-3.5 py-3 rounded-xl"
                style={{ background: t.tagBg, border: `1px solid ${t.border}` }}
              >
                <span className="text-base leading-none mt-0.5 flex-shrink-0">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accent }}>{t.tag}</span>
                    <span className="text-[9px] text-[#484848]">{n.createdAt}</span>
                  </div>
                  <p className="text-[12px] text-white/80 leading-snug">{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5 text-[11px] text-[#a0a0a0]">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        ))}
      </div>

      {/* ── View Calendar toggle ── */}
      <button
        onClick={() => setShowCalendar(v => !v)}
        className="w-full flex items-center justify-between gap-2 p-3.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 transition-all duration-200 mb-5 group"
      >
        <div className="flex items-center gap-2 text-[13px] text-white/80 group-hover:text-white font-medium">
          <CalendarDays className="w-4 h-4 text-[#8b5cf6]" />
          {showCalendar ? 'Hide Full Calendar' : 'View Full Calendar'}
        </div>
        {showCalendar
          ? <ChevronUp className="w-4 h-4 text-[#8b5cf6]" />
          : <ChevronDown className="w-4 h-4 text-[#8b5cf6]" />
        }
      </button>

      {/* ── Original calendar image ── */}
      {showCalendar && (
        <div className="mb-5 rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <img
            src="/academic_calendar.jpg"
            alt="Vignan's FSTR Academic Calendar 2025-26 Semester II"
            className="w-full object-contain bg-white"
          />
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-t border-white/8">
            <span className="text-[11px] text-[#6e6e6e]">
              Vignan's Foundation for Science, Technology and Research :: Vadlamudi
            </span>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-[11px] text-[#8b5cf6] hover:text-white transition-colors font-medium"
            >
              <Download className="w-3 h-3" /> Save
            </button>
          </div>
        </div>
      )}

      {/* ── Upcoming Events ── */}
      <div>
        <SectionDivider icon={Clock} label="Upcoming Events – Next 60 Days" />

        {upcoming.length === 0 ? (
          <p className="text-center text-[#a0a0a0] text-sm py-4">
            No events scheduled in the next 60 days.
          </p>
        ) : (
          <div className="space-y-6">
            {monthGroups.map(g => (
              <MonthSection key={`${g.year}-${g.month}`} group={g} today={today} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Sub-components ──────────────────────────────────────────────────────── */

function SectionDivider({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="h-px flex-1 bg-white/5" />
      <div className="flex items-center gap-1.5 text-[#ececec]/40 text-[11px] uppercase tracking-widest font-semibold whitespace-nowrap">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}

function MonthSection({ group, today }) {
  const counts = group.events.reduce((acc, ev) => { acc[ev.type] = (acc[ev.type] || 0) + 1; return acc; }, {});
  const summary = [];
  if (counts.holiday)    summary.push(`${counts.holiday} Holiday${counts.holiday > 1 ? 's' : ''}`);
  if (counts.exam)       summary.push(`${counts.exam} Exam${counts.exam > 1 ? 's' : ''}`);
  if (counts.assessment) summary.push(`${counts.assessment} Assessment Day${counts.assessment > 1 ? 's' : ''}`);
  if (counts.academic)   summary.push(`${counts.academic} Academic Event${counts.academic > 1 ? 's' : ''}`);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[12px] font-bold text-[#8b5cf6] uppercase tracking-widest">
          {MONTHS_FULL[group.month]} {group.year}
        </span>
        <span className="text-[10px] text-[#6e6e6e]">· {summary.join(' · ')}</span>
      </div>

      <div className="space-y-1.5">
        {group.events.map((ev, i) => <EventRow key={i} ev={ev} today={today} />)}
      </div>
    </div>
  );
}

function EventRow({ ev, today }) {
  const cfg    = TYPE_CONFIG[ev.type] || TYPE_CONFIG.academic;
  const Icon   = cfg.icon;
  const days   = daysUntil(ev.dateStart);
  const endDay = ev.dateEnd ? parseDate(ev.dateEnd) : null;
  const isOngoing = days < 0 && endDay && endDay >= today;

  let badge;
  if (isOngoing)  badge = { label: 'Ongoing', cls: 'bg-violet-500/20 text-violet-300 border-violet-500/30' };
  else if (days === 0) badge = { label: 'Today',    cls: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
  else if (days === 1) badge = { label: 'Tomorrow', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
  else badge = { label: `In ${days}d`, cls: 'bg-white/5 text-[#a0a0a0] border-white/10' };

  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-lg border ${cfg.bg}`}>
      <div className="p-1.5 rounded-md bg-white/5 flex-shrink-0">
        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-white/90 font-medium leading-tight truncate">{ev.label}</p>
        <p className="text-[11px] text-[#7a7a7a] mt-0.5">{fmtRange(ev.dateStart, ev.dateEnd)}</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${badge.cls}`}>
        {badge.label}
      </span>
    </div>
  );
}

export default AcademicCalendarWidget;
