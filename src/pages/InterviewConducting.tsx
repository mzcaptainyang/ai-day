import {
  Brain,
  CheckCircle,
  Clock,
  Edit,
  Mic,
  MicOff,
  Pause,
  Play,
  Plus,
  Save,
  Square,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import candidatesData from "../data/candidates.json";
import interviewRoundsData from "../data/interviewRounds.json";
import questionTemplatesData from "../data/questionTemplates.json";
import {
  AIQuestionTemplate,
  Candidate,
  InterviewQuestion,
  InterviewRound,
} from "../types";

const InterviewConducting: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<InterviewRound | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<InterviewQuestion[]>([]);

  useEffect(() => {
    // 加载面试数据
    const interviewData = (interviewRoundsData as InterviewRound[]).find(
      (i) => i.id === id
    );
    if (interviewData) {
      setInterview(interviewData);
      const candidateData = (candidatesData as Candidate[]).find(
        (c) => c.id === interviewData.candidateId
      );
      setCandidate(candidateData || null);
    }
  }, [id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (interviewStarted && !isRecording) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [interviewStarted, isRecording]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const generateAIQuestions = async () => {
    if (!candidate || !interview) return;

    setIsGeneratingQuestions(true);

    // 模拟AI生成问题的过程
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const questionTemplates = questionTemplatesData as AIQuestionTemplate[];
    const relevantTemplate = questionTemplates.find(
      (t) =>
        t.category ===
        (interview.type === "tech_1" ? "technical" : "behavioral")
    );

    if (relevantTemplate) {
      const generatedQuestions: InterviewQuestion[] =
        relevantTemplate.questions.map((q, index) => ({
          id: `ai_${index}`,
          question: q.question,
          category: relevantTemplate.category as any,
          difficulty: "medium" as any,
          keyPoints: q.evaluationCriteria,
          followUpQuestions: q.followUps,
          expectedAnswer: q.idealAnswer,
          timeLimit: 15,
        }));

      setAiQuestions(generatedQuestions);
    }

    setIsGeneratingQuestions(false);
  };

  const handleStartInterview = () => {
    setInterviewStarted(true);
    setIsRecording(true);
  };

  const handlePauseResume = () => {
    setIsRecording(!isRecording);
  };

  const handleStopInterview = () => {
    setInterviewStarted(false);
    setIsRecording(false);
    // TODO: 保存面试结果
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNotesChange = (questionId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [questionId]: note }));
  };

  const currentQuestions =
    aiQuestions.length > 0 ? aiQuestions : interview?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  if (!interview || !candidate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载面试信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 面试头部信息 */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-12 w-12">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium text-lg">
                  {candidate.name.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {interview.type === "tech_1"
                  ? "技术一面"
                  : interview.type === "tech_2"
                  ? "技术二面"
                  : interview.type === "hr"
                  ? "HR面试"
                  : "VP面试"}
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  {candidate.name}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(timeElapsed)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!interviewStarted ? (
              <>
                <button
                  onClick={generateAIQuestions}
                  disabled={isGeneratingQuestions}
                  className="btn btn-secondary"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isGeneratingQuestions ? "生成中..." : "AI生成问题"}
                </button>
                <button
                  onClick={handleStartInterview}
                  className="btn btn-primary"
                >
                  <Play className="h-4 w-4 mr-2" />
                  开始面试
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handlePauseResume}
                  className="btn btn-secondary"
                >
                  {isRecording ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isRecording ? "暂停" : "继续"}
                </button>
                <button
                  onClick={handleStopInterview}
                  className="btn btn-danger"
                >
                  <Square className="h-4 w-4 mr-2" />
                  结束面试
                </button>
              </>
            )}
          </div>
        </div>

        {/* 面试状态栏 */}
        {interviewStarted && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {isRecording ? (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-sm font-medium text-red-700">
                        录制中
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-yellow-700">
                        已暂停
                      </span>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  问题 {currentQuestionIndex + 1} / {currentQuestions.length}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className={`btn btn-sm ${
                    isRecording ? "btn-danger" : "btn-secondary"
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="h-3 w-3" />
                  ) : (
                    <Mic className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：问题列表 */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">面试问题</h3>
              <button className="btn btn-sm btn-secondary">
                <Plus className="h-3 w-3 mr-1" />
                添加问题
              </button>
            </div>

            {isGeneratingQuestions && (
              <div className="text-center py-8">
                <Brain className="h-8 w-8 text-primary-600 animate-pulse mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  AI正在根据候选人简历生成面试问题...
                </p>
              </div>
            )}

            <div className="space-y-2">
              {currentQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentQuestionIndex
                      ? "bg-primary-100 border border-primary-300"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        问题 {index + 1}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {question.question}
                      </p>
                    </div>
                    <div className="ml-2 flex items-center space-x-1">
                      {answers[question.id] && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span
                        className={`badge badge-sm ${
                          question.difficulty === "hard"
                            ? "badge-danger"
                            : question.difficulty === "medium"
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {question.difficulty === "hard"
                          ? "困难"
                          : question.difficulty === "medium"
                          ? "中等"
                          : "简单"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：当前问题详情 */}
        <div className="lg:col-span-2 space-y-6">
          {currentQuestion && (
            <>
              {/* 当前问题 */}
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    问题 {currentQuestionIndex + 1}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`badge ${
                        currentQuestion.category === "technical"
                          ? "badge-primary"
                          : currentQuestion.category === "behavioral"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {currentQuestion.category === "technical"
                        ? "技术问题"
                        : currentQuestion.category === "behavioral"
                        ? "行为问题"
                        : "情景问题"}
                    </span>
                    {currentQuestion.timeLimit && (
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentQuestion.timeLimit}分钟
                      </span>
                    )}
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-900 text-base leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* 关键点提示 */}
                {currentQuestion.keyPoints &&
                  currentQuestion.keyPoints.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">
                        评估关键点:
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {currentQuestion.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* 追问问题 */}
                {currentQuestion.followUpQuestions &&
                  currentQuestion.followUpQuestions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        可能的追问:
                      </h4>
                      <div className="space-y-2">
                        {currentQuestion.followUpQuestions.map(
                          (followUp, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
                            >
                              {followUp}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* 导航按钮 */}
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.max(0, currentQuestionIndex - 1)
                      )
                    }
                    disabled={currentQuestionIndex === 0}
                    className="btn btn-secondary"
                  >
                    上一题
                  </button>
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.min(
                          currentQuestions.length - 1,
                          currentQuestionIndex + 1
                        )
                      )
                    }
                    disabled={
                      currentQuestionIndex === currentQuestions.length - 1
                    }
                    className="btn btn-secondary"
                  >
                    下一题
                  </button>
                </div>
              </div>

              {/* 候选人回答记录 */}
              <div className="card p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  候选人回答
                </h4>
                <textarea
                  className="textarea h-32 mb-4"
                  placeholder="记录候选人的回答要点..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                />

                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  面试官备注
                </h4>
                <textarea
                  className="textarea h-24"
                  placeholder="记录评估备注和观察..."
                  value={notes[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleNotesChange(currentQuestion.id, e.target.value)
                  }
                />

                <div className="mt-4 flex justify-end space-x-2">
                  <button className="btn btn-secondary">
                    <Edit className="h-4 w-4 mr-2" />
                    编辑
                  </button>
                  <button className="btn btn-primary">
                    <Save className="h-4 w-4 mr-2" />
                    保存记录
                  </button>
                </div>
              </div>

              {/* 实时评估 */}
              {interviewStarted && (
                <div className="card p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    实时评估
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        技术能力 (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        沟通表达 (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      总体印象
                    </label>
                    <textarea
                      className="textarea h-20"
                      placeholder="记录对候选人的总体印象和建议..."
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewConducting;
