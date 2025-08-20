import {
  BarChart3,
  Bot,
  Brain,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  Filter,
  Lightbulb,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import candidatesData from "../data/candidates.json";
import { Candidate } from "../types";

// AI分析数据接口
interface AIInsight {
  candidateId: string;
  aiScore: number;
  confidence: number;
  recommendation: string;
  reasoning: string;
  skills: { name: string; score: number }[];
  personalityTraits: { trait: string; score: number }[];
  culturalFit: number;
  riskLevel: "low" | "medium" | "high";
}

const InterviewReports: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  // const [interviews, setInterviews] = useState<InterviewRound[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [showReportModal, setShowReportModal] = useState(false);
  const [aiInsights, setAiInsights] = useState<Map<string, AIInsight>>(
    new Map()
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setCandidates(candidatesData as any[]);
    // setInterviews(interviewRoundsData as InterviewRound[]);
    // 生成AI分析数据
    generateAIInsights();
  }, []);

  // 生成AI分析数据
  const generateAIInsights = () => {
    const insights = new Map<string, AIInsight>();

    candidatesData.forEach((candidate) => {
      insights.set(candidate.id, {
        candidateId: candidate.id,
        aiScore: Math.round((Math.random() * 2.5 + 7.5) * 10) / 10, // 7.5-10分
        confidence: Math.round(Math.random() * 15 + 85), // 85-100%
        recommendation: Math.random() > 0.3 ? "strong_hire" : "hire",
        reasoning:
          "AI综合分析显示该候选人技术能力强，学习能力突出，与团队文化高度匹配",
        skills: [
          {
            name: "React",
            score: Math.round((Math.random() * 2 + 8) * 10) / 10,
          },
          {
            name: "TypeScript",
            score: Math.round((Math.random() * 2 + 7) * 10) / 10,
          },
          {
            name: "系统设计",
            score: Math.round((Math.random() * 3 + 7) * 10) / 10,
          },
        ],
        personalityTraits: [
          { trait: "主动性", score: Math.round(Math.random() * 20 + 80) },
          { trait: "团队合作", score: Math.round(Math.random() * 15 + 75) },
          { trait: "学习能力", score: Math.round(Math.random() * 25 + 75) },
        ],
        culturalFit: Math.round(Math.random() * 20 + 80), // 80-100%
        riskLevel: Math.random() > 0.7 ? "medium" : "low",
      });
    });

    setAiInsights(insights);
  };

  // 生成完整的面试报告（包含所有轮次）
  const generateMockReport = (candidate: Candidate) => {
    // 生成完整的面试流程报告
    const allRounds = [
      {
        id: `report_hr_${candidate.id}`,
        interviewType: "hr",
        interviewerName: "王HR",
        date: "2024-01-15T14:00:00",
        overallScore: Math.round((Math.random() * 2 + 7) * 10) / 10,
        recommendation: "hire",
        aiScore: Math.round((Math.random() * 1.5 + 7.5) * 10) / 10,
        strengths: [
          "沟通表达能力强",
          "职业规划清晰",
          "学习意愿强烈",
          "团队协作意识好",
        ],
        weaknesses: ["缺乏大厂工作经验", "对公司业务了解有限"],
        detailedFeedback:
          "候选人表现出良好的沟通能力和学习意愿，回答问题逻辑清晰，对职业规划有明确的想法。在团队协作方面有丰富的经验分享，展现了积极的工作态度。",
        aiAnalysis:
          "AI分析显示候选人在沟通能力和学习意愿方面表现突出，文化匹配度高达85%，建议进入下一轮技术面试。",
      },
      {
        id: `report_tech1_${candidate.id}`,
        interviewType: "tech_1",
        interviewerName: "李技术",
        date: "2024-01-17T10:00:00",
        overallScore: Math.round((Math.random() * 2 + 8) * 10) / 10,
        recommendation: "hire",
        aiScore: Math.round((Math.random() * 1.5 + 8) * 10) / 10,
        strengths: [
          "React技术栈掌握扎实",
          "系统设计思路清晰",
          "代码质量高",
          "问题分析能力强",
        ],
        weaknesses: ["部分新技术了解不够深入", "性能优化经验需要加强"],
        detailedFeedback:
          "候选人在技术面试中表现出色，对React生态系统有深入理解，能够清晰地解释复杂的技术概念。在系统设计题目中展现了良好的架构思维，代码实现规范。",
        aiAnalysis:
          "AI技能评估显示候选人React技能达到8.5/10，系统设计能力8.2/10，技术深度满足岗位要求，建议继续技术二面。",
      },
      {
        id: `report_tech2_${candidate.id}`,
        interviewType: "tech_2",
        interviewerName: "张架构师",
        date: "2024-01-19T15:30:00",
        overallScore: Math.round((Math.random() * 2 + 7.5) * 10) / 10,
        recommendation: "hire",
        aiScore: Math.round((Math.random() * 1.5 + 8) * 10) / 10,
        strengths: [
          "系统架构设计优秀",
          "性能优化思路清晰",
          "技术视野开阔",
          "解决复杂问题能力强",
        ],
        weaknesses: ["微服务架构经验相对不足", "容器化部署了解有限"],
        detailedFeedback:
          "候选人在架构设计方面展现了很强的能力，能够从全局角度思考系统设计，对性能优化有深入理解。在讨论复杂业务场景时表现出色，技术深度符合高级工程师要求。",
        aiAnalysis:
          "AI深度评估显示候选人系统架构能力达到高级水平，问题解决能力突出，技术学习能力强，具备成长为技术专家的潜力。",
      },
      {
        id: `report_vp_${candidate.id}`,
        interviewType: "vp",
        interviewerName: "陈VP",
        date: "2024-01-22T16:00:00",
        overallScore: Math.round((Math.random() * 2 + 8) * 10) / 10,
        recommendation: "strong_hire",
        aiScore: Math.round((Math.random() * 1 + 8.5) * 10) / 10,
        strengths: [
          "战略思维清晰",
          "领导潜力突出",
          "业务理解深入",
          "沟通协调能力强",
        ],
        weaknesses: ["管理经验有待加强", "行业洞察需要提升"],
        detailedFeedback:
          "候选人展现了优秀的战略思维和领导潜质，对技术发展趋势有清晰的认知，沟通表达能力强。在讨论团队建设和技术规划时见解独到，具备很强的成长潜力。",
        aiAnalysis:
          "AI综合评估显示候选人具备优秀的领导潜质和战略思维，团队协作能力95/100，推荐录用并纳入核心人才培养计划。",
      },
    ];

    return allRounds;
  };

  const filteredCandidates = candidates.filter((candidate) => {
    return (
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getRecommendationBadge = (recommendation: string) => {
    const map = {
      strong_hire: { text: "强烈推荐", class: "badge-success" },
      hire: { text: "推荐录用", class: "badge-success" },
      no_hire: { text: "不推荐", class: "badge-danger" },
      strong_no_hire: { text: "强烈不推荐", class: "badge-danger" },
    };
    const info = map[recommendation as keyof typeof map] || {
      text: recommendation,
      class: "badge-gray",
    };
    return <span className={`badge ${info.class}`}>{info.text}</span>;
  };

  const handleViewReport = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowReportModal(true);
  };

  return (
    <div className="space-y-6">
      {/* AI智能页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 text-primary-500 mr-3" />
            AI智能面试报告
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            基于机器学习算法深度分析候选人表现，提供智能化招聘决策支持
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="btn btn-secondary"
            onClick={() => setIsAnalyzing(true)}
            disabled={isAnalyzing}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {isAnalyzing ? "AI分析中..." : "AI深度分析"}
          </button>
          <button className="btn btn-primary">
            <Sparkles className="h-4 w-4 mr-2" />
            生成AI报告
          </button>
        </div>
      </div>

      {/* AI智能统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-700">AI分析覆盖</p>
              <p className="text-2xl font-bold text-blue-900">100%</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Sparkles className="h-3 w-3 mr-1" />
                全面智能分析
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-700">AI推荐精度</p>
              <p className="text-2xl font-bold text-green-900">94.2%</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2% 本月
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-700">AI平均评分</p>
              <p className="text-2xl font-bold text-purple-900">8.3</p>
              <p className="text-xs text-purple-600">/10 智能评估</p>
            </div>
          </div>
        </div>
        <div className="card p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-2 bg-orange-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-700">AI推荐录用</p>
              <p className="text-2xl font-bold text-orange-900">78%</p>
              <p className="text-xs text-orange-600">智能筛选率</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI智能洞察面板 */}
      <div className="card p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
            AI智能洞察
          </h3>
          <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full font-medium">
            实时更新
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start p-3 bg-white bg-opacity-60 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">技能趋势分析</p>
              <p className="text-gray-600">
                React和TypeScript技能的候选人表现优于其他技术栈15%
              </p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-white bg-opacity-60 rounded-lg">
            <Target className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">匹配度预测</p>
              <p className="text-gray-600">
                AI识别出3位高匹配度候选人，建议优先安排终面
              </p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-white bg-opacity-60 rounded-lg">
            <Bot className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">智能建议</p>
              <p className="text-gray-600">
                优化面试流程，AI分析显示技术面试时长可缩短至40分钟
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI智能搜索和筛选 */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="AI智能搜索候选人..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <select className="select">
              <option>AI推荐排序</option>
              <option>评分最高</option>
              <option>匹配度最佳</option>
              <option>风险最低</option>
            </select>
            <button className="btn btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              AI智能筛选
            </button>
          </div>
        </div>
      </div>

      {/* AI智能报告列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCandidates.map((candidate) => {
          const mockReports = generateMockReport(candidate);
          const aiInsight = aiInsights.get(candidate.id);
          const avgScore =
            mockReports.length > 0
              ? mockReports.reduce((sum, r) => sum + r.overallScore, 0) /
                mockReports.length
              : 0;

          if (!aiInsight) return null;

          return (
            <div
              key={candidate.id}
              className="card p-0 border-l-4 border-l-primary-500 relative overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* AI状态横幅 */}
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-4 text-white relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 animate-pulse"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{candidate.name}</h3>
                      <div className="flex items-center text-sm text-blue-100">
                        <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                        AI全维度分析完成 • 置信度 {aiInsight.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* AI推荐标签 */}
                  <div className="flex items-center space-x-2">
                    {aiInsight.recommendation === "strong_hire" && (
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        AI强烈推荐
                      </span>
                    )}
                    {aiInsight.recommendation === "hire" && (
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        AI推荐录用
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* AI核心指标面板 */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {aiInsight.aiScore}
                    </div>
                    <div className="text-xs text-blue-700 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI总评分
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {aiInsight.culturalFit}%
                    </div>
                    <div className="text-xs text-green-700 flex items-center justify-center">
                      <Target className="h-3 w-3 mr-1" />
                      文化匹配
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {avgScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-purple-700">面试均分</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div
                      className={`text-lg font-bold mb-1 ${
                        aiInsight.riskLevel === "low"
                          ? "text-green-600"
                          : aiInsight.riskLevel === "medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {aiInsight.riskLevel === "low"
                        ? "✅ 低"
                        : aiInsight.riskLevel === "medium"
                        ? "⚠️ 中"
                        : "❌ 高"}
                    </div>
                    <div className="text-xs text-orange-700">风险评级</div>
                  </div>
                </div>

                {/* 候选人基本信息 */}
                <div className="flex items-center justify-center mb-4 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                  高级前端工程师 • 文化匹配 {aiInsight.culturalFit}% •
                  经验匹配度 {Math.round(85 + Math.random() * 10)}%
                </div>
                {/* 旧的头部信息已移动到顶部横幅 */}

                {/* AI技能分析 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <Zap className="h-4 w-4 text-purple-500 mr-2" />
                    AI技能分析
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {aiInsight.skills.slice(0, 3).map((skill) => (
                      <div
                        key={skill.name}
                        className="bg-gray-50 p-2 rounded-lg text-center"
                      >
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          {skill.name}
                        </div>
                        <div
                          className={`text-lg font-bold ${getScoreColor(
                            skill.score
                          )}`}
                        >
                          {skill.score}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full"
                            style={{ width: `${(skill.score / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI人格洞察 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <User className="h-4 w-4 text-green-500 mr-2" />
                    AI人格洞察
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {aiInsight.personalityTraits.map((trait) => (
                      <div
                        key={trait.trait}
                        className="bg-green-50 px-2 py-1 rounded-full text-xs"
                      >
                        <span className="font-medium text-green-800">
                          {trait.trait}
                        </span>
                        <span className="text-green-600 ml-1">
                          {trait.score}/100
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI智能分析结论增强版 */}
                <div className="mb-4 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    AI智能分析结论
                    <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      置信度 {aiInsight.confidence}%
                    </span>
                  </h4>
                  <div className="bg-white bg-opacity-80 p-3 rounded-lg border-l-4 border-purple-400 shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed italic mb-3">
                      "{aiInsight.reasoning}"
                    </p>

                    {/* AI预测指标 */}
                    <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                      <div className="text-center bg-gradient-to-r from-green-50 to-green-100 p-2 rounded-lg">
                        <div className="font-bold text-green-600">
                          {Math.round(85 + Math.random() * 10)}%
                        </div>
                        <div className="text-green-700">入职成功率</div>
                      </div>
                      <div className="text-center bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-lg">
                        <div className="font-bold text-blue-600">
                          {Math.round(75 + Math.random() * 20)}%
                        </div>
                        <div className="text-blue-700">团队适配度</div>
                      </div>
                      <div className="text-center bg-gradient-to-r from-purple-50 to-purple-100 p-2 rounded-lg">
                        <div className="font-bold text-purple-600">
                          {Math.round(80 + Math.random() * 15)}%
                        </div>
                        <div className="text-purple-700">成长潜力</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI增强面试轮次报告 */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 text-orange-500 mr-2" />
                    面试流程总览
                    <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                      {mockReports.length}轮完成
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {mockReports.map((report, index) => (
                      <div
                        key={report.id}
                        className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900 flex items-center">
                                {report.interviewType === "hr"
                                  ? "🤝 HR面试"
                                  : report.interviewType === "tech_1"
                                  ? "💻 技术一面"
                                  : report.interviewType === "tech_2"
                                  ? "🏗️ 技术二面"
                                  : "🎯 VP面试"}
                                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  AI已分析
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(report.date).toLocaleDateString(
                                  "zh-CN"
                                )}{" "}
                                • 面试官: {report.interviewerName}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* 传统评分 */}
                            <div className="text-center">
                              <div
                                className={`text-lg font-bold ${getScoreColor(
                                  report.overallScore
                                )}`}
                              >
                                {report.overallScore}
                              </div>
                              <div className="text-xs text-gray-500">
                                传统评分
                              </div>
                            </div>

                            {/* AI评分 */}
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {report.aiScore}
                              </div>
                              <div className="text-xs text-blue-600 flex items-center">
                                <Brain className="h-3 w-3 mr-1" />
                                AI评分
                              </div>
                            </div>

                            {getRecommendationBadge(report.recommendation)}
                          </div>
                        </div>

                        {/* AI分析摘要 */}
                        <div className="mt-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                          <div className="flex items-start">
                            <Bot className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-blue-700 leading-relaxed">
                              <span className="font-medium">AI分析摘要: </span>
                              {report.aiAnalysis}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(candidate.createdAt).toLocaleDateString(
                        "zh-CN"
                      )}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {mockReports.length} 轮面试
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-1 ${
                          aiInsight.riskLevel === "low"
                            ? "bg-green-400"
                            : aiInsight.riskLevel === "medium"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                      />
                      {aiInsight.riskLevel === "low"
                        ? "低风险"
                        : aiInsight.riskLevel === "medium"
                        ? "中风险"
                        : "高风险"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewReport(candidate)}
                      className="btn btn-sm btn-secondary flex items-center group"
                    >
                      <Brain className="h-3 w-3 mr-1 group-hover:animate-pulse" />
                      AI深度分析
                    </button>
                    <button className="btn btn-sm btn-primary flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      下载AI报告
                      <span className="ml-1 text-xs bg-white bg-opacity-20 px-1 py-0.5 rounded">
                        PDF
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 报告详情模态框 */}
      {showReportModal && selectedCandidate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Brain className="h-7 w-7 text-primary-500 mr-3" />
                  {selectedCandidate.name} - AI智能分析报告
                </h3>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" />
                  由AI算法深度分析生成，提供全方位候选人评估
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* ⚠️ AI智能分析结果 - 最突出位置 */}
            {aiInsights.get(selectedCandidate.id) ? (
              <>
                {/* AI分析横幅 - 吸引用户注意 */}
                <div className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 rounded-xl text-white relative overflow-hidden">
                  {/* 背景动效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-30 animate-pulse"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                          <Brain className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">
                            🤖 AI智能分析报告
                          </h3>
                          <p className="text-blue-100 text-sm">
                            基于机器学习算法的全方位候选人评估
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">实时AI分析</span>
                      </div>
                    </div>

                    {/* AI关键结论 */}
                    <div className="bg-white bg-opacity-15 p-4 rounded-lg mb-4">
                      <div className="flex items-center mb-2">
                        <Sparkles className="h-5 w-5 mr-2" />
                        <span className="font-bold text-lg">
                          AI综合评估结论
                        </span>
                      </div>
                      <p className="text-blue-100 leading-relaxed mb-3">
                        {aiInsights.get(selectedCandidate.id)!.reasoning}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span>
                            AI评分:{" "}
                            <strong className="text-yellow-300">
                              {aiInsights.get(selectedCandidate.id)!.aiScore}/10
                            </strong>
                          </span>
                          <span>
                            置信度:{" "}
                            <strong className="text-green-300">
                              {aiInsights.get(selectedCandidate.id)!.confidence}
                              %
                            </strong>
                          </span>
                          <span>
                            匹配度:{" "}
                            <strong className="text-blue-300">
                              {
                                aiInsights.get(selectedCandidate.id)!
                                  .culturalFit
                              }
                              %
                            </strong>
                          </span>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            aiInsights.get(selectedCandidate.id)!
                              .recommendation === "strong_hire"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {aiInsights.get(selectedCandidate.id)!
                            .recommendation === "strong_hire"
                            ? "🌟 强烈推荐"
                            : "✅ 推荐录用"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI详细分析面板 */}
                <div className="mb-8 relative overflow-hidden">
                  <div className="card p-8 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border-2 border-blue-300 relative z-10">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <Target className="h-6 w-6 text-blue-500 mr-3" />
                      AI智能评估详情
                    </h4>

                    {/* AI核心指标 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-blue-200">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {aiInsights.get(selectedCandidate.id)!.aiScore}
                        </div>
                        <div className="text-sm text-gray-600">AI评分</div>
                      </div>

                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-green-200">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {aiInsights.get(selectedCandidate.id)!.culturalFit}%
                        </div>
                        <div className="text-sm text-gray-600">文化匹配</div>
                      </div>

                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-purple-200">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {aiInsights.get(selectedCandidate.id)!.confidence}%
                        </div>
                        <div className="text-sm text-gray-600">置信度</div>
                      </div>

                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-orange-200">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-lg font-bold text-orange-600">
                          {aiInsights.get(selectedCandidate.id)!.riskLevel ===
                          "low"
                            ? "低风险"
                            : aiInsights.get(selectedCandidate.id)!
                                .riskLevel === "medium"
                            ? "中风险"
                            : "高风险"}
                        </div>
                        <div className="text-sm text-gray-600">风险等级</div>
                      </div>
                    </div>

                    {/* AI技能和特质快速预览 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 技能预览 */}
                      <div className="bg-white p-4 rounded-xl border border-purple-200">
                        <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                          <Zap className="h-5 w-5 text-purple-500 mr-2" />
                          AI技能分析
                        </h5>
                        {aiInsights
                          .get(selectedCandidate.id)!
                          .skills.map((skill) => (
                            <div
                              key={skill.name}
                              className="flex items-center justify-between mb-2"
                            >
                              <span className="text-sm text-gray-700">
                                {skill.name}
                              </span>
                              <div className="flex items-center">
                                <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-gradient-to-r from-purple-400 to-blue-500 h-2 rounded-full"
                                    style={{
                                      width: `${(skill.score / 10) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-purple-600">
                                  {skill.score}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* 人格预览 */}
                      <div className="bg-white p-4 rounded-xl border border-green-200">
                        <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                          <User className="h-5 w-5 text-green-500 mr-2" />
                          AI人格分析
                        </h5>
                        {aiInsights
                          .get(selectedCandidate.id)!
                          .personalityTraits.map((trait) => (
                            <div
                              key={trait.trait}
                              className="flex items-center justify-between mb-2"
                            >
                              <span className="text-sm text-gray-700">
                                {trait.trait}
                              </span>
                              <div className="flex items-center">
                                <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-gradient-to-r from-green-400 to-teal-500 h-2 rounded-full"
                                    style={{ width: `${trait.score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-green-600">
                                  {trait.score}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-6 bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-gray-600">AI分析数据加载中...</p>
              </div>
            )}

            {/* 面试轮次报告 - AI增强版 */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-7 w-7 text-primary-500 mr-3" />
                完整面试流程报告
                <span className="ml-auto text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full">
                  4轮面试完成
                </span>
              </h3>

              {generateMockReport(selectedCandidate).map((report, index) => (
                <div key={report.id} className="mb-8 relative">
                  {/* 时间线连接线 */}
                  {index < generateMockReport(selectedCandidate).length - 1 && (
                    <div className="absolute left-6 top-20 w-px h-full bg-gradient-to-b from-blue-300 to-purple-300 z-0"></div>
                  )}

                  <div className="card p-8 relative z-10 border-l-4 border-l-primary-500 bg-gradient-to-r from-gray-50 to-blue-50">
                    {/* 面试轮次标题 */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {report.interviewType === "hr"
                              ? "🤝 HR面试报告"
                              : report.interviewType === "tech_1"
                              ? "💻 技术一面报告"
                              : report.interviewType === "tech_2"
                              ? "🏗️ 技术二面报告"
                              : "🎯 VP面试报告"}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            面试官: {report.interviewerName} •
                            {new Date(report.date).toLocaleDateString("zh-CN")}{" "}
                            •
                            {Math.round(
                              (new Date(report.date).getTime() -
                                new Date("2024-01-15").getTime()) /
                                (1000 * 60)
                            )}
                            分钟
                          </p>
                        </div>
                      </div>

                      {/* 评分对比 */}
                      <div className="text-right">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="text-center">
                            <div
                              className={`text-2xl font-bold ${getScoreColor(
                                report.overallScore
                              )}`}
                            >
                              {report.overallScore}
                            </div>
                            <div className="text-xs text-gray-500">
                              传统评分
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {report.aiScore}
                            </div>
                            <div className="text-xs text-blue-600 flex items-center">
                              <Brain className="h-3 w-3 mr-1" />
                              AI评分
                            </div>
                          </div>
                        </div>
                        {getRecommendationBadge(report.recommendation)}
                      </div>
                    </div>

                    {/* AI分析横幅 */}
                    <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl text-white">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-1">
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-bold mb-2 flex items-center">
                            🤖 AI深度分析
                            <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                              智能评估
                            </span>
                          </h5>
                          <p className="text-blue-100 leading-relaxed text-sm">
                            {report.aiAnalysis}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          优势表现
                        </h5>
                        <ul className="space-y-3">
                          {report.strengths.map((strength, idx) => (
                            <li
                              key={idx}
                              className="flex items-start bg-green-50 p-3 rounded-lg"
                            >
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-white font-bold text-xs">
                                  {idx + 1}
                                </span>
                              </div>
                              <span className="text-sm text-gray-700 font-medium">
                                {strength}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                            <TrendingDown className="h-5 w-5 text-orange-600" />
                          </div>
                          改进建议
                        </h5>
                        <ul className="space-y-3">
                          {report.weaknesses.map((weakness, idx) => (
                            <li
                              key={idx}
                              className="flex items-start bg-orange-50 p-3 rounded-lg"
                            >
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-white font-bold text-xs">
                                  {idx + 1}
                                </span>
                              </div>
                              <span className="text-sm text-gray-700 font-medium">
                                {weakness}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 详细反馈 */}
                    <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
                      <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                        <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                        面试官详细反馈
                      </h5>
                      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-300">
                        <p className="text-gray-700 leading-relaxed italic">
                          "{report.detailedFeedback}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI多维度深度分析 - 增强版 */}
            {aiInsights.get(selectedCandidate.id) && (
              <div className="mb-8">
                <div className="flex items-center justify-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center">
                    <Brain className="h-7 w-7 text-purple-500 mr-3" />
                    AI多维度智能分析
                    <Sparkles className="h-6 w-6 text-blue-500 ml-3" />
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* AI技能分析 - 雷达图风格 */}
                  <div className="card p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 relative overflow-hidden">
                    {/* 背景装饰 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-30 transform translate-x-16 -translate-y-16"></div>

                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        AI技能深度解析
                        <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                          机器学习评估
                        </span>
                      </h4>

                      <div className="space-y-6">
                        {aiInsights
                          .get(selectedCandidate.id)!
                          .skills.map((skill, index) => (
                            <div key={skill.name} className="relative">
                              {/* 技能卡片 */}
                              <div className="bg-white bg-opacity-80 p-5 rounded-xl shadow-sm border border-purple-100">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                        skill.score >= 8
                                          ? "bg-green-500"
                                          : skill.score >= 6
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                    >
                                      <span className="text-white font-bold text-sm">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-800">
                                      {skill.name}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <div
                                      className={`text-2xl font-bold ${getScoreColor(
                                        skill.score
                                      )}`}
                                    >
                                      {skill.score}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      满分10
                                    </div>
                                  </div>
                                </div>

                                {/* 进度条 - 多层次 */}
                                <div className="mb-4">
                                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                    <div
                                      className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 h-3 rounded-full relative overflow-hidden"
                                      style={{
                                        width: `${(skill.score / 10) * 100}%`,
                                      }}
                                    >
                                      <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>初级</span>
                                    <span>中级</span>
                                    <span>高级</span>
                                    <span>专家</span>
                                  </div>
                                </div>

                                {/* AI详细分析 */}
                                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-lg">
                                  <div className="flex items-start">
                                    <Bot className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                      <p className="font-medium text-purple-800 mb-1">
                                        AI深度评估:
                                      </p>
                                      <p className="text-purple-700">
                                        {skill.score >= 8
                                          ? "该技能掌握扎实，在实际项目中能独立承担核心功能开发，具备指导他人的能力"
                                          : skill.score >= 6
                                          ? "技能基础良好，能够完成常规开发任务，在复杂场景下需要适当指导"
                                          : "技能处于学习阶段，基本概念掌握较好，需要在实践中进一步提升"}
                                      </p>
                                      <div className="mt-2 flex items-center text-xs">
                                        <Target className="h-3 w-3 mr-1" />
                                        <span className="font-medium">
                                          匹配度: {Math.round(skill.score * 10)}
                                          %
                                        </span>
                                        <span className="ml-3 text-purple-600">
                                          • 业务适配性强
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* AI人格特质分析 - 圆环进度风格 */}
                  <div className="card p-6 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 relative overflow-hidden">
                    {/* 背景装饰 */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-100 to-teal-100 rounded-full opacity-30 transform -translate-x-16 -translate-y-16"></div>

                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        AI人格特质画像
                        <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          心理学模型
                        </span>
                      </h4>

                      <div className="space-y-6">
                        {aiInsights
                          .get(selectedCandidate.id)!
                          .personalityTraits.map((trait, index) => (
                            <div key={trait.trait} className="relative">
                              {/* 特质卡片 */}
                              <div className="bg-white bg-opacity-80 p-5 rounded-xl shadow-sm border border-green-100">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center">
                                    <div className="relative w-16 h-16 mr-4">
                                      {/* 圆环进度 */}
                                      <svg
                                        className="w-16 h-16 transform -rotate-90"
                                        viewBox="0 0 36 36"
                                      >
                                        <path
                                          className="text-gray-200"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          fill="transparent"
                                          d="M18,2.5 a 15.5,15.5 0 1,1 0,31 a 15.5,15.5 0 1,1 0,-31"
                                        />
                                        <path
                                          className="text-green-500"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          fill="transparent"
                                          strokeDasharray={`${trait.score}, 100`}
                                          d="M18,2.5 a 15.5,15.5 0 1,1 0,31 a 15.5,15.5 0 1,1 0,-31"
                                        />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-green-600">
                                          {trait.score}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <h5 className="text-lg font-bold text-gray-800 mb-1">
                                        {trait.trait}
                                      </h5>
                                      <div className="flex items-center text-sm text-green-600">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        {trait.score >= 90
                                          ? "卓越表现"
                                          : trait.score >= 80
                                          ? "优秀水平"
                                          : trait.score >= 70
                                          ? "良好表现"
                                          : "发展空间"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">
                                      {trait.score}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      满分100
                                    </div>
                                  </div>
                                </div>

                                {/* AI分析详情 */}
                                <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg">
                                  <div className="flex items-start">
                                    <Lightbulb className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                      <p className="font-medium text-green-800 mb-2">
                                        AI人格分析:
                                      </p>
                                      <p className="text-green-700 leading-relaxed mb-3">
                                        {trait.trait === "主动性"
                                          ? "候选人展现出强烈的工作主动性，能够主动承担责任，在团队中起到推动作用"
                                          : trait.trait === "团队合作"
                                          ? "具备良好的团队协作精神，善于沟通，能够与不同背景的同事有效配合"
                                          : trait.trait === "学习能力"
                                          ? "学习能力突出，对新技术和新知识保持高度敏感，能够快速适应变化"
                                          : ""}
                                      </p>
                                      <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center text-green-600">
                                          <Target className="h-3 w-3 mr-1" />
                                          <span>
                                            职位匹配度:{" "}
                                            {Math.round(
                                              (trait.score / 100) * 100
                                            )}
                                            %
                                          </span>
                                        </div>
                                        <span className="bg-white bg-opacity-70 px-2 py-1 rounded-full text-green-700 font-medium">
                                          AI置信度{" "}
                                          {85 + Math.floor(Math.random() * 10)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI预测与建议面板 */}
            {aiInsights.get(selectedCandidate.id) && (
              <div className="mb-8 card p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  AI智能预测与建议
                  <span className="ml-auto text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                    预测模型 v2.1
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 入职成功率预测 */}
                  <div className="bg-white bg-opacity-80 p-5 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-lg font-bold text-gray-800">
                        入职成功率
                      </h5>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {Math.round(85 + Math.random() * 10)}%
                      </div>
                      <div className="text-sm text-gray-600">AI预测概率</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg">
                      <div className="flex items-start">
                        <Bot className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <p className="text-xs text-green-700">
                          基于历史数据分析，该候选人入职后表现稳定的概率很高，建议优先考虑
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 团队适配性 */}
                  <div className="bg-white bg-opacity-80 p-5 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-lg font-bold text-gray-800">
                        团队适配
                      </h5>
                      <User className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {Math.round(80 + Math.random() * 15)}%
                      </div>
                      <div className="text-sm text-gray-600">匹配指数</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-lg">
                      <div className="flex items-start">
                        <Lightbulb className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                        <p className="text-xs text-blue-700">
                          性格特质与现有团队成员互补性强，预期能快速融入团队环境
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 成长潜力预测 */}
                  <div className="bg-white bg-opacity-80 p-5 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-lg font-bold text-gray-800">
                        成长潜力
                      </h5>
                      <TrendingUp className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {Math.round(75 + Math.random() * 20)}%
                      </div>
                      <div className="text-sm text-gray-600">潜力评估</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-3 rounded-lg">
                      <div className="flex items-start">
                        <Sparkles className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                        <p className="text-xs text-purple-700">
                          学习能力和适应性优秀，预期在6个月内能承担更多核心职责
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI建议行动计划 */}
                <div className="mt-6 bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-xl">
                  <h5 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <Target className="h-5 w-5 text-amber-600 mr-2" />
                    AI智能建议
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 mb-1">
                          建议录用
                        </p>
                        <p className="text-gray-700">
                          综合AI分析结果优秀，建议进入最终决策流程
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 mb-1">
                          培养方向
                        </p>
                        <p className="text-gray-700">
                          重点关注系统设计能力培养，安排资深导师指导
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI增强操作按钮 */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      AI分析完成
                    </p>
                    <p className="text-sm text-gray-600">
                      基于126项指标进行多维度智能评估
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="btn btn-secondary flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    AI完整报告
                    <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      PDF
                    </span>
                  </button>
                  <button className="btn btn-primary flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI深度洞察
                    <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      NEW
                    </span>
                  </button>
                  <button className="btn btn-primary flex items-center bg-gradient-to-r from-purple-600 to-blue-600 border-0">
                    <Bot className="h-4 w-4 mr-2" />
                    AI对话助手
                    <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewReports;
