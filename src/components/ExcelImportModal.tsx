import React, { useState } from 'react';
import { parseExcelOrCsv, downloadSampleCrmExcelTemplate, ParsedExcelResult } from '../utils/excelParser';
import { Deal, Customer } from '../types/crm';
import { FileSpreadsheet, Upload, Download, Check, AlertCircle, Loader2, Table } from 'lucide-react';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedDeals: Partial<Deal>[], importedCustomers: Partial<Customer>[]) => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedResult, setParsedResult] = useState<ParsedExcelResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsParsing(true);
    setErrorMsg('');

    try {
      const result = await parseExcelOrCsv(selectedFile);
      setParsedResult(result);
    } catch (err: any) {
      setErrorMsg(`❌ Lỗi đọc file Excel/CSV: ${err.message || 'File không hợp lệ'}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedResult) return;

    onImportSuccess(parsedResult.deals, parsedResult.customers);
    onClose();
    setFile(null);
    setParsedResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Import Dữ Liệu Khách Hàng & Pipeline Tùy Chỉnh</h3>
              <p className="text-xs text-slate-500">Hỗ trợ file Excel (.xlsx, .xls) và CSV</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
            ✕
          </button>
        </div>

        {/* Upload Drop Zone */}
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 p-6 rounded-2xl text-center space-y-3 transition-colors">
          <Upload className="w-8 h-8 text-blue-600 mx-auto" />
          <div>
            <label className="cursor-pointer font-bold text-xs text-blue-600 hover:text-blue-700 underline">
              <span>Bấm để chọn file Excel / CSV</span>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-500 mt-1">Hoặc kéo thả file vào đây</p>
          </div>

          <button
            onClick={downloadSampleCrmExcelTemplate}
            className="inline-flex items-center space-x-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải File Mẫu Excel CRM Standard (.xlsx)</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-xl border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isParsing && (
          <div className="py-6 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-600 font-semibold">Đang đọc & chuẩn hóa dữ liệu cột Excel...</p>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedResult && !isParsing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã đọc thành công {parsedResult.deals.length} dòng dữ liệu từ {parsedResult.fileName}</span>
              </span>
            </div>

            <div className="overflow-x-auto max-h-48 border border-slate-200 rounded-xl">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2">Tên Deal</th>
                    <th className="p-2">Công Ty</th>
                    <th className="p-2">Giá Trị</th>
                    <th className="p-2">Giai Đoạn</th>
                    <th className="p-2">Ưu Tiên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedResult.deals.slice(0, 5).map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-slate-900 line-clamp-1">{d.title}</td>
                      <td className="p-2 text-slate-700">{d.companyName}</td>
                      <td className="p-2 font-bold text-emerald-700">{d.amount?.toLocaleString('vi-VN')} đ</td>
                      <td className="p-2 font-semibold text-blue-700">{d.stage}</td>
                      <td className="p-2 font-bold text-slate-800">{d.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={!parsedResult}
            onClick={handleConfirmImport}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            Nhập {parsedResult ? parsedResult.deals.length : 0} Deal Vào Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};
