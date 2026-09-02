import React from 'react';
import { Deal, Activity } from '../types/crm';
import { formatVND } from '../utils/bctcCalculator';
import {
  DollarSign,
  Trophy,
  BarChart3,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Briefcase,
  UserCheck,
} from 'lucide-react';

interface CrmDashboardProps {
  deals: Deal[];
  activities: Activity[];
  onSelectDeal: (deal: Deal) => void;
  onNavigateToAi: (context: string, deal?: Deal) => void;
  onNavigateTab: (tab: 'KANBAN' | 'ACTIVITIES' | 'BCTC') => void;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({
  deals,
  activities,
  onSelectDeal,
  onNavigateToAi,
  onNavigateTab,
}) => {
  // Calculated Metrics
  const totalPipelineValue = deals
    .filter((d) => d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalWonRevenue = deals
    .filter((d) => d.stage === 'CLOSED_WON')
    .reduce((sum, d) => sum + d.amount, 0);

  const closedDeals = deals.filter((d) => d.stage === 'CLOSED_WON' || d.stage === 'CLOSED_LOST');
  const winRate = closedDeals.length > 0
    ? Math.round((deals.filter((d) => d.stage === 'CLOSED_WON').length / closedDeals.length) * 100)
    : 0;

  const forecastedRevenue = deals
    .filter((d) => d.stage !== 'CLOSED_LOST')
    .reduce((sum, d) => sum + (d.amount * d.probability) / 100, 0);

  // Stale deals (> 14 days since last contact and not closed)
  const today = new Date();
  const staleDeals = deals.filter((d) => {
    if (d.stage === 'CLOSED_WON' || d.stage === 'CLOSED_LOST') return false;
    const lastContact = new Date(d.lastContactDate);
    const diffDays = Math.floor((today.getTime() - lastContact.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 14;
  });

  // Overdue activities
  const overdueActivities = activities.filter((a) => a.status === 'OVERDUE');

  // Top Priority Deals
  const priorityDeals = [...deals]
    .filter((d) => d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Pipeline Stage Distribution
  const stageCounts: Record<string, { count: number; value: number }> = {
    PROSPECT: { count: 0, value: 0 },
    QUALIFICATION: { count: 0, value: 0 },
    PROPOSAL: { count: 0, value: 0 },
    NEGOTIATION: { count: 0, value: 0 },
    CLOSED_WON: { count: 0, value: 0 },
    CLOSED_LOST: { count: 0, value: 0 },
  };

  deals.forEach((d) => {
    if (stageCounts[d.stage]) {
      stageCounts[d.stage].count += 1;
      stageCounts[d.stage].value += d.amount;
    }
  });

  const stageLabels: Record<string, string> = {
    PROSPECT: '1. Khách Hàng Tiềm Năng',
    QUALIFICATION: '2. Đánh Giá & Xác Nhận',
    PROPOSAL: '3. Đề Xuất / Báo Giá',
    NEGOTIATION: '4. Thương Lượng Hợp Đồng',
    CLOSED_WON: '5. Thắng (Closed Won)',
    CLOSED_LOST: '6. Thua (Closed Lost)',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header / Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
              SALES EXECUTIVE DASHBOARD
            </span>
            <span className="text-slate-400 text-xs">Cập nhật thực tế</span>
          </div>
          <h2 className="text-2xl font-extrabold mt-2 tracking-tight">
            Tổng Quan Doanh Số & Sức Khỏe Sales Pipeline
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Theo dõi đường ống cơ hội, cảnh báo hợp đồng ngâm lâu, quản lý lịch chăm sóc và sử dụng AI Sales Assistant để chốt sale hiệu quả.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab('KANBAN')}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Mở Pipeline Kanban</span>
          </button>
          <button
            onClick={() => onNavigateTab('BCTC')}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Đọc BCTC Thông tư 200</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pipeline Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Giá Trị Pipeline Đang Chạy
            </span>
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatVND(totalPipelineValue)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-500" />
              <span>{deals.filter((d) => d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST').length} Cơ hội đang đàm phán</span>
            </p>
          </div>
        </div>

        {/* Won Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Doanh Số Đã Chốt (Won)
            </span>
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700">
              {formatVND(totalWonRevenue)}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{deals.filter((d) => d.stage === 'CLOSED_WON').length} Hợp đồng đã ký thành công</span>
            </p>
          </div>
        </div>

        {/* Win Rate & Forecast */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tỷ Lệ Thắng & Dự Báo (Forecast)
            </span>
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-900">{winRate}% Win-rate</div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dự báo doanh số: <strong className="text-indigo-600 font-bold">{formatVND(forecastedRevenue)}</strong>
            </p>
          </div>
        </div>

        {/* Stale & Overdue Alert */}
        <div className={`p-5 rounded-2xl border shadow-sm transition-shadow ${
          staleDeals.length > 0 || overdueActivities.length > 0
            ? 'bg-amber-50/60 border-amber-200 text-amber-900'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Cảnh Báo Cần Xử Lý Gấp
            </span>
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-lg font-bold text-amber-900 flex items-center justify-between">
              <span>{staleDeals.length} Deal bị trễ ({'>'}14 ngày)</span>
              <button
                onClick={() => onNavigateTab('KANBAN')}
                className="text-xs text-amber-800 underline hover:text-amber-950 font-semibold"
              >
                Xem
              </button>
            </div>
            <div className="text-xs text-amber-700 flex items-center justify-between">
              <span>{overdueActivities.length} Lịch hẹn quá hạn</span>
              <button
                onClick={() => onNavigateTab('ACTIVITIES')}
                className="text-xs text-amber-800 underline hover:text-amber-950 font-semibold"
              >
                Xem
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pipeline Breakdown & Stale Deal Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Stage Distribution (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Phân Bổ Sales Pipeline Theo Giai Đoạn</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Xem tổng giá trị và số lượng cơ hội đang tiến triển qua các bước
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('KANBAN')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Chi tiết Kanban</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(stageCounts).map(([stageKey, data]) => {
              const maxVal = Math.max(...Object.values(stageCounts).map((s) => s.value), 1);
              const percentage = Math.round((data.value / maxVal) * 100);

              let barColor = 'bg-slate-500';
              if (stageKey === 'PROSPECT') barColor = 'bg-sky-500';
              if (stageKey === 'QUALIFICATION') barColor = 'bg-blue-600';
              if (stageKey === 'PROPOSAL') barColor = 'bg-indigo-600';
              if (stageKey === 'NEGOTIATION') barColor = 'bg-amber-500';
              if (stageKey === 'CLOSED_WON') barColor = 'bg-emerald-600';
              if (stageKey === 'CLOSED_LOST') barColor = 'bg-slate-400';

              return (
                <div key={stageKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      {stageLabels[stageKey]}
                    </span>
                    <div className="space-x-3 text-right">
                      <span className="text-slate-500">{data.count} Cơ hội</span>
                      <span className="font-bold text-slate-900">{formatVND(data.value)}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Warning & Stale Deal Action Card */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white space-y-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-amber-400">
                  Phân Tích Cảnh Báo AI
                </h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                GEMINI 3.6
              </span>
            </div>

            {staleDeals.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Phát hiện <strong className="text-amber-400 font-bold">{staleDeals.length} hợp đồng B2B</strong> ngâm quá 14 ngày chưa được tương tác. Nguy cơ mất deal do đối thủ can thiệp!
                </p>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {staleDeals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => onSelectDeal(deal)}
                      className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-amber-500/30 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between text-xs">
                        <span className="font-bold text-slate-200 line-clamp-1">{deal.companyName}</span>
                        <span className="text-amber-400 font-bold ml-2 whitespace-nowrap">
                          {formatVND(deal.amount)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{deal.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1 border-t border-slate-700/50">
                        <span className="flex items-center gap-1 text-rose-300">
                          <Clock className="w-3 h-3" />
                          <span>Tương tác từ: {deal.lastContactDate}</span>
                        </span>
                        <span className="text-blue-300">{deal.assignedSales}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-emerald-400 bg-emerald-950/30 rounded-xl border border-emerald-500/20">
                <p className="font-bold text-sm">Pipeline Rất Khỏe Mạnh!</p>
                <p className="text-slate-400 mt-1">Không có cơ hội nào bị ngâm quá 14 ngày.</p>
              </div>
            )}
          </div>

          <button
            onClick={() =>
              onNavigateToAi(
                'PIPELINE_INSIGHTS',
                staleDeals[0] || deals[0]
              )
            }
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Chạy AI Đề Xuất Kịch Bản Giải Cứu Deal</span>
          </button>
        </div>
      </div>

      {/* Top Priority High Value Deals Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Top Cơ Hội Ưu Tiên Hàng Đầu (High Priority)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Các hợp đồng B2B giá trị cao nhất cần tập trung nguồn lực Sales & Chăm sóc
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('KANBAN')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Xem tất cả
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Mã / Tiêu Đề Deal</th>
                <th className="py-3 px-4">Khách Hàng / Công Ty</th>
                <th className="py-3 px-4">Giá Trị (VNĐ)</th>
                <th className="py-3 px-4">Giai Đoạn</th>
                <th className="py-3 px-4">Xác Suất</th>
                <th className="py-3 px-4">Next Action</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {priorityDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{deal.code}</div>
                    <div className="text-slate-600 max-w-xs line-clamp-1">{deal.title}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{deal.companyName}</div>
                    <div className="text-slate-500 text-[11px]">{deal.customerName}</div>
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-700">
                    {formatVND(deal.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                      deal.stage === 'NEGOTIATION'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : deal.stage === 'PROPOSAL'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : deal.stage === 'QUALIFICATION'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {stageLabels[deal.stage] || deal.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700">{deal.probability}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800 line-clamp-1">{deal.nextActionTitle || 'Chưa đặt lịch'}</div>
                    {deal.nextActionDate && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        Hạn: {deal.nextActionDate}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => onSelectDeal(deal)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded transition-colors"
                    >
                      Chi Tiết
                    </button>
                    <button
                      onClick={() => onNavigateToAi('DRAFT_EMAIL', deal)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded transition-colors"
                    >
                      AI Email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
