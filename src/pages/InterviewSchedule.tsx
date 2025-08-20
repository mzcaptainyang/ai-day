import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Lightbulb,
  MessageSquare,
  Plus,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import candidatesData from "../data/candidates.json";
import interviewRoundsData from "../data/interviewRounds.json";
import usersData from "../data/users.json";
import { Candidate, InterviewRound, User as UserType } from "../types";

const InterviewSchedule: React.FC = () => {
  const [interviews, setInterviews] = useState<InterviewRound[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    setInterviews(interviewRoundsData as InterviewRound[]);
    setCandidates(candidatesData as Candidate[]);
    setUsers(usersData as UserType[]);
  }, []);

  const getCandidateName = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return candidate?.name || "未知候选人";
  };

  const getCandidate = (candidateId: string) => {
    return candidates.find((c) => c.id === candidateId);
  };

  const getInterviewerName = (interviewerId: string) => {
    const interviewer = users.find((u) => u.id === interviewerId);
    return interviewer?.name || "未知面试官";
  };

  // AI 简历评价功能
  const generateAIResumeAnalysis = (candidate: Candidate) => {
    const experience = candidate.resume.experience.length;
    const skillsCount = candidate.resume.skills.technical.length;
    const projectsCount = candidate.resume.projects.length;

    // 模拟AI评分算法
    const experienceScore = Math.min(experience * 2.5, 10);
    const skillsScore = Math.min(skillsCount * 0.8, 10);
    const projectScore = Math.min(projectsCount * 3, 10);
    const overallScore =
      Math.round(((experienceScore + skillsScore + projectScore) / 3) * 10) /
      10;

    // 技能匹配度分析
    const jobRequiredSkills = ["React", "TypeScript", "Node.js", "系统设计"];
    const candidateSkills = candidate.resume.skills.technical;
    const matchedSkills = jobRequiredSkills.filter((skill) =>
      candidateSkills.some((cs) =>
        cs.toLowerCase().includes(skill.toLowerCase())
      )
    );
    const matchRate = Math.round(
      (matchedSkills.length / jobRequiredSkills.length) * 100
    );

    // AI 洞察分析
    const insights = [];
    if (experienceScore >= 8) insights.push("经验丰富");
    if (skillsScore >= 7) insights.push("技能全面");
    if (projectScore >= 8) insights.push("项目经验出色");
    if (matchRate >= 75) insights.push("岗位匹配度高");

    const risks = [];
    if (experienceScore < 5) risks.push("经验不足");
    if (matchRate < 50) risks.push("技能匹配度偏低");
    if (projectScore < 6) risks.push("项目经验有限");

    return {
      overallScore,
      matchRate,
      insights,
      risks,
      experienceScore,
      skillsScore,
      projectScore,
      recommendation:
        overallScore >= 7.5
          ? "强烈推荐"
          : overallScore >= 6
          ? "推荐"
          : "需要评估",
    };
  };

  const getTypeLabel = (type: string) => {
    const typeMap = {
      hr: "HR面试",
      tech_1: "技术一面",
      tech_2: "技术二面",
      vp: "VP面试",
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      scheduled: { text: "已安排", className: "badge-warning", icon: Clock },
      in_progress: {
        text: "进行中",
        className: "badge-primary",
        icon: AlertCircle,
      },
      completed: {
        text: "已完成",
        className: "badge-success",
        icon: CheckCircle,
      },
      cancelled: {
        text: "已取消",
        className: "badge-danger",
        icon: AlertCircle,
      },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      text: status,
      className: "badge-gray",
      icon: AlertCircle,
    };
    const Icon = statusInfo.icon;
    return (
      <span className={`badge ${statusInfo.className} flex items-center`}>
        <Icon className="h-3 w-3 mr-1" />
        {statusInfo.text}
      </span>
    );
  };

  // 筛选面试
  const filteredInterviews = interviews.filter((interview) => {
    const matchesType =
      selectedType === "all" || interview.type === selectedType;
    const interviewDate = new Date(interview.scheduledTime)
      .toISOString()
      .split("T")[0];
    const matchesDate = interviewDate === selectedDate;
    return matchesType && matchesDate;
  });

  // 今日面试统计
  const todayInterviews = interviews.filter((interview) => {
    const interviewDate = new Date(interview.scheduledTime)
      .toISOString()
      .split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    return interviewDate === today;
  });

  const todayStats = {
    total: todayInterviews.length,
    completed: todayInterviews.filter((i) => i.status === "completed").length,
    inProgress: todayInterviews.filter((i) => i.status === "in_progress")
      .length,
    scheduled: todayInterviews.filter((i) => i.status === "scheduled").length,
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-2xl"></div>
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  AI 智能面试安排
                </h1>
                <p className="mt-2 text-gray-600 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                  基于AI算法的智能面试管理与分析系统
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn btn-secondary relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all"></div>
                <Zap className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">AI 智能排期</span>
              </button>
              <button className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0">
                <Plus className="h-4 w-4 mr-2" />
                安排新面试
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI 驱动的今日统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-300"></div>
          <div className="relative card p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    今日面试
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {todayStats.total}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>比昨日 +12%</span>
                </div>
              </div>
              <div className="bg-blue-100 p-4 rounded-2xl">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-300"></div>
          <div className="relative card p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                    AI 评估完成
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {todayStats.completed}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Award className="h-3 w-3 mr-1" />
                  <span>平均得分 8.2</span>
                </div>
              </div>
              <div className="bg-green-100 p-4 rounded-2xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-300"></div>
          <div className="relative card p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                    实时进行
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {todayStats.inProgress}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>平均时长 45分钟</span>
                </div>
              </div>
              <div className="bg-orange-100 p-4 rounded-2xl relative">
                <Activity className="h-8 w-8 text-orange-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-300"></div>
          <div className="relative card p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">
                    AI 智能排期
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {todayStats.scheduled}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Target className="h-3 w-3 mr-1" />
                  <span>匹配度 92%</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-2xl">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">
              选择日期:
            </label>
            <input
              type="date"
              className="input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              面试类型:
            </label>
            <select
              className="select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">所有类型</option>
              <option value="hr">HR面试</option>
              <option value="tech_1">技术一面</option>
              <option value="tech_2">技术二面</option>
              <option value="vp">VP面试</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI 智能面试列表 */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate === new Date().toISOString().split("T")[0]
                  ? "今日AI智能面试安排"
                  : `${selectedDate} AI智能面试安排`}
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>AI实时分析候选人匹配度</span>
            </div>
          </div>
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="relative">
              <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1">
                <Brain className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              该日期暂无面试安排
            </h3>
            <p className="text-gray-500">使用AI智能排期功能安排新的面试</p>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {filteredInterviews.map((interview) => {
              const candidate = getCandidate(interview.candidateId);
              const aiAnalysis = candidate
                ? generateAIResumeAnalysis(candidate)
                : null;

              return (
                <div
                  key={interview.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                >
                  <div className="flex items-start justify-between">
                    {/* 左侧：候选人信息和AI分析 */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {/* 候选人头像 */}
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {getCandidateName(interview.candidateId).charAt(
                                0
                              )}
                            </span>
                          </div>
                          {aiAnalysis && (
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                              <div
                                className={`w-4 h-4 rounded-full ${
                                  aiAnalysis.overallScore >= 8
                                    ? "bg-green-500"
                                    : aiAnalysis.overallScore >= 6
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                            </div>
                          )}
                        </div>

                        {/* 候选人详细信息 */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {getCandidateName(interview.candidateId)}
                            </h4>
                            <span
                              className={`badge ${
                                interview.type === "hr"
                                  ? "badge-primary"
                                  : interview.type === "tech_1"
                                  ? "badge-success"
                                  : interview.type === "tech_2"
                                  ? "badge-warning"
                                  : "badge-danger"
                              }`}
                            >
                              {getTypeLabel(interview.type)}
                            </span>
                            {getStatusBadge(interview.status)}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(
                                interview.scheduledTime
                              ).toLocaleTimeString("zh-CN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {getInterviewerName(interview.interviewerId)}
                            </div>
                          </div>

                          {/* AI 分析结果 */}
                          {aiAnalysis && (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-3">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <Brain className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-semibold text-blue-800">
                                    AI 智能分析
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`text-sm font-bold ${
                                      aiAnalysis.overallScore >= 8
                                        ? "text-green-600"
                                        : aiAnalysis.overallScore >= 6
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {aiAnalysis.overallScore}/10
                                  </span>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i <
                                          Math.floor(
                                            aiAnalysis.overallScore / 2
                                          )
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4 mb-3">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-blue-600">
                                    {aiAnalysis.matchRate}%
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    岗位匹配度
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-green-600">
                                    {aiAnalysis.experienceScore.toFixed(1)}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    经验评分
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-purple-600">
                                    {aiAnalysis.skillsScore.toFixed(1)}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    技能评分
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {aiAnalysis.insights.length > 0 && (
                                    <div className="flex space-x-1">
                                      {aiAnalysis.insights
                                        .slice(0, 2)
                                        .map((insight, idx) => (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                          >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {insight}
                                          </span>
                                        ))}
                                    </div>
                                  )}
                                </div>

                                <div
                                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                    aiAnalysis.recommendation === "强烈推荐"
                                      ? "bg-green-100 text-green-800"
                                      : aiAnalysis.recommendation === "推荐"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  AI {aiAnalysis.recommendation}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 右侧：操作按钮 */}
                    <div className="flex items-center space-x-3 ml-6">
                      {interview.status === "scheduled" && (
                        <Link
                          to={`/interview/${interview.id}`}
                          className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          开始AI面试
                        </Link>
                      )}
                      {interview.status === "completed" && (
                        <button className="btn btn-secondary">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          AI分析报告
                        </button>
                      )}
                      <button className="btn btn-secondary btn-sm">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="btn btn-secondary btn-sm">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI 智能操作面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI 快速操作 */}
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                AI 智能操作
              </h3>
            </div>
            <div className="space-y-3">
              <button className="w-full btn btn-secondary justify-start group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Brain className="h-4 w-4 mr-3 relative z-10" />
                <span className="relative z-10">AI 批量智能安排</span>
                <div className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full relative z-10">
                  NEW
                </div>
              </button>
              <button className="w-full btn btn-secondary justify-start group">
                <Lightbulb className="h-4 w-4 mr-3 text-yellow-500" />
                AI 最优时间推荐
              </button>
              <button className="w-full btn btn-secondary justify-start group">
                <Target className="h-4 w-4 mr-3 text-green-500" />
                智能候选人匹配
              </button>
            </div>
          </div>
        </div>

        {/* 实时AI洞察 */}
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                实时AI洞察
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2 animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      候选人质量上升
                    </p>
                    <p className="text-xs text-green-600">
                      本周平均AI评分提升 +15%
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      面试效率优化
                    </p>
                    <p className="text-xs text-blue-600">
                      AI建议优化面试时长分配
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 智能提醒中心 */}
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  智能提醒
                </h3>
              </div>
              <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full animate-pulse">
                紧急
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-400">
                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      30分钟后开始
                    </p>
                    <p className="text-xs text-orange-600">
                      陈小明 - 技术一面 (AI匹配度: 92%)
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded-full transition-colors">
                        准备材料
                      </button>
                      <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full transition-colors">
                        AI预热
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-400">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      明日待安排
                    </p>
                    <p className="text-xs text-blue-600">
                      3场面试等待AI智能排期
                    </p>
                    <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full mt-2 transition-colors">
                      立即优化
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedule;
