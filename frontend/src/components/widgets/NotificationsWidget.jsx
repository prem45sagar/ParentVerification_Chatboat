import React from 'react';
import { Calendar, AlertCircle, FileText } from 'lucide-react';

const NotificationsWidget = ({ data }) => {
  if (!data) return null;

  return (
    <div className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl p-4 md:p-5 shadow-sm text-[#ececec]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-[#8b5cf6]" />
        </div>
        <h3 className="font-semibold text-[15px]">Academic Notifications</h3>
      </div>

      <div className="space-y-4">
        {/* Exams */}
        {data.upcomingExams && data.upcomingExams.length > 0 && (
          <div className="bg-[#1E1E1E] rounded-lg p-3 border border-white/5">
            <h4 className="text-sm font-medium text-[#a0a0a0] mb-2 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Upcoming Exams
            </h4>
            <div className="space-y-2">
              {data.upcomingExams.map((exam, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span>{exam.name}</span>
                  <span className="text-[#8b5cf6] font-medium">{exam.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments */}
        {data.assignments && data.assignments.length > 0 && (
          <div className="bg-[#1E1E1E] rounded-lg p-3 border border-white/5">
            <h4 className="text-sm font-medium text-[#a0a0a0] mb-2 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" /> Assignment Deadlines
            </h4>
            <div className="space-y-2">
              {data.assignments.map((assignment, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span>{assignment.name}</span>
                  <span className="text-[#eab308] font-medium">{assignment.deadline}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Updates */}
        {data.calendarUpdates && (
          <div className="bg-[#1E1E1E] rounded-lg p-3 border border-white/5">
            <h4 className="text-sm font-medium text-[#a0a0a0] mb-1">Calendar Updates</h4>
            <p className="text-sm text-[#ececec]/80">{data.calendarUpdates}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsWidget;
