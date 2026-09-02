import React, { useState } from 'react';
import { Activity, Deal, ActivityType } from '../types/crm';
import {
  CalendarCheck,
  PhoneCall,
  Mail,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  Building,
} from 'lucide-react';

interface ActivityLogProps {
  activities: Activity[];
  deals: Deal[];
  onAddNewActivity: (newAct: Omit<Activity, 'id'>) => void;
  onToggleActivityStatus: (activityId: string) => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({
  activities,
  deals,
  onAddNewActivity,
  onToggleActivityStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OVERDUE' | 'PENDING' | 'COMPLETED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [dealId, setDealId] = useState(deals[0]?.id || '');
  const [type, setType] = useState<ActivityType>('CALL');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [nextActionDate, setNextActionDate] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)
  );
  const [nextActionTitle, setNextActionTitle] = useState('');

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || act.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dealId) return;

    const selectedDeal = deals.find((d) => d.id === dealId);

    onAddNewActivity({
      dealId,
      customerId: selectedDeal?.customerId || 'CUST-001',
      type,
      title,
      notes,
      date: new Date().toISOString().slice(0, 10),
      nextActionDate,
      nextActionTitle,
      status: 'PENDING',
      createdBy: 'Trần Thanh Nam',
    });

    setIsModalOpen(false);
    setTitle('');
    setNotes('');
    setNextActionTitle('');
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'CALL':
        return <PhoneCall className="w-4 h-4 text-blue-600" />;
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-emerald-600" />;
      case 'MEETING':
        return <Users className="w-4 h-4 text-indigo-600" />;
      case 'FOLLOW_UP':
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, nội dung, người tạo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Tất Cả ({activities.length})
            </button>
            <button
              onClick={() => setStatusFilter('OVERDUE')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'OVERDUE' ? 'bg-rose-500 text-white shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Quá Hạn ({activities.filter((a) => a.status === 'OVERDUE').length})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'PENDING' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Chờ Xử Lý ({activities.filter((a) => a.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setStatusFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'COMPLETED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Đã Hoàn Thành
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi Nhật Ký / Đặt Lịch Chăm Sóc</span>
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <CalendarCheck className="w-5 h-5 text-blue-600" />
          <span>Nhật Ký Tương Tác & Hạn Chăm Sóc Khách Hàng (Follow-up)</span>
        </h3>

        <div className="space-y-3">
          {filteredActivities.map((act) => {
            const deal = deals.find((d) => d.id === act.dealId);

            return (
              <div
                key={act.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  act.status === 'OVERDUE'
                    ? 'bg-rose-50/50 border-rose-200'
                    : act.status === 'COMPLETED'
                    ? 'bg-slate-50/60 border-slate-200 text-slate-500'
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-slate-100 rounded-xl mt-0.5">{getActivityIcon(act.type)}</div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-sm">{act.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          act.status === 'OVERDUE'
                            ? 'bg-rose-100 text-rose-800'
                            : act.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {act.status === 'OVERDUE' ? 'QUÁ HẠN' : act.status === 'COMPLETED' ? 'ĐÃ XONG' : 'SẮP TỚI'}
                      </span>
                    </div>

                    {deal && (
                      <p className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        <span>{deal.companyName} ({deal.code})</span>
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-slate-100 mt-1">
                      {act.notes}
                    </p>

                    {act.nextActionTitle && (
                      <div className="text-xs text-amber-800 font-bold flex items-center gap-1.5 pt-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Hành động tiếp theo: {act.nextActionTitle} (Hạn: {act.nextActionDate})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 pt-2 md:pt-0 border-slate-200/60 text-right space-y-1">
                  <div className="text-[11px] text-slate-500">
                    <div>Ngày tạo: {act.date}</div>
                    <div className="font-medium text-slate-700">Tạo bởi: {act.createdBy}</div>
                  </div>

                  <button
                    onClick={() => onToggleActivityStatus(act.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      act.status === 'COMPLETED'
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{act.status === 'COMPLETED' ? 'Mở Lại' : 'Đánh Dấu Đã Xong'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredActivities.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              Chưa có nhật ký tương tác nào
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Activity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Ghi Nhật Ký & Đặt Lịch Chăm Sóc</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn Hợp Đồng / Deal *</label>
                <select
                  value={dealId}
                  onChange={(e) => setDealId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                >
                  {deals.map((d) => (
                    <option key={d.id} value={d.id}>
                      [{d.code}] {d.companyName} - {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hình Thức Tương Tác</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ActivityType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CALL">Gọi Điện Thoại (Call)</option>
                    <option value="EMAIL">Gửi Email / Proposal</option>
                    <option value="MEETING">Họp Trực Tiếp / Demo</option>
                    <option value="FOLLOW_UP">Gửi Nhắc Nhở (Follow-up)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tiêu Đề Tóm Tắt *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Họp trao đổi hợp đồng"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội Dung Chi Tiết</label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú kết quả cuộc họp, yêu cầu của khách hàng..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hành Động Tiếp Theo (Next Action)</label>
                  <input
                    type="text"
                    placeholder="e.g. Gửi dự thảo hợp đồng"
                    value={nextActionTitle}
                    onChange={(e) => setNextActionTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hạn Hoàn Thành (Deadline)</label>
                  <input
                    type="date"
                    value={nextActionDate}
                    onChange={(e) => setNextActionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow"
                >
                  Lưu Nhật Ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
