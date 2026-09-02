import React, { useState } from 'react';
import { Deal } from '../types/crm';
import { BalanceSheetTT200 } from '../types/bctc';
import {
  Sparkles,
  Bot,
  Mail,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Send,
  Loader2,
  Copy,
  Check,
  Building,
  User,
  DollarSign,
} from 'lucide-react';

interface AiSalesAssistantProps {
  deals: Deal[];
  bctcData: BalanceSheetTT200;
  initialActionType?: string;
  initialDeal?: Deal;
}

export const AiSalesAssistant: React.FC<AiSalesAssistantProps> = ({
  deals,
  bctcData,
  initialActionType = 'DRAFT_EMAIL',
  initialDeal,
}) => {
  const [actionType, setActionType] = useState<string>(initialActionType);
  const [selectedDealId, setSelectedDealId] = useState<string>(initialDeal?.id || deals[0]?.id || '');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedDeal = deals.find((d) => d.id === selectedDealId) || deals[0];

  const handleRunAi = async (overrideAction?: string, overridePrompt?: string) => {
    setIsLoading(true);
    setAiResult('');
    setCopied(false);

    const currentAction = overrideAction || actionType;

    try {
      let endpoint = '/api/ai/sales-assistant';
      let bodyData: any = {};

      if (currentAction === 'BCTC_ANALYSIS') {
        endpoint = '/api/ai/bctc-analyzer';
        bodyData = {
          bctcData,
          companyName: bctcData.companyName,
          period: bctcData.period,
          customQuestion: overridePrompt || customPrompt || 'Hãy thẩm định khả năng thanh khoản và rủi ro nợ vay ngắn hạn.',
        };
      } else {
        bodyData = {
          actionType: currentAction,
          dealData: currentAction === 'PIPELINE_INSIGHTS' ? deals : selectedDeal,
          customerData: {
            name: selectedDeal?.customerName,
            company: selectedDeal?.companyName,
          },
          promptContext: overridePrompt || customPrompt,
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (data.error) {
        setAiResult(`⚠️ Error: ${data.error}`);
      } else {
        setAiResult(data.result || 'Không tìm thấy phản hồi từ AI Gemini.');
      }
    } catch (err: any) {
      setAiResult(`❌ Lỗi kết nối hệ thống AI: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top AI Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
            <Bot className="w-8 h-8 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold tracking-tight">Trợ Lý Bán Hàng & Phân Tích BCTC AI</h2>
              <span className="bg-slate-950/40 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30">
                GEMINI 3.6 FLASH
              </span>
            </div>
            <p className="text-xs text-amber-100 mt-1">
              Tự động soạn email chốt sale, tư vấn xử lý từ chối, giải cứu deal ngâm và thẩm định BCTC Thông tư 200.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Controls & Preset Prompts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Chọn Kịch Bản AI Phù Hợp</span>
          </h3>

          {/* Action Selectors */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setActionType('DRAFT_EMAIL');
                handleRunAi('DRAFT_EMAIL');
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center space-x-3 text-xs ${
                actionType === 'DRAFT_EMAIL'
                  ? 'bg-amber-50 border-amber-400 font-bold text-amber-950 ring-1 ring-amber-400'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">1. Soạn Email Chốt Sale B2B</div>
                <div className="text-[10px] text-slate-500">Tự động viết email đàm phán & ký MoU</div>
              </div>
            </button>

            <button
              onClick={() => {
                setActionType('OBJECTION_HANDLING');
                handleRunAi('OBJECTION_HANDLING');
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center space-x-3 text-xs ${
                actionType === 'OBJECTION_HANDLING'
                  ? 'bg-amber-50 border-amber-400 font-bold text-amber-950 ring-1 ring-amber-400'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="p-2 bg-rose-100 text-rose-800 rounded-lg">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">2. Kịch Bản Xử Lý Phản Đối Giá</div>
                <div className="text-[10px] text-slate-500">Thuyết phục khách hàng chê đắt hoặc so sánh</div>
              </div>
            </button>

            <button
              onClick={() => {
                setActionType('PIPELINE_INSIGHTS');
                handleRunAi('PIPELINE_INSIGHTS');
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center space-x-3 text-xs ${
                actionType === 'PIPELINE_INSIGHTS'
                  ? 'bg-amber-50 border-amber-400 font-bold text-amber-950 ring-1 ring-amber-400'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">3. Phân Tích Pipeline & Trễ Deal</div>
                <div className="text-[10px] text-slate-500">Khảo sát sức khỏe pipeline & deal ngâm {'>'}14 ngày</div>
              </div>
            </button>

            <button
              onClick={() => {
                setActionType('BCTC_ANALYSIS');
                handleRunAi('BCTC_ANALYSIS');
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center space-x-3 text-xs ${
                actionType === 'BCTC_ANALYSIS'
                  ? 'bg-amber-50 border-amber-400 font-bold text-amber-950 ring-1 ring-amber-400'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">4. Thẩm Định BCTC Thông Tư 200</div>
                <div className="text-[10px] text-slate-500">Đánh giá rủi ro tài chính khách hàng B2B</div>
              </div>
            </button>
          </div>

          {/* Context Selector */}
          {actionType !== 'BCTC_ANALYSIS' && actionType !== 'PIPELINE_INSIGHTS' && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">Chọn Deal Cụ Thể Lấy Context:</label>
              <select
                value={selectedDealId}
                onChange={(e) => setSelectedDealId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    [{d.code}] {d.companyName} - {d.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Custom prompt input */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">Yêu Cầu Bổ Sung Cho AI:</label>
            <textarea
              rows={3}
              placeholder="e.g. Hãy thêm ưu đãi chiết khấu 5% nếu thanh toán trước ngày 15/08..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            disabled={isLoading}
            onClick={() => handleRunAi()}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Đang Suy Nghĩ & Phân Tích...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gửi Yêu Cầu Cho AI Gemini</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Console */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-amber-400">
                  Kết Quả Phản Hồi Từ AI Sales Assistant
                </h3>
              </div>

              {aiResult && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã Sao Chép' : 'Sao Chép Result'}</span>
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="py-24 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-xs text-amber-200 font-bold">Chuyên gia AI đang phân tích dữ liệu & tổng hợp câu trả lời...</p>
                <p className="text-[11px] text-slate-400">Đang áp dụng chuẩn mực kế toán VAS/Thông tư 200 & kịch bản B2B Sales</p>
              </div>
            ) : aiResult ? (
              <div className="prose prose-invert prose-xs max-w-none bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 font-sans leading-relaxed overflow-y-auto max-h-[500px] whitespace-pre-wrap text-slate-200">
                {aiResult}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-950/40 space-y-2">
                <Bot className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="font-bold text-slate-300">Sẵn Sàng Hỗ Trợ Đội Ngũ Bán Hàng!</p>
                <p className="text-slate-500 max-w-md mx-auto">
                  Bấm vào một trong các kịch bản mẫu ở bên trái để AI tự động tạo email, phân tích phản đối giá hoặc thẩm định BCTC.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
