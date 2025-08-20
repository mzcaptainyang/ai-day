import {
  AlertCircle,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  FileText,
  Plus,
  User,
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

  const getInterviewerName = (interviewerId: string) => {
    const interviewer = users.find((u) => u.id === interviewerId);
    return interviewer?.name || "未知面试官";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">面试安排</h1>
          <p className="mt-1 text-sm text-gray-500">管理和查看所有面试安排</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary">
            <Brain className="h-4 w-4 mr-2" />
            AI 智能排期
          </button>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            安排新面试
          </button>
        </div>
      </div>

      {/* 今日统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">今日面试</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">已完成</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.completed}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">进行中</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.inProgress}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">待开始</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.scheduled}
              </p>
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

      {/* 面试列表 */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {selectedDate === new Date().toISOString().split("T")[0]
              ? "今日面试安排"
              : `${selectedDate} 面试安排`}
          </h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  候选人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  面试类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  面试官
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">操作</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInterviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    该日期暂无面试安排
                  </td>
                </tr>
              ) : (
                filteredInterviews.map((interview) => (
                  <tr key={interview.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(interview.scheduledTime).toLocaleTimeString(
                          "zh-CN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-medium text-xs">
                              {getCandidateName(interview.candidateId).charAt(
                                0
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {getCandidateName(interview.candidateId)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-primary">
                        {getTypeLabel(interview.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {getInterviewerName(interview.interviewerId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(interview.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {interview.status === "scheduled" && (
                          <Link
                            to={`/interview/${interview.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            开始面试
                          </Link>
                        )}
                        {interview.status === "completed" && (
                          <button className="btn btn-secondary btn-sm">
                            <FileText className="h-3 w-3 mr-1" />
                            查看报告
                          </button>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 快速操作面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
          <div className="space-y-3">
            <button className="w-full btn btn-secondary justify-start">
              <Plus className="h-4 w-4 mr-3" />
              批量安排面试
            </button>
            <button className="w-full btn btn-secondary justify-start">
              <Brain className="h-4 w-4 mr-3" />
              AI 智能推荐时间
            </button>
            <button className="w-full btn btn-secondary justify-start">
              <Calendar className="h-4 w-4 mr-3" />
              导出面试日程
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">面试提醒</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">30分钟后有一场技术一面</p>
                <p className="text-xs text-gray-500">
                  候选人: 陈小明 | 面试官: 李四
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">明日有3场面试待安排</p>
                <p className="text-xs text-gray-500">建议提前准备面试材料</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedule;
