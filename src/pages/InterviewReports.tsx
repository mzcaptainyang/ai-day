import {
  BarChart3,
  Brain,
  Calendar,
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import candidatesData from "../data/candidates.json";
import interviewRoundsData from "../data/interviewRounds.json";
import { Candidate, InterviewRound } from "../types";

const InterviewReports: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<InterviewRound[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    setCandidates(candidatesData as Candidate[]);
    setInterviews(interviewRoundsData as InterviewRound[]);
  }, []);

  // 生成模拟面试报告
  const generateMockReport = (candidate: Candidate) => {
    const completedInterviews = interviews.filter(
      (i) => i.candidateId === candidate.id && i.status === "completed"
    );

    const reports = completedInterviews.map((interview) => ({
      id: `report_${interview.id}`,
      interviewType: interview.type,
      interviewerName: "李四", // 模拟数据
      date: interview.scheduledTime,
      overallScore: interview.evaluation.overallScore,
      recommendation: interview.evaluation.recommendation,
      strengths:
        interview.type === "tech_1"
          ? ["React技术栈掌握扎实", "系统设计思路清晰", "代码质量高"]
          : ["沟通表达能力强", "学习能力突出", "团队协作意识好"],
      weaknesses:
        interview.type === "tech_1"
          ? ["部分新技术了解不够深入", "性能优化经验需要加强"]
          : ["项目管理经验相对不足"],
      detailedFeedback:
        interview.type === "tech_1"
          ? "候选人在技术面试中表现出色，对React生态系统有深入理解，能够清晰地解释复杂的技术概念。在系统设计题目中展现了良好的架构思维，但对一些新兴技术的了解还需要加强。"
          : "候选人表现出良好的沟通能力和学习意愿，回答问题逻辑清晰，对职业规划有明确的想法。在团队协作方面有丰富的经验分享。",
    }));

    return reports;
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
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">面试报告</h1>
          <p className="mt-1 text-sm text-gray-500">
            查看和分析所有候选人的面试报告
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary">
            <BarChart3 className="h-4 w-4 mr-2" />
            数据分析
          </button>
          <button className="btn btn-primary">
            <Brain className="h-4 w-4 mr-2" />
            AI 报告总结
          </button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">总报告数</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">平均分数</p>
              <p className="text-2xl font-bold text-gray-900">7.8</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">推荐率</p>
              <p className="text-2xl font-bold text-gray-900">75%</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">本周生成</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索候选人..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <select className="select">
              <option>所有岗位</option>
              <option>高级前端工程师</option>
              <option>Java后端工程师</option>
            </select>
            <button className="btn btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              更多筛选
            </button>
          </div>
        </div>
      </div>

      {/* 报告列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCandidates.map((candidate) => {
          const mockReports = generateMockReport(candidate);
          const avgScore =
            mockReports.length > 0
              ? mockReports.reduce((sum, r) => sum + r.overallScore, 0) /
                mockReports.length
              : 0;

          return (
            <div key={candidate.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {candidate.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-gray-500">高级前端工程师</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(avgScore)}`}
                  >
                    {avgScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">平均分</div>
                </div>
              </div>

              {/* 面试轮次报告 */}
              <div className="space-y-3 mb-4">
                {mockReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.interviewType === "hr"
                            ? "HR面试"
                            : report.interviewType === "tech_1"
                            ? "技术一面"
                            : report.interviewType === "tech_2"
                            ? "技术二面"
                            : "VP面试"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(report.date).toLocaleDateString("zh-CN")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium ${getScoreColor(
                          report.overallScore
                        )}`}
                      >
                        {report.overallScore}/10
                      </span>
                      {getRecommendationBadge(report.recommendation)}
                    </div>
                  </div>
                ))}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(candidate.createdAt).toLocaleDateString("zh-CN")}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {mockReports.length} 轮面试
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewReport(candidate)}
                    className="btn btn-sm btn-secondary"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    查看详情
                  </button>
                  <button className="btn btn-sm btn-primary">
                    <Download className="h-3 w-3 mr-1" />
                    导出
                  </button>
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
              <h3 className="text-xl font-bold text-gray-900">
                {selectedCandidate.name} - 面试报告详情
              </h3>
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

            {generateMockReport(selectedCandidate).map((report) => (
              <div key={report.id} className="mb-8 card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {report.interviewType === "hr"
                      ? "HR面试报告"
                      : report.interviewType === "tech_1"
                      ? "技术一面报告"
                      : report.interviewType === "tech_2"
                      ? "技术二面报告"
                      : "VP面试报告"}
                  </h4>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-xl font-bold ${getScoreColor(
                        report.overallScore
                      )}`}
                    >
                      {report.overallScore}/10
                    </span>
                    {getRecommendationBadge(report.recommendation)}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                      优势表现
                    </h5>
                    <ul className="space-y-2">
                      {report.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <span className="text-sm text-gray-600">
                            {strength}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2 text-orange-600" />
                      改进建议
                    </h5>
                    <ul className="space-y-2">
                      {report.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <span className="text-sm text-gray-600">
                            {weakness}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="font-medium text-gray-900 mb-3">详细反馈</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {report.detailedFeedback}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                  <div>面试官: {report.interviewerName}</div>
                  <div>
                    面试时间:{" "}
                    {new Date(report.date).toLocaleDateString("zh-CN")}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end space-x-3 mt-6">
              <button className="btn btn-secondary">
                <Download className="h-4 w-4 mr-2" />
                导出PDF
              </button>
              <button className="btn btn-primary">
                <Brain className="h-4 w-4 mr-2" />
                生成AI总结
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewReports;
