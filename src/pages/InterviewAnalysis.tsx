import {
  AlertTriangle,
  BarChart3,
  Bot,
  Brain,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

const InterviewAnalysis: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [selectedInterviewer, setSelectedInterviewer] = useState<string | null>(
    null
  );
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  // 模拟分析数据
  const analysisData = {
    summary: {
      totalInterviews: 156,
      averageScore: 7.2,
      passRate: 68,
      averageDuration: 85, // 分钟
    },
    trends: {
      monthly: [
        { month: "1月", interviews: 45, passRate: 64, avgScore: 6.8 },
        { month: "2月", interviews: 52, passRate: 71, avgScore: 7.1 },
        { month: "3月", interviews: 59, passRate: 68, avgScore: 7.2 },
      ],
    },
    interviewTypes: [
      { type: "HR面试", count: 156, passRate: 85, avgScore: 7.8 },
      { type: "技术一面", count: 132, passRate: 72, avgScore: 7.1 },
      { type: "技术二面", count: 95, passRate: 63, avgScore: 6.9 },
      { type: "VP面试", count: 60, passRate: 58, avgScore: 6.8 },
    ],
    interviewers: [
      {
        id: "zhang_hr",
        name: "张三(HR)",
        interviews: 45,
        avgScore: 7.8,
        efficiency: 92,
        aiScore: 8.5,
        strengths: ["沟通能力强", "面试节奏把控好", "候选人体验佳"],
        weaknesses: ["技术评估深度不够", "时间把控需改进"],
        aiAnalysis:
          "张三作为HR面试官表现优异，在候选人沟通和文化适配评估方面有独特优势，建议继续保持并加强技术理解。",
        personalityType: "友好型",
        consistency: 94,
        predictiveAccuracy: 89,
      },
      {
        id: "li_tech",
        name: "李四(技术)",
        interviews: 38,
        avgScore: 7.2,
        efficiency: 88,
        aiScore: 7.9,
        strengths: ["技术深度把控准确", "问题设计合理", "逻辑思维清晰"],
        weaknesses: ["面试氛围略紧张", "沟通引导不足"],
        aiAnalysis:
          "李四技术功底扎实，评估准确度高，但在面试体验优化方面有提升空间，建议参加面试技巧培训。",
        personalityType: "分析型",
        consistency: 91,
        predictiveAccuracy: 95,
      },
      {
        id: "wang_tech",
        name: "王五(技术)",
        interviews: 35,
        avgScore: 6.9,
        efficiency: 85,
        aiScore: 7.3,
        strengths: ["系统设计评估专业", "架构思维清晰", "经验丰富"],
        weaknesses: ["评分标准偏严格", "反馈不够及时"],
        aiAnalysis:
          "王五在系统架构评估方面表现突出，但评分标准需要校准，建议与其他面试官进行标准统一。",
        personalityType: "严谨型",
        consistency: 88,
        predictiveAccuracy: 87,
      },
      {
        id: "zhao_vp",
        name: "赵六(VP)",
        interviews: 22,
        avgScore: 6.8,
        efficiency: 90,
        aiScore: 8.1,
        strengths: ["战略视野开阔", "领导力评估准确", "决策果断"],
        weaknesses: ["面试频次较低", "与候选人互动较少"],
        aiAnalysis:
          "赵六具有丰富的高级管理经验，在候选人潜力评估方面准确度很高，建议增加面试参与度。",
        personalityType: "领导型",
        consistency: 93,
        predictiveAccuracy: 91,
      },
    ],
    skills: [
      { skill: "React", avgScore: 7.5, difficulty: "high", trend: "up" },
      {
        skill: "Node.js",
        avgScore: 7.1,
        difficulty: "medium",
        trend: "stable",
      },
      { skill: "Python", avgScore: 6.8, difficulty: "medium", trend: "down" },
      { skill: "系统设计", avgScore: 6.5, difficulty: "high", trend: "up" },
      { skill: "沟通能力", avgScore: 7.8, difficulty: "low", trend: "stable" },
    ],
    aiInsights: [
      {
        type: "improvement",
        title: "🚀 面试效率AI优化建议",
        description:
          "AI分析发现技术二面平均时长超出最优范围15%，建议引入结构化面试流程，预计可提升效率18%",
        priority: "high",
        confidence: 92,
        impact: "提升面试体验，节省时间成本",
        aiScore: 8.3,
      },
      {
        type: "trend",
        title: "📈 候选人质量AI趋势预测",
        description:
          "基于机器学习模型预测，本季度候选人技术水平呈上升趋势，建议适当调整录用标准以匹配市场变化",
        priority: "high",
        confidence: 89,
        impact: "优化人才筛选精度，提高录用质量",
        aiScore: 8.7,
      },
      {
        type: "alert",
        title: "⚠️ 面试官负载AI预警",
        description:
          "AI工作量分析显示面试官负载不均衡，李四超负荷30%，建议重新分配并提供支持",
        priority: "medium",
        confidence: 95,
        impact: "避免面试质量下降，提升面试官满意度",
        aiScore: 7.9,
      },
      {
        type: "prediction",
        title: "🔮 AI人才流失预测",
        description:
          "基于历史数据分析，预测未来3个月内可能流失的关键候选人，建议提前制定挽留策略",
        priority: "high",
        confidence: 87,
        impact: "降低人才流失率，节省招聘成本",
        aiScore: 8.5,
      },
      {
        type: "opportunity",
        title: "💡 AI技能缺口发现",
        description:
          "智能分析发现React和系统设计技能存在明显缺口，建议调整面试策略和人才培养计划",
        priority: "medium",
        confidence: 91,
        impact: "填补技能缺口，提升团队整体能力",
        aiScore: 8.1,
      },
      {
        type: "optimization",
        title: "⚡ 面试流程AI优化",
        description:
          "通过AI分析最优面试顺序和时间安排，预计可将候选人体验提升25%，面试成功率提升12%",
        priority: "medium",
        confidence: 88,
        impact: "提升候选人满意度和录用成功率",
        aiScore: 8.4,
      },
    ],
    // AI智能预测和分析
    aiPredictions: {
      nextMonthHiring: {
        predicted: 42,
        confidence: 89,
        trend: "up",
        factors: ["市场需求增加", "技术栈匹配度提升", "薪资竞争力增强"],
      },
      skillGrowth: [
        {
          skill: "React",
          growthRate: 15,
          demand: "high",
          recommendation: "加强筛选",
        },
        {
          skill: "AI/ML",
          growthRate: 35,
          demand: "very_high",
          recommendation: "紧急招聘",
        },
        {
          skill: "系统设计",
          growthRate: 8,
          demand: "medium",
          recommendation: "稳步培养",
        },
      ],
      riskAssessment: {
        overallRisk: "low",
        factors: [
          { factor: "面试质量", risk: "low", score: 8.5 },
          { factor: "候选人满意度", risk: "medium", score: 7.2 },
          { factor: "时间效率", risk: "medium", score: 7.8 },
        ],
      },
    },
    // 面试官AI深度分析
    interviewerAiAnalysis: {
      performanceMatrix: [
        {
          name: "张三(HR)",
          technical: 6.5,
          communication: 9.2,
          efficiency: 8.8,
          growth: 7.5,
        },
        {
          name: "李四(技术)",
          technical: 9.1,
          communication: 7.3,
          efficiency: 8.5,
          growth: 8.2,
        },
        {
          name: "王五(技术)",
          technical: 8.9,
          communication: 7.8,
          efficiency: 8.1,
          growth: 7.9,
        },
        {
          name: "赵六(VP)",
          technical: 7.5,
          communication: 8.7,
          efficiency: 9.0,
          growth: 8.8,
        },
      ],
      recommendations: [
        {
          interviewer: "张三(HR)",
          action: "技术培训",
          priority: "medium",
          timeline: "2个月",
        },
        {
          interviewer: "李四(技术)",
          action: "沟通技巧提升",
          priority: "high",
          timeline: "1个月",
        },
        {
          interviewer: "王五(技术)",
          action: "评分标准统一",
          priority: "medium",
          timeline: "2周",
        },
        {
          interviewer: "赵六(VP)",
          action: "增加面试频次",
          priority: "low",
          timeline: "持续",
        },
      ],
    },
  };

  const getSkillTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return (
          <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
        );
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "improvement":
        return <Target className="h-5 w-5 text-blue-500" />;
      case "trend":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "prediction":
        return <Brain className="h-5 w-5 text-purple-500" />;
      case "opportunity":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case "optimization":
        return <Zap className="h-5 w-5 text-indigo-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-gray-500" />;
    }
  };

  // AI分析触发
  const triggerAiAnalysis = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => setIsAiAnalyzing(false), 3000);
  };

  // 面试官详细分析
  const handleInterviewerClick = (interviewerId: string) => {
    setSelectedInterviewer(interviewerId);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <span className="badge badge-danger">高优先级</span>;
      case "medium":
        return <span className="badge badge-warning">中优先级</span>;
      case "low":
        return <span className="badge badge-success">低优先级</span>;
      default:
        return <span className="badge badge-gray">未知</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI增强页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 text-blue-600 mr-3" />
            🤖 AI智能数据分析
          </h1>
          <p className="mt-2 text-sm text-gray-600 flex items-center">
            <Sparkles className="h-4 w-4 mr-1" />
            基于机器学习算法的全方位面试数据洞察与预测分析
            <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
              AI驱动
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
            <option value="year">本年</option>
          </select>
          <button className="btn btn-secondary">
            <Filter className="h-4 w-4 mr-2" />
            智能筛选
          </button>
          <button
            onClick={triggerAiAnalysis}
            className={`btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 border-0 ${
              isAiAnalyzing ? "animate-pulse" : ""
            }`}
          >
            <Brain className="h-4 w-4 mr-2" />
            {isAiAnalyzing ? "AI分析中..." : "AI深度分析"}
          </button>
          <button className="btn btn-primary">
            <FileText className="h-4 w-4 mr-2" />
            导出AI报告
            <span className="ml-1 text-xs bg-white bg-opacity-20 px-1 py-0.5 rounded">
              PDF
            </span>
          </button>
        </div>
      </div>

      {/* AI增强关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-l-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 mb-1">
                🤖 AI分析面试总数
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {analysisData.summary.totalInterviews}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% vs 上月
                </p>
                <div className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">
                  AI预测: +8%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-l-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 mb-1">
                🎯 AI智能评分
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {analysisData.summary.averageScore}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.3 vs 上月
                </p>
                <div className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">
                  置信度: 94%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-l-purple-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 mb-1">
                ✅ AI预测通过率
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {analysisData.summary.passRate}%
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2% vs 上月
                </p>
                <div className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">
                  AI建议: 优化
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-l-orange-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 mb-1">
                ⏱️ AI时长优化
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {analysisData.summary.averageDuration}min
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-600">最优范围内</p>
                <div className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full">
                  效率: 92%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI增强面试类型分析 */}
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
            🤖 AI面试轮次深度分析
            <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              智能洞察
            </span>
          </h3>
          <div className="space-y-5">
            {analysisData.interviewTypes.map((type, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        index === 0
                          ? "bg-blue-100"
                          : index === 1
                          ? "bg-green-100"
                          : index === 2
                          ? "bg-purple-100"
                          : "bg-orange-100"
                      }`}
                    >
                      <span
                        className={`text-lg ${
                          index === 0
                            ? "text-blue-600"
                            : index === 1
                            ? "text-green-600"
                            : index === 2
                            ? "text-purple-600"
                            : "text-orange-600"
                        }`}
                      >
                        {index === 0
                          ? "🤝"
                          : index === 1
                          ? "💻"
                          : index === 2
                          ? "🏗️"
                          : "🎯"}
                      </span>
                    </div>
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        {type.type}
                      </span>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500 mr-2">
                          {type.count} 场面试
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          AI评估完成
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {type.avgScore}
                    </div>
                    <div className="text-xs text-gray-500">AI智能评分</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>🎯 通过率</span>
                      <span className="font-bold">{type.passRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div
                        className={`h-3 rounded-full relative ${
                          index === 0
                            ? "bg-gradient-to-r from-blue-400 to-blue-600"
                            : index === 1
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : index === 2
                            ? "bg-gradient-to-r from-purple-400 to-purple-600"
                            : "bg-gradient-to-r from-orange-400 to-orange-600"
                        }`}
                        style={{ width: `${type.passRate}%` }}
                      >
                        <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>🤖 AI预测</span>
                      <span className="font-bold text-green-600">
                        {type.passRate >= 80
                          ? "↗️ 优化"
                          : type.passRate >= 60
                          ? "→ 稳定"
                          : "↘️ 关注"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {type.passRate >= 80
                        ? "表现优异，建议保持"
                        : type.passRate >= 60
                        ? "表现稳定，小幅优化"
                        : "需要重点关注改进"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI面试官深度分析 */}
        <div className="card p-6 bg-gradient-to-br from-green-50 to-teal-50 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <User className="h-6 w-6 text-green-600 mr-3" />
              🧠 AI面试官全维度分析
            </h3>
            <button className="btn btn-sm btn-primary">
              <Bot className="h-4 w-4 mr-1" />
              AI深度报告
            </button>
          </div>
          <div className="space-y-4">
            {analysisData.interviewers.map((interviewer, index) => (
              <div
                key={index}
                onClick={() => handleInterviewerClick(interviewer.id)}
                className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
              >
                {/* AI状态指示器 */}
                <div className="absolute top-0 right-0 w-16 h-16">
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-blue-600 text-xl font-bold">
                        {interviewer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {interviewer.name}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {interviewer.interviews} 场面试
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {interviewer.personalityType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {interviewer.aiScore}
                    </div>
                    <div className="text-xs text-blue-600 flex items-center">
                      <Brain className="h-3 w-3 mr-1" />
                      AI综合评分
                    </div>
                  </div>
                </div>

                {/* AI核心指标 */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-600">
                      {interviewer.avgScore}
                    </div>
                    <div className="text-xs text-green-700">面试评分</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">
                      {interviewer.efficiency}%
                    </div>
                    <div className="text-xs text-blue-700">工作效率</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-lg font-bold text-purple-600">
                      {interviewer.consistency}%
                    </div>
                    <div className="text-xs text-purple-700">评分一致性</div>
                  </div>
                </div>

                {/* AI优势分析 */}
                <div className="mb-3">
                  <h5 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    AI识别优势
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {interviewer.strengths.slice(0, 2).map((strength, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                      >
                        ✅ {strength}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI分析结论 */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-start">
                    <Bot className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700 leading-relaxed">
                      <span className="font-medium">AI智能分析: </span>
                      {interviewer.aiAnalysis}
                    </div>
                  </div>
                </div>

                {/* 点击提示 */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-400 flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  点击查看详细分析
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 技能评估分析 */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">技能评估分析</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  技能
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  平均分数
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  难度等级
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  趋势
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analysisData.skills.map((skill, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      {skill.skill}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">
                        {skill.avgScore}
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(skill.avgScore / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge ${
                        skill.difficulty === "high"
                          ? "badge-danger"
                          : skill.difficulty === "medium"
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {skill.difficulty === "high"
                        ? "困难"
                        : skill.difficulty === "medium"
                        ? "中等"
                        : "简单"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getSkillTrendIcon(skill.trend)}
                      <span className="ml-2 text-sm text-gray-500">
                        {skill.trend === "up"
                          ? "上升"
                          : skill.trend === "down"
                          ? "下降"
                          : "稳定"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI增强洞察和预测 */}
      <div className="card p-0 overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="relative">
          {/* 背景动效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 animate-pulse"></div>

          <div className="relative z-10 p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center">
                  <Brain className="h-8 w-8 mr-3" />
                  🤖 AI深度洞察与智能预测
                </h3>
                <p className="text-blue-100 text-sm mt-2">
                  基于深度学习算法的全方位数据分析与未来趋势预测
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI实时分析中</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisData.aiInsights.map((insight, index) => (
              <div
                key={index}
                className="p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <span className="text-lg font-bold text-gray-900 block">
                        {insight.title}
                      </span>
                      <div className="flex items-center mt-1">
                        {getPriorityBadge(insight.priority)}
                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          置信度 {insight.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {insight.description}
                </p>

                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">
                        AI评分
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {insight.aiScore}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(insight.aiScore / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    <span className="font-medium">预期影响: </span>
                    {insight.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI预测分析面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 招聘预测 */}
        <div className="card p-6 bg-gradient-to-br from-green-50 to-teal-50 border border-green-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            📈 AI招聘预测
          </h4>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {analysisData.aiPredictions.nextMonthHiring.predicted}
            </div>
            <div className="text-sm text-green-700">下月预计录用人数</div>
            <div className="text-xs text-gray-500 mt-1">
              置信度 {analysisData.aiPredictions.nextMonthHiring.confidence}%
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-bold text-gray-800">关键影响因素:</h5>
            {analysisData.aiPredictions.nextMonthHiring.factors.map(
              (factor, idx) => (
                <div
                  key={idx}
                  className="flex items-center text-sm text-gray-700"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  {factor}
                </div>
              )
            )}
          </div>
        </div>

        {/* 技能趋势 */}
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 text-blue-600 mr-2" />
            🚀 AI技能趋势
          </h4>
          <div className="space-y-3">
            {analysisData.aiPredictions.skillGrowth.map((skill, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {skill.skill}
                  </span>
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-sm font-bold text-green-600">
                      +{skill.growthRate}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      skill.demand === "very_high"
                        ? "bg-red-100 text-red-700"
                        : skill.demand === "high"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {skill.demand === "very_high"
                      ? "极高需求"
                      : skill.demand === "high"
                      ? "高需求"
                      : "中等需求"}
                  </span>
                  <span className="text-gray-600">{skill.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 风险评估 */}
        <div className="card p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            ⚠️ AI风险评估
          </h4>
          <div className="text-center mb-4">
            <div
              className={`text-2xl font-bold mb-1 ${
                analysisData.aiPredictions.riskAssessment.overallRisk === "low"
                  ? "text-green-600"
                  : analysisData.aiPredictions.riskAssessment.overallRisk ===
                    "medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {analysisData.aiPredictions.riskAssessment.overallRisk === "low"
                ? "✅ 低风险"
                : analysisData.aiPredictions.riskAssessment.overallRisk ===
                  "medium"
                ? "⚠️ 中风险"
                : "❌ 高风险"}
            </div>
            <div className="text-sm text-gray-600">整体风险评级</div>
          </div>

          <div className="space-y-3">
            {analysisData.aiPredictions.riskAssessment.factors.map(
              (factor, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      {factor.factor}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {factor.score}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${
                          factor.risk === "low"
                            ? "bg-green-500"
                            : factor.risk === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${(factor.score / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        factor.risk === "low"
                          ? "bg-green-100 text-green-700"
                          : factor.risk === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {factor.risk === "low"
                        ? "低"
                        : factor.risk === "medium"
                        ? "中"
                        : "高"}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* AI增强趋势分析与可视化 */}
      <div className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-7 w-7 text-purple-600 mr-3" />
            📊 AI智能趋势分析
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
              实时更新
            </span>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              AI驱动
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 图表区域 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              月度趋势图表
            </h4>
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg relative">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-purple-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">🚀 AI增强图表组件</p>
                <p className="text-xs text-gray-400">
                  可集成 Chart.js, D3.js 等图表库
                </p>
              </div>
              {/* AI分析标识 */}
              <div className="absolute top-2 right-2 flex items-center text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                <Brain className="h-3 w-3 mr-1" />
                AI分析
              </div>
            </div>
          </div>

          {/* AI分析总结 */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900">🤖 AI关键发现</h4>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-1">
                    候选人质量提升
                  </h5>
                  <p className="text-sm text-gray-600">
                    过去3个月候选人平均技术水平提升了18%，建议适当调整技术评估标准。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-1">
                    面试流程优化机会
                  </h5>
                  <p className="text-sm text-gray-600">
                    AI识别出技术二面环节存在15%的时间浪费，建议引入标准化流程。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <Lightbulb className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-1">AI预测建议</h5>
                  <p className="text-sm text-gray-600">
                    基于当前趋势，下季度建议重点关注AI/ML技能候选人的招聘。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 面试官详细分析模态框 */}
      {selectedInterviewer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Brain className="h-7 w-7 text-blue-600 mr-3" />
                🧠 AI面试官深度分析报告
              </h3>
              <button
                onClick={() => setSelectedInterviewer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {analysisData.interviewerAiAnalysis.performanceMatrix
                  .filter(
                    (perf) =>
                      perf.name ===
                      analysisData.interviewers.find(
                        (i) => i.id === selectedInterviewer
                      )?.name
                  )
                  .map((perf, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {perf.technical}
                      </div>
                      <div className="text-xs text-gray-600">技术能力</div>
                    </div>
                  ))}
                {/* 其他维度类似 */}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setSelectedInterviewer(null)}
                className="btn btn-secondary"
              >
                关闭详细分析
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewAnalysis;
