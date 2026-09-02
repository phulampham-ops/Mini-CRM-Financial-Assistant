import { BalanceSheetTT200 } from '../types/bctc';

export const SAMPLE_BCTC_VINAMILK: BalanceSheetTT200 = {
  companyName: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
  taxCode: '0300588569',
  period: 'BCTC Năm 2025 (Theo TT 200/2014/TT-BTC)',
  unit: 'VNĐ',
  items: [
    // --- TÀI SẢN NGẮN HẠN (MÃ 100) ---
    { code: 100, name: 'TÀI SẢN NGẮN HẠN', amountCurrent: 36820000000000, amountPrevious: 34500000000000, isHeader: true, category: 'ASSET_SHORT' },
    { code: 110, name: 'I. Tiền và các khoản tương đương tiền', amountCurrent: 2850000000000, amountPrevious: 2600000000000, isHeader: false, category: 'ASSET_SHORT' },
    { code: 120, name: 'II. Đầu tư tài chính ngắn hạn (Tiền gửi có kỳ hạn)', amountCurrent: 22400000000000, amountPrevious: 20500000000000, isHeader: false, category: 'ASSET_SHORT' },
    { code: 130, name: 'III. Các khoản phải thu ngắn hạn', amountCurrent: 5880000000000, amountPrevious: 5400000000000, isHeader: true, category: 'ASSET_SHORT' },
    { code: 131, name: '1. Phải thu ngắn hạn của khách hàng', amountCurrent: 4920000000000, amountPrevious: 4500000000000, isHeader: false, category: 'ASSET_SHORT' },
    { code: 132, name: '2. Trả trước cho người bán ngắn hạn', amountCurrent: 410000000000, amountPrevious: 380000000000, isHeader: false, category: 'ASSET_SHORT' },
    { code: 136, name: '3. Phải thu ngắn hạn khác', amountCurrent: 550000000000, amountPrevious: 520000000000, isHeader: false, category: 'ASSET_SHORT' },
    { code: 140, name: 'IV. Hàng tồn kho (Net)', amountCurrent: 5250000000000, amountPrevious: 5600000000000, isHeader: false, category: 'ASSET_SHORT' },
    { code: 150, name: 'V. Tài sản ngắn hạn khác', amountCurrent: 440000000000, amountPrevious: 400000000000, isHeader: false, category: 'ASSET_SHORT' },

    // --- TÀI SẢN DÀI HẠN (MÃ 200) ---
    { code: 200, name: 'TÀI SẢN DÀI HẠN', amountCurrent: 15830000000000, amountPrevious: 16200000000000, isHeader: true, category: 'ASSET_LONG' },
    { code: 210, name: 'I. Các khoản phải thu dài hạn', amountCurrent: 120000000000, amountPrevious: 110000000000, isHeader: false, category: 'ASSET_LONG' },
    { code: 220, name: 'II. Tài sản cố định (Nguyên giá - Hao mòn)', amountCurrent: 12150000000000, amountPrevious: 12800000000000, isHeader: false, category: 'ASSET_LONG' },
    { code: 240, name: 'III. Bất động sản đầu tư', amountCurrent: 180000000000, amountPrevious: 190000000000, isHeader: false, category: 'ASSET_LONG' },
    { code: 250, name: 'IV. Tài sản dở dang dài hạn', amountCurrent: 1180000000000, amountPrevious: 1050000000000, isHeader: false, category: 'ASSET_LONG' },
    { code: 260, name: 'V. Đầu tư tài chính dài hạn', amountCurrent: 2200000000000, amountPrevious: 2050000000000, isHeader: false, category: 'ASSET_LONG' },

    // --- TỔNG CỘNG TÀI SẢN (MÃ 270) ---
    { code: 270, name: 'TỔNG CỘNG TÀI SẢN (100 + 200)', amountCurrent: 52650000000000, amountPrevious: 50700000000000, isHeader: true, category: 'ASSET_LONG' },

    // --- NỢ PHẢI TRẢ (MÃ 300) ---
    { code: 300, name: 'NỢ PHẢI TRẢ', amountCurrent: 16800000000000, amountPrevious: 15900000000000, isHeader: true, category: 'LIABILITY_SHORT' },
    { code: 310, name: 'I. Nợ ngắn hạn', amountCurrent: 16100000000000, amountPrevious: 15200000000000, isHeader: true, category: 'LIABILITY_SHORT' },
    { code: 311, name: '1. Phải trả người bán ngắn hạn', amountCurrent: 4850000000000, amountPrevious: 4400000000000, isHeader: false, category: 'LIABILITY_SHORT' },
    { code: 312, name: '2. Người mua trả tiền trước ngắn hạn', amountCurrent: 320000000000, amountPrevious: 290000000000, isHeader: false, category: 'LIABILITY_SHORT' },
    { code: 313, name: '3. Thuế và các khoản phải nộp Nhà nước', amountCurrent: 820000000000, amountPrevious: 750000000000, isHeader: false, category: 'LIABILITY_SHORT' },
    { code: 315, name: '4. Chi phí phải trả ngắn hạn', amountCurrent: 1650000000000, amountPrevious: 1500000000000, isHeader: false, category: 'LIABILITY_SHORT' },
    { code: 320, name: '5. Vay và nợ thuê tài chính ngắn hạn', amountCurrent: 8460000000000, amountPrevious: 8260000000000, isHeader: false, category: 'LIABILITY_SHORT' },

    { code: 330, name: 'II. Nợ dài hạn', amountCurrent: 700000000000, amountPrevious: 700000000000, isHeader: false, category: 'LIABILITY_LONG' },

    // --- VỐN CHỦ SỞ HỮU (MÃ 400) ---
    { code: 400, name: 'VỐN CHỦ SỞ HỮU', amountCurrent: 35850000000000, amountPrevious: 34800000000000, isHeader: true, category: 'EQUITY' },
    { code: 411, name: '1. Vốn góp của chủ sở hữu', amountCurrent: 20899554450000, amountPrevious: 20899554450000, isHeader: false, category: 'EQUITY' },
    { code: 412, name: '2. Thặng dư vốn cổ phần', amountCurrent: 341100000000, amountPrevious: 341100000000, isHeader: false, category: 'EQUITY' },
    { code: 421, name: '3. Lợi nhuận sau thuế chưa phân phối', amountCurrent: 14609345550000, amountPrevious: 13559345550000, isHeader: false, category: 'EQUITY' },

    // --- TỔNG CỘNG NGUỒN VỐN (MÃ 440) ---
    { code: 440, name: 'TỔNG CỘNG NGUỒN VỐN (300 + 400)', amountCurrent: 52650000000000, amountPrevious: 50700000000000, isHeader: true, category: 'EQUITY' },

    // --- KẾT QUẢ KINH DOANH (KQKD) ---
    { code: 1, name: '1. Doanh thu bán hàng và cung cấp dịch vụ', amountCurrent: 60800000000000, amountPrevious: 59900000000000, isHeader: false, category: 'INCOME_STATEMENT' },
    { code: 2, name: '2. Các khoản giảm trừ doanh thu', amountCurrent: 180000000000, amountPrevious: 170000000000, isHeader: false, category: 'INCOME_STATEMENT' },
    { code: 10, name: '3. Doanh thu thuần về bán hàng (Mã 10 = 01 - 02)', amountCurrent: 60620000000000, amountPrevious: 59730000000000, isHeader: true, category: 'INCOME_STATEMENT' },
    { code: 11, name: '4. Giá vốn hàng bán', amountCurrent: 35800000000000, amountPrevious: 35400000000000, isHeader: false, category: 'INCOME_STATEMENT' },
    { code: 20, name: '5. Lợi nhuận gộp (Mã 20 = 10 - 11)', amountCurrent: 24820000000000, amountPrevious: 24330000000000, isHeader: true, category: 'INCOME_STATEMENT' },
    { code: 21, name: '6. Doanh thu hoạt động tài chính', amountCurrent: 1550000000000, amountPrevious: 1400000000000, isHeader: false, category: 'INCOME_STATEMENT' },
    { code: 22, name: '7. Chi phí tài chính (Chi phí lãi vay)', amountCurrent: 420000000000, amountPrevious: 390000000000, isHeader: false, category: 'INCOME_STATEMENT' },
    { code: 25, name: '8. Chi phí bán hàng', amountCurrent: 12900000000000, amountPrevious: 12600000000000, isHeader: false, category: 'INCOME_STATEMENT' },
    { code: 26, name: '9. Chi phí quản lý doanh nghiệp', amountCurrent: 1850000000000, amountPrevious: 1800000000000, isHeader: false, category: 'INCOME_STATEMENT' },
    { code: 30, name: '10. Lợi nhuận thuần từ HĐKD (Mã 30)', amountCurrent: 11200000000000, amountPrevious: 10940000000000, isHeader: true, category: 'INCOME_STATEMENT' },
    { code: 50, name: '11. Tổng lợi nhuận kế toán trước thuế', amountCurrent: 11250000000000, amountPrevious: 10990000000000, isHeader: true, category: 'INCOME_STATEMENT' },
    { code: 60, name: '12. Lợi nhuận sau thuế TNDN (Mã 60)', amountCurrent: 9150000000000, amountPrevious: 8900000000000, isHeader: true, category: 'INCOME_STATEMENT' },
  ],
};
