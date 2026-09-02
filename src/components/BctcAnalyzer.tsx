import React, { useState } from 'react';
import { BalanceSheetTT200, LineItemTT200 } from '../types/bctc';
import { calculateFinancialRatios, formatVND } from '../utils/bctcCalculator';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Scale,
  CreditCard,
  DollarSign,
  PieChart,
  ShieldCheck,
  Edit2,
  RefreshCw,
} from 'lucide-react';

interface BctcAnalyzerProps {
  bctcData: BalanceSheetTT200;
  onUpdateBctcData: (updated: BalanceSheetTT200) => void;
  onRunAiAnalysis: (bctc: BalanceSheetTT200) => void;
}

export const BctcAnalyzer: React.FC<BctcAnalyzerProps> = ({
  bctcData,
  onUpdateBctcData,
  onRunAiAnalysis,
}) => {
  const [editingCode, setEditingCode] = useState<number | null>(null);
  const [editingAmount, setEditingAmount] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const ratios = calculateFinancialRatios(bctcData);

  const handleEditAmountSave = (code: number) => {
    const updatedItems = bctcData.items.map((item) => {
      if (item.code === code) {
        return { ...item, amountCurrent: editingAmount };
      }
      return item;
    });

    // Recalculate totals if sub-items changed
    onUpdateBctcData({
      ...bctcData,
      items: updatedItems,
    });

    setEditingCode(null);
  };

  const filteredItems = bctcData.items.filter((item) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'ASSET') return item.category === 'ASSET_SHORT' || item.category === 'ASSET_LONG';
    if (activeCategory === 'LIABILITY') return item.category === 'LIABILITY_SHORT' || item.category === 'LIABILITY_LONG';
    if (activeCategory === 'EQUITY') return item.category === 'EQUITY';
    if (activeCategory === 'INCOME') return item.category === 'INCOME_STATEMENT';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Company Header & Balance Status */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              THÔNG TƯ 200/2014/TT-BTC
            </span>
            <span className="text-slate-400 text-xs">{bctcData.period}</span>
          </div>
          <h2 className="text-2xl font-black mt-2 tracking-tight">
            {bctcData.companyName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mã số thuế: <span className="font-mono text-slate-200">{bctcData.taxCode}</span> • Đơn vị tính: {bctcData.unit}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Balance Check Indicator */}
          <div
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 ${
              ratios.isBalanced
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}
          >
            {ratios.isBalanced ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>BCTC CÂN ĐỐI (TS Mã 270 = NV Mã 440)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>LỆCH CÂN ĐỐI ({formatVND(ratios.balanceDifference)})</span>
              </>
            )}
          </div>

          <button
            onClick={() => onRunAiAnalysis(bctcData)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Thẩm Định BCTC AI (CFA/Gemini)</span>
          </button>
        </div>
      </div>

      {/* Financial Ratio Scorecard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Ratio & Quick Ratio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Thanh Khoản Ngắn Hạn</span>
            <Scale className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black text-slate-900">{ratios.currentRatio}x</span>
              <p className="text-[11px] text-slate-500">Current Ratio (100/310)</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-blue-700">{ratios.quickRatio}x</span>
              <p className="text-[11px] text-slate-500">Quick Ratio</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            {ratios.currentRatio >= 1.2 ? '🟢 Thanh khoản an toàn' : '🔴 Nguy cơ thiếu hụt tiền mặt'}
          </p>
        </div>

        {/* DSO (Mã 131) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Kỳ Thu Tiền Bình Quân (DSO)</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="pt-1">
            <span className="text-2xl font-black text-indigo-700">{ratios.dso} ngày</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Phải thu khách hàng (Mã 131) / Doanh thu x 365
            </p>
          </div>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            {ratios.dso <= 60 ? '🟢 Thu hồi nợ tốt' : '⚠️ Kỳ thu tiền kéo dài, đọng vốn tại KH'}
          </p>
        </div>

        {/* Debt / Equity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Đòn Bẩy Tài Chính (D/E)</span>
            <PieChart className="w-4 h-4 text-amber-600" />
          </div>
          <div className="pt-1">
            <span className="text-2xl font-black text-slate-900">{ratios.debtToEquity}x</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tổng Nợ (Mã 300) / Vốn CSH (Mã 400)
            </p>
          </div>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            Tỷ lệ Nợ / Tài sản: <strong className="font-bold text-slate-800">{(ratios.debtToAssets * 100).toFixed(1)}%</strong>
          </p>
        </div>

        {/* Profitability ROE & Margin */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Hiệu Quả Sinh Lời (ROE & ROA)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black text-emerald-700">{ratios.roe}%</span>
              <p className="text-[11px] text-slate-500">ROE (Mã 60/400)</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-emerald-600">{ratios.grossMargin}%</span>
              <p className="text-[11px] text-slate-500">Biên LN Gộp</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            ROA: <strong className="font-bold text-slate-800">{ratios.roa}%</strong>
          </p>
        </div>
      </div>

      {/* Main Financial Table with TT 200 Mapping */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Bảng Cân Đối Kế Toán & KQKD Theo Mã Số Thông Tư 200</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chuẩn hóa theo đúng Mã số quy định (110 Tiền, 131 Phải thu KH, 311 Vay ngắn hạn)
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setActiveCategory('ASSET')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'ASSET' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Tài Sản (100 - 270)
            </button>
            <button
              onClick={() => setActiveCategory('LIABILITY')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'LIABILITY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Nợ Phải Trả (300)
            </button>
            <button
              onClick={() => setActiveCategory('EQUITY')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'EQUITY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Vốn CSH (400)
            </button>
            <button
              onClick={() => setActiveCategory('INCOME')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === 'INCOME' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Kết Quả Kinh Doanh (01-60)
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white font-semibold">
                <th className="py-3 px-4 w-20 text-center">Mã Số</th>
                <th className="py-3 px-4">Chỉ Tiêu BCTC (Thông tư 200)</th>
                <th className="py-3 px-4 text-right">Số Cuối Năm / Kỳ Báo Cáo (VNĐ)</th>
                <th className="py-3 px-4 text-right">Số Đầu Năm / Kỳ Trước (VNĐ)</th>
                <th className="py-3 px-4 text-center w-24">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isEditing = editingCode === item.code;

                return (
                  <tr
                    key={item.code}
                    className={`transition-colors ${
                      item.isHeader
                        ? 'bg-slate-100/90 font-extrabold text-slate-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    } ${
                      item.code === 110 || item.code === 131 || item.code === 311 || item.code === 320
                        ? 'bg-blue-50/50'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-700">
                      {item.code}
                    </td>

                    <td className="py-3 px-4">
                      <span className={item.isHeader ? 'text-sm text-slate-900' : 'pl-3'}>
                        {item.name}
                      </span>
                      {item.code === 110 && (
                        <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                          Tiền mặt & NH
                        </span>
                      )}
                      {item.code === 131 && (
                        <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">
                          Phải thu KH
                        </span>
                      )}
                      {item.code === 320 && (
                        <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                          Vay ngắn hạn
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {isEditing ? (
                        <div className="flex items-center justify-end space-x-1">
                          <input
                            type="number"
                            value={editingAmount}
                            onChange={(e) => setEditingAmount(Number(e.target.value))}
                            className="w-40 px-2 py-1 text-xs border border-blue-500 rounded bg-white text-right font-mono"
                          />
                          <button
                            onClick={() => handleEditAmountSave(item.code)}
                            className="px-2 py-1 bg-emerald-600 text-white font-bold rounded text-[10px]"
                          >
                            Lưu
                          </button>
                        </div>
                      ) : (
                        <span>{formatVND(item.amountCurrent)}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {formatVND(item.amountPrevious)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {!item.isHeader && !isEditing && (
                        <button
                          onClick={() => {
                            setEditingCode(item.code);
                            setEditingAmount(item.amountCurrent);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded"
                          title="Chỉnh sửa số liệu"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
