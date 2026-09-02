// Bảng Cân đối Kế toán (CDKT) và Kết quả Kinh doanh (KQKD) theo Thông tư 200/2014/TT-BTC

export interface LineItemTT200 {
  code: number; // Mã số theo TT 200 (110, 131, 311, v.v.)
  name: string; // Tên chỉ tiêu (Việt Nam)
  noteNo?: string; // Thuyết minh
  amountCurrent: number; // Số cuối năm / Kỳ này (VNĐ)
  amountPrevious: number; // Số đầu năm / Kỳ trước (VNĐ)
  isHeader?: boolean;
  category: 'ASSET_SHORT' | 'ASSET_LONG' | 'LIABILITY_SHORT' | 'LIABILITY_LONG' | 'EQUITY' | 'INCOME_STATEMENT';
}

export interface BalanceSheetTT200 {
  companyName: string;
  taxCode: string;
  period: string; // e.g. "Năm 2025" hoặc "Q4/2025"
  unit: string; // "VNĐ"
  items: LineItemTT200[];
}

export interface FinancialRatios {
  // Thanh khoản
  currentRatio: number; // Khả năng thanh toán ngắn hạn = 100 / 310
  quickRatio: number; // Khả năng thanh toán nhanh = (110 + 120 + 130) / 310
  cashRatio: number; // Khả năng thanh toán tức thời = 110 / 310

  // Cơ cấu vốn & Đòn bẩy
  debtToEquity: number; // Nợ / Vốn CSH = 300 / 400
  debtToAssets: number; // Nợ / Tổng TS = 300 / 270
  shortTermDebtRatio: number; // Vay ngắn hạn / Nợ ngắn hạn = 311 / 310

  // Hoạt động & Vòng quay
  dso: number; // Số ngày phải thu = (131 / Doanh thu) * 365
  inventoryTurnover: number; // Vòng quay hàng tồn kho = Giá vốn / 140
  assetTurnover: number; // Vòng quay tổng tài sản = Doanh thu / 270

  // Khả năng sinh lời
  grossMargin: number; // Biên lợi nhuận gộp (%) = (Lợi nhuận gộp 20 / Doanh thu 10) * 100
  netMargin: number; // Biên lợi nhuận ròng (%) = (LNST 60 / Doanh thu 10) * 100
  roa: number; // ROA (%) = (LNST 60 / Tổng TS 270) * 100
  roe: number; // ROE (%) = (LNST 60 / Vốn CSH 400) * 100

  // Kiểm tra cân đối
  isBalanced: boolean; // 270 == 440 (Tài sản = Nguồn vốn)
  balanceDifference: number;
}
