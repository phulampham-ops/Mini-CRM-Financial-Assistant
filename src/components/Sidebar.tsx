import React from 'react';
import {
  LayoutGrid,
  Users,
  Briefcase,
  CalendarCheck,
  Award,
  BarChart3,
  FileSpreadsheet,
  FolderKanban,
  Settings,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  FileText,
  X,
} from 'lucide-react';

export type ActiveTab =
  | 'DASHBOARD'
  | 'KANBAN'
  | 'CUSTOMERS'
  | 'ACTIVITIES'
  | 'BCTC'
  | 'AI_ASSISTANT';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenImportModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  dealsCount: number;
  staleDealsCount: number;
  customersCount: number;
  overdueTasksCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenImportModal,
  isOpenMobile,
  onCloseMobile,
  dealsCount,
  staleDealsCount,
  customersCount,
  overdueTasksCount,
}) => {
  const menuItems = [
    {
      key: 'DASHBOARD' as ActiveTab,
      label: 'Tổng quan CRM',
      icon: LayoutGrid,
      badge: dealsCount > 0 ? dealsCount : undefined,
      badgeColor: 'bg-blue-500 text-white',
    },
    {
      key: 'KANBAN' as ActiveTab,
      label: 'Pipeline Kanban',
      icon: Briefcase,
      badge: staleDealsCount > 0 ? staleDealsCount : undefined,
      badgeColor: 'bg-rose-600/90 text-white',
      badgeTitle: 'Deal ngâm cần xử lý',
    },
    {
      key: 'CUSTOMERS' as ActiveTab,
      label: 'Khách hàng & Leads',
      icon: Users,
      badge: customersCount > 0 ? customersCount : undefined,
      badgeColor: 'bg-slate-700 text-slate-300',
    },
    {
      key: 'ACTIVITIES' as ActiveTab,
      label: 'Chăm sóc & Lịch hẹn',
      icon: CalendarCheck,
      badge: overdueTasksCount > 0 ? overdueTasksCount : undefined,
      badgeColor: 'bg-rose-600 text-white',
      badgeTitle: 'Công việc quá hạn',
    },
    {
      key: 'BCTC' as ActiveTab,
      label: 'Đọc BCTC (TT200)',
      icon: FileText,
      badge: 'VAS',
      badgeColor: 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/30',
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B1120] text-slate-200 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Navigation */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar px-4 py-5">
          {/* Logo / Brand Banner */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
            <div className="flex items-center space-x-3.5">
              {/* Glowing App Icon */}
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-base shadow-[0_0_20px_rgba(59,130,246,0.6)] ring-1 ring-blue-400/40">
                  CRM
                </div>
              </div>

              {/* Title & Badge */}
              <div className="space-y-0.5">
                <h1 className="text-base font-extrabold text-white tracking-wider font-sans">
                  CRM CONTROL
                </h1>
                <div className="flex items-center space-x-1 text-[11px] font-semibold text-blue-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>AI CHO DOANH NGHIỆP</span>
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Header */}
          <div className="mt-6 mb-3 px-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              MENU ĐIỀU HÀNH
            </span>
          </div>

          {/* Main Navigation List */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => handleSelectTab(item.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    {item.badge !== undefined && (
                      <span
                        title={item.badgeTitle}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-blue-500/80 text-white' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-blue-200" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Secondary Action: Import Excel */}
            <button
              onClick={() => {
                onOpenImportModal();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 shrink-0" />
                <span>Nhập dữ liệu Excel</span>
              </div>
              <span className="text-[10px] bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                .xlsx
              </span>
            </button>
          </nav>

          {/* Dedicated AI Assistant Box (Styled like in reference image) */}
          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <button
              onClick={() => handleSelectTab('AI_ASSISTANT')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'AI_ASSISTANT'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900/80 border-slate-800 text-blue-300 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 fill-blue-400/20" />
              <span>AI Sales & CFA Assistant</span>
            </button>
          </div>
        </div>

        {/* Footer Area (Matched with Reference Image) */}
        <div className="p-4 bg-[#080d19] border-t border-slate-800/80 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-slate-300 text-xs">Chế độ Dữ liệu:</span>
            <span className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
              Mock / Local
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sẵn sàng tích hợp Cloud & Gemini AI. Không cần đăng nhập.
          </p>
        </div>
      </aside>
    </>
  );
};
