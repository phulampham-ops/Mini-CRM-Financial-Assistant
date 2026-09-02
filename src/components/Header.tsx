import React from 'react';
import {
  LayoutDashboard,
  Kanban,
  Users,
  CalendarCheck,
  FileSpreadsheet,
  Bot,
  FileUp,
  Download,
  Building2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export type ActiveTab = 'DASHBOARD' | 'KANBAN' | 'CUSTOMERS' | 'ACTIVITIES' | 'BCTC' | 'AI_ASSISTANT';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenImportModal: () => void;
  onExportExcel: () => void;
  onDownloadTemplate: () => void;
  staleDealsCount: number;
  overdueTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenImportModal,
  onExportExcel,
  onDownloadTemplate,
  staleDealsCount,
  overdueTasksCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-lg ring-1 ring-white/10">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Mini CRM & AI Sales Executive
              </h1>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-blue-500/30">
                VAS/TT200
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Quản lý Sales Pipeline • Phân tích BCTC Thông tư 200 • Trợ lý AI Gemini
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={onOpenImportModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Import Excel/CSV</span>
          </button>

          <button
            onClick={onExportExcel}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={onDownloadTemplate}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            title="Tải mẫu Excel chuẩn CRM"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>File Mẫu</span>
          </button>

          <button
            onClick={() => setActiveTab('AI_ASSISTANT')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/10 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            <span>AI Sales Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 py-1.5">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'DASHBOARD'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Sales Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('KANBAN')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap relative ${
                activeTab === 'KANBAN'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Pipeline Kanban</span>
              {staleDealsCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {staleDealsCount} cảnh báo
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('CUSTOMERS')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'CUSTOMERS'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Khách Hàng & Lead</span>
            </button>

            <button
              onClick={() => setActiveTab('ACTIVITIES')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap relative ${
                activeTab === 'ACTIVITIES'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Chăm Sóc & Lịch Trình</span>
              {overdueTasksCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {overdueTasksCount} trễ
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('BCTC')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'BCTC'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Đọc BCTC (Thông tư 200)</span>
            </button>

            <button
              onClick={() => setActiveTab('AI_ASSISTANT')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'AI_ASSISTANT'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow font-bold'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Trợ Lý Sales AI</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
