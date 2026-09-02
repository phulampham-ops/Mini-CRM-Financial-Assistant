import { BalanceSheetTT200, FinancialRatios } from '../types/bctc';

export function calculateFinancialRatios(bctc: BalanceSheetTT200): FinancialRatios {
  const getItemAmount = (code: number): number => {
    const item = bctc.items.find((i) => i.code === code);
    return item ? item.amountCurrent : 0;
  };

  // Các giá trị cốt lõi theo mã số Thông tư 200
  const m100 = getItemAmount(100); // Tài sản ngắn hạn
  const m110 = getItemAmount(110); // Tiền & TĐ tiền
  const m120 = getItemAmount(120); // Đầu tư tài chính ngắn hạn
  const m130 = getItemAmount(130); // Phải thu ngắn hạn
  const m131 = getItemAmount(131); // Phải thu khách hàng
  const m140 = getItemAmount(140); // Hàng tồn kho
  const m270 = getItemAmount(270); // TỔNG TÀI SẢN

  const m300 = getItemAmount(300); // NỢ PHẢI TRẢ
  const m310 = getItemAmount(310); // Nợ ngắn hạn
  const m320 = getItemAmount(320); // Vay ngắn hạn
  const m400 = getItemAmount(400); // VỐN CHỦ SỞ HỮU
  const m440 = getItemAmount(440); // TỔNG NGUỒN VỐN

  const m10 = getItemAmount(10) || getItemAmount(1); // Doanh thu thuần
  const m11 = getItemAmount(11); // Giá vốn hàng bán
  const m20 = getItemAmount(20); // Lợi nhuận gộp
  const m60 = getItemAmount(60); // Lợi nhuận sau thuế

  // 1. Thanh khoản
  const currentRatio = m310 > 0 ? m100 / m310 : 0;
  const quickRatio = m310 > 0 ? (m110 + m120 + m130) / m310 : 0;
  const cashRatio = m310 > 0 ? m110 / m310 : 0;

  // 2. Cơ cấu vốn
  const debtToEquity = m400 > 0 ? m300 / m400 : 0;
  const debtToAssets = m270 > 0 ? m300 / m270 : 0;
  const shortTermDebtRatio = m310 > 0 ? m320 / m310 : 0;

  // 3. Hoạt động & Vòng quay
  const dso = m10 > 0 ? (m131 / m10) * 365 : 0;
  const inventoryTurnover = m140 > 0 ? m11 / m140 : 0;
  const assetTurnover = m270 > 0 ? m10 / m270 : 0;

  // 4. Sinh lời
  const grossMargin = m10 > 0 ? (m20 / m10) * 100 : 0;
  const netMargin = m10 > 0 ? (m60 / m10) * 100 : 0;
  const roa = m270 > 0 ? (m60 / m270) * 100 : 0;
  const roe = m400 > 0 ? (m60 / m400) * 100 : 0;

  // 5. Kiểm tra Cân đối
  const balanceDifference = Math.abs(m270 - m440);
  const isBalanced = balanceDifference < 1000; // Sai số dưới 1000 VNĐ do làm tròn

  return {
    currentRatio: Number(currentRatio.toFixed(2)),
    quickRatio: Number(quickRatio.toFixed(2)),
    cashRatio: Number(cashRatio.toFixed(2)),
    debtToEquity: Number(debtToEquity.toFixed(2)),
    debtToAssets: Number(debtToAssets.toFixed(2)),
    shortTermDebtRatio: Number(shortTermDebtRatio.toFixed(2)),
    dso: Math.round(dso),
    inventoryTurnover: Number(inventoryTurnover.toFixed(2)),
    assetTurnover: Number(assetTurnover.toFixed(2)),
    grossMargin: Number(grossMargin.toFixed(2)),
    netMargin: Number(netMargin.toFixed(2)),
    roa: Number(roa.toFixed(2)),
    roe: Number(roe.toFixed(2)),
    isBalanced,
    balanceDifference,
  };
}

export function formatVND(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000_000) {
    return (amount / 1_000_000_000_000).toFixed(2) + ' Tỷ Tỷ VNĐ';
  }
  if (Math.abs(amount) >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(2) + ' Tỷ VNĐ';
  }
  if (Math.abs(amount) >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + ' Tr VNĐ';
  }
  return amount.toLocaleString('vi-VN') + ' VNĐ';
}
