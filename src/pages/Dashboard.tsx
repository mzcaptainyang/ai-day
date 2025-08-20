import {
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import candidatesData from "../data/candidates.json";
import { Candidate } from "../types";

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  changeType: "positive" | "negative" | "neutral";
}

const Dashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    setCandidates(candidatesData as Candidate[]);
  }, []);

  // 统计数据计算
  const totalCandidates = candidates.length;
  const interviewingCandidates = candidates.filter(
    (c) => c.status === "interviewing"
  ).length;
  const completedInterviews = candidates.filter(
    (c) => c.status === "completed"
  ).length;
  const pendingScreening = candidates.filter(
    (c) => c.status === "screening"
  ).length;

  const stats: StatCard[] = [
    {
      title: "总候选人数",
      value: totalCandidates.toString(),
      change: "+12%",
      icon: Users,
      changeType: "positive",
    },
    {
      title: "面试中",
      value: interviewingCandidates.toString(),
      change: "+5%",
      icon: Calendar,
      changeType: "positive",
    },
    {
      title: "已完成面试",
      value: completedInterviews.toString(),
      change: "+8%",
      icon: CheckCircle,
      changeType: "positive",
    },
    {
      title: "待筛选",
      value: pendingScreening.toString(),
      change: "-3%",
      icon: Clock,
      changeType: "negative",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "interview_completed",
      message: "陈小明 完成了技术一面",
      time: "2小时前",
      status: "success",
    },
    {
      id: "2",
      type: "interview_scheduled",
      message: "刘小红 的HR面试已安排",
      time: "4小时前",
      status: "info",
    },
    {
      id: "3",
      type: "report_generated",
      message: "生成了技术面试报告",
      time: "6小时前",
      status: "success",
    },
    {
      id: "4",
      type: "candidate_applied",
      message: "新候选人王小强提交申请",
      time: "1天前",
      status: "info",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <p className="mt-1 text-sm text-gray-500">
            欢迎使用AI面试系统，这里是您的工作概览
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary">
            <FileText className="h-4 w-4 mr-2" />
            导出报告
          </button>
          <button className="btn btn-primary">
            <Brain className="h-4 w-4 mr-2" />
            AI 助手
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
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
                        <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                        <span className="sr-only">
                          {stat.changeType === "positive" ? "增长" : "下降"}
                        </span>
                        {stat.change}
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
        {/* 最近活动 */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                最近活动
              </h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivities.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivities.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                activity.status === "success"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                            >
                              {activity.status === "success" ? (
                                <CheckCircle className="h-5 w-5 text-white" />
                              ) : (
                                <Clock className="h-5 w-5 text-white" />
                              )}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
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
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
            <div className="space-y-3">
              <button className="w-full btn btn-primary justify-start">
                <Users className="h-4 w-4 mr-3" />
                添加新候选人
              </button>
              <button className="w-full btn btn-secondary justify-start">
                <Calendar className="h-4 w-4 mr-3" />
                安排面试
              </button>
              <button className="w-full btn btn-secondary justify-start">
                <Brain className="h-4 w-4 mr-3" />
                生成面试问题
              </button>
              <button className="w-full btn btn-secondary justify-start">
                <FileText className="h-4 w-4 mr-3" />
                查看面试报告
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI 洞察</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      本周技术面试通过率为78%，比上周提升了5%
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-800">
                      候选人整体技术水平呈上升趋势，建议适当提高面试标准
                    </p>
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

export default Dashboard;
