import React, { useState } from 'react';
import { Customer, Deal } from '../types/crm';
import { formatVND } from '../utils/bctcCalculator';
import {
  Users,
  Search,
  Plus,
  Building2,
  Phone,
  Mail,
  FileText,
  MapPin,
  Tag,
  Briefcase,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface CustomerLeadListProps {
  customers: Customer[];
  deals: Deal[];
  onAddNewCustomer: (newCustomer: Omit<Customer, 'id' | 'code'>) => void;
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomerLeadList: React.FC<CustomerLeadListProps> = ({
  customers,
  deals,
  onAddNewCustomer,
  onSelectCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LEAD' | 'CUSTOMER'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('Công nghệ & Giải pháp');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'LEAD' | 'CUSTOMER'>('LEAD');
  const [assignedTo, setAssignedTo] = useState('Trần Thanh Nam (Sales Lead)');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) return;

    onAddNewCustomer({
      name,
      company,
      industry,
      phone: phone || '0900000000',
      email: email || 'contact@company.com.vn',
      taxCode,
      address,
      status,
      assignedTo,
      createdDate: new Date().toISOString().slice(0, 10),
    });

    setIsAddModalOpen(false);
    setName('');
    setCompany('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm theo tên, công ty, SĐT, mã..."
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
              Tất Cả ({customers.length})
            </button>
            <button
              onClick={() => setStatusFilter('LEAD')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'LEAD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Leads Tiềm Năng ({customers.filter((c) => c.status === 'LEAD').length})
            </button>
            <button
              onClick={() => setStatusFilter('CUSTOMER')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'CUSTOMER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Khách Hàng Chính Thức ({customers.filter((c) => c.status === 'CUSTOMER').length})
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Khách Hàng / Lead</span>
        </button>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3.5 px-4">Mã / Công Ty</th>
                <th className="py-3.5 px-4">Người Liên Hệ</th>
                <th className="py-3.5 px-4">Thông Tin Liên Hệ</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4">Cơ Hội (Deals)</th>
                <th className="py-3.5 px-4">Phụ Trách Sales</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const customerDeals = deals.filter(
                  (d) => d.customerId === cust.id || d.companyName.toLowerCase().includes(cust.company.toLowerCase())
                );
                const totalDealValue = customerDeals.reduce((sum, d) => sum + d.amount, 0);

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-500 text-[11px]">{cust.code}</div>
                      <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>{cust.company}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{cust.industry}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{cust.name}</div>
                      {cust.taxCode && (
                        <div className="text-[10px] font-mono text-slate-400">MST: {cust.taxCode}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{cust.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{cust.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          cust.status === 'CUSTOMER'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {cust.status === 'CUSTOMER' ? 'Khách Hàng' : 'Lead Tiềm Năng'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{customerDeals.length} Deal</div>
                      <div className="text-emerald-700 font-extrabold text-[11px]">
                        {formatVND(totalDealValue)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {cust.assignedTo}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectCustomer(cust)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors text-xs inline-flex items-center gap-1"
                      >
                        <span>Xem Hồ Sơ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    Không tìm thấy khách hàng nào phù hợp với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Customer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Thêm Khách Hàng / Lead Mới</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên Tỉnh/Thành & Công Ty *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tập đoàn Sữa Vinamilk"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Người Liên Hệ / Đại Diện *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nguyễn Văn Minh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    placeholder="e.g. 0903827112"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Công Việc</label>
                  <input
                    type="email"
                    placeholder="e.g. minh.nguyen@vinamilk.com.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã Số Thuế (MST)</label>
                  <input
                    type="text"
                    placeholder="e.g. 0300588569"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngành Nghề</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa Chỉ Đăng Ký KD</label>
                <input
                  type="text"
                  placeholder="e.g. 10 Tân Trào, P. Tân Phú, Q. 7, TP. HCM"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trạng Thái Khoản</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'LEAD' | 'CUSTOMER')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  >
                    <option value="LEAD">LEAD Tiềm Năng</option>
                    <option value="CUSTOMER">Khách Hàng Chính Thức</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nhân Viên Phụ Trách</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
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
                  Lưu Khách Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
