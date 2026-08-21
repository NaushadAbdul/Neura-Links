import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Bell, CheckCircle2, Megaphone, Trophy, Check } from 'lucide-react';

export const NotificationsCenter: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead } = useData();

  const userNotifs = notifications.filter(n => n.studentId === currentUser?.id);

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="space-y-2 border-b border-[#1f1f2a] pb-6">
        <div className="font-mono text-xs text-purple-400 uppercase tracking-widest flex items-center space-x-2">
          <Bell className="w-4 h-4" />
          <span>NEURA LINKS // STUDENT NOTIFICATION CENTER</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-wider uppercase">
          Notifications & Alerts
        </h1>
        <p className="text-sm text-gray-400">
          Stay updated on task evaluation results, module releases, achievements, and club announcements.
        </p>
      </div>

      {/* Notifications Stream */}
      <div className="space-y-3">
        {userNotifs.length > 0 ? (
          userNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-md border transition-all flex items-start justify-between cursor-pointer ${
                n.read
                  ? 'bg-[#111116] border-[#1f1f28] opacity-75'
                  : 'bg-[#161422] border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="font-heading text-sm font-bold text-white">{n.title}</span>
                  {!n.read && <Badge variant="purple">NEW</Badge>}
                </div>
                <p className="text-xs text-gray-300 font-sans">{n.message}</p>
                <div className="font-mono text-[10px] text-gray-500 pt-1">{n.createdAt}</div>
              </div>

              {!n.read && (
                <button className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Read</span>
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 font-mono text-xs bg-[#111116] border border-[#1f1f28] rounded-md">
            No notifications at this time.
          </div>
        )}
      </div>
    </div>
  );
};
