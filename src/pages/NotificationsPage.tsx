import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  AlertCircle, 
  Armchair, 
  ArrowLeftRight, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setCurrentPage } = useLibrary();

  const getIcon = (type: string) => {
    switch (type) {
      case 'due':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'seat':
        return <Armchair className="w-4 h-4 text-emerald-600" />;
      case 'exchange':
        return <ArrowLeftRight className="w-4 h-4 text-blue-600" />;
      case 'streak':
        return <Sparkles className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Alerts & Academic Notices
          </span>
          <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <span>Notification Center</span>
            <Bell className="w-6 h-6 text-blue-600" />
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Stay informed about due return reminders, seat reservation passes, and peer exchange proposals.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="py-2 px-3.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-blue-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active notifications</p>
            <p className="text-xs text-slate-500 mt-1">You are completely up to date with library activities.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                !n.read 
                  ? 'bg-blue-50/40 border-blue-200 shadow-2xs hover:bg-blue-50/70' 
                  : 'bg-white border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-semibold ${!n.read ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 font-tabular mt-2 block">
                    {n.timestamp}
                  </span>
                </div>
              </div>

              {n.linkPage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(n.id);
                    setCurrentPage(n.linkPage as any);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-white transition-colors shrink-0"
                  title="View details"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
