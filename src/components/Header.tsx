import React from 'react';
import {
  Menu,
  FileUp,
  Download,
  FileSpreadsheet,
  Sparkles,
  Calendar,
  Building2,
  TrendingUp,
  LayoutGrid,
  Kanban,
  Users,
  CalendarCheck,
  FileText,
  Bot,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenImportModal: () => void;
  onExportExcel: () => void;
  onDownloadTemplate: () => void;
  onToggleSidebarMobile: () => void;
  staleDealsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenImportModal,
  onExportExcel,
  onDownloadTemplate,
  onToggleSidebarMobile,
  staleDealsCount,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return {
          title: 'Tổng quan Hoạt động Bán hàng (CRM Dashboard)',
          subtitle: 'Theo dõi chỉ số KPI Pipeline, Win Rate và Cảnh báo deal',
          icon: LayoutGrid,
        };
      case 'KANBAN':
        return {
          title: 'Pipeline Bán hàng Kanban (6 Giai đoạn B2B)',
          subtitle: 'Kéo thả quản lý tiến trình chốt hợp đồng từ Tiềm năng đến Đã Thắng',
          icon: Kanban,
        };
      case 'CUSTOMERS':
        return {
          title: 'Danh bạ Doanh nghiệp & Khách hàng Leads',
          subtitle: 'Quản lý thông tin đầu mối, lịch sử giao dịch và mã số thuế',
          icon: Users,
        };
      case 'ACTIVITIES':
        return {
          title: 'Nhật ký Tương tác & Lịch Trình Chăm Sóc',
          subtitle: 'Quản lý cuộc gọi, email, lịch hẹn demo và công việc cần xử lý',
          icon: CalendarCheck,
        };
      case 'BCTC':
        return {
          title: 'Phân tích Báo Cáo Tài Chính (Chuẩn VAS / Thông tư 200)',
          subtitle: 'Đọc hiểu Bảng CĐKT, KQKD, kiểm tra cân đối và tính toán chỉ số CFA',
          icon: FileText,
        };
      case 'AI_ASSISTANT':
        return {
          title: 'Trợ lý Bán Hàng & Phân Tích Tài Chính AI',
          subtitle: 'Soạn email chốt sale, xử lý từ chối giá và thẩm định sức khỏe tài chính',
          icon: Bot,
        };
    }
  };

  const currentTabInfo = getTabTitle();
  const TabIcon = currentTabInfo.icon;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button + Page Breadcrumb */}
        <div className="flex items-center space-x-3.5">
          {/* Hamburger toggle button on mobile */}
          <button
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            aria-label="Mở menu điều hành"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <TabIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {currentTabInfo.title}
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                {currentTabInfo.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Toolbar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={onOpenImportModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Import Excel</span>
          </button>

          <button
            onClick={onExportExcel}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors whitespace-nowrap shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={onDownloadTemplate}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors whitespace-nowrap shadow-xs"
            title="Tải mẫu Excel chuẩn CRM"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">File Mẫu</span>
          </button>

          <button
            onClick={() => setActiveTab('AI_ASSISTANT')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg transition-all shadow-xs shadow-blue-500/20 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>AI Sales</span>
          </button>
        </div>
      </div>
    </header>
  );
};
