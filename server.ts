import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Sales Assistant Endpoint (Email draft, Objection handling, Strategy)
app.post("/api/ai/sales-assistant", async (req, res) => {
  try {
    const { actionType, dealData, customerData, promptContext } = req.body;
    const ai = getGeminiClient();

    let systemInstruction = `Bạn là Chuyên gia Tư vấn Bán hàng & Trợ lý AI CRM Doanh nghiệp cấp cao (AI Sales Assistant). 
Nhiệm vụ của bạn là hỗ trợ đội ngũ Sales chốt hợp đồng, tư vấn kịch bản chăm sóc, viết email B2B chuyên nghiệp, và phân tích tâm lý khách hàng.
Bạn phải đưa ra câu trả lời thực tế, rõ ràng bằng Tiếng Việt, sử dụng định dạng Markdown đẹp mắt.`;

    let userPrompt = "";

    if (actionType === "DRAFT_EMAIL") {
      userPrompt = `Hãy viết 1 email B2B gửi cho khách hàng sau:
- Tên Khách Hàng: ${customerData?.name || "Khách hàng B2B"}
- Công ty/Đơn vị: ${customerData?.company || "Doanh nghiệp"}
- Giai đoạn Pipeline: ${dealData?.stage || "Thương lượng"}
- Sản phẩm/Dịch vụ quan tâm: ${dealData?.title || "Giải pháp Doanh nghiệp"}
- Giá trị Deal: ${dealData?.amount ? dealData.amount.toLocaleString("vi-VN") + " VNĐ" : "Chưa xác định"}
- Yêu cầu/Bối cảnh cụ thể: ${promptContext || "Mời họp demo và chốt hợp đồng"}

Yêu cầu email: Có tiêu đề cuốn hút (Subject line), nội dung lịch sự, chuyên nghiệp, nêu bật giá trị mang lại và CTA (Call to action) chốt lịch làm việc.`;
    } else if (actionType === "OBJECTION_HANDLING") {
      userPrompt = `Khách hàng đang đưa ra phản đối hoặc phân vân sau:
- Nguồn phản đối: "${promptContext || "Giá hơi cao so với ngân sách của công ty"}"
- Thông tin Deal: ${dealData?.title || "Dự án"} (${dealData?.amount ? dealData.amount.toLocaleString("vi-VN") + " VNĐ" : ""})
- Thông tin Khách hàng: ${customerData?.company || "Đối tác B2B"}

Hãy cung cấp:
1. Phân tích nguyên nhân cốt lõi đằng sau sự từ chối này.
2. 3 kịch bản ứng xử/câu nói cụ thể cho Nhân viên Sales để thuyết phục khách hàng.
3. Đề xuất chiến lược đàm phán giảm bớt áp lực giá (ví dụ: chia nhỏ gói, ưu đãi thanh toán sớm, cam kết ROI).`;
    } else if (actionType === "PIPELINE_INSIGHTS") {
      userPrompt = `Hãy phân tích danh sách cơ hội bán hàng (Deal Pipeline) hiện tại và đưa ra khuyến nghị hành động khẩn cấp:
- Dữ liệu Deal Pipeline: ${JSON.stringify(dealData || [])}
- Yêu cầu:
1. Đánh giá sức khỏe Pipeline (Deal có nguy cơ rủi ro trễ hạn, deal ngâm quá lâu > 14 ngày).
2. Top 3 deal ưu tiên cần tập trung nguồn lực nhất tuần này và lý do.
3. Kế hoạch hành động cụ thể cho Sales Manager / CEO.`;
    } else {
      userPrompt = promptContext || "Hãy đưa ra 5 lời khuyên gia tăng Win-rate cho đội ngũ B2B Sales.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ result: response.text || "Không có phản hồi từ AI." });
  } catch (error: any) {
    console.error("AI Sales Assistant error:", error);
    res.status(500).json({ error: error.message || "Lỗi xử lý AI Sales Assistant" });
  }
});

// AI BCTC Financial Analyzer Endpoint (VAS / Thông tư 200)
app.post("/api/ai/bctc-analyzer", async (req, res) => {
  try {
    const { bctcData, companyName, period, customQuestion } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `Bạn là Kỹ sư phần mềm kiêm Chuyên gia Phân tích Tài chính Doanh nghiệp (CFA) chuyên sâu về Chuẩn mực Kế toán Việt Nam (VAS) và Thông tư 200/2014/TT-BTC.
QUY TẮC CỐT LÕI:
1. Luôn map dữ liệu theo mã số Thông tư 200 (Ví dụ: Mã 110 - Tiền, Mã 131 - Phải thu khách hàng, Mã 311 - Vay & nợ ngắn hạn, Mã 140 - Hàng tồn kho, Mã 310 - Nợ ngắn hạn, Mã 400 - Vốn CSH, Mã 10 - Doanh thu thuần, Mã 20 - Lợi nhuận gộp, Mã 60 - LNST).
2. Khi phân tích cho CEO/Nhà đầu tư, KHÔNG ĐƯỢC BỊA SỐ. Chỉ sử dụng chính xác các con số có trong dữ liệu context BCTC được cung cấp.
3. Trình bày báo cáo đánh giá bằng Markdown chuyên nghiệp, cấu trúc rõ ràng bao gồm:
   - Tóm tắt sức khỏe tài chính tổng quan (Sức mạnh Bảng CDKT & KQKD).
   - Phân tích khả năng thanh toán & Rủi ro dòng tiền (Current ratio, Quick ratio, DSO mã 131).
   - Phân tích cơ cấu Vốn & Đòn bẩy tài chính (Nợ phải trả Mã 300 / Vốn CSH Mã 400, Vay ngắn hạn Mã 311).
   - Phân tích hiệu quả hoạt động & Khả năng sinh lời (Biên LN gộp, ROE, ROA).
   - 3 Cảnh báo rủi ro trọng yếu & Khuyến nghị quản trị tài chính cho Ban Giám Đốc.`;

    const userPrompt = `Hãy phân tích Báo cáo tài chính Thông tư 200 cho doanh nghiệp:
- Tên Doanh nghiệp: ${companyName || "Công ty Cổ phần B2B"}
- Kỳ Báo cáo: ${period || "Năm hiện tại"}
- Dữ liệu BCTC chi tiết (Mã số TT 200):
${JSON.stringify(bctcData, null, 2)}

- Câu hỏi / Yêu cầu bổ sung của Ban Giám Đốc: ${customQuestion || "Hãy phân tích toàn diện rủi ro thanh khoản, nợ vay và hiệu quả kinh doanh."}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature to prevent hallucination of numbers
      },
    });

    res.json({ result: response.text || "Không có phản hồi từ AI." });
  } catch (error: any) {
    console.error("AI BCTC Analyzer error:", error);
    res.status(500).json({ error: error.message || "Lỗi phân tích BCTC" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
