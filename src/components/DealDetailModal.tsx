import React from 'react';
import { Deal, Activity, PipelineStage } from '../types/crm';
import { formatVND } from '../utils/bctcCalculator';
import {
  Building,
  User,
  DollarSign,
  Clock,
  Sparkles,
  Mail,
  PhoneCall,
  CalendarCheck,
  Tag,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';

interface DealDetailModalProps {
  deal: Deal | null;
  activities: Activity[];
  onClose: () => void;
  onUpdateStage: (dealId: string, stage: PipelineStage) => void;
  onNavigateToAi: (actionType: string, deal: Deal) => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  deal,
  activities,
  onClose,
  onUpdateStage,
  onNavigateToAi,
}) => {
  if (!deal) return null;

  const dealActivities = activities.filter((a) => a.dealId === deal.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded">
                {deal.code}
              </span>
              <span className="bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
                {deal.stage}
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-1">{deal.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs border border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Công ty: <strong className="text-slate-900">{deal.companyName}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              <span>Người liên hệ: <strong>{deal.customerName}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Tương tác gần nhất: {deal.lastContactDate}</span>
            </div>
          </div>

          <div className="space-y-2 text-right">
            <div className="text-xs text-slate-500 font-semibold">Giá trị hợp đồng:</div>
            <div className="text-xl font-black text-emerald-700">{formatVND(deal.amount)}</div>
            <div className="text-[11px] text-slate-500">
              Xác suất chốt: <strong className="text-slate-800">{deal.probability}%</strong> • Phụ trách: <strong>{deal.assignedSales}</strong>
            </div>
          </div>
        </div>

        {/* AI Shortcuts */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-amber-950 font-bold">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Sử dụng AI Sales Assistant cho deal này:</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onNavigateToAi('DRAFT_EMAIL', deal);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center space-x-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Soạn Email AI</span>
            </button>

            <button
              onClick={() => {
                onNavigateToAi('OBJECTION_HANDLING', deal);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kịch Bản Xử Lý Giá</span>
            </button>
          </div>
        </div>

        {/* Stage Changer */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Chuyển Giai Đoạn Nhanh:</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[11px] font-bold">
            {(['PROSPECT', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'] as PipelineStage[]).map((st) => (
              <button
                key={st}
                onClick={() => onUpdateStage(deal.id, st)}
                className={`py-1.5 rounded-lg border transition-all ${
                  deal.stage === st
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Activity History */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>Lịch Sử Chăm Sóc ({dealActivities.length})</span>
          </h4>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {dealActivities.map((act) => (
              <div key={act.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{act.title}</span>
                  <span className="text-[10px] text-slate-500">{act.date}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{act.notes}</p>
              </div>
            ))}

            {dealActivities.length === 0 && (
              <div className="text-center py-4 text-xs text-slate-400">Chưa có nhật ký chăm sóc riêng cho deal này</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
