import {
  BarChart3,
  Bot,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Filter,
  Lightbulb,
  MessageSquare,
  Mic,
  Play,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import candidatesData from "../data/candidates.json";
import interviewRoundsData from "../data/interviewRounds.json";
import { Candidate } from "../types";

// AI分析数据接口
interface AIInsight {
  candidateId: string;
  aiScore: number;
  confidence: number;
  recommendation: string;
  reasoning: string;
  skills: { name: string; score: number }[];
  personalityTraits: { trait: string; score: number }[];
  culturalFit: number;
  riskLevel: "low" | "medium" | "high";
}

// 面试对话记录接口
interface InterviewDialogue {
  id: string;
  timestamp: string;
  speaker: "interviewer" | "candidate";
  content: string;
  duration?: number;
  sentiment?: "positive" | "neutral" | "negative";
  keywords?: string[];
}

// AI对话分析接口
interface AIDialogueAnalysis {
  id: string;
  timestamp: string;
  analysisType: "sentiment" | "keyword" | "competency" | "concern";
  content: string;
  confidence: number;
  relatedDialogue: string;
}

// 会议记录接口
interface InterviewMeetingRecord {
  id: string;
  interviewRoundId: string;
  candidateId: string;
  interviewType: "hr" | "tech_1" | "tech_2" | "vp";
  interviewerName: string;
  startTime: string;
  endTime: string;
  duration: number;
  dialogues: InterviewDialogue[];
  aiAnalysis: AIDialogueAnalysis[];
  summary: {
    keyTopics: string[];
    candidateStrengths: string[];
    concerns: string[];
    aiInsights: string[];
    nextSteps: string[];
  };
  transcription: {
    quality: "excellent" | "good" | "fair" | "poor";
    confidence: number;
    language: string;
  };
}

const InterviewReports = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMeetingRecord, setShowMeetingRecord] = useState(false);
  const [selectedMeetingRecord, setSelectedMeetingRecord] =
    useState<InterviewMeetingRecord | null>(null);
  const [aiInsights, setAiInsights] = useState<Map<string, AIInsight>>(
    new Map()
  );
  const [meetingRecords, setMeetingRecords] = useState<
    Map<string, InterviewMeetingRecord>
  >(new Map());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setCandidates(candidatesData as any[]);
    // 生成AI分析数据和会议记录
    generateAIInsights();
    generateMeetingRecords();
  }, []);

  // 生成模拟面试会议记录
  const generateMeetingRecords = () => {
    const records = new Map<string, InterviewMeetingRecord>();

    interviewRoundsData.forEach((round: any) => {
      const candidate = candidatesData.find((c) => c.id === round.candidateId);
      if (!candidate) return;

      // 生成模拟对话记录
      const dialogues: InterviewDialogue[] = generateDialogueForRound(
        round,
        candidate
      );

      // 生成AI分析
      const aiAnalysis: AIDialogueAnalysis[] =
        generateAIAnalysisForDialogue(dialogues);

      const record: InterviewMeetingRecord = {
        id: `meeting_${round.id}`,
        interviewRoundId: round.id,
        candidateId: round.candidateId,
        interviewType: round.type as "hr" | "tech_1" | "tech_2" | "vp",
        interviewerName: getInterviewerName(round.interviewerId),
        startTime: round.actualStartTime || round.scheduledTime,
        endTime: round.actualEndTime || round.scheduledTime,
        duration: calculateDuration(
          round.actualStartTime || round.scheduledTime,
          round.actualEndTime || round.scheduledTime
        ),
        dialogues,
        aiAnalysis,
        summary: {
          keyTopics: generateKeyTopics(round.type),
          candidateStrengths: generateStrengthsFromDialogue(),
          concerns: generateConcernsFromDialogue(),
          aiInsights: generateAIInsightsFromDialogue(),
          nextSteps: generateNextSteps(round.type, round.recommendation),
        },
        transcription: {
          quality: "excellent",
          confidence: 95 + Math.random() * 5,
          language: "zh-CN",
        },
      };

      records.set(record.id, record);
    });

    setMeetingRecords(records);
  };

  // 辅助函数：生成对话内容
  const generateDialogueForRound = (
    round: any,
    candidate: any
  ): InterviewDialogue[] => {
    const dialogues: InterviewDialogue[] = [];
    let timestamp = new Date(round.actualStartTime || round.scheduledTime);

    if (round.type === "hr") {
      // HR面试对话 - 大幅增加内容
      dialogues.push(
        {
          id: "d1",
          timestamp: timestamp.toISOString(),
          speaker: "interviewer",
          content: "您好，欢迎来到我们公司面试。请先简单介绍一下自己吧。",
          sentiment: "positive",
          keywords: ["介绍", "面试开场"],
        },
        {
          id: "d2",
          timestamp: addMinutes(timestamp, 1).toISOString(),
          speaker: "candidate",
          content: `我叫${candidate.name}，有${
            candidate.resume.experience.length
          }年的工作经验，主要专注于${candidate.resume.skills.technical
            .slice(0, 3)
            .join("、")}等技术领域。我在${
            candidate.resume.experience[0]?.company
          }工作期间，负责了多个重要项目的开发，包括用户中心系统、支付系统等核心模块。我具有良好的团队协作能力，曾带领5人团队完成了一个大型电商项目，项目上线后用户活跃度提升了30%。`,
          sentiment: "positive",
          keywords: [
            "自我介绍",
            "工作经验",
            "技术技能",
            "项目经验",
            "团队领导",
          ],
        },
        {
          id: "d3",
          timestamp: addMinutes(timestamp, 3).toISOString(),
          speaker: "interviewer",
          content:
            "很好，您的经验很丰富。为什么想要离开目前的公司，选择加入我们呢？",
          sentiment: "neutral",
          keywords: ["离职原因", "选择公司"],
        },
        {
          id: "d4",
          timestamp: addMinutes(timestamp, 4).toISOString(),
          speaker: "candidate",
          content:
            "主要是希望能在一个更大的平台上发挥自己的能力，贵公司的技术实力和企业文化都很吸引我，我相信能在这里获得更好的职业发展。现在的公司规模相对较小，技术栈比较单一，我希望能接触更多前沿技术，也希望能在更大的业务体量下锻炼自己的架构设计能力。",
          sentiment: "positive",
          keywords: ["职业发展", "企业文化", "技术实力", "业务挑战"],
        },
        {
          id: "d5",
          timestamp: addMinutes(timestamp, 6).toISOString(),
          speaker: "interviewer",
          content: "您对我们公司有什么了解吗？对这个职位有什么期望？",
          sentiment: "neutral",
          keywords: ["公司了解", "职位期望"],
        },
        {
          id: "d6",
          timestamp: addMinutes(timestamp, 7).toISOString(),
          speaker: "candidate",
          content:
            "我了解贵公司是行业内的技术领先企业，在AI、大数据等方面有很强的技术积累。这个职位主要负责前端架构设计和团队管理，我希望能够运用我的技术经验，带领团队构建高质量的用户界面，同时也希望能在技术决策和团队建设方面发挥作用。我特别关注用户体验和性能优化，希望能在这方面有所贡献。",
          sentiment: "positive",
          keywords: ["公司认知", "技术架构", "团队管理", "用户体验"],
        },
        {
          id: "d7",
          timestamp: addMinutes(timestamp, 9).toISOString(),
          speaker: "interviewer",
          content: "您的薪资期望是多少？对于工作时间和加班有什么看法？",
          sentiment: "neutral",
          keywords: ["薪资期望", "工作时间", "加班"],
        },
        {
          id: "d8",
          timestamp: addMinutes(timestamp, 10).toISOString(),
          speaker: "candidate",
          content:
            "薪资方面我希望能在25-30K之间，具体可以根据面试结果和公司标准来协商。关于工作时间，我理解互联网行业的特点，适度的加班是可以接受的，但我更倾向于通过提高工作效率和合理规划来平衡工作与生活。我相信高效的工作方式比简单的时间投入更重要。",
          sentiment: "positive",
          keywords: ["薪资协商", "工作平衡", "效率优先"],
        }
      );
    } else if (round.type === "tech_1") {
      // 技术一面对话 - 大幅增加内容
      dialogues.push(
        {
          id: "d1",
          timestamp: timestamp.toISOString(),
          speaker: "interviewer",
          content:
            "我们开始技术面试，首先请您介绍一下React的生命周期，以及Hooks的工作原理。",
          sentiment: "neutral",
          keywords: ["React", "生命周期", "Hooks", "技术基础"],
        },
        {
          id: "d2",
          timestamp: addMinutes(timestamp, 1).toISOString(),
          speaker: "candidate",
          content:
            "React的生命周期分为三个阶段：挂载、更新和卸载。挂载阶段包括constructor、componentDidMount等，更新阶段有componentDidUpdate、getSnapshotBeforeUpdate等，卸载阶段是componentWillUnmount。Hooks是React 16.8引入的新特性，它让我们可以在函数组件中使用状态和其他React特性。useState用于状态管理，useEffect用于副作用处理，相当于componentDidMount、componentDidUpdate和componentWillUnmount的组合。useEffect的依赖数组可以控制何时执行副作用。",
          sentiment: "positive",
          keywords: [
            "React生命周期",
            "useState",
            "useEffect",
            "函数组件",
            "副作用",
          ],
        },
        {
          id: "d3",
          timestamp: addMinutes(timestamp, 3).toISOString(),
          speaker: "interviewer",
          content: "很好，那您能说说如何优化React应用的性能吗？",
          sentiment: "positive",
          keywords: ["性能优化", "React优化"],
        },
        {
          id: "d4",
          timestamp: addMinutes(timestamp, 4).toISOString(),
          speaker: "candidate",
          content:
            "React性能优化有很多方法：1. 使用React.memo避免不必要的重渲染；2. 使用useMemo和useCallback缓存计算结果和函数；3. 代码分割和懒加载，使用React.lazy和Suspense；4. 虚拟列表处理大数据，如react-window；5. 使用生产环境构建；6. 避免在render中创建新对象和函数；7. 使用shouldComponentUpdate或PureComponent；8. 合理使用key prop；9. 图片懒加载和预加载。",
          sentiment: "positive",
          keywords: [
            "React.memo",
            "useMemo",
            "useCallback",
            "代码分割",
            "虚拟列表",
            "懒加载",
          ],
        },
        {
          id: "d5",
          timestamp: addMinutes(timestamp, 6).toISOString(),
          speaker: "interviewer",
          content: "请解释一下JavaScript的闭包和原型链，以及ES6的新特性。",
          sentiment: "neutral",
          keywords: ["JavaScript", "闭包", "原型链", "ES6"],
        },
        {
          id: "d6",
          timestamp: addMinutes(timestamp, 7).toISOString(),
          speaker: "candidate",
          content:
            "闭包是指函数能够访问其外部作用域的变量，即使外部函数已经返回。这创造了数据私有化的可能。原型链是JavaScript实现继承的机制，每个对象都有一个__proto__属性指向其原型。ES6引入了很多新特性：let/const块级作用域、箭头函数、模板字符串、解构赋值、Promise、async/await、class语法糖、模块化import/export、Set/Map数据结构等。这些特性大大提高了代码的可读性和开发效率。",
          sentiment: "positive",
          keywords: [
            "闭包",
            "原型链",
            "作用域",
            "箭头函数",
            "Promise",
            "async/await",
          ],
        },
        {
          id: "d7",
          timestamp: addMinutes(timestamp, 9).toISOString(),
          speaker: "interviewer",
          content:
            "您在项目中使用过哪些状态管理方案？Redux和Context API有什么区别？",
          sentiment: "neutral",
          keywords: ["状态管理", "Redux", "Context API"],
        },
        {
          id: "d8",
          timestamp: addMinutes(timestamp, 10).toISOString(),
          speaker: "candidate",
          content:
            "我使用过Redux、Context API、Zustand和Valtio等状态管理方案。Redux适合大型应用，提供了可预测的状态管理，但模板代码较多。Context API是React内置的，适合中小型应用或者跨组件传递数据，但性能上可能不如Redux。Redux有中间件机制，支持异步处理，而Context在频繁更新时可能导致不必要的重渲染。在最近的项目中，我倾向于使用Zustand，它更轻量且API更简洁。",
          sentiment: "positive",
          keywords: ["Redux", "Context API", "Zustand", "状态管理", "中间件"],
        },
        {
          id: "d9",
          timestamp: addMinutes(timestamp, 12).toISOString(),
          speaker: "interviewer",
          content: "请手写一个防抖函数，并解释一下防抖和节流的区别。",
          sentiment: "neutral",
          keywords: ["防抖", "节流", "手写代码"],
        },
        {
          id: "d10",
          timestamp: addMinutes(timestamp, 13).toISOString(),
          speaker: "candidate",
          content:
            "防抖是延迟执行，在事件停止触发一段时间后才执行；节流是限制执行频率，在一定时间内最多执行一次。防抖适用于搜索框输入、按钮点击；节流适用于滚动事件、鼠标移动。防抖函数实现：function debounce(func, delay) { let timer; return function() { clearTimeout(timer); timer = setTimeout(() => func.apply(this, arguments), delay); }; }",
          sentiment: "positive",
          keywords: ["防抖实现", "节流区别", "setTimeout", "apply"],
        }
      );
    } else if (round.type === "tech_2") {
      // 技术二面对话 - 新增
      dialogues.push(
        {
          id: "d1",
          timestamp: timestamp.toISOString(),
          speaker: "interviewer",
          content:
            "欢迎来到技术二面，今天我们主要讨论系统设计和架构相关的问题。请设计一个高并发的电商系统架构。",
          sentiment: "neutral",
          keywords: ["系统设计", "高并发", "电商系统", "架构"],
        },
        {
          id: "d2",
          timestamp: addMinutes(timestamp, 1).toISOString(),
          speaker: "candidate",
          content:
            "电商系统需要考虑高并发、高可用和数据一致性。我会采用微服务架构，将系统拆分为用户服务、商品服务、订单服务、支付服务等。前端使用CDN加速，后端使用负载均衡器分发请求。数据库采用读写分离，热点数据使用Redis缓存。对于秒杀等高并发场景，可以使用消息队列异步处理，限流熔断保护系统稳定性。",
          sentiment: "positive",
          keywords: ["微服务", "负载均衡", "读写分离", "Redis缓存", "消息队列"],
        },
        {
          id: "d3",
          timestamp: addMinutes(timestamp, 3).toISOString(),
          speaker: "interviewer",
          content: "如何保证分布式系统的数据一致性？CAP理论是什么？",
          sentiment: "neutral",
          keywords: ["数据一致性", "分布式", "CAP理论"],
        },
        {
          id: "d4",
          timestamp: addMinutes(timestamp, 4).toISOString(),
          speaker: "candidate",
          content:
            "CAP理论指出分布式系统无法同时保证一致性(Consistency)、可用性(Availability)和分区容错性(Partition tolerance)。实际应用中通常选择CP或AP。数据一致性可以通过分布式事务、消息队列、事件溯源等方式保证。我倾向于使用最终一致性，通过补偿机制确保数据最终达到一致状态，这样既保证了性能又保证了数据正确性。",
          sentiment: "positive",
          keywords: ["CAP理论", "最终一致性", "分布式事务", "补偿机制"],
        },
        {
          id: "d5",
          timestamp: addMinutes(timestamp, 6).toISOString(),
          speaker: "interviewer",
          content: "前端性能优化有哪些策略？如何监控和排查性能问题？",
          sentiment: "neutral",
          keywords: ["前端优化", "性能监控", "问题排查"],
        },
        {
          id: "d6",
          timestamp: addMinutes(timestamp, 7).toISOString(),
          speaker: "candidate",
          content:
            "前端性能优化包括：1.资源优化：压缩、合并、CDN；2.渲染优化：减少DOM操作、虚拟滚动；3.网络优化：HTTP/2、预加载、缓存；4.代码优化：Tree shaking、懒加载。监控方面使用Performance API、LightHouse、Web Vitals等工具。排查时关注首屏时间、加载时间、运行时性能，通过Chrome DevTools分析瓶颈。",
          sentiment: "positive",
          keywords: ["资源优化", "渲染优化", "Performance API", "Web Vitals"],
        }
      );
    } else if (round.type === "vp") {
      // VP面试对话 - 新增
      dialogues.push(
        {
          id: "d1",
          timestamp: timestamp.toISOString(),
          speaker: "interviewer",
          content:
            "欢迎参加最终面试，我主要想了解您的技术规划和团队管理理念。您如何看待技术团队的发展方向？",
          sentiment: "neutral",
          keywords: ["技术规划", "团队管理", "发展方向"],
        },
        {
          id: "d2",
          timestamp: addMinutes(timestamp, 1).toISOString(),
          speaker: "candidate",
          content:
            "我认为技术团队的发展应该紧密结合业务目标。首先要建立技术标准和最佳实践，确保代码质量；其次要关注团队成员的技术成长，通过技术分享、code review等方式提升整体水平；最后要保持对新技术的敏感度，但不盲目追求新技术，要结合业务场景选择合适的技术栈。我倾向于建设学习型团队，鼓励创新和试错。",
          sentiment: "positive",
          keywords: ["业务结合", "技术标准", "团队成长", "学习型团队"],
        },
        {
          id: "d3",
          timestamp: addMinutes(timestamp, 3).toISOString(),
          speaker: "interviewer",
          content: "如果要招聘新的团队成员，您会看重哪些素质？如何评估候选人？",
          sentiment: "neutral",
          keywords: ["招聘", "素质要求", "候选人评估"],
        },
        {
          id: "d4",
          timestamp: addMinutes(timestamp, 4).toISOString(),
          speaker: "candidate",
          content:
            "我会从技术能力、学习能力、沟通协作和价值观四个维度评估。技术能力看基础知识和实践经验；学习能力看对新技术的接受度和自驱力；沟通协作看表达能力和团队融入度；价值观看是否认同公司文化。我倾向于招聘有潜力的人才，通过mentorship帮助他们快速成长，而不是只看当前的技术水平。",
          sentiment: "positive",
          keywords: [
            "技术能力",
            "学习能力",
            "沟通协作",
            "价值观",
            "mentorship",
          ],
        },
        {
          id: "d5",
          timestamp: addMinutes(timestamp, 6).toISOString(),
          speaker: "interviewer",
          content: "您对我们公司的技术栈和业务有什么建议？看到哪些优化空间？",
          sentiment: "neutral",
          keywords: ["技术建议", "业务优化", "改进空间"],
        },
        {
          id: "d6",
          timestamp: addMinutes(timestamp, 7).toISOString(),
          speaker: "candidate",
          content:
            "从了解到的情况来看，贵公司技术栈比较现代化，但我觉得可以在以下方面优化：1.建设更完善的监控体系，及时发现和解决问题；2.加强自动化测试，提高发布质量；3.推进DevOps实践，提升交付效率；4.建设技术中台，避免重复开发。这些都需要逐步推进，我愿意在这方面贡献力量。",
          sentiment: "positive",
          keywords: ["监控体系", "自动化测试", "DevOps", "技术中台"],
        }
      );
    }

    return dialogues;
  };

  // 生成AI对话分析 - 大幅增强
  const generateAIAnalysisForDialogue = (
    dialogues: InterviewDialogue[]
  ): AIDialogueAnalysis[] => {
    const candidateAnalysisTemplates = [
      "候选人回答逻辑清晰，专业知识扎实，表达能力强，展现出良好的技术基础",
      "候选人对问题的理解准确，能够结合实际项目经验进行回答，体现了丰富的实践能力",
      "候选人的回答显示出对技术细节的深入理解，具备解决复杂问题的能力",
      "候选人表现出积极的学习态度和对新技术的敏感度，具备良好的成长潜力",
      "候选人在回答中展现了团队协作意识和沟通能力，适合团队环境",
      "候选人对行业趋势有清晰认知，具备前瞻性思维和规划能力",
      "候选人的技术视野开阔，能够从多个角度分析问题，体现了架构思维",
      "候选人在表述中展现了责任心和主动性，是值得培养的优秀人才",
      "候选人对技术方案有自己的思考和见解，具备独立解决问题的能力",
      "候选人展现出良好的代码规范意识和工程化思维，符合团队标准",
    ];

    const interviewerAnalysisTemplates = [
      "面试官提问专业且有针对性，能够有效评估候选人的技术能力",
      "面试官的问题设计合理，循序渐进地深入了解候选人的技术水平",
      "面试官善于引导候选人展现真实的技术能力和项目经验",
      "面试官的提问涵盖了理论和实践，能够全面评估候选人",
      "面试官营造了良好的面试氛围，有助于候选人发挥真实水平",
      "面试官的问题具有很好的区分度，能够识别出优秀候选人",
      "面试官注重考察候选人的思维过程，而不仅仅是标准答案",
      "面试官能够根据候选人的回答进行深入追问，挖掘更多信息",
    ];

    const sentimentAnalysisTemplates = {
      positive: [
        "语调积极向上，表达出对技术和工作的热情",
        "回答中透露出自信和对未来的期待",
        "表现出对挑战的积极态度和解决问题的决心",
        "展现出对学习新技术的兴趣和动力",
      ],
      neutral: [
        "语调平稳，表达客观理性",
        "回答简洁明了，重点突出",
        "保持专业的沟通风格",
        "表达清晰，逻辑性强",
      ],
      negative: [
        "在某些问题上表现出不确定性",
        "对部分技术点的了解可能需要加强",
        "在压力下的表现有待观察",
        "需要更多的自信来展现真实能力",
      ],
    };

    const keywordAnalysisTemplates = [
      "识别出多个技术关键词，显示候选人的知识广度",
      "关键词使用准确，体现出对技术概念的深入理解",
      "技术术语运用恰当，展现了专业的技术背景",
      "关键词覆盖了前端、后端、架构等多个领域",
      "通过关键词分析可以看出候选人的技术偏好和专长",
    ];

    const competencyAnalysisTemplates = [
      "技术基础扎实，能够胜任高级开发工程师岗位",
      "项目经验丰富，具备解决复杂业务问题的能力",
      "学习能力突出，能够快速适应新的技术环境",
      "团队协作能力良好，适合在敏捷开发环境中工作",
      "沟通表达能力强，能够清晰地传达技术方案",
      "问题分析能力出色，能够从根本上解决技术难题",
      "代码质量意识强，注重工程化和最佳实践",
      "具备一定的架构设计能力，能够参与系统设计",
    ];

    const concernAnalysisTemplates = [
      "建议在某些新兴技术方面加强学习和实践",
      "可以通过更多的大型项目经验来提升综合能力",
      "在团队管理方面可以积累更多经验",
      "建议加强对业务理解，提升产品思维",
      "可以在系统设计和架构方面继续深入学习",
      "建议关注性能优化和用户体验方面的实践",
      "可以加强对前沿技术趋势的关注和学习",
    ];

    return dialogues.map((dialogue, index) => {
      const analysisType =
        index % 4 === 0
          ? "sentiment"
          : index % 4 === 1
          ? "keyword"
          : index % 4 === 2
          ? "competency"
          : "concern";
      let content = "";

      if (dialogue.speaker === "candidate") {
        switch (analysisType) {
          case "sentiment":
            const sentimentTemplates =
              sentimentAnalysisTemplates[dialogue.sentiment || "neutral"];
            content =
              sentimentTemplates[
                Math.floor(Math.random() * sentimentTemplates.length)
              ];
            break;
          case "keyword":
            content =
              keywordAnalysisTemplates[
                Math.floor(Math.random() * keywordAnalysisTemplates.length)
              ];
            break;
          case "competency":
            content =
              competencyAnalysisTemplates[
                Math.floor(Math.random() * competencyAnalysisTemplates.length)
              ];
            break;
          case "concern":
            content =
              concernAnalysisTemplates[
                Math.floor(Math.random() * concernAnalysisTemplates.length)
              ];
            break;
          default:
            content =
              candidateAnalysisTemplates[
                Math.floor(Math.random() * candidateAnalysisTemplates.length)
              ];
        }
      } else {
        content =
          interviewerAnalysisTemplates[
            Math.floor(Math.random() * interviewerAnalysisTemplates.length)
          ];
      }

      return {
        id: `analysis_${dialogue.id}`,
        timestamp: dialogue.timestamp,
        analysisType,
        content,
        confidence: 80 + Math.random() * 15, // 80-95%的置信度
        relatedDialogue: dialogue.id,
      };
    });
  };

  // 辅助函数
  const addMinutes = (date: Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000);
  };

  const calculateDuration = (start: string, end: string) => {
    return Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / 60000
    );
  };

  const getInterviewerName = (interviewerId: string) => {
    const names = {
      u001: "王HR",
      u002: "李技术",
      u003: "张架构师",
      u004: "陈VP",
    };
    return names[interviewerId as keyof typeof names] || "面试官";
  };

  const generateKeyTopics = (type: string) => {
    const topics = {
      hr: ["自我介绍", "工作经验", "离职原因", "职业规划", "薪资期望"],
      tech_1: ["技术基础", "项目经验", "问题解决", "代码能力", "学习能力"],
      tech_2: ["系统设计", "架构思维", "性能优化", "团队协作", "技术深度"],
      vp: ["战略思维", "领导能力", "业务理解", "团队管理", "文化匹配"],
    };
    return topics[type as keyof typeof topics] || [];
  };

  const generateStrengthsFromDialogue = () => {
    const strengthsPool = [
      "表达逻辑清晰，思维敏捷",
      "专业知识扎实，技术基础深厚",
      "学习能力强，对新技术敏感",
      "团队协作意识好，沟通能力出色",
      "项目经验丰富，实践能力强",
      "问题分析能力出色，能快速定位关键问题",
      "代码质量意识强，注重工程化规范",
      "具备一定的架构思维和系统设计能力",
      "对业务理解深入，具备产品思维",
      "主动性强，具备自驱力和责任心",
      "抗压能力好，能在挑战中保持冷静",
      "技术视野开阔，关注行业发展趋势",
    ];

    // 随机选择4-6个优势
    const selectedCount = 4 + Math.floor(Math.random() * 3);
    const shuffled = strengthsPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, selectedCount);
  };

  const generateConcernsFromDialogue = () => {
    const concernsPool = [
      "某些新兴技术栈了解有限，建议持续学习",
      "大型项目架构设计经验相对不足",
      "团队管理和领导力方面可以进一步提升",
      "对业务领域的深度理解还有提升空间",
      "在高并发系统设计方面需要更多实践",
      "跨部门沟通协调经验相对较少",
      "产品思维和用户体验意识可以加强",
      "对云原生技术的实践经验有待积累",
      "数据分析和性能优化技能需要深化",
      "开源社区参与度相对较低",
    ];

    // 随机选择2-3个关注点
    const selectedCount = 2 + Math.floor(Math.random() * 2);
    const shuffled = concernsPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, selectedCount);
  };

  const generateAIInsightsFromDialogue = () => {
    const insightsPool = [
      "候选人技术基础扎实，在React生态系统方面有深入理解，能够胜任高级开发岗位",
      "沟通表达能力强，逻辑思维清晰，适合在团队中承担技术方案设计和评审工作",
      "学习意愿强烈，对新技术保持敏感度，具备快速适应技术变化的能力",
      "项目经验丰富，能够结合实际业务场景分析技术问题，展现出良好的工程化思维",
      "在系统设计和架构方面有一定见解，具备向架构师方向发展的潜力",
      "表现出良好的代码质量意识和工程规范理解，能够为团队技术标准建设贡献力量",
      "对性能优化和用户体验有较好的理解，能够在前端性能提升方面发挥作用",
      "展现出积极的工作态度和责任心，是值得长期培养的技术人才",
      "具备良好的问题分析和解决能力，能够在复杂技术难题面前保持冷静",
      "对行业发展趋势有一定认知，能够为技术团队的技术选型提供参考意见",
    ];

    // 随机选择3-4个洞察
    const selectedCount = 3 + Math.floor(Math.random() * 2);
    const shuffled = insightsPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, selectedCount);
  };

  const generateNextSteps = (_type: string, recommendation: string) => {
    if (recommendation === "pass") {
      return ["安排下一轮面试", "准备相关技术题目", "通知候选人面试结果"];
    }
    return ["提供面试反馈", "建议候选人提升相关技能", "后续保持联系"];
  };

  // 生成AI分析数据
  const generateAIInsights = () => {
    const insights = new Map<string, AIInsight>();

    candidatesData.forEach((candidate) => {
      insights.set(candidate.id, {
        candidateId: candidate.id,
        aiScore: Math.round((Math.random() * 2.5 + 7.5) * 10) / 10, // 7.5-10分
        confidence: Math.round(Math.random() * 15 + 85), // 85-100%
        recommendation: Math.random() > 0.3 ? "strong_hire" : "hire",
        reasoning:
          "AI综合分析显示该候选人技术能力强，学习能力突出，与团队文化高度匹配",
        skills: [
          {
            name: "React",
            score: Math.round((Math.random() * 2 + 8) * 10) / 10,
          },
          {
            name: "TypeScript",
            score: Math.round((Math.random() * 2 + 7) * 10) / 10,
          },
          {
            name: "系统设计",
            score: Math.round((Math.random() * 3 + 7) * 10) / 10,
          },
        ],
        personalityTraits: [
          { trait: "主动性", score: Math.round(Math.random() * 20 + 80) },
          { trait: "团队合作", score: Math.round(Math.random() * 15 + 75) },
          { trait: "学习能力", score: Math.round(Math.random() * 25 + 75) },
        ],
        culturalFit: Math.round(Math.random() * 20 + 80), // 80-100%
        riskLevel: Math.random() > 0.7 ? "medium" : "low",
      });
    });

    setAiInsights(insights);
  };

  // 生成完整的面试报告（包含所有轮次）
  const generateMockReport = (candidate: Candidate) => {
    // 生成完整的面试流程报告
    const allRounds = [
      {
        id: `report_hr_${candidate.id}`,
        interviewType: "hr",
        interviewerName: "王HR",
        date: "2024-01-15T14:00:00",
        overallScore: Math.round((Math.random() * 2 + 7) * 10) / 10,
        recommendation: "hire",
        aiScore: Math.round((Math.random() * 1.5 + 7.5) * 10) / 10,
        strengths: [
          "沟通表达能力强",
          "职业规划清晰",
          "学习意愿强烈",
          "团队协作意识好",
        ],
        weaknesses: ["缺乏大厂工作经验", "对公司业务了解有限"],
        detailedFeedback:
          "候选人表现出良好的沟通能力和学习意愿，回答问题逻辑清晰，对职业规划有明确的想法。在团队协作方面有丰富的经验分享，展现了积极的工作态度。",
        aiAnalysis:
          "AI分析显示候选人在沟通能力和学习意愿方面表现突出，文化匹配度高达85%，建议进入下一轮技术面试。",
      },
      {
        id: `report_tech1_${candidate.id}`,
        interviewType: "tech_1",
        interviewerName: "李技术",
        date: "2024-01-17T10:00:00",
        overallScore: Math.round((Math.random() * 2 + 8) * 10) / 10,
        recommendation: "hire",
        aiScore: Math.round((Math.random() * 1.5 + 8) * 10) / 10,
        strengths: [
          "React技术栈掌握扎实",
          "系统设计思路清晰",
          "代码质量高",
          "问题分析能力强",
        ],
        weaknesses: ["部分新技术了解不够深入", "性能优化经验需要加强"],
        detailedFeedback:
          "候选人在技术面试中表现出色，对React生态系统有深入理解，能够清晰地解释复杂的技术概念。在系统设计题目中展现了良好的架构思维，代码实现规范。",
        aiAnalysis:
          "AI技能评估显示候选人React技能达到8.5/10，系统设计能力8.2/10，技术深度满足岗位要求，建议继续技术二面。",
      },
      {
        id: `report_tech2_${candidate.id}`,
        interviewType: "tech_2",
        interviewerName: "张架构师",
        date: "2024-01-19T15:30:00",
        overallScore: Math.round((Math.random() * 2 + 7.5) * 10) / 10,
        recommendation: "hire",
        aiScore: Math.round((Math.random() * 1.5 + 8) * 10) / 10,
        strengths: [
          "系统架构设计优秀",
          "性能优化思路清晰",
          "技术视野开阔",
          "解决复杂问题能力强",
        ],
        weaknesses: ["微服务架构经验相对不足", "容器化部署了解有限"],
        detailedFeedback:
          "候选人在架构设计方面展现了很强的能力，能够从全局角度思考系统设计，对性能优化有深入理解。在讨论复杂业务场景时表现出色，技术深度符合高级工程师要求。",
        aiAnalysis:
          "AI深度评估显示候选人系统架构能力达到高级水平，问题解决能力突出，技术学习能力强，具备成长为技术专家的潜力。",
      },
      {
        id: `report_vp_${candidate.id}`,
        interviewType: "vp",
        interviewerName: "陈VP",
        date: "2024-01-22T16:00:00",
        overallScore: Math.round((Math.random() * 2 + 8) * 10) / 10,
        recommendation: "strong_hire",
        aiScore: Math.round((Math.random() * 1 + 8.5) * 10) / 10,
        strengths: [
          "战略思维清晰",
          "领导潜力突出",
          "业务理解深入",
          "沟通协调能力强",
        ],
        weaknesses: ["管理经验有待加强", "行业洞察需要提升"],
        detailedFeedback:
          "候选人展现了优秀的战略思维和领导潜质，对技术发展趋势有清晰的认知，沟通表达能力强。在讨论团队建设和技术规划时见解独到，具备很强的成长潜力。",
        aiAnalysis:
          "AI综合评估显示候选人具备优秀的领导潜质和战略思维，团队协作能力95/100，推荐录用并纳入核心人才培养计划。",
      },
    ];

    return allRounds;
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

  const handleViewMeetingRecord = (
    candidateId: string,
    interviewType: string
  ) => {
    // 查找对应的会议记录
    const recordKey = Array.from(meetingRecords.keys()).find((key) => {
      const record = meetingRecords.get(key);
      return (
        record?.candidateId === candidateId &&
        record?.interviewType === interviewType
      );
    });

    if (recordKey) {
      const record = meetingRecords.get(recordKey);
      setSelectedMeetingRecord(record || null);
      setShowMeetingRecord(true);
    } else {
      // 如果找不到会议记录，生成一个临时记录
      const candidate = candidates.find((c) => c.id === candidateId);
      if (candidate) {
        const tempDialogues = generateDialogueForRound(
          {
            type: interviewType,
            candidateId,
            actualStartTime: new Date().toISOString(),
          },
          candidate
        );
        const tempRecord: InterviewMeetingRecord = {
          id: `temp_${candidateId}_${interviewType}`,
          interviewRoundId: `temp_${candidateId}_${interviewType}`,
          candidateId,
          interviewType: interviewType as "hr" | "tech_1" | "tech_2" | "vp",
          interviewerName: getInterviewerName("u001"),
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 45 * 60000).toISOString(),
          duration: 45,
          dialogues: tempDialogues,
          aiAnalysis: generateAIAnalysisForDialogue(tempDialogues),
          summary: {
            keyTopics: generateKeyTopics(interviewType),
            candidateStrengths: generateStrengthsFromDialogue(),
            concerns: generateConcernsFromDialogue(),
            aiInsights: generateAIInsightsFromDialogue(),
            nextSteps: generateNextSteps(interviewType, "hire"),
          },
          transcription: {
            quality: "excellent",
            confidence: 95 + Math.random() * 5,
            language: "zh-CN",
          },
        };
        setSelectedMeetingRecord(tempRecord);
        setShowMeetingRecord(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* AI智能页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 text-primary-500 mr-3" />
            AI智能面试报告
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            基于机器学习算法深度分析候选人表现，提供智能化招聘决策支持
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="btn btn-secondary"
            onClick={() => setIsAnalyzing(true)}
            disabled={isAnalyzing}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {isAnalyzing ? "AI分析中..." : "AI深度分析"}
          </button>
          <button className="btn btn-primary">
            <Sparkles className="h-4 w-4 mr-2" />
            生成AI报告
          </button>
        </div>
      </div>

      {/* AI智能统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-700">AI分析覆盖</p>
              <p className="text-2xl font-bold text-blue-900">100%</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Sparkles className="h-3 w-3 mr-1" />
                全面智能分析
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-700">AI推荐精度</p>
              <p className="text-2xl font-bold text-green-900">94.2%</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2% 本月
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-700">AI平均评分</p>
              <p className="text-2xl font-bold text-purple-900">8.3</p>
              <p className="text-xs text-purple-600">/10 智能评估</p>
            </div>
          </div>
        </div>
        <div className="card p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-2 bg-orange-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-700">AI推荐录用</p>
              <p className="text-2xl font-bold text-orange-900">78%</p>
              <p className="text-xs text-orange-600">智能筛选率</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI智能洞察面板 */}
      <div className="card p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
            AI智能洞察
          </h3>
          <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full font-medium">
            实时更新
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start p-3 bg-white bg-opacity-60 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">技能趋势分析</p>
              <p className="text-gray-600">
                React和TypeScript技能的候选人表现优于其他技术栈15%
              </p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-white bg-opacity-60 rounded-lg">
            <Target className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">匹配度预测</p>
              <p className="text-gray-600">
                AI识别出3位高匹配度候选人，建议优先安排终面
              </p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-white bg-opacity-60 rounded-lg">
            <Bot className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">智能建议</p>
              <p className="text-gray-600">
                优化面试流程，AI分析显示技术面试时长可缩短至40分钟
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI智能搜索和筛选 */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="AI智能搜索候选人..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <select className="select">
              <option>AI推荐排序</option>
              <option>评分最高</option>
              <option>匹配度最佳</option>
              <option>风险最低</option>
            </select>
            <button className="btn btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              AI智能筛选
            </button>
          </div>
        </div>
      </div>

      {/* AI智能报告列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCandidates.map((candidate) => {
          const mockReports = generateMockReport(candidate);
          const aiInsight = aiInsights.get(candidate.id);
          const avgScore =
            mockReports.length > 0
              ? mockReports.reduce((sum, r) => sum + r.overallScore, 0) /
                mockReports.length
              : 0;

          if (!aiInsight) return null;

          return (
            <div
              key={candidate.id}
              className="card p-0 border-l-4 border-l-primary-500 relative overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* AI状态横幅 */}
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-4 text-white relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 animate-pulse"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{candidate.name}</h3>
                      <div className="flex items-center text-sm text-blue-100">
                        <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                        AI全维度分析完成 • 置信度 {aiInsight.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* AI推荐标签 */}
                  <div className="flex items-center space-x-2">
                    {aiInsight.recommendation === "strong_hire" && (
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        AI强烈推荐
                      </span>
                    )}
                    {aiInsight.recommendation === "hire" && (
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        AI推荐录用
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* AI核心指标面板 */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {aiInsight.aiScore}
                    </div>
                    <div className="text-xs text-blue-700 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI总评分
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {aiInsight.culturalFit}%
                    </div>
                    <div className="text-xs text-green-700 flex items-center justify-center">
                      <Target className="h-3 w-3 mr-1" />
                      文化匹配
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {avgScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-purple-700">面试均分</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div
                      className={`text-lg font-bold mb-1 ${
                        aiInsight.riskLevel === "low"
                          ? "text-green-600"
                          : aiInsight.riskLevel === "medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {aiInsight.riskLevel === "low"
                        ? "✅ 低"
                        : aiInsight.riskLevel === "medium"
                        ? "⚠️ 中"
                        : "❌ 高"}
                    </div>
                    <div className="text-xs text-orange-700">风险评级</div>
                  </div>
                </div>

                {/* 候选人基本信息 */}
                <div className="flex items-center justify-center mb-4 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                  高级前端工程师 • 文化匹配 {aiInsight.culturalFit}% •
                  经验匹配度 {Math.round(85 + Math.random() * 10)}%
                </div>
                {/* 旧的头部信息已移动到顶部横幅 */}

                {/* AI技能分析 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <Zap className="h-4 w-4 text-purple-500 mr-2" />
                    AI技能分析
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {aiInsight.skills.slice(0, 3).map((skill) => (
                      <div
                        key={skill.name}
                        className="bg-gray-50 p-2 rounded-lg text-center"
                      >
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          {skill.name}
                        </div>
                        <div
                          className={`text-lg font-bold ${getScoreColor(
                            skill.score
                          )}`}
                        >
                          {skill.score}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full"
                            style={{ width: `${(skill.score / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI人格洞察 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <User className="h-4 w-4 text-green-500 mr-2" />
                    AI人格洞察
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {aiInsight.personalityTraits.map((trait) => (
                      <div
                        key={trait.trait}
                        className="bg-green-50 px-2 py-1 rounded-full text-xs"
                      >
                        <span className="font-medium text-green-800">
                          {trait.trait}
                        </span>
                        <span className="text-green-600 ml-1">
                          {trait.score}/100
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI智能分析结论增强版 */}
                <div className="mb-4 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    AI智能分析结论
                    <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      置信度 {aiInsight.confidence}%
                    </span>
                  </h4>
                  <div className="bg-white bg-opacity-80 p-3 rounded-lg border-l-4 border-purple-400 shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed italic mb-3">
                      "{aiInsight.reasoning}"
                    </p>

                    {/* AI预测指标 */}
                    <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                      <div className="text-center bg-gradient-to-r from-green-50 to-green-100 p-2 rounded-lg">
                        <div className="font-bold text-green-600">
                          {Math.round(85 + Math.random() * 10)}%
                        </div>
                        <div className="text-green-700">入职成功率</div>
                      </div>
                      <div className="text-center bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-lg">
                        <div className="font-bold text-blue-600">
                          {Math.round(75 + Math.random() * 20)}%
                        </div>
                        <div className="text-blue-700">团队适配度</div>
                      </div>
                      <div className="text-center bg-gradient-to-r from-purple-50 to-purple-100 p-2 rounded-lg">
                        <div className="font-bold text-purple-600">
                          {Math.round(80 + Math.random() * 15)}%
                        </div>
                        <div className="text-purple-700">成长潜力</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI增强面试轮次报告 */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 text-orange-500 mr-2" />
                    面试流程总览
                    <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                      {mockReports.length}轮完成
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {mockReports.map((report, index) => (
                      <div
                        key={report.id}
                        className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900 flex items-center">
                                {report.interviewType === "hr"
                                  ? "🤝 HR面试"
                                  : report.interviewType === "tech_1"
                                  ? "💻 技术一面"
                                  : report.interviewType === "tech_2"
                                  ? "🏗️ 技术二面"
                                  : "🎯 VP面试"}
                                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  AI已分析
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(report.date).toLocaleDateString(
                                  "zh-CN"
                                )}{" "}
                                • 面试官: {report.interviewerName}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* 传统评分 */}
                            <div className="text-center">
                              <div
                                className={`text-lg font-bold ${getScoreColor(
                                  report.overallScore
                                )}`}
                              >
                                {report.overallScore}
                              </div>
                              <div className="text-xs text-gray-500">
                                传统评分
                              </div>
                            </div>

                            {/* AI评分 */}
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {report.aiScore}
                              </div>
                              <div className="text-xs text-blue-600 flex items-center">
                                <Brain className="h-3 w-3 mr-1" />
                                AI评分
                              </div>
                            </div>

                            {getRecommendationBadge(report.recommendation)}

                            {/* 会议记录按钮 */}
                            <button
                              onClick={() =>
                                selectedCandidate &&
                                handleViewMeetingRecord(
                                  selectedCandidate.id,
                                  report.interviewType
                                )
                              }
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 flex items-center text-sm font-medium transition-all shadow-md hover:shadow-lg"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              会议纪要
                            </button>
                          </div>
                        </div>

                        {/* AI分析摘要 */}
                        <div className="mt-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                          <div className="flex items-start">
                            <Bot className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 text-xs text-blue-700 leading-relaxed">
                              <span className="font-medium">AI分析摘要: </span>
                              {report.aiAnalysis}
                            </div>
                          </div>
                        </div>

                        {/* 会议记录按钮 */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <Video className="h-3 w-3 mr-1" />
                            <span>会议已录制</span>
                            <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              AI转录完成
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleViewMeetingRecord(
                                candidate.id,
                                report.interviewType
                              )
                            }
                            className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-lg hover:from-purple-600 hover:to-blue-600 flex items-center transition-all"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            查看会议纪要
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(candidate.createdAt).toLocaleDateString(
                        "zh-CN"
                      )}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {mockReports.length} 轮面试
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-1 ${
                          aiInsight.riskLevel === "low"
                            ? "bg-green-400"
                            : aiInsight.riskLevel === "medium"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                      />
                      {aiInsight.riskLevel === "low"
                        ? "低风险"
                        : aiInsight.riskLevel === "medium"
                        ? "中风险"
                        : "高风险"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewReport(candidate)}
                      className="btn btn-sm btn-secondary flex items-center group"
                    >
                      <Brain className="h-3 w-3 mr-1 group-hover:animate-pulse" />
                      AI深度分析
                    </button>
                    <button className="btn btn-sm btn-primary flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      下载AI报告
                      <span className="ml-1 text-xs bg-white bg-opacity-20 px-1 py-0.5 rounded">
                        PDF
                      </span>
                    </button>
                  </div>
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
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Brain className="h-7 w-7 text-primary-500 mr-3" />
                  {selectedCandidate.name} - AI智能分析报告
                </h3>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" />
                  由AI算法深度分析生成，提供全方位候选人评估
                </p>
              </div>
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

            {/* ⚠️ AI智能分析结果 - 最突出位置 */}
            {aiInsights.get(selectedCandidate.id) ? (
              <>
                {/* AI分析横幅 - 吸引用户注意 */}
                <div className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 rounded-xl text-white relative overflow-hidden">
                  {/* 背景动效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-30 animate-pulse"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                          <Brain className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">
                            🤖 AI智能分析报告
                          </h3>
                          <p className="text-blue-100 text-sm">
                            基于机器学习算法的全方位候选人评估
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">实时AI分析</span>
                      </div>
                    </div>

                    {/* AI关键结论 */}
                    <div className="bg-white bg-opacity-15 p-4 rounded-lg mb-4">
                      <div className="flex items-center mb-2">
                        <Sparkles className="h-5 w-5 mr-2" />
                        <span className="font-bold text-lg">
                          AI综合评估结论
                        </span>
                      </div>
                      <p className="text-blue-100 leading-relaxed mb-3">
                        {aiInsights.get(selectedCandidate.id)!.reasoning}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span>
                            AI评分:{" "}
                            <strong className="text-yellow-300">
                              {aiInsights.get(selectedCandidate.id)!.aiScore}/10
                            </strong>
                          </span>
                          <span>
                            置信度:{" "}
                            <strong className="text-green-300">
                              {aiInsights.get(selectedCandidate.id)!.confidence}
                              %
                            </strong>
                          </span>
                          <span>
                            匹配度:{" "}
                            <strong className="text-blue-300">
                              {
                                aiInsights.get(selectedCandidate.id)!
                                  .culturalFit
                              }
                              %
                            </strong>
                          </span>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            aiInsights.get(selectedCandidate.id)!
                              .recommendation === "strong_hire"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {aiInsights.get(selectedCandidate.id)!
                            .recommendation === "strong_hire"
                            ? "🌟 强烈推荐"
                            : "✅ 推荐录用"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI详细分析面板 */}
                <div className="mb-8 relative overflow-hidden">
                  <div className="card p-8 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border-2 border-blue-300 relative z-10">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <Target className="h-6 w-6 text-blue-500 mr-3" />
                      AI智能评估详情
                    </h4>

                    {/* AI核心指标 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-blue-200">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {aiInsights.get(selectedCandidate.id)!.aiScore}
                        </div>
                        <div className="text-sm text-gray-600">AI评分</div>
                      </div>

                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-green-200">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {aiInsights.get(selectedCandidate.id)!.culturalFit}%
                        </div>
                        <div className="text-sm text-gray-600">文化匹配</div>
                      </div>

                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-purple-200">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {aiInsights.get(selectedCandidate.id)!.confidence}%
                        </div>
                        <div className="text-sm text-gray-600">置信度</div>
                      </div>

                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-orange-200">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-lg font-bold text-orange-600">
                          {aiInsights.get(selectedCandidate.id)!.riskLevel ===
                          "low"
                            ? "低风险"
                            : aiInsights.get(selectedCandidate.id)!
                                .riskLevel === "medium"
                            ? "中风险"
                            : "高风险"}
                        </div>
                        <div className="text-sm text-gray-600">风险等级</div>
                      </div>
                    </div>

                    {/* AI技能和特质快速预览 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 技能预览 */}
                      <div className="bg-white p-4 rounded-xl border border-purple-200">
                        <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                          <Zap className="h-5 w-5 text-purple-500 mr-2" />
                          AI技能分析
                        </h5>
                        {aiInsights
                          .get(selectedCandidate.id)!
                          .skills.map((skill) => (
                            <div
                              key={skill.name}
                              className="flex items-center justify-between mb-2"
                            >
                              <span className="text-sm text-gray-700">
                                {skill.name}
                              </span>
                              <div className="flex items-center">
                                <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-gradient-to-r from-purple-400 to-blue-500 h-2 rounded-full"
                                    style={{
                                      width: `${(skill.score / 10) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-purple-600">
                                  {skill.score}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* 人格预览 */}
                      <div className="bg-white p-4 rounded-xl border border-green-200">
                        <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                          <User className="h-5 w-5 text-green-500 mr-2" />
                          AI人格分析
                        </h5>
                        {aiInsights
                          .get(selectedCandidate.id)!
                          .personalityTraits.map((trait) => (
                            <div
                              key={trait.trait}
                              className="flex items-center justify-between mb-2"
                            >
                              <span className="text-sm text-gray-700">
                                {trait.trait}
                              </span>
                              <div className="flex items-center">
                                <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-gradient-to-r from-green-400 to-teal-500 h-2 rounded-full"
                                    style={{ width: `${trait.score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-green-600">
                                  {trait.score}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-6 bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-gray-600">AI分析数据加载中...</p>
              </div>
            )}

            {/* 面试轮次报告 - AI增强版 */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-7 w-7 text-primary-500 mr-3" />
                完整面试流程报告
                <span className="ml-auto text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full">
                  4轮面试完成
                </span>
              </h3>

              {generateMockReport(selectedCandidate).map(
                (report, reportIndex) => (
                  <div key={report.id} className="mb-8 relative">
                    {/* 时间线连接线 */}
                    {reportIndex <
                      generateMockReport(selectedCandidate).length - 1 && (
                      <div className="absolute left-6 top-20 w-px h-full bg-gradient-to-b from-blue-300 to-purple-300 z-0"></div>
                    )}

                    <div className="card p-8 relative z-10 border-l-4 border-l-primary-500 bg-gradient-to-r from-gray-50 to-blue-50">
                      {/* 面试轮次标题 */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                            {reportIndex + 1}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">
                              {report.interviewType === "hr"
                                ? "🤝 HR面试报告"
                                : report.interviewType === "tech_1"
                                ? "💻 技术一面报告"
                                : report.interviewType === "tech_2"
                                ? "🏗️ 技术二面报告"
                                : "🎯 VP面试报告"}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              面试官: {report.interviewerName} •
                              {new Date(report.date).toLocaleDateString(
                                "zh-CN"
                              )}{" "}
                              •
                              {Math.round(
                                (new Date(report.date).getTime() -
                                  new Date("2024-01-15").getTime()) /
                                  (1000 * 60)
                              )}
                              分钟
                            </p>
                          </div>
                        </div>

                        {/* 评分对比 */}
                        <div className="text-right">
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="text-center">
                              <div
                                className={`text-2xl font-bold ${getScoreColor(
                                  report.overallScore
                                )}`}
                              >
                                {report.overallScore}
                              </div>
                              <div className="text-xs text-gray-500">
                                传统评分
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {report.aiScore}
                              </div>
                              <div className="text-xs text-blue-600 flex items-center">
                                <Brain className="h-3 w-3 mr-1" />
                                AI评分
                              </div>
                            </div>
                          </div>
                          {getRecommendationBadge(report.recommendation)}
                        </div>
                      </div>

                      {/* AI分析横幅 */}
                      <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl text-white">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-1">
                            <Bot className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-lg font-bold mb-2 flex items-center">
                              🤖 AI深度分析
                              <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                                智能评估
                              </span>
                            </h5>
                            <p className="text-blue-100 leading-relaxed text-sm">
                              {report.aiAnalysis}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            优势表现
                          </h5>
                          <ul className="space-y-3">
                            {report.strengths.map((strength, strengthIndex) => (
                              <li
                                key={strengthIndex}
                                className="flex items-start bg-green-50 p-3 rounded-lg"
                              >
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                  <span className="text-white font-bold text-xs">
                                    {strengthIndex + 1}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-700 font-medium">
                                  {strength}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                              <TrendingDown className="h-5 w-5 text-orange-600" />
                            </div>
                            改进建议
                          </h5>
                          <ul className="space-y-3">
                            {report.weaknesses.map(
                              (weakness, weaknessIndex) => (
                                <li
                                  key={weaknessIndex}
                                  className="flex items-start bg-orange-50 p-3 rounded-lg"
                                >
                                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-white font-bold text-xs">
                                      {weaknessIndex + 1}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-700 font-medium">
                                    {weakness}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* 详细反馈 */}
                      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                          <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                          面试官详细反馈
                        </h5>
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-300">
                          <p className="text-gray-700 leading-relaxed italic">
                            "{report.detailedFeedback}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* AI多维度深度分析 - 增强版 */}
            {aiInsights.get(selectedCandidate.id) && (
              <div className="mb-8">
                <div className="flex items-center justify-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center">
                    <Brain className="h-7 w-7 text-purple-500 mr-3" />
                    AI多维度智能分析
                    <Sparkles className="h-6 w-6 text-blue-500 ml-3" />
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* AI技能分析 - 雷达图风格 */}
                  <div className="card p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 relative overflow-hidden">
                    {/* 背景装饰 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-30 transform translate-x-16 -translate-y-16"></div>

                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        AI技能深度解析
                        <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                          机器学习评估
                        </span>
                      </h4>

                      <div className="space-y-6">
                        {aiInsights
                          .get(selectedCandidate.id)!
                          .skills.map((skill, index) => (
                            <div key={skill.name} className="relative">
                              {/* 技能卡片 */}
                              <div className="bg-white bg-opacity-80 p-5 rounded-xl shadow-sm border border-purple-100">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                        skill.score >= 8
                                          ? "bg-green-500"
                                          : skill.score >= 6
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                    >
                                      <span className="text-white font-bold text-sm">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-800">
                                      {skill.name}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <div
                                      className={`text-2xl font-bold ${getScoreColor(
                                        skill.score
                                      )}`}
                                    >
                                      {skill.score}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      满分10
                                    </div>
                                  </div>
                                </div>

                                {/* 进度条 - 多层次 */}
                                <div className="mb-4">
                                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                    <div
                                      className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 h-3 rounded-full relative overflow-hidden"
                                      style={{
                                        width: `${(skill.score / 10) * 100}%`,
                                      }}
                                    >
                                      <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>初级</span>
                                    <span>中级</span>
                                    <span>高级</span>
                                    <span>专家</span>
                                  </div>
                                </div>

                                {/* AI详细分析 */}
                                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-lg">
                                  <div className="flex items-start">
                                    <Bot className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                      <p className="font-medium text-purple-800 mb-1">
                                        AI深度评估:
                                      </p>
                                      <p className="text-purple-700">
                                        {skill.score >= 8
                                          ? "该技能掌握扎实，在实际项目中能独立承担核心功能开发，具备指导他人的能力"
                                          : skill.score >= 6
                                          ? "技能基础良好，能够完成常规开发任务，在复杂场景下需要适当指导"
                                          : "技能处于学习阶段，基本概念掌握较好，需要在实践中进一步提升"}
                                      </p>
                                      <div className="mt-2 flex items-center text-xs">
                                        <Target className="h-3 w-3 mr-1" />
                                        <span className="font-medium">
                                          匹配度: {Math.round(skill.score * 10)}
                                          %
                                        </span>
                                        <span className="ml-3 text-purple-600">
                                          • 业务适配性强
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* AI人格特质分析 - 圆环进度风格 */}
                  <div className="card p-6 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 relative overflow-hidden">
                    {/* 背景装饰 */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-100 to-teal-100 rounded-full opacity-30 transform -translate-x-16 -translate-y-16"></div>

                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        AI人格特质画像
                        <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          心理学模型
                        </span>
                      </h4>

                      <div className="space-y-6">
                        {aiInsights
                          .get(selectedCandidate.id)!
                          .personalityTraits.map((trait) => (
                            <div key={trait.trait} className="relative">
                              {/* 特质卡片 */}
                              <div className="bg-white bg-opacity-80 p-5 rounded-xl shadow-sm border border-green-100">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center">
                                    <div className="relative w-16 h-16 mr-4">
                                      {/* 圆环进度 */}
                                      <svg
                                        className="w-16 h-16 transform -rotate-90"
                                        viewBox="0 0 36 36"
                                      >
                                        <path
                                          className="text-gray-200"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          fill="transparent"
                                          d="M18,2.5 a 15.5,15.5 0 1,1 0,31 a 15.5,15.5 0 1,1 0,-31"
                                        />
                                        <path
                                          className="text-green-500"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          fill="transparent"
                                          strokeDasharray={`${trait.score}, 100`}
                                          d="M18,2.5 a 15.5,15.5 0 1,1 0,31 a 15.5,15.5 0 1,1 0,-31"
                                        />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-green-600">
                                          {trait.score}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <h5 className="text-lg font-bold text-gray-800 mb-1">
                                        {trait.trait}
                                      </h5>
                                      <div className="flex items-center text-sm text-green-600">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        {trait.score >= 90
                                          ? "卓越表现"
                                          : trait.score >= 80
                                          ? "优秀水平"
                                          : trait.score >= 70
                                          ? "良好表现"
                                          : "发展空间"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">
                                      {trait.score}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      满分100
                                    </div>
                                  </div>
                                </div>

                                {/* AI分析详情 */}
                                <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg">
                                  <div className="flex items-start">
                                    <Lightbulb className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                      <p className="font-medium text-green-800 mb-2">
                                        AI人格分析:
                                      </p>
                                      <p className="text-green-700 leading-relaxed mb-3">
                                        {trait.trait === "主动性"
                                          ? "候选人展现出强烈的工作主动性，能够主动承担责任，在团队中起到推动作用"
                                          : trait.trait === "团队合作"
                                          ? "具备良好的团队协作精神，善于沟通，能够与不同背景的同事有效配合"
                                          : trait.trait === "学习能力"
                                          ? "学习能力突出，对新技术和新知识保持高度敏感，能够快速适应变化"
                                          : ""}
                                      </p>
                                      <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center text-green-600">
                                          <Target className="h-3 w-3 mr-1" />
                                          <span>
                                            职位匹配度:{" "}
                                            {Math.round(
                                              (trait.score / 100) * 100
                                            )}
                                            %
                                          </span>
                                        </div>
                                        <span className="bg-white bg-opacity-70 px-2 py-1 rounded-full text-green-700 font-medium">
                                          AI置信度{" "}
                                          {85 + Math.floor(Math.random() * 10)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI预测与建议面板 */}
            {aiInsights.get(selectedCandidate.id) && (
              <div className="mb-8 card p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  AI智能预测与建议
                  <span className="ml-auto text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                    预测模型 v2.1
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 入职成功率预测 */}
                  <div className="bg-white bg-opacity-80 p-5 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-lg font-bold text-gray-800">
                        入职成功率
                      </h5>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {Math.round(85 + Math.random() * 10)}%
                      </div>
                      <div className="text-sm text-gray-600">AI预测概率</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg">
                      <div className="flex items-start">
                        <Bot className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <p className="text-xs text-green-700">
                          基于历史数据分析，该候选人入职后表现稳定的概率很高，建议优先考虑
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 团队适配性 */}
                  <div className="bg-white bg-opacity-80 p-5 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-lg font-bold text-gray-800">
                        团队适配
                      </h5>
                      <User className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {Math.round(80 + Math.random() * 15)}%
                      </div>
                      <div className="text-sm text-gray-600">匹配指数</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-lg">
                      <div className="flex items-start">
                        <Lightbulb className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                        <p className="text-xs text-blue-700">
                          性格特质与现有团队成员互补性强，预期能快速融入团队环境
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 成长潜力预测 */}
                  <div className="bg-white bg-opacity-80 p-5 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-lg font-bold text-gray-800">
                        成长潜力
                      </h5>
                      <TrendingUp className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {Math.round(75 + Math.random() * 20)}%
                      </div>
                      <div className="text-sm text-gray-600">潜力评估</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-3 rounded-lg">
                      <div className="flex items-start">
                        <Sparkles className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                        <p className="text-xs text-purple-700">
                          学习能力和适应性优秀，预期在6个月内能承担更多核心职责
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI建议行动计划 */}
                <div className="mt-6 bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-xl">
                  <h5 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <Target className="h-5 w-5 text-amber-600 mr-2" />
                    AI智能建议
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 mb-1">
                          建议录用
                        </p>
                        <p className="text-gray-700">
                          综合AI分析结果优秀，建议进入最终决策流程
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 mb-1">
                          培养方向
                        </p>
                        <p className="text-gray-700">
                          重点关注系统设计能力培养，安排资深导师指导
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI增强操作按钮 */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      AI分析完成
                    </p>
                    <p className="text-sm text-gray-600">
                      基于126项指标进行多维度智能评估
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="btn btn-secondary flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    AI完整报告
                    <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      PDF
                    </span>
                  </button>
                  <button className="btn btn-primary flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI深度洞察
                    <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      NEW
                    </span>
                  </button>
                  <button className="btn btn-primary flex items-center bg-gradient-to-r from-purple-600 to-blue-600 border-0">
                    <Bot className="h-4 w-4 mr-2" />
                    AI对话助手
                    <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 面试会议记录模态框 */}
      {showMeetingRecord && selectedMeetingRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Video className="h-7 w-7 text-purple-500 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    面试会议记录 -{" "}
                    {selectedMeetingRecord.interviewType === "hr"
                      ? "HR面试"
                      : selectedMeetingRecord.interviewType === "tech_1"
                      ? "技术一面"
                      : selectedMeetingRecord.interviewType === "tech_2"
                      ? "技术二面"
                      : "VP面试"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(selectedMeetingRecord.startTime).toLocaleString(
                      "zh-CN"
                    )}{" "}
                    • 时长 {selectedMeetingRecord.duration} 分钟 • 面试官:{" "}
                    {selectedMeetingRecord.interviewerName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMeetingRecord(false)}
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

            {/* 会议概览信息 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-green-800">
                      转录质量
                    </div>
                    <div className="text-lg font-bold text-green-600 capitalize">
                      {selectedMeetingRecord.transcription.quality}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-blue-800">
                      AI置信度
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round(
                        selectedMeetingRecord.transcription.confidence
                      )}
                      %
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-purple-800">
                      对话轮次
                    </div>
                    <div className="text-lg font-bold text-purple-600">
                      {selectedMeetingRecord.dialogues.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-orange-800">
                      AI分析
                    </div>
                    <div className="text-lg font-bold text-orange-600">
                      {selectedMeetingRecord.aiAnalysis.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 对话记录 */}
              <div className="lg:col-span-2">
                <div className="card p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <MessageSquare className="h-6 w-6 text-blue-500 mr-3" />
                    面试对话全记录
                    <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      AI实时转录
                    </span>
                  </h4>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {selectedMeetingRecord.dialogues.map((dialogue) => (
                      <div
                        key={dialogue.id}
                        className="flex items-start space-x-4"
                      >
                        {/* 说话者头像 */}
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                            dialogue.speaker === "interviewer"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600"
                              : "bg-gradient-to-r from-green-500 to-green-600"
                          }`}
                        >
                          {dialogue.speaker === "interviewer" ? (
                            <Users className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>

                        {/* 对话内容 */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {dialogue.speaker === "interviewer"
                                ? "面试官"
                                : "候选人"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(dialogue.timestamp).toLocaleTimeString(
                                "zh-CN"
                              )}
                            </span>
                            {dialogue.sentiment && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  dialogue.sentiment === "positive"
                                    ? "bg-green-100 text-green-700"
                                    : dialogue.sentiment === "negative"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {dialogue.sentiment === "positive"
                                  ? "积极"
                                  : dialogue.sentiment === "negative"
                                  ? "消极"
                                  : "中性"}
                              </span>
                            )}
                          </div>

                          <div
                            className={`p-4 rounded-lg ${
                              dialogue.speaker === "interviewer"
                                ? "bg-blue-50 border-l-4 border-blue-400"
                                : "bg-green-50 border-l-4 border-green-400"
                            }`}
                          >
                            <p className="text-gray-700 leading-relaxed">
                              {dialogue.content}
                            </p>

                            {dialogue.keywords &&
                              dialogue.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {dialogue.keywords.map((keyword, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs bg-white bg-opacity-60 text-gray-600 px-2 py-1 rounded-full border"
                                    >
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>

                          {/* AI实时分析 */}
                          {selectedMeetingRecord.aiAnalysis
                            .filter(
                              (analysis) =>
                                analysis.relatedDialogue === dialogue.id
                            )
                            .map((analysis) => (
                              <div
                                key={analysis.id}
                                className="mt-3 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200"
                              >
                                <div className="flex items-start">
                                  <Bot className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="text-xs font-medium text-purple-800">
                                        AI{" "}
                                        {analysis.analysisType === "sentiment"
                                          ? "情感分析"
                                          : analysis.analysisType === "keyword"
                                          ? "关键词提取"
                                          : analysis.analysisType ===
                                            "competency"
                                          ? "能力评估"
                                          : "风险识别"}
                                      </span>
                                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                        置信度 {Math.round(analysis.confidence)}
                                        %
                                      </span>
                                    </div>
                                    <p className="text-xs text-purple-700">
                                      {analysis.content}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI会议纪要 */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* 关键话题 */}
                  <div className="card p-5">
                    <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Target className="h-5 w-5 text-blue-500 mr-2" />
                      关键话题
                    </h5>
                    <div className="space-y-2">
                      {selectedMeetingRecord.summary.keyTopics.map(
                        (topic, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm bg-blue-50 p-2 rounded"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            {topic}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 候选人优势 */}
                  <div className="card p-5">
                    <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      候选人优势
                    </h5>
                    <div className="space-y-2">
                      {selectedMeetingRecord.summary.candidateStrengths.map(
                        (strength, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm bg-green-50 p-2 rounded"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                            {strength}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 关注点 */}
                  {selectedMeetingRecord.summary.concerns.length > 0 && (
                    <div className="card p-5">
                      <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                        <TrendingDown className="h-5 w-5 text-orange-500 mr-2" />
                        关注点
                      </h5>
                      <div className="space-y-2">
                        {selectedMeetingRecord.summary.concerns.map(
                          (concern, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm bg-orange-50 p-2 rounded"
                            >
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 flex-shrink-0"></div>
                              {concern}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI智能洞察 */}
                  <div className="card p-5">
                    <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                      AI智能洞察
                    </h5>
                    <div className="space-y-3">
                      {selectedMeetingRecord.summary.aiInsights.map(
                        (insight, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200"
                          >
                            <div className="flex items-start">
                              <Lightbulb className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-purple-700">
                                {insight}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 后续步骤 */}
                  <div className="card p-5">
                    <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                      后续步骤
                    </h5>
                    <div className="space-y-2">
                      {selectedMeetingRecord.summary.nextSteps.map(
                        (step, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm bg-indigo-50 p-2 rounded"
                          >
                            <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                {index + 1}
                              </span>
                            </div>
                            {step}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <Bot className="h-4 w-4 mr-2" />
                <span>
                  AI分析于 {new Date().toLocaleDateString("zh-CN")} 生成
                </span>
              </div>

              <div className="flex space-x-3">
                <button className="btn btn-secondary flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  导出会议纪要
                </button>
                <button className="btn btn-secondary flex items-center">
                  <Play className="h-4 w-4 mr-2" />
                  播放录音
                </button>
                <button className="btn btn-primary flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI问答助手
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewReports;
