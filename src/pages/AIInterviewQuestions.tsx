import {
  Activity,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  GitBranch,
  Lightbulb,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import candidatesData from "../data/candidates.json";
import { Candidate } from "../types";

const AIInterviewQuestions: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [selectedInterviewType, setSelectedInterviewType] =
    useState<string>("hr");
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    resume: true,
    questions: true,
  });

  useEffect(() => {
    // 默认选择golang开发者张伟
    const golangCandidate = candidatesData.find((c) => c.name === "张伟");
    if (golangCandidate) {
      setSelectedCandidate(golangCandidate as Candidate);
    }
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const interviewTypes = [
    {
      id: "hr",
      name: "HR面试",
      icon: Users,
      color: "blue",
      description: "关注软技能和团队协作能力",
    },
    {
      id: "tech_1",
      name: "技术一面",
      icon: Code,
      color: "green",
      description: "关注技术深度和编程能力",
    },
    {
      id: "tech_2",
      name: "技术二面",
      icon: GitBranch,
      color: "purple",
      description: "关注架构设计和技术广度",
    },
    {
      id: "vp",
      name: "VP面试",
      icon: Award,
      color: "orange",
      description: "综合评估技术和管理能力",
    },
  ];

  // 根据面试类型生成AI面试题
  const generateAIQuestions = (type: string, candidate: Candidate) => {
    const baseInfo = candidate.resume;

    const questionSets = {
      hr: {
        title: "HR面试 - 软技能评估",
        questions: [
          {
            category: "团队协作",
            questions: [
              "在字节跳动和美团的工作经历中，请描述一次您与跨部门团队协作的具体案例？",
              "当团队成员对技术方案有分歧时，您是如何处理的？",
              "您在项目中承担过mentor角色吗？如何帮助其他同事成长？",
            ],
          },
          {
            category: "沟通表达",
            questions: [
              "您如何向非技术人员解释复杂的DDD领域驱动设计概念？",
              "在电商订单系统重构项目中，您是如何说服团队采用DDD架构的？",
              "请描述一次您需要争取更多资源或时间来完成项目的经历。",
            ],
          },
          {
            category: "抗压能力",
            questions: [
              "在支持50万+QPS的双十一场景下，您是如何应对突发技术问题的？",
              "当项目进度紧张时，您如何平衡代码质量和交付时间？",
              "描述一次您在高压环境下做出重要技术决策的经历。",
            ],
          },
          {
            category: "职业规划",
            questions: [
              "您为什么从美团跳槽到字节跳动？这个决定给您带来了什么？",
              "您理想中的下一个职业发展阶段是什么？",
              "您如何持续学习和跟上技术发展趋势？",
            ],
          },
        ],
      },
      tech_1: {
        title: "技术一面 - Golang核心技术",
        questions: [
          {
            category: "Golang基础",
            questions: [
              "请详细解释Go语言的goroutine调度模型，GMP模型的工作原理是什么？",
              "Go语言的内存管理机制是怎样的？请解释垃圾回收器的工作原理。",
              "Go语言中channel的底层实现原理是什么？请编写一个使用channel实现worker pool的代码。",
            ],
          },
          {
            category: "并发编程",
            questions: [
              "在配送调度系统中，您是如何处理10万+骑手的并发请求的？",
              "请设计一个高并发的订单处理系统，如何避免超卖问题？",
              "如何在Go中实现一个高性能的连接池？请编写核心代码。",
            ],
          },
          {
            category: "性能优化",
            questions: [
              "您提到订单处理性能优化了3倍，具体采用了哪些优化策略？",
              "如何在Go中进行内存泄漏检测和性能分析？",
              "请分析一段Go代码的性能问题并给出优化方案。",
            ],
          },
          {
            category: "微服务架构",
            questions: [
              "在gRPC通信中，如何处理服务间的超时和熔断？",
              "请设计一个基于Go的分布式锁实现方案。",
              "如何在微服务架构中实现分布式事务？",
            ],
          },
        ],
      },
      tech_2: {
        title: "技术二面 - 架构设计与DDD",
        questions: [
          {
            category: "领域驱动设计",
            questions: [
              "请详细介绍您在电商订单系统中是如何应用DDD的？如何划分领域边界？",
              "在DDD中，聚合根的设计原则是什么？请结合您的项目经验说明。",
              "事件溯源(Event Sourcing)和CQRS在您的项目中是如何实现的？",
            ],
          },
          {
            category: "系统架构",
            questions: [
              "如何设计一个支持50万QPS的电商订单系统？请画出架构图。",
              "在微服务架构中，如何处理数据一致性问题？",
              "请设计一个高可用的配送调度系统，考虑容灾和扩展性。",
            ],
          },
          {
            category: "技术选型",
            questions: [
              "为什么选择Golang而不是Java来开发高并发系统？",
              "在选择消息队列时，RabbitMQ和Kafka各有什么优劣？",
              "Redis Cluster和单机Redis的使用场景有什么区别？",
            ],
          },
          {
            category: "架构演进",
            questions: [
              "从单体架构到微服务的演进过程中，您遇到了哪些挑战？",
              "如何设计API的版本管理策略？",
              "容器化改造中，如何解决服务发现和配置管理问题？",
            ],
          },
        ],
      },
      vp: {
        title: "VP面试 - 综合能力评估",
        questions: [
          {
            category: "技术领导力",
            questions: [
              "作为高级后端工程师，您是如何带领团队进行技术升级的？",
              "在技术选型上，您如何平衡技术先进性和团队学习成本？",
              "如何建立和维护技术团队的代码质量标准？",
            ],
          },
          {
            category: "业务理解",
            questions: [
              "您对电商业务的理解如何？订单系统的核心业务逻辑是什么？",
              "在配送调度系统中，算法优化如何直接影响业务指标？",
              "如何从技术角度支持业务的快速增长？",
            ],
          },
          {
            category: "战略思维",
            questions: [
              "您认为未来3-5年，后端技术架构会有哪些重要发展趋势？",
              "如何评估一个技术方案的ROI（投资回报率）？",
              "在资源有限的情况下，如何制定技术发展优先级？",
            ],
          },
          {
            category: "创新能力",
            questions: [
              "您的配送调度系统获得技术创新奖，创新点体现在哪里？",
              "如何在现有架构基础上进行技术创新？",
              "您认为AI技术在后端开发中有哪些应用前景？",
            ],
          },
        ],
      },
    };

    return questionSets[type as keyof typeof questionSets] || questionSets.hr;
  };

  if (!selectedCandidate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">加载中...</h3>
        </div>
      </div>
    );
  }

  const currentQuestions = generateAIQuestions(
    selectedInterviewType,
    selectedCandidate
  );

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
                  AI 智能面试题
                </h1>
                <p className="mt-2 text-gray-600 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                  针对不同面试类型智能生成个性化面试题目
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn btn-secondary relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all"></div>
                <Lightbulb className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">AI 题目推荐</span>
              </button>
              <button className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0">
                <Zap className="h-4 w-4 mr-2" />
                生成新题目
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：候选人简历 */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <div className="p-6 border-b border-gray-200">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("resume")}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    候选人简历
                  </h3>
                </div>
                {expandedSections.resume ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedSections.resume && (
              <div className="p-6 space-y-6">
                {/* 基本信息 */}
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">
                      {selectedCandidate.name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {selectedCandidate.name}
                  </h4>
                  <p className="text-gray-600">Golang高级后端工程师</p>
                  <div className="flex items-center justify-center space-x-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedCandidate.resume.personalInfo.location}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {selectedCandidate.resume.personalInfo.phone}
                    </div>
                  </div>
                </div>

                {/* 核心技能 */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Code className="h-4 w-4 mr-2 text-green-600" />
                    核心技能
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.resume.skills.technical.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            skill === "Golang" || skill === "DDD"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {skill === "Golang" || skill === "DDD" ? (
                            <Star className="h-3 w-3 mr-1 text-blue-600" />
                          ) : null}
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* 工作经验 */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-purple-600" />
                    工作经验 (5年+)
                  </h5>
                  <div className="space-y-4">
                    {selectedCandidate.resume.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-blue-200 pl-4 pb-4"
                      >
                        <div className="flex items-center justify-between">
                          <h6 className="font-medium text-gray-900">
                            {exp.company}
                          </h6>
                          <span className="text-xs text-gray-500">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {exp.position}
                        </p>
                        <div className="space-y-1">
                          {exp.achievements
                            .slice(0, 2)
                            .map((achievement, idx) => (
                              <div key={idx} className="flex items-start">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-600">
                                  {achievement}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 核心项目 */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-orange-600" />
                    核心项目
                  </h5>
                  <div className="space-y-3">
                    {selectedCandidate.resume.projects
                      .slice(0, 2)
                      .map((project, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <h6 className="font-medium text-gray-900 mb-1">
                            {project.name}
                          </h6>
                          <p className="text-xs text-gray-600 mb-2">
                            {project.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                            {project.achievements[0]}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：面试题目 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 面试类型选择 */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              选择面试类型
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {interviewTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedInterviewType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedInterviewType(type.id)}
                    className={`relative group p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `border-${type.color}-500 bg-${type.color}-50`
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div
                      className={`flex flex-col items-center text-center space-y-2`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          isSelected
                            ? `bg-${type.color}-100`
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            isSelected
                              ? `text-${type.color}-600`
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            isSelected
                              ? `text-${type.color}-900`
                              : "text-gray-900"
                          }`}
                        >
                          {type.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1">
                        <div
                          className={`w-4 h-4 bg-${type.color}-500 rounded-full flex items-center justify-center`}
                        >
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI面试题目 */}
          <div className="card">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("questions")}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Brain className="h-6 w-6 text-blue-600" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentQuestions.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      AI智能生成的个性化面试题目
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                    AI推荐
                  </span>
                  {expandedSections.questions ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedSections.questions && (
              <div className="p-6">
                <div className="space-y-8">
                  {currentQuestions.questions.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {categoryIndex + 1}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {category.category}
                        </h4>
                      </div>

                      <div className="space-y-4 ml-10">
                        {category.questions.map((question, questionIndex) => (
                          <div key={questionIndex} className="group">
                            <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-100">
                                  <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                                    {questionIndex + 1}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-900 leading-relaxed">
                                  {question}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      建议时长: 3-5分钟
                                    </div>
                                    <div className="flex items-center">
                                      <Target className="h-4 w-4 mr-1" />
                                      考察重点: {category.category}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition-colors">
                                      AI分析
                                    </button>
                                    <button className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full transition-colors">
                                      使用此题
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 底部操作按钮 */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                      AI智能匹配度: 96%
                    </div>
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-1 text-green-500" />
                      题目难度: 适中
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                      预计面试时长: 45-60分钟
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="btn btn-secondary">
                      <BookOpen className="h-4 w-4 mr-2" />
                      导出题目
                    </button>
                    <button className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0">
                      <Zap className="h-4 w-4 mr-2" />
                      开始面试
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewQuestions;
