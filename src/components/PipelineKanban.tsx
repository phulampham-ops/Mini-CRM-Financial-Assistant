import React, { useState } from 'react';
import { Deal, PipelineStage, Priority } from '../types/crm';
import { formatVND } from '../utils/bctcCalculator';
import {
  Plus,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  Building,
  User,
  Calendar,
  Tag,
  DollarSign,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface PipelineKanbanProps {
  deals: Deal[];
  onUpdateDealStage: (dealId: string, newStage: PipelineStage) => void;
  onSelectDeal: (deal: Deal) => void;
  onAddNewDeal: (newDeal: Omit<Deal, 'id' | 'code'>) => void;
  onNavigateToAi: (actionType: string, deal: Deal) => void;
}

const STAGES: { key: PipelineStage; title: string; color: string; badgeColor: string }[] = [
  { key: 'PROSPECT', title: '1. Tiềm Năng', color: 'border-sky-500 bg-sky-50/50', badgeColor: 'bg-sky-100 text-sky-800' },
  { key: 'QUALIFICATION', title: '2. Xác Nhận Nhu Cầu', color: 'border-blue-500 bg-blue-50/50', badgeColor: 'bg-blue-100 text-blue-800' },
  { key: 'PROPOSAL', title: '3. Đề Xuất / Báo Giá', color: 'border-indigo-500 bg-indigo-50/50', badgeColor: 'bg-indigo-100 text-indigo-800' },
  { key: 'NEGOTIATION', title: '4. Thương Lượng', color: 'border-amber-500 bg-amber-50/50', badgeColor: 'bg-amber-100 text-amber-800' },
  { key: 'CLOSED_WON', title: '5. Đã Thắng (Won)', color: 'border-emerald-500 bg-emerald-50/50', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { key: 'CLOSED_LOST', title: '6. Thua (Lost)', color: 'border-slate-400 bg-slate-50/50', badgeColor: 'bg-slate-200 text-slate-700' },
];

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  deals,
  onUpdateDealStage,
  onSelectDeal,
  onAddNewDeal,
  onNavigateToAi,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSalesFilter, setSelectedSalesFilter] = useState('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New deal form state
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newAmount, setNewAmount] = useState<number>(500000000);
  const [newStage, setNewStage] = useState<PipelineStage>('PROSPECT');
  const [newPriority, setNewPriority] = useState<Priority>('HIGH');
  const [newSales, setNewSales] = useState('Trần Thanh Nam (Sales Lead)');

  const salesReps = Array.from(new Set(deals.map((d) => d.assignedSales)));

  // Filter deals
  const filteredDeals = deals.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSales = selectedSalesFilter === 'ALL' || d.assignedSales === selectedSalesFilter;
    const matchesPriority = selectedPriorityFilter === 'ALL' || d.priority === selectedPriorityFilter;

    return matchesSearch && matchesSales && matchesPriority;
  });

  const handleCreateDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    onAddNewDeal({
      title: newTitle,
      companyName: newCompany,
      customerName: newCustomer || 'Đại diện',
      customerId: 'CUST-NEW',
      amount: newAmount,
      stage: newStage,
      probability: newStage === 'CLOSED_WON' ? 100 : newStage === 'NEGOTIATION' ? 80 : 40,
      priority: newPriority,
      expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      lastContactDate: new Date().toISOString().slice(0, 10),
      assignedSales: newSales,
      notes: 'Khởi tạo từ Kanban Board',
      tags: ['New Deal'],
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewCustomer('');
  };

  const isStale = (lastContactDate: string) => {
    const today = new Date();
    const contactDate = new Date(lastContactDate);
    const diffDays = Math.floor((today.getTime() - contactDate.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 14;
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm theo mã deal, công ty, tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters & Add Button */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Sales Rep Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSalesFilter}
              onChange={(e) => setSelectedSalesFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs text-slate-800"
            >
              <option value="ALL">Tất cả Sales Rep</option>
              {salesReps.map((rep) => (
                <option key={rep} value={rep}>
                  {rep}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs text-slate-800"
            >
              <option value="ALL">Mức Ưu Tiên (Tất cả)</option>
              <option value="HIGH">Ưu Tiên Cao (HIGH)</option>
              <option value="MEDIUM">Ưu Tiên Trung Bình</option>
              <option value="LOW">Ưu Tiên Thấp</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Deal Mới</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto min-h-[600px]">
        {STAGES.map((stageObj) => {
          const stageDeals = filteredDeals.filter((d) => d.stage === stageObj.key);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div
              key={stageObj.key}
              className={`flex flex-col rounded-2xl border ${stageObj.color} p-2.5 space-y-3 shadow-sm min-w-[240px]`}
            >
              {/* Column Header */}
              <div className="bg-white/90 p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${stageObj.badgeColor}`}>
                    {stageObj.title}
                  </span>
                  <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="mt-2 text-xs font-black text-slate-900 border-t border-slate-100 pt-1.5 flex justify-between">
                  <span className="text-slate-500 font-normal">Tổng:</span>
                  <span>{formatVND(stageValue)}</span>
                </div>
              </div>

              {/* Deal Cards Container */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {stageDeals.map((deal) => {
                  const dealIsStale = isStale(deal.lastContactDate) && deal.stage !== 'CLOSED_WON' && deal.stage !== 'CLOSED_LOST';

                  return (
                    <div
                      key={deal.id}
                      className={`bg-white p-3.5 rounded-xl border shadow-xs hover:shadow-md transition-all space-y-2.5 relative group ${
                        dealIsStale ? 'border-amber-400 ring-1 ring-amber-400/50' : 'border-slate-200'
                      }`}
                    >
                      {/* Top Code & Priority */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-slate-500">{deal.code}</span>
                        <div className="flex items-center space-x-1">
                          {dealIsStale && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>Stale</span>
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              deal.priority === 'HIGH'
                                ? 'bg-rose-100 text-rose-800'
                                : deal.priority === 'MEDIUM'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {deal.priority}
                          </span>
                        </div>
                      </div>

                      {/* Title & Company */}
                      <div
                        onClick={() => onSelectDeal(deal)}
                        className="cursor-pointer space-y-1 hover:text-blue-600 transition-colors"
                      >
                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {deal.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span className="line-clamp-1">{deal.companyName}</span>
                        </p>
                      </div>

                      {/* Amount & Probability */}
                      <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                        <span className="text-xs font-black text-emerald-700">
                          {formatVND(deal.amount)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {deal.probability}% P
                        </span>
                      </div>

                      {/* Last contact date & Next action */}
                      <div className="text-[10px] text-slate-500 space-y-0.5 bg-slate-50 p-2 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Tương tác: {deal.lastContactDate}</span>
                          </span>
                        </div>
                        {deal.nextActionTitle && (
                          <div className="text-slate-700 font-medium line-clamp-1 pt-0.5 border-t border-slate-200/60">
                            👉 {deal.nextActionTitle}
                          </div>
                        )}
                      </div>

                      {/* Actions: Move Stage & AI Assistant */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-1">
                          {/* Move stage buttons */}
                          {deal.stage !== 'PROSPECT' && (
                            <button
                              title="Lùi 1 giai đoạn"
                              onClick={() => {
                                const currentIndex = STAGES.findIndex((s) => s.key === deal.stage);
                                if (currentIndex > 0) {
                                  onUpdateDealStage(deal.id, STAGES[currentIndex - 1].key);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {deal.stage !== 'CLOSED_WON' && deal.stage !== 'CLOSED_LOST' && (
                            <button
                              title="Tiến 1 giai đoạn"
                              onClick={() => {
                                const currentIndex = STAGES.findIndex((s) => s.key === deal.stage);
                                if (currentIndex < STAGES.length - 2) {
                                  onUpdateDealStage(deal.id, STAGES[currentIndex + 1].key);
                                }
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded font-bold flex items-center text-[10px] gap-0.5"
                            >
                              <span>Chuyển</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => onNavigateToAi('OBJECTION_HANDLING', deal)}
                          className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold rounded flex items-center gap-1 transition-colors"
                          title="Tạo kịch bản chốt sale AI"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>AI Chốt</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {stageDeals.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-xl bg-white/50">
                    Chưa có deal nào ở bước này
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Quick Add Deal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Thêm Cơ Hội Bán Hàng Mới</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDealSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Hợp Đồng / Tiêu Đề Deal *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hợp đồng triển khai AI CRM cho Vinamilk"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Công Ty / Doanh Nghiệp Khách Hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tập đoàn Sữa Việt Nam"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Người Liên Hệ / Đại Diện</label>
                <input
                  type="text"
                  placeholder="e.g. Nguyễn Văn A - Giám đốc Mua hàng"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giá Trị Dự Kiến (VNĐ)</label>
                  <input
                    type="number"
                    step={10000000}
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-500">{formatVND(newAmount)}</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giai Đoạn Ban Đầu</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as PipelineStage)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mức Ưu Tiên</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="HIGH">HIGH (Ưu tiên cao)</option>
                    <option value="MEDIUM">MEDIUM (Trung bình)</option>
                    <option value="LOW">LOW (Thấp)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phụ Trách Sales</label>
                  <input
                    type="text"
                    value={newSales}
                    onChange={(e) => setNewSales(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow"
                >
                  Lưu Cơ Hội Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
