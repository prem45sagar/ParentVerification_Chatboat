import React from 'react';
import {
  Phone, Mail, User, BookOpen, GraduationCap,
  Headphones, ShieldCheck, UserCheck, Building2, Award
} from 'lucide-react';

const SupportWidget = ({ data }) => {
  if (!data) return null;

  const { faculties, advisor, office, view, department, section } = data;

  /* ── Reusable Contact Card ───────────────────────────────────────────── */
  const ContactCard = ({ title, person, role, icon: Icon, email, phone, badge, variant = "default" }) => (
    <div className={`relative overflow-hidden group rounded-xl p-4 transition-all duration-300 ${
      variant === "premium"
        ? "bg-gradient-to-br from-[#2a1f4a] to-[#1a1535] border border-[#8b5cf6]/20 shadow-lg"
        : "bg-[#1E1E1E] border border-white/5 hover:border-[#8b5cf6]/20"
    }`}>
      {variant === "premium" && (
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Icon className="w-12 h-12 text-[#a370f7]" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg flex-shrink-0 ${variant === "premium" ? "bg-[#8b5cf6]/20" : "bg-white/5"}`}>
          <Icon className={`w-4 h-4 ${variant === "premium" ? "text-[#a370f7]" : "text-[#8b5cf6]"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-[#8b5cf6]">{title}</h4>
            {badge && (
              <span className="text-[9px] font-semibold uppercase tracking-wide bg-[#8b5cf6]/20 text-[#c4b5fd] px-1.5 py-0.5 rounded-full border border-[#8b5cf6]/30">
                {badge}
              </span>
            )}
          </div>
          <div className="text-[14px] font-semibold text-white/95 truncate">{person}</div>
          {role && <div className="text-[11px] text-[#a0a0a0] mt-0.5 italic leading-tight">{role}</div>}

          <div className="mt-2.5 space-y-1.5">
            {email && (
              <div className="flex items-center gap-2 text-[#ececec]/65 text-[12px] group/link min-w-0">
                <Mail className="w-3 h-3 text-[#6e6e6e] group-hover/link:text-[#8b5cf6] transition-colors flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors truncate">{email}</a>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-[#ececec]/65 text-[12px] group/link">
                <Phone className="w-3 h-3 text-[#6e6e6e] group-hover/link:text-[#8b5cf6] transition-colors flex-shrink-0" />
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Section header ───────────────────────────────────────────────────── */
  const SectionHeader = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-px flex-1 bg-white/5" />
      <div className="flex items-center gap-1.5 text-[#ececec]/40 text-[11px] uppercase tracking-widest font-semibold whitespace-nowrap">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );

  /* ── Faculty section ─────────────────────────────────────────────────── */
  const renderFacultySection = () => (
    <div className="space-y-3">
      <SectionHeader icon={BookOpen} label="Subject Faculty" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {faculties.map((f, i) => (
          <ContactCard
            key={i}
            title={f.subject}
            person={f.name}
            icon={User}
            email={f.email}
            phone={f.phone}
          />
        ))}
      </div>
    </div>
  );

  /* ── Advisor section ─────────────────────────────────────────────────── */
  const renderAdvisorSection = () => (
    <div className="space-y-3">
      <SectionHeader icon={UserCheck} label="Class Advisor & Counsellor" />
      <ContactCard
        title={`Section ${section} Class Advisor`}
        person={advisor.name}
        role={advisor.role}
        icon={UserCheck}
        email={advisor.email}
        phone={advisor.phone}
        badge="Counsellor"
        variant="premium"
      />
    </div>
  );

  /* ── Office section ──────────────────────────────────────────────────── */
  const renderOfficeSection = () => (
    <div className="space-y-3">
      <SectionHeader icon={Building2} label="Academic Office & Administration" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ContactCard
          title="Head of Department (HOD)"
          person={office.hod.name}
          role={`HOD – ${department}`}
          icon={GraduationCap}
          email={office.hod.email}
          phone={office.hod.phone}
          badge="HOD"
          variant="premium"
        />
        <ContactCard
          title="Year Coordinator"
          person={office.coordinator.name}
          role="Handles All Year Students"
          icon={Award}
          email={office.coordinator.email}
          phone={office.coordinator.phone}
          badge="Coordinator"
        />
        <ContactCard
          title="Dean"
          person={office.dean.name}
          role="Dean of Academic Affairs"
          icon={Building2}
          email={office.dean.email}
          phone={office.dean.phone}
          badge="Dean"
          variant="premium"
        />
        <ContactCard
          title="Help Desk"
          person="Academic Support Centre"
          role="Toll-Free Helpline"
          icon={Headphones}
          email={office.helpdesk.email}
          phone={office.helpdesk.phone}
          badge="Toll-Free"
        />
      </div>
    </div>
  );

  /* ── Root ────────────────────────────────────────────────────────────── */
  return (
    <div className="w-full bg-[#232323] border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20 flex-shrink-0">
          <Phone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white leading-tight">Communication Support</h3>
          <p className="text-xs text-[#a0a0a0] font-medium uppercase tracking-widest mt-0.5">
            {department} &bull; Section {section}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {(view === 'all' || view === 'faculty')  && renderFacultySection()}
        {(view === 'all' || view === 'advisor')  && renderAdvisorSection()}
        {(view === 'all' || view === 'office')   && renderOfficeSection()}
      </div>
    </div>
  );
};

export default SupportWidget;
