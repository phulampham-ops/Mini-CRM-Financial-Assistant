import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Deal, Customer } from '../types/crm';

export interface ParsedExcelResult {
  deals: Partial<Deal>[];
  customers: Partial<Customer>[];
  rawRows: any[];
  fileName: string;
}

export function parseExcelOrCsv(file: File): Promise<ParsedExcelResult> {
  return new Promise((resolve, reject) => {
    const fileName = file.name;
    const isCsv = fileName.toLowerCase().endsWith('.csv');

    if (isCsv) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const processed = processRawRows(results.data, fileName);
          resolve(processed);
        },
        error: (error) => reject(error),
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet);
          const processed = processRawRows(rawRows, fileName);
          resolve(processed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    }
  });
}

function processRawRows(rows: any[], fileName: string): ParsedExcelResult {
  const deals: Partial<Deal>[] = [];
  const customers: Partial<Customer>[] = [];

  rows.forEach((row, index) => {
    // Standardize column keys (case-insensitive & space trimmed)
    const normalizedRow: Record<string, any> = {};
    Object.keys(row).forEach((k) => {
      normalizedRow[k.trim().toLowerCase()] = row[k];
    });

    const title = normalizedRow['tiêu đề'] || normalizedRow['tên deal'] || normalizedRow['title'] || normalizedRow['cơ hội'] || `Cơ hội #${index + 1}`;
    const companyName = normalizedRow['công ty'] || normalizedRow['doanh nghiệp'] || normalizedRow['company'] || normalizedRow['khách hàng'] || 'Công ty Chưa đặt tên';
    const customerName = normalizedRow['người liên hệ'] || normalizedRow['đại diện'] || normalizedRow['contact'] || normalizedRow['name'] || 'Khách hàng';
    const amountStr = normalizedRow['giá trị'] || normalizedRow['số tiền'] || normalizedRow['amount'] || normalizedRow['doanh số'] || '0';
    const amount = typeof amountStr === 'number' ? amountStr : parseFloat(String(amountStr).replace(/[^0-9.]/g, '')) || 0;
    
    let stage: Deal['stage'] = 'PROSPECT';
    const stageStr = String(normalizedRow['giai đoạn'] || normalizedRow['stage'] || '').toUpperCase();
    if (stageStr.includes('QUALIF') || stageStr.includes('ĐÁNH GIÁ') || stageStr.includes('TIỀM NĂNG')) stage = 'QUALIFICATION';
    else if (stageStr.includes('PROP') || stageStr.includes('ĐỀ XUẤT') || stageStr.includes('BÁO GIÁ')) stage = 'PROPOSAL';
    else if (stageStr.includes('NEGOT') || stageStr.includes('THƯƠNG LƯỢNG') || stageStr.includes('ĐÀM PHÁN')) stage = 'NEGOTIATION';
    else if (stageStr.includes('WON') || stageStr.includes('THÀNH CÔNG') || stageStr.includes('ĐÃ CHỐT')) stage = 'CLOSED_WON';
    else if (stageStr.includes('LOST') || stageStr.includes('THẤT BẠI') || stageStr.includes('THUA')) stage = 'CLOSED_LOST';

    const priorityStr = String(normalizedRow['ưu tiên'] || normalizedRow['priority'] || '').toUpperCase();
    let priority: Deal['priority'] = 'MEDIUM';
    if (priorityStr.includes('CAO') || priorityStr.includes('HIGH')) priority = 'HIGH';
    else if (priorityStr.includes('THẤP') || priorityStr.includes('LOW')) priority = 'LOW';

    deals.push({
      id: `IMP-DEAL-${Date.now()}-${index}`,
      code: `DL-IMP-${index + 1}`,
      title,
      companyName,
      customerName,
      amount,
      stage,
      priority,
      probability: stage === 'CLOSED_WON' ? 100 : stage === 'NEGOTIATION' ? 80 : stage === 'PROPOSAL' ? 50 : 30,
      expectedCloseDate: normalizedRow['ngày dự kiến'] || normalizedRow['expected date'] || new Date().toISOString().slice(0, 10),
      lastContactDate: new Date().toISOString().slice(0, 10),
      assignedSales: normalizedRow['nhân viên'] || normalizedRow['sales rep'] || 'Sales Import',
      notes: normalizedRow['ghi chú'] || normalizedRow['notes'] || `Imported từ ${fileName}`,
      tags: ['Excel Import'],
    });

    customers.push({
      id: `IMP-CUST-${Date.now()}-${index}`,
      code: `KH-IMP-${index + 1}`,
      name: customerName,
      company: companyName,
      phone: normalizedRow['sđt'] || normalizedRow['phone'] || '0900000000',
      email: normalizedRow['email'] || 'contact@company.com',
      industry: normalizedRow['ngành nghề'] || normalizedRow['industry'] || 'B2B',
      status: 'LEAD',
      assignedTo: 'Sales Team',
      createdDate: new Date().toISOString().slice(0, 10),
    });
  });

  return { deals, customers, rawRows: rows, fileName };
}

export function exportCrmToExcel(deals: Deal[], customers: Customer[] = []) {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Deals
  const dealsData = deals.map((d) => ({
    'Mã Deal': d.code,
    'Tên Cơ Hội': d.title,
    'Công Ty': d.companyName,
    'Người Liên Hệ': d.customerName,
    'Giá Trị (VNĐ)': d.amount,
    'Giai Đoạn': d.stage,
    'Xác Suất (%)': d.probability,
    'Mức Ưu Tiên': d.priority,
    'Ngày Dự Kiến': d.expectedCloseDate,
    'Tương Tác Gần Nhất': d.lastContactDate,
    'Hành Động Tiếp Theo': d.nextActionTitle || '',
    'Hạn Next Action': d.nextActionDate || '',
    'Nhân Viên Sales': d.assignedSales,
    'Ghi Chú': d.notes,
  }));
  const dealsSheet = XLSX.utils.json_to_sheet(dealsData);
  XLSX.utils.book_append_sheet(workbook, dealsSheet, 'CRM Sales Pipeline');

  // Sheet 2: Customers
  if (customers.length > 0) {
    const customersData = customers.map((c) => ({
      'Mã KH': c.code,
      'Tên Doanh Nghiệp': c.company,
      'Người Liên Hệ': c.name,
      'SĐT': c.phone,
      'Email': c.email,
      'Ngành Nghề': c.industry,
      'Mã Số Thuế': c.taxCode || '',
      'Địa Chỉ': c.address || '',
      'Trạng Thái': c.status,
      'Phụ Trách': c.assignedTo,
    }));
    const customersSheet = XLSX.utils.json_to_sheet(customersData);
    XLSX.utils.book_append_sheet(workbook, customersSheet, 'Danh Sách Khách Hàng');
  }

  XLSX.writeFile(workbook, `CRM_Pipeline_Data_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportDealsToExcel(deals: Deal[]) {
  exportCrmToExcel(deals);
}

export function downloadSampleCrmExcelTemplate() {
  const sampleRows = [
    {
      'Mã Deal': 'DL-SAMPLE-01',
      'Tên Cơ Hội': 'Hợp đồng Nâng cấp Hệ thống ERP Sữa Vina',
      'Công Ty': 'Công ty Sữa Việt Nam',
      'Người Liên Hệ': 'Nguyễn Văn A',
      'Giá Trị (VNĐ)': 1500000000,
      'Giai Đoạn': 'NEGOTIATION',
      'Mức Ưu Tiên': 'HIGH',
      'SĐT': '0912345678',
      'Email': 'anv@company.vn',
      'Ngành Nghề': 'FMCG',
      'Nhân Viên Sales': 'Trần Thanh Nam',
      'Ghi Chú': 'Mẫu import chuẩn CRM B2B',
    },
    {
      'Mã Deal': 'DL-SAMPLE-02',
      'Tên Cơ Hội': 'Gói Giải pháp AI Sales Assistant & BCTC',
      'Công Ty': 'Tập đoàn Công nghệ Alpha',
      'Người Liên Hệ': 'Lê Thị B',
      'Giá Trị (VNĐ)': 850000000,
      'Giai Đoạn': 'PROPOSAL',
      'Mức Ưu Tiên': 'MEDIUM',
      'SĐT': '0987654321',
      'Email': 'ble@alpha.com.vn',
      'Ngành Nghề': 'Công nghệ',
      'Nhân Viên Sales': 'Nguyễn Phương Anh',
      'Ghi Chú': 'Mẫu import chuẩn CRM B2B',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_Import_CRM');
  XLSX.writeFile(workbook, 'Mau_Import_Du_Lieu_Khach_Hang_CRM.xlsx');
}
