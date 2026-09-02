/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Deal, Customer, Activity, PipelineStage } from './types/crm';
import { BalanceSheetTT200 } from './types/bctc';
import { INITIAL_DEALS, INITIAL_CUSTOMERS, INITIAL_ACTIVITIES } from './data/mockCrmData';
import { SAMPLE_BCTC_VINAMILK } from './data/mockBctcData';
import { exportCrmToExcel, downloadSampleCrmExcelTemplate } from './utils/excelParser';

import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { CrmDashboard } from './components/CrmDashboard';
import { PipelineKanban } from './components/PipelineKanban';
import { CustomerLeadList } from './components/CustomerLeadList';
import { ActivityLog } from './components/ActivityLog';
import { BctcAnalyzer } from './components/BctcAnalyzer';
import { AiSalesAssistant } from './components/AiSalesAssistant';
import { ExcelImportModal } from './components/ExcelImportModal';
import { DealDetailModal } from './components/DealDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('DASHBOARD');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [bctcData, setBctcData] = useState<BalanceSheetTT200>(SAMPLE_BCTC_VINAMILK);

  // Modal States
  const [selectedDealForModal, setSelectedDealForModal] = useState<Deal | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // AI Navigation State
  const [aiInitialAction, setAiInitialAction] = useState<string>('DRAFT_EMAIL');
  const [aiInitialDeal, setAiInitialDeal] = useState<Deal | undefined>(undefined);

  // Badges and alerts calculation
  const staleDealsCount = useMemo(() => {
    const today = new Date().getTime();
    return deals.filter((d) => {
      if (d.stage === 'CLOSED_WON' || d.stage === 'CLOSED_LOST') return false;
      const contactTime = new Date(d.lastContactDate).getTime();
      const diffDays = (today - contactTime) / (1000 * 60 * 60 * 24);
      return diffDays > 14;
    }).length;
  }, [deals]);

  const overdueTasksCount = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return activities.filter((a) => a.status === 'PENDING' && a.date < todayStr).length;
  }, [activities]);

  const activeDealsCount = useMemo(() => {
    return deals.filter((d) => d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST').length;
  }, [deals]);

  // Handlers
  const handleUpdateDealStage = (dealId: string, newStage: PipelineStage) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          let probability = d.probability;
          if (newStage === 'CLOSED_WON') probability = 100;
          else if (newStage === 'CLOSED_LOST') probability = 0;
          else if (newStage === 'NEGOTIATION') probability = 80;
          else if (newStage === 'PROPOSAL') probability = 60;
          else if (newStage === 'QUALIFICATION') probability = 40;
          else if (newStage === 'PROSPECT') probability = 20;

          return {
            ...d,
            stage: newStage,
            probability,
            lastContactDate: new Date().toISOString().slice(0, 10),
          };
        }
        return d;
      })
    );
  };

  const handleAddNewDeal = (newDealData: Omit<Deal, 'id' | 'code'>) => {
    const nextNum = deals.length + 1;
    const code = `DEAL-2025-${nextNum < 10 ? '0' + nextNum : nextNum}`;
    const newDeal: Deal = {
      ...newDealData,
      id: `deal-${Date.now()}`,
      code,
    };
    setDeals((prev) => [newDeal, ...prev]);
  };

  const handleAddNewCustomer = (newCustomerData: Omit<Customer, 'id' | 'code'>) => {
    const nextNum = customers.length + 1;
    const code = `CUST-${nextNum < 10 ? '0' + nextNum : nextNum}`;
    const newCustomer: Customer = {
      ...newCustomerData,
      id: `cust-${Date.now()}`,
      code,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const handleAddNewActivity = (newActData: Omit<Activity, 'id'>) => {
    const newAct: Activity = {
      ...newActData,
      id: `act-${Date.now()}`,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleToggleActivityStatus = (activityId: string) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === activityId) {
          return {
            ...a,
            status: a.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
          };
        }
        return a;
      })
    );
  };

  const handleNavigateToAi = (actionType: string, deal?: Deal) => {
    setAiInitialAction(actionType);
    setAiInitialDeal(deal || deals[0]);
    setActiveTab('AI_ASSISTANT');
  };

  const handleImportSuccess = (importedDeals: Partial<Deal>[], importedCustomers: Partial<Customer>[]) => {
    if (importedDeals.length > 0) {
      const formattedDeals: Deal[] = importedDeals.map((d, idx) => ({
        id: `imported-deal-${Date.now()}-${idx}`,
        code: d.code || `DEAL-IMP-${idx + 1}`,
        title: d.title || 'Hợp Đồng Mới Import',
        companyName: d.companyName || 'Công Ty Đối Tác',
        customerName: d.customerName || 'Đại Diện',
        customerId: d.customerId || 'CUST-IMP',
        amount: d.amount || 500000000,
        stage: d.stage || 'PROSPECT',
        probability: d.probability || 30,
        priority: d.priority || 'MEDIUM',
        expectedCloseDate: d.expectedCloseDate || new Date().toISOString().slice(0, 10),
        lastContactDate: d.lastContactDate || new Date().toISOString().slice(0, 10),
        assignedSales: d.assignedSales || 'Trần Thanh Nam',
        notes: d.notes || 'Import từ file Excel',
        tags: d.tags || ['Excel Import'],
      }));

      setDeals((prev) => [...formattedDeals, ...prev]);
    }

    if (importedCustomers.length > 0) {
      const formattedCustomers: Customer[] = importedCustomers.map((c, idx) => ({
        id: `imported-cust-${Date.now()}-${idx}`,
        code: c.code || `CUST-IMP-${idx + 1}`,
        company: c.company || 'Công Ty Import',
        name: c.name || 'Người Đại Diện',
        industry: c.industry || 'Thương Mại & Dịch Vụ',
        phone: c.phone || '0900000000',
        email: c.email || 'info@partner.com',
        taxCode: c.taxCode || '',
        address: c.address || '',
        status: c.status || 'LEAD',
        assignedTo: c.assignedTo || 'Trần Thanh Nam',
        createdDate: new Date().toISOString().slice(0, 10),
      }));

      setCustomers((prev) => [...formattedCustomers, ...prev]);
    }
  };

  const handleExportExcel = () => {
    exportCrmToExcel(deals, customers);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Left Sidebar Navigation (Matching Reference Design) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        dealsCount={activeDealsCount}
        staleDealsCount={staleDealsCount}
        customersCount={customers.length}
        overdueTasksCount={overdueTasksCount}
      />

      {/* Main Content Area (Offset for Fixed Sidebar on Desktop) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onExportExcel={handleExportExcel}
          onDownloadTemplate={downloadSampleCrmExcelTemplate}
          onToggleSidebarMobile={() => setIsSidebarOpenMobile(true)}
          staleDealsCount={staleDealsCount}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'DASHBOARD' && (
            <CrmDashboard
              deals={deals}
              activities={activities}
              onSelectDeal={(deal) => setSelectedDealForModal(deal)}
              onNavigateToAi={handleNavigateToAi}
              onUpdateDealStage={handleUpdateDealStage}
            />
          )}

          {activeTab === 'KANBAN' && (
            <PipelineKanban
              deals={deals}
              onUpdateDealStage={handleUpdateDealStage}
              onSelectDeal={(deal) => setSelectedDealForModal(deal)}
              onAddNewDeal={handleAddNewDeal}
              onNavigateToAi={handleNavigateToAi}
            />
          )}

          {activeTab === 'CUSTOMERS' && (
            <CustomerLeadList
              customers={customers}
              deals={deals}
              onAddNewCustomer={handleAddNewCustomer}
              onSelectCustomer={(cust) => {
                const matchedDeal = deals.find(
                  (d) => d.customerId === cust.id || d.companyName.toLowerCase().includes(cust.company.toLowerCase())
                );
                if (matchedDeal) {
                  setSelectedDealForModal(matchedDeal);
                } else {
                  alert(
                    `Khách hàng ${cust.company} hiện chưa có hợp đồng/deal trong pipeline. Bấm "Thêm Deal Mới" ở tab Kanban để khởi tạo.`
                  );
                }
              }}
            />
          )}

          {activeTab === 'ACTIVITIES' && (
            <ActivityLog
              activities={activities}
              deals={deals}
              onAddNewActivity={handleAddNewActivity}
              onToggleActivityStatus={handleToggleActivityStatus}
            />
          )}

          {activeTab === 'BCTC' && (
            <BctcAnalyzer
              bctcData={bctcData}
              onUpdateBctcData={setBctcData}
              onRunAiAnalysis={(bctc) => handleNavigateToAi('BCTC_ANALYSIS')}
            />
          )}

          {activeTab === 'AI_ASSISTANT' && (
            <AiSalesAssistant
              deals={deals}
              bctcData={bctcData}
              initialActionType={aiInitialAction}
              initialDeal={aiInitialDeal}
            />
          )}
        </main>
      </div>

      {/* Deal Detail Modal */}
      <DealDetailModal
        deal={selectedDealForModal}
        activities={activities}
        onClose={() => setSelectedDealForModal(null)}
        onUpdateStage={(dealId, stage) => {
          handleUpdateDealStage(dealId, stage);
          if (selectedDealForModal) {
            setSelectedDealForModal({ ...selectedDealForModal, stage });
          }
        }}
        onNavigateToAi={handleNavigateToAi}
      />

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
