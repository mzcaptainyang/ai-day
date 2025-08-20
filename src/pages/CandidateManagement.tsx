import {
  AlertTriangle,
  Award,
  Brain,
  Briefcase,
  Calendar,
  Edit,
  Eye,
  Filter,
  Lightbulb,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import candidatesData from "../data/candidates.json";
import jobDescriptionsData from "../data/jobDescriptions.json";
import { Candidate, JobDescription } from "../types";

// AI分析接口
interface CandidateAIAnalysis {
  id: string;
  overallScore: number; // 0-10
  potentialRank: "high" | "medium" | "low";
  skillMatchScore: number; // 0-100
  cultureMatchScore: number; // 0-100
  experienceScore: number; // 0-100
  educationScore: number; // 0-100
  growthPotential: number; // 0-100
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  predictedSuccess: number; // 0-100
  riskFactors: string[];
}

// 扩展候选人类型包含AI分析
interface EnhancedCandidate extends Candidate {
  aiAnalysis: CandidateAIAnalysis;
}

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState<EnhancedCandidate[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPotential, setSelectedPotential] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] =
    useState<EnhancedCandidate | null>(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showOnlyHighPotential, setShowOnlyHighPotential] = useState(false);

  // AI分析生成函数
  const generateAIAnalysis = (
    candidate: Candidate,
    job: JobDescription
  ): CandidateAIAnalysis => {
    const skills = candidate.resume.skills.technical;
    const experience = candidate.resume.experience;

    // 技能匹配评分
    const requiredSkills = job?.skills.technical || [];
    const matchingSkills = skills.filter((skill) =>
      requiredSkills.some(
        (reqSkill) =>
          reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(reqSkill.toLowerCase())
      )
    );
    const skillMatchScore = Math.min(
      100,
      (matchingSkills.length / Math.max(requiredSkills.length, 1)) * 100 +
        Math.random() * 20
    );

    // 经验评分 (基于年限和大厂经验)
    const totalExperience = experience.reduce((acc, exp) => {
      const years =
        parseFloat(exp.duration.split(" - ")[1]) -
        parseFloat(exp.duration.split(" - ")[0]);
      return acc + (isNaN(years) ? 2 : years);
    }, 0);
    const bigCompanies = [
      "字节跳动",
      "腾讯",
      "阿里",
      "美团",
      "百度",
      "Google",
      "Microsoft",
      "Apple",
    ];
    const hasBigCompanyExp = experience.some((exp) =>
      bigCompanies.some((company) => exp.company.includes(company))
    );
    const experienceScore = Math.min(
      100,
      totalExperience * 20 + (hasBigCompanyExp ? 30 : 0) + Math.random() * 15
    );

    // 教育背景评分
    const topUniversities = [
      "清华",
      "北大",
      "北理工",
      "北航",
      "复旦",
      "上交",
      "MIT",
      "Stanford",
    ];
    const hasTopEducation = candidate.resume.education.some((edu) =>
      topUniversities.some((uni) => edu.school.includes(uni))
    );
    const educationScore = hasTopEducation
      ? 85 + Math.random() * 15
      : 60 + Math.random() * 25;

    // 文化匹配度 (模拟)
    const cultureMatchScore = 70 + Math.random() * 25;

    // 成长潜力
    const growthPotential = Math.min(
      100,
      skillMatchScore * 0.3 + experienceScore * 0.3 + educationScore * 0.4
    );

    // 综合评分
    const overallScore =
      (skillMatchScore * 0.3 +
        experienceScore * 0.25 +
        educationScore * 0.2 +
        cultureMatchScore * 0.25) /
      10;

    // 潜力等级
    let potentialRank: "high" | "medium" | "low";
    if (overallScore >= 8.5) potentialRank = "high";
    else if (overallScore >= 7) potentialRank = "medium";
    else potentialRank = "low";

    // 预测成功率
    const predictedSuccess = Math.min(
      95,
      overallScore * 10 + Math.random() * 10
    );

    // 生成优势和建议
    const strengths: string[] = [];
    const concerns: string[] = [];
    const recommendations: string[] = [];
    const riskFactors: string[] = [];

    if (skillMatchScore > 80) {
      strengths.push("技能匹配度高");
      strengths.push("技术实力突出");
    } else if (skillMatchScore < 60) {
      concerns.push("技能匹配度待提升");
      recommendations.push("建议增加相关技术培训");
    }

    if (hasBigCompanyExp) {
      strengths.push("大厂工作经验丰富");
      strengths.push("项目经验valuable");
    }

    if (hasTopEducation) {
      strengths.push("教育背景优秀");
    }

    if (totalExperience > 5) {
      strengths.push("工作经验丰富");
    } else if (totalExperience < 2) {
      riskFactors.push("工作经验相对较少");
    }

    if (potentialRank === "high") {
      recommendations.push("优先安排面试");
      recommendations.push("考虑快速通道");
    }

    return {
      id: candidate.id,
      overallScore: Number(overallScore.toFixed(1)),
      potentialRank,
      skillMatchScore: Number(skillMatchScore.toFixed(0)),
      cultureMatchScore: Number(cultureMatchScore.toFixed(0)),
      experienceScore: Number(experienceScore.toFixed(0)),
      educationScore: Number(educationScore.toFixed(0)),
      growthPotential: Number(growthPotential.toFixed(0)),
      strengths,
      concerns,
      recommendations,
      predictedSuccess: Number(predictedSuccess.toFixed(0)),
      riskFactors,
    };
  };

  useEffect(() => {
    const rawCandidates = candidatesData as unknown as Candidate[];
    const jobsList = jobDescriptionsData as JobDescription[];
    setJobs(jobsList);

    // 为每个候选人生成AI分析
    const enhancedCandidates = rawCandidates.map((candidate) => {
      const job = jobsList.find((j) => j.id === candidate.appliedPosition);
      const aiAnalysis = generateAIAnalysis(candidate, job || jobsList[0]);

      return {
        ...candidate,
        aiAnalysis,
      } as EnhancedCandidate;
    });

    // 按AI评分排序，高潜力优先
    enhancedCandidates.sort(
      (a, b) => b.aiAnalysis.overallScore - a.aiAnalysis.overallScore
    );

    setCandidates(enhancedCandidates);
  }, []);

  // 筛选候选人
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || candidate.status === selectedStatus;
    const matchesPotential =
      selectedPotential === "all" ||
      candidate.aiAnalysis.potentialRank === selectedPotential;
    const matchesHighPotentialFilter =
      !showOnlyHighPotential || candidate.aiAnalysis.potentialRank === "high";

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPotential &&
      matchesHighPotentialFilter
    );
  });

  // AI评分显示组件
  const AIScoreDisplay = ({
    score,
    label,
    color = "primary",
  }: {
    score: number;
    label: string;
    color?: string;
  }) => (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-gray-900">{score}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full bg-${color}-500`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // 潜力等级显示
  const getPotentialBadge = (rank: string, score: number) => {
    const rankConfig = {
      high: {
        text: "高潜力",
        className: "badge-success",
        icon: Star,
        glow: "ring-2 ring-green-200 shadow-green-100",
      },
      medium: {
        text: "中等潜力",
        className: "badge-warning",
        icon: TrendingUp,
        glow: "ring-2 ring-yellow-200 shadow-yellow-100",
      },
      low: {
        text: "待提升",
        className: "badge-gray",
        icon: Target,
        glow: "",
      },
    };
    const config =
      rankConfig[rank as keyof typeof rankConfig] || rankConfig.low;
    const Icon = config.icon;

    return (
      <div className={`flex items-center space-x-1 ${config.glow}`}>
        <span
          className={`badge ${config.className} flex items-center space-x-1`}
        >
          <Icon className="h-3 w-3" />
          <span>{config.text}</span>
          <span className="text-xs opacity-80">({score})</span>
        </span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      applied: { text: "已申请", className: "badge-gray" },
      screening: { text: "筛选中", className: "badge-warning" },
      interviewing: { text: "面试中", className: "badge-primary" },
      completed: { text: "已完成", className: "badge-success" },
      rejected: { text: "已拒绝", className: "badge-danger" },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      text: status,
      className: "badge-gray",
    };
    return (
      <span className={`badge ${statusInfo.className}`}>{statusInfo.text}</span>
    );
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    return job?.title || "未知职位";
  };

  const handleViewCandidate = (candidate: EnhancedCandidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 text-primary-500 mr-3" />
            AI候选人智能管理
            <Sparkles className="h-5 w-5 text-yellow-500 ml-2" />
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            基于AI算法的智能候选人分析与潜力评估系统
          </p>
          <div className="flex items-center mt-2 space-x-6">
            <div className="flex items-center text-sm text-green-600">
              <Star className="h-4 w-4 mr-1" />
              <span>
                已识别{" "}
                {
                  candidates.filter(
                    (c) => c.aiAnalysis?.potentialRank === "high"
                  ).length
                }{" "}
                位高潜力候选人
              </span>
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <Zap className="h-4 w-4 mr-1" />
              <span>
                平均AI评分:{" "}
                {candidates.length > 0
                  ? (
                      candidates.reduce(
                        (sum, c) => sum + c.aiAnalysis?.overallScore || 0,
                        0
                      ) / candidates.length
                    ).toFixed(1)
                  : "0"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowOnlyHighPotential(!showOnlyHighPotential)}
            className={`btn ${
              showOnlyHighPotential ? "btn-success" : "btn-secondary"
            }`}
          >
            <Star className="h-4 w-4 mr-2" />
            {showOnlyHighPotential ? "显示所有" : "仅显示高潜力"}
          </button>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            添加候选人
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="card p-6">
        <div className="flex flex-col gap-4">
          {/* 第一行：搜索和主要筛选 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索候选人姓名或邮箱..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                className="select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">所有状态</option>
                <option value="applied">已申请</option>
                <option value="screening">筛选中</option>
                <option value="interviewing">面试中</option>
                <option value="completed">已完成</option>
                <option value="rejected">已拒绝</option>
              </select>

              <select
                className="select"
                value={selectedPotential}
                onChange={(e) => setSelectedPotential(e.target.value)}
              >
                <option value="all">所有潜力等级</option>
                <option value="high">🌟 高潜力</option>
                <option value="medium">📈 中等潜力</option>
                <option value="low">🎯 待提升</option>
              </select>

              <button className="btn btn-secondary">
                <Filter className="h-4 w-4 mr-2" />
                更多筛选
              </button>
            </div>
          </div>

          {/* 第二行：AI统计概览 */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div>
                <div className="text-sm font-medium text-green-800">
                  高潜力候选人
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {
                    filteredCandidates.filter(
                      (c) => c.aiAnalysis.potentialRank === "high"
                    ).length
                  }
                </div>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div>
                <div className="text-sm font-medium text-blue-800">
                  平均匹配度
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredCandidates.length > 0
                    ? Math.round(
                        filteredCandidates.reduce(
                          (sum, c) => sum + c.aiAnalysis.skillMatchScore,
                          0
                        ) / filteredCandidates.length
                      )
                    : 0}
                  %
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div>
                <div className="text-sm font-medium text-purple-800">
                  成功预测率
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {filteredCandidates.length > 0
                    ? Math.round(
                        filteredCandidates.reduce(
                          (sum, c) => sum + c.aiAnalysis.predictedSuccess,
                          0
                        ) / filteredCandidates.length
                      )
                    : 0}
                  %
                </div>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
              <div>
                <div className="text-sm font-medium text-yellow-800">
                  平均AI评分
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredCandidates.length > 0
                    ? (
                        filteredCandidates.reduce(
                          (sum, c) => sum + c.aiAnalysis.overallScore,
                          0
                        ) / filteredCandidates.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
              </div>
              <Brain className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* 候选人列表 */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  候选人信息
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-primary-500" />
                    AI潜力评估
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-blue-500" />
                    匹配度分析
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态 & 进度
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                    成功预测
                  </div>
                </th>
                <th className="relative px-6 py-4">
                  <span className="sr-only">操作</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => {
                const isHighPotential =
                  candidate.aiAnalysis.potentialRank === "high";
                return (
                  <tr
                    key={candidate.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${
                      isHighPotential
                        ? "bg-green-50 hover:bg-green-100 border-l-4 border-green-400"
                        : ""
                    }`}
                  >
                    {/* 候选人信息 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 relative">
                          <div
                            className={`h-12 w-12 rounded-full flex items-center justify-center ${
                              isHighPotential
                                ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md"
                                : "bg-primary-100 text-primary-700"
                            }`}
                          >
                            <span className="font-medium text-sm">
                              {candidate.name.charAt(0)}
                            </span>
                            {isHighPotential && (
                              <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 fill-current" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {candidate.name}
                            </div>
                            {isHighPotential && (
                              <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {candidate.email}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {getJobTitle(candidate.appliedPosition)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* AI潜力评估 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        {getPotentialBadge(
                          candidate.aiAnalysis.potentialRank,
                          candidate.aiAnalysis.overallScore
                        )}
                        <div className="text-xs text-gray-600">
                          综合评分:{" "}
                          <span className="font-medium">
                            {candidate.aiAnalysis.overallScore}/10
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 匹配度分析 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2 w-32">
                        <AIScoreDisplay
                          score={candidate.aiAnalysis.skillMatchScore}
                          label="技能匹配"
                          color="blue"
                        />
                        <AIScoreDisplay
                          score={candidate.aiAnalysis.experienceScore}
                          label="经验匹配"
                          color="purple"
                        />
                      </div>
                    </td>

                    {/* 状态 & 进度 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        {getStatusBadge(candidate.status)}
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {candidate.interviewRounds.length} / 4 轮
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(candidate.createdAt).toLocaleDateString(
                            "zh-CN"
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 成功预测 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div
                          className={`text-lg font-bold ${
                            candidate.aiAnalysis.predictedSuccess > 80
                              ? "text-green-600"
                              : candidate.aiAnalysis.predictedSuccess > 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {candidate.aiAnalysis.predictedSuccess}%
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              candidate.aiAnalysis.predictedSuccess > 80
                                ? "bg-green-500"
                                : candidate.aiAnalysis.predictedSuccess > 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${candidate.aiAnalysis.predictedSuccess}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600">成功概率</div>
                      </div>
                    </td>

                    {/* 操作 */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewCandidate(candidate)}
                          className="text-primary-600 hover:text-primary-900 p-2 rounded-lg hover:bg-primary-50"
                          title="查看详情"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50"
                          title="编辑信息"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {isHighPotential && (
                          <button
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50"
                            title="快速面试"
                          >
                            <Lightbulb className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50"
                          title="更多操作"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 候选人详情模态框 */}
      {showCandidateModal && selectedCandidate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-primary-500 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    AI智能候选人分析
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedCandidate.name} -{" "}
                    {getPotentialBadge(
                      selectedCandidate.aiAnalysis.potentialRank,
                      selectedCandidate.aiAnalysis.overallScore
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCandidateModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
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

            {/* AI分析概览 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-blue-800">
                      综合评分
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedCandidate.aiAnalysis.overallScore}/10
                    </div>
                  </div>
                  <Brain className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-green-800">
                      技能匹配
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {selectedCandidate.aiAnalysis.skillMatchScore}%
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-purple-800">
                      成功预测
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedCandidate.aiAnalysis.predictedSuccess}%
                    </div>
                  </div>
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-yellow-800">
                      成长潜力
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {selectedCandidate.aiAnalysis.growthPotential}%
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* AI分析面板 */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  {/* AI优势分析 */}
                  <div className="card p-4">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-green-500" />
                      AI识别优势
                    </h5>
                    <div className="space-y-2">
                      {selectedCandidate.aiAnalysis.strengths.map(
                        (strength, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-green-700 bg-green-50 p-2 rounded"
                          >
                            <Star className="h-3 w-3 mr-2 text-green-600" />
                            {strength}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* AI关注点 */}
                  {selectedCandidate.aiAnalysis.concerns.length > 0 && (
                    <div className="card p-4">
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-yellow-500" />
                        关注点分析
                      </h5>
                      <div className="space-y-2">
                        {selectedCandidate.aiAnalysis.concerns.map(
                          (concern, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm text-yellow-700 bg-yellow-50 p-2 rounded"
                            >
                              <AlertTriangle className="h-3 w-3 mr-2 text-yellow-600" />
                              {concern}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI建议 */}
                  <div className="card p-4">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                      AI智能建议
                    </h5>
                    <div className="space-y-2">
                      {selectedCandidate.aiAnalysis.recommendations.map(
                        (recommendation, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-blue-700 bg-blue-50 p-2 rounded"
                          >
                            <Zap className="h-3 w-3 mr-2 text-blue-600" />
                            {recommendation}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="lg:col-span-1">
                <div className="card p-4">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary-700 font-medium text-2xl">
                        {selectedCandidate.name.charAt(0)}
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {selectedCandidate.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {getJobTitle(selectedCandidate.appliedPosition)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedCandidate.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {selectedCandidate.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedCandidate.resume.personalInfo.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      申请时间:{" "}
                      {new Date(selectedCandidate.createdAt).toLocaleDateString(
                        "zh-CN"
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    {getStatusBadge(selectedCandidate.status)}
                  </div>
                </div>
              </div>

              {/* 详细信息 */}
              <div className="lg:col-span-2 space-y-4">
                {/* 工作经历 */}
                <div className="card p-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    工作经历
                  </h5>
                  <div className="space-y-4">
                    {selectedCandidate.resume.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-200 pl-4"
                      >
                        <div className="flex items-center justify-between">
                          <h6 className="font-medium text-gray-900">
                            {exp.position}
                          </h6>
                          <span className="text-sm text-gray-500">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {exp.company}
                        </p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {exp.responsibilities.slice(0, 2).map((resp, idx) => (
                            <li key={idx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 技能 */}
                <div className="card p-4">
                  <h5 className="font-medium text-gray-900 mb-3">技术技能</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.resume.skills.technical.map(
                      (skill, index) => (
                        <span key={index} className="badge badge-primary">
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* 面试进度 */}
                <div className="card p-4">
                  <h5 className="font-medium text-gray-900 mb-3">面试进度</h5>
                  <div className="space-y-2">
                    {["HR面试", "技术一面", "技术二面", "VP面试"].map(
                      (stage, index) => {
                        const isCompleted =
                          index < selectedCandidate.interviewRounds.length;
                        const isCurrent =
                          index === selectedCandidate.interviewRounds.length;
                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <div
                              className={`w-4 h-4 rounded-full ${
                                isCompleted
                                  ? "bg-green-500"
                                  : isCurrent
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isCompleted
                                  ? "text-green-700"
                                  : isCurrent
                                  ? "text-blue-700"
                                  : "text-gray-500"
                              }`}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <div className="flex items-center text-sm text-gray-600">
                <Brain className="h-4 w-4 mr-2" />
                <span>AI分析于 {new Date().toLocaleString("zh-CN")} 生成</span>
              </div>

              <div className="flex space-x-3">
                <button className="btn btn-secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  编辑信息
                </button>
                {selectedCandidate.aiAnalysis.potentialRank === "high" && (
                  <button className="btn btn-success">
                    <Star className="h-4 w-4 mr-2" />
                    优先面试
                  </button>
                )}
                <button className="btn btn-primary">
                  <Calendar className="h-4 w-4 mr-2" />
                  安排面试
                </button>
                <button className="btn btn-warning">
                  <Zap className="h-4 w-4 mr-2" />
                  更新AI分析
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;
