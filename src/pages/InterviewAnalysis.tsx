import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const InterviewAnalysis: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("all");

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
      { name: "张三(HR)", interviews: 45, avgScore: 7.8, efficiency: 92 },
      { name: "李四(技术)", interviews: 38, avgScore: 7.2, efficiency: 88 },
      { name: "王五(技术)", interviews: 35, avgScore: 6.9, efficiency: 85 },
      { name: "赵六(VP)", interviews: 22, avgScore: 6.8, efficiency: 90 },
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
        title: "面试效率提升建议",
        description: "技术二面的平均时长比标准时长长15%，建议优化面试流程",
        priority: "medium",
      },
      {
        type: "trend",
        title: "候选人质量趋势",
        description: "本月候选人整体技术水平较上月提升12%，可适当提高录用标准",
        priority: "high",
      },
      {
        type: "alert",
        title: "面试官工作量不均",
        description: "李四面试场次较其他面试官多30%，建议合理分配面试任务",
        priority: "medium",
      },
    ],
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
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
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
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
          <p className="mt-1 text-sm text-gray-500">
            深入分析面试数据，发现改进机会
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
            筛选
          </button>
          <button className="btn btn-primary">
            <FileText className="h-4 w-4 mr-2" />
            导出报告
          </button>
        </div>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">总面试次数</p>
              <p className="text-2xl font-bold text-gray-900">
                {analysisData.summary.totalInterviews}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs 上月
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">平均分数</p>
              <p className="text-2xl font-bold text-gray-900">
                {analysisData.summary.averageScore}
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.3 vs 上月
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">通过率</p>
              <p className="text-2xl font-bold text-gray-900">
                {analysisData.summary.passRate}%
              </p>
              <p className="text-sm text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                -2% vs 上月
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">平均时长</p>
              <p className="text-2xl font-bold text-gray-900">
                {analysisData.summary.averageDuration}分钟
              </p>
              <p className="text-sm text-gray-600">标准范围内</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 面试类型分析 */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            面试轮次分析
          </h3>
          <div className="space-y-4">
            {analysisData.interviewTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {type.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {type.count} 场
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>通过率</span>
                        <span>{type.passRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${type.passRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {type.avgScore}
                      </div>
                      <div className="text-xs text-gray-500">平均分</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 面试官效率分析 */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">面试官表现</h3>
          <div className="space-y-4">
            {analysisData.interviewers.map((interviewer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 text-xs font-medium">
                      {interviewer.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {interviewer.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {interviewer.interviews} 场面试
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {interviewer.avgScore}
                  </div>
                  <div className="text-xs text-gray-500">平均分</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">
                    {interviewer.efficiency}%
                  </div>
                  <div className="text-xs text-gray-500">效率</div>
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

      {/* AI 洞察和建议 */}
      <div className="card p-6">
        <div className="flex items-center mb-4">
          <Brain className="h-5 w-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">AI 洞察和建议</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysisData.aiInsights.map((insight, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {getInsightIcon(insight.type)}
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {insight.title}
                  </span>
                </div>
                {getPriorityBadge(insight.priority)}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 趋势分析图表区域 - 这里可以集成图表库 */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">面试趋势</h3>
        <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              图表组件位置 - 可集成 Chart.js, D3.js 等图表库
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewAnalysis;
