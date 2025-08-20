import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  Brain,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Layers,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// 项目亮点数据接口
interface ProjectHighlight {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  stats: {
    label: string;
    value: string;
    improvement?: string;
  }[];
}

const ProjectHighlights = () => {
  const [activeHighlight, setActiveHighlight] =
    useState<string>("ai-questions");
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 项目核心亮点数据
  const highlights: ProjectHighlight[] = [
    {
      id: "ai-questions",
      title: "AI千人千面面试题生成",
      subtitle: "智能个性化面试体验",
      description:
        "基于深度学习算法，为每位候选人生成个性化面试题目，深度挖掘候选人潜力，提供更加精准的人才评估",
      features: [
        "AI智能分析候选人简历背景",
        "根据岗位要求动态生成面试题",
        "支持多维度能力考察",
        "实时调整面试难度和重点",
        "千人千面的个性化体验",
      ],
      icon: Brain,
      gradient: "from-purple-500 via-pink-500 to-red-500",
      stats: [
        { label: "题目生成准确率", value: "98.5%", improvement: "+15%" },
        { label: "候选人满意度", value: "9.2/10", improvement: "+1.8" },
        { label: "面试效率提升", value: "45%", improvement: "+30%" },
      ],
    },
    {
      id: "auto-recording",
      title: "全流程智能记录系统",
      subtitle: "零遗漏的面试数字化管理",
      description:
        "自动记录面试全过程，智能生成面试摘要和关键信息提取，帮助面试官避免记录混乱，提升面试质量",
      features: [
        "实时语音转文字记录",
        "智能关键信息提取",
        "自动生成面试摘要",
        "多轮面试记录关联",
        "云端安全存储备份",
      ],
      icon: Shield,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      stats: [
        { label: "记录完整性", value: "99.8%", improvement: "+25%" },
        { label: "信息提取准确率", value: "94.2%", improvement: "+20%" },
        { label: "面试官工作效率", value: "60%", improvement: "+40%" },
      ],
    },
    {
      id: "ai-reports",
      title: "AI智能分析报告",
      subtitle: "数据驱动的深度人才洞察",
      description:
        "为每位候选人生成专属的AI分析报告，包含能力评估、发展建议和匹配度分析，助力精准人才决策",
      features: [
        "多维度能力雷达图分析",
        "个性特征深度画像",
        "岗位匹配度智能评分",
        "发展潜力预测分析",
        "个性化改进建议",
      ],
      icon: FileText,
      gradient: "from-green-500 via-emerald-500 to-lime-500",
      stats: [
        { label: "预测准确率", value: "91.7%", improvement: "+18%" },
        { label: "匹配成功率", value: "87.3%", improvement: "+22%" },
        { label: "决策效率提升", value: "55%", improvement: "+35%" },
      ],
    },
    {
      id: "interviewer-analysis",
      title: "面试官能力提升系统",
      subtitle: "持续优化的面试技能训练",
      description:
        "通过AI分析面试官表现，提供个性化的面试技巧建议和培训方案，持续提升面试质量和专业水平",
      features: [
        "面试技巧智能评估",
        "个性化改进建议",
        "面试质量趋势分析",
        "最佳实践案例推荐",
        "持续技能提升跟踪",
      ],
      icon: Award,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      stats: [
        { label: "面试技能提升", value: "42%", improvement: "+28%" },
        { label: "面试一致性", value: "89.5%", improvement: "+15%" },
        { label: "候选人体验评分", value: "9.4/10", improvement: "+1.2" },
      ],
    },
  ];

  const currentHighlight =
    highlights.find((h) => h.id === activeHighlight) || highlights[0];

  // 动画数字显示
  const AnimatedNumber = ({
    value,
    suffix = "",
  }: {
    value: string;
    suffix?: string;
  }) => {
    const [displayValue, setDisplayValue] = useState("0");

    useEffect(() => {
      const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
      let current = 0;
      const increment = numericValue / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current).toString() + suffix);
        }
      }, 20);

      return () => clearInterval(timer);
    }, [value, suffix]);

    return <span>{displayValue}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* 头部区域 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform skew-y-1"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-yellow-300 animate-pulse" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              项目核心亮点分析
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              基于人工智能技术的智能化面试系统，革命性地改变传统招聘模式，提供全方位的智能化解决方案
            </p>

            {/* 核心数据展示 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              {[
                { label: "AI智能化程度", value: "95%", icon: Bot },
                { label: "面试效率提升", value: "60%", icon: TrendingUp },
                { label: "用户满意度", value: "9.6/10", icon: Star },
                { label: "预测准确率", value: "93%", icon: Target },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="backdrop-blur-sm bg-white bg-opacity-20 rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
                  >
                    <Icon className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                    <div className="text-3xl font-bold mb-2">
                      <AnimatedNumber value={stat.value} />
                    </div>
                    <div className="text-sm text-indigo-100">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 装饰性元素 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 亮点选择器 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            const isActive = activeHighlight === highlight.id;

            return (
              <div
                key={highlight.id}
                onClick={() => setActiveHighlight(highlight.id)}
                className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transform transition-all duration-300 ${
                  isActive
                    ? "scale-105 shadow-2xl"
                    : "hover:scale-102 shadow-lg hover:shadow-xl"
                }`}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${
                        highlight.gradient.split(" ")[1]
                      }, ${highlight.gradient.split(" ")[3]})`
                    : "white",
                }}
              >
                {/* 背景装饰 */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    highlight.gradient
                  } opacity-${
                    isActive ? "100" : "10"
                  } transition-opacity duration-300`}
                ></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-white bg-opacity-20 rounded-full"></div>
                <div className="absolute -bottom-5 -left-5 w-15 h-15 bg-white bg-opacity-10 rounded-full"></div>

                <div className="relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                      isActive
                        ? "bg-white bg-opacity-20"
                        : "bg-gradient-to-br " + highlight.gradient
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        isActive ? "text-white" : "text-white"
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-bold text-lg mb-2 ${
                      isActive ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {highlight.title.split("AI")[0]}
                    {highlight.title.includes("AI") && (
                      <span className="text-yellow-300">AI</span>
                    )}
                    {highlight.title.split("AI")[1]}
                  </h3>
                  <p
                    className={`text-sm ${
                      isActive ? "text-white text-opacity-90" : "text-gray-600"
                    }`}
                  >
                    {highlight.subtitle}
                  </p>

                  {/* 进度指示器 */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-30 rounded-b-2xl">
                      <div
                        className="h-full bg-white rounded-b-2xl transition-all duration-300"
                        style={{ width: `${(animationStep + 1) * 25}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 详细展示区域 */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* 左侧：详细信息 */}
            <div className="p-12">
              <div className="flex items-center mb-6">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${currentHighlight.gradient} mr-6`}
                >
                  <currentHighlight.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentHighlight.title}
                  </h2>
                  <p
                    className={`text-lg bg-gradient-to-r ${currentHighlight.gradient} bg-clip-text text-transparent font-semibold`}
                  >
                    {currentHighlight.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {currentHighlight.description}
              </p>

              {/* 功能特性列表 */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  核心功能特性
                </h3>
                {currentHighlight.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${currentHighlight.gradient} flex items-center justify-center mt-0.5`}
                    >
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-4">
                <button
                  className={`px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${currentHighlight.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center`}
                >
                  <Eye className="h-5 w-5 mr-2" />
                  查看详情
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
                <button className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  查看演示
                </button>
              </div>
            </div>

            {/* 右侧：数据统计与可视化 */}
            <div
              className={`bg-gradient-to-br ${currentHighlight.gradient} p-12 text-white relative overflow-hidden`}
            >
              {/* 背景装饰 */}
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-5 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-3" />
                  性能数据统计
                </h3>

                {/* 数据卡片 */}
                <div className="space-y-6 mb-8">
                  {currentHighlight.stats.map((stat, index) => (
                    <div
                      key={index}
                      className="backdrop-blur-sm bg-white bg-opacity-20 rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white text-opacity-90 font-medium">
                          {stat.label}
                        </span>
                        {stat.improvement && (
                          <span className="text-xs bg-green-400 bg-opacity-20 text-green-100 px-2 py-1 rounded-full flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {stat.improvement}
                          </span>
                        )}
                      </div>
                      <div className="text-3xl font-bold mb-2">
                        <AnimatedNumber value={stat.value} />
                      </div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${Math.min(
                              parseFloat(stat.value.replace(/[^\d.]/g, "")),
                              100
                            )}%`,
                            animationDelay: `${index * 300 + 500}ms`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 实时状态指示器 */}
                <div className="backdrop-blur-sm bg-white bg-opacity-10 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
                      <span className="font-medium">实时AI分析状态</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>24/7运行中</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部技术优势展示 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "深度学习算法",
              description:
                "基于最新的Transformer架构，提供精准的语义理解和智能分析",
              icon: Brain,
              color: "from-purple-500 to-pink-500",
            },
            {
              title: "实时数据处理",
              description: "毫秒级响应，支持大规模并发处理，保证系统稳定性",
              icon: Zap,
              color: "from-yellow-500 to-orange-500",
            },
            {
              title: "智能预测引擎",
              description: "结合历史数据和机器学习，提供高准确率的预测分析",
              icon: Target,
              color: "from-blue-500 to-cyan-500",
            },
          ].map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${tech.color} mb-6`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {tech.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 添加自定义CSS动画 */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProjectHighlights;
