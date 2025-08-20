import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Lightbulb,
  MessageSquare,
  PieChart,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import AIAssistant from "../components/AIAssistant";
import DataVisualization from "../components/DataVisualization";
import candidatesData from "../data/candidates.json";
import interviewRoundsData from "../data/interviewRounds.json";
import { Candidate, InterviewRound } from "../types";

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  changeType: "positive" | "negative" | "neutral";
}

// AI分析结果接口
interface AIInsight {
  id: string;
  type: "prediction" | "recommendation" | "alert" | "trend";
  title: string;
  description: string;
  confidence: number;
  priority: "high" | "medium" | "low";
  action?: string;
}

interface AIAnalytics {
  candidateQualityScore: number;
  averageInterviewTime: number;
  successPredictionAccuracy: number;
  topSkillsInDemand: string[];
  interviewBottlenecks: string[];
  predictedHiringSuccess: number;
}

const Dashboard = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [aiAnalytics, setAiAnalytics] = useState<AIAnalytics | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  useEffect(() => {
    // 处理候选人数据，转换interviewRounds为正确的格式
    const processedCandidates = candidatesData.map((candidate) => ({
      ...candidate,
      interviewRounds: candidate.interviewRounds.map(
        (roundId) =>
          interviewRoundsData.find((round) => round.id === roundId) || {
            id: roundId,
            type: "hr" as const,
            candidateId: candidate.id,
            interviewerId: "",
            status: "scheduled" as const,
            scheduledTime: "",
            questions: [],
            evaluation: {
              culturalFit: { score: 0, notes: "" },
              overallScore: 0,
              overallNotes: "",
              recommendation: "hire" as const,
            },
            notes: "",
            feedback: "",
            recommendation: "pass" as const,
          }
      ),
    })) as Candidate[];

    setCandidates(processedCandidates);
    setInterviewRounds(interviewRoundsData as InterviewRound[]);

    // 模拟AI分析数据
    generateAIInsights();
    generateAIAnalytics();
  }, []);

  // 生成AI洞察
  const generateAIInsights = () => {
    const insights: AIInsight[] = [
      {
        id: "ai1",
        type: "prediction",
        title: "招聘成功率预测",
        description: "基于当前面试数据，本月成功招聘概率为85%，比上月提升12%",
        confidence: 92,
        priority: "high",
        action: "建议重点关注技术面试质量",
      },
      {
        id: "ai2",
        type: "recommendation",
        title: "候选人匹配优化",
        description: "发现3位高匹配度候选人，建议优先安排面试",
        confidence: 88,
        priority: "medium",
        action: "查看推荐候选人列表",
      },
      {
        id: "ai3",
        type: "alert",
        title: "面试流程瓶颈",
        description: "技术面试环节平均用时超标25%，可能影响候选人体验",
        confidence: 95,
        priority: "high",
        action: "优化面试流程",
      },
      {
        id: "ai4",
        type: "trend",
        title: "技能需求趋势",
        description: "React、TypeScript需求量上升40%，建议调整招聘策略",
        confidence: 87,
        priority: "medium",
      },
    ];
    setAiInsights(insights);
  };

  // 生成AI分析数据
  const generateAIAnalytics = () => {
    const analytics: AIAnalytics = {
      candidateQualityScore: 7.8,
      averageInterviewTime: 65,
      successPredictionAccuracy: 89,
      topSkillsInDemand: ["React", "TypeScript", "Node.js", "Python", "Golang"],
      interviewBottlenecks: [
        "技术面试时间过长",
        "候选人反馈不及时",
        "面试官档期冲突",
      ],
      predictedHiringSuccess: 85,
    };
    setAiAnalytics(analytics);
  };

  // 统计数据计算
  const totalCandidates = candidates.length;
  const interviewingCandidates = candidates.filter(
    (c) => c.status === "interviewing"
  ).length;

  // AI驱动的高级统计
  const calculateAdvancedMetrics = () => {
    const completedRounds = interviewRounds.filter(
      (r) => r.status === "completed"
    );
    const averageScore =
      completedRounds.reduce(
        (acc, round) => acc + (round.evaluation?.overallScore || 0),
        0
      ) / completedRounds.length || 0;

    const passRate =
      (completedRounds.filter((r) => r.recommendation === "pass").length /
        completedRounds.length) *
        100 || 0;

    return {
      averageScore: averageScore.toFixed(1),
      passRate: passRate.toFixed(0),
      totalInterviews: completedRounds.length,
    };
  };

  const metrics = calculateAdvancedMetrics();

  const stats: StatCard[] = [
    {
      title: "AI质量评分",
      value: `${aiAnalytics?.candidateQualityScore.toFixed(1) || "7.8"}/10`,
      change: "+0.8",
      icon: Brain,
      changeType: "positive",
    },
    {
      title: "预测成功率",
      value: `${aiAnalytics?.predictedHiringSuccess || 85}%`,
      change: "+12%",
      icon: Target,
      changeType: "positive",
    },
    {
      title: "面试通过率",
      value: `${metrics.passRate}%`,
      change: "+8%",
      icon: CheckCircle,
      changeType: "positive",
    },
    {
      title: "平均面试时长",
      value: `${aiAnalytics?.averageInterviewTime || 65}分钟`,
      change: "-15分钟",
      icon: Clock,
      changeType: "positive",
    },
  ];

  // AI洞察图标映射
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "prediction":
        return Target;
      case "recommendation":
        return Lightbulb;
      case "alert":
        return AlertTriangle;
      case "trend":
        return TrendingUp;
      default:
        return Brain;
    }
  };

  // AI洞察优先级颜色
  const getInsightColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50 text-red-800";
      case "medium":
        return "border-yellow-500 bg-yellow-50 text-yellow-800";
      case "low":
        return "border-blue-500 bg-blue-50 text-blue-800";
      default:
        return "border-gray-500 bg-gray-50 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题与AI助手 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-8 w-8 text-primary-500 mr-3" />
            AI智能仪表盘
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            基于机器学习的招聘数据分析与预测，助力智能决策
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary">
            <FileText className="h-4 w-4 mr-2" />
            导出智能报告
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsAIAssistantOpen(true)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI对话助手
          </button>
        </div>
      </div>

      {/* AI核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent opacity-20 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="flex items-center relative">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">
                      {stat.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : stat.changeType === "negative"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {stat.changeType === "positive" ? (
                          <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                        ) : (
                          <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                        )}
                        <span className="ml-1">{stat.change}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI智能洞察 */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI核心洞察 */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain className="h-5 w-5 text-primary-500 mr-2" />
                AI智能洞察
              </h3>
              <span className="text-xs px-3 py-1 bg-primary-100 text-primary-800 rounded-full font-medium">
                实时更新
              </span>
            </div>
            <div className="space-y-4">
              {aiInsights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div
                    key={insight.id}
                    className={`border-l-4 p-4 rounded-r-lg ${getInsightColor(
                      insight.priority
                    )}`}
                  >
                    <div className="flex items-start">
                      <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{insight.title}</h4>
                          <span className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded-full">
                            置信度 {insight.confidence}%
                          </span>
                        </div>
                        <p className="text-sm mb-2">{insight.description}</p>
                        {insight.action && (
                          <button className="text-sm font-medium hover:underline">
                            {insight.action} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 数据可视化概览 */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 text-primary-500 mr-2" />
              招聘数据分析
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {totalCandidates}
                </div>
                <div className="text-sm text-blue-800 mt-1">总候选人数</div>
                <div className="text-xs text-blue-600 mt-2">↑ 12% 环比增长</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {interviewingCandidates}
                </div>
                <div className="text-sm text-green-800 mt-1">面试进行中</div>
                <div className="text-xs text-green-600 mt-2">AI智能调度</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {metrics.totalInterviews}
                </div>
                <div className="text-sm text-purple-800 mt-1">已完成面试</div>
                <div className="text-xs text-purple-600 mt-2">AI评分分析</div>
              </div>
            </div>
          </div>

          {/* 最近AI分析活动 */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 text-primary-500 mr-2" />
              智能活动流
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  {
                    id: "ai_1",
                    type: "AI分析",
                    message: "AI系统识别出3位高潜力候选人",
                    time: "5分钟前",
                    icon: Brain,
                    color: "bg-purple-500",
                  },
                  {
                    id: "ai_2",
                    type: "预测更新",
                    message: "本月招聘成功率预测更新至85%",
                    time: "1小时前",
                    icon: Target,
                    color: "bg-blue-500",
                  },
                  {
                    id: "ai_3",
                    type: "智能推荐",
                    message: "推荐优化面试问题模板",
                    time: "3小时前",
                    icon: Lightbulb,
                    color: "bg-yellow-500",
                  },
                ].map((activity, activityIdx) => {
                  const Icon = activity.icon;
                  return (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== 2 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.color}`}
                            >
                              <Icon className="h-4 w-4 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {activity.type}
                              </p>
                              <p className="text-sm text-gray-500">
                                {activity.message}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="space-y-6">
          {/* AI智能推荐 */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
              智能推荐
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      优秀候选人
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      陈小明匹配度达92%
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      最佳面试时间
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      建议安排在周二下午
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div className="flex items-start">
                  <Brain className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      问题优化
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      建议增加行为类问题
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 技能需求热力图 */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChart className="h-5 w-5 text-primary-500 mr-2" />
              技能需求热力
            </h3>
            <div className="space-y-3">
              {aiAnalytics?.topSkillsInDemand.map((skill, index) => {
                const percentage = 100 - index * 15;
                return (
                  <div key={skill}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{skill}</span>
                      <span className="text-primary-600 font-medium">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 快速操作 */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              快速操作
            </h3>
            <div className="space-y-3">
              <button className="w-full btn btn-primary justify-start">
                <Brain className="h-4 w-4 mr-3" />
                启动AI分析
              </button>
              <button className="w-full btn btn-secondary justify-start">
                <Target className="h-4 w-4 mr-3" />
                查看预测报告
              </button>
              <button className="w-full btn btn-secondary justify-start">
                <Users className="h-4 w-4 mr-3" />
                候选人智能匹配
              </button>
              <button className="w-full btn btn-secondary justify-start">
                <Lightbulb className="h-4 w-4 mr-3" />
                生成面试建议
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI数据可视化分析区域 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">深度数据分析</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Sparkles className="h-4 w-4 mr-1" />
            AI智能分析引擎
          </div>
        </div>
        <DataVisualization />
      </div>

      {/* AI助手对话界面 */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
