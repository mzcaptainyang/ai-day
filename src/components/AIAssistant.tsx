import { Bot, Send, Sparkles, User, X } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "你好！我是AI招聘助手，可以帮您分析候选人数据、预测面试结果、优化招聘流程。有什么可以为您解答的吗？",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // 模拟AI回复
  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("候选人") && lowerMessage.includes("质量")) {
      return "根据AI分析，当前候选人整体质量评分为7.8/10，比上月提升0.8分。高潜力候选人占48%，建议重点关注技术能力突出的候选人，如陈小明（匹配度92%）。";
    } else if (
      lowerMessage.includes("面试") &&
      lowerMessage.includes("通过率")
    ) {
      return "当前面试通过率为78%，呈上升趋势。技术面试环节通过率75%，HR面试通过率85%。AI预测下个月通过率可达82%，建议优化技术面试题目难度。";
    } else if (lowerMessage.includes("推荐") || lowerMessage.includes("建议")) {
      return "基于AI分析，我为您推荐以下操作：\n1. 优先安排陈小明的终面，成功概率93%\n2. 调整技术面试时长，当前平均65分钟偏长\n3. 增加行为面试问题，提升文化匹配度评估\n4. 关注React、TypeScript技能的候选人，需求上升40%";
    } else if (lowerMessage.includes("预测") || lowerMessage.includes("趋势")) {
      return "AI预测分析显示：\n📈 本月成功招聘率：85%（↑12%）\n🎯 预计完成招聘目标：95%\n⚡ 最佳面试时间：周二-周四下午\n🔥 热门技能需求：React、Node.js、Python\n建议提前储备相关技能的候选人。";
    } else if (lowerMessage.includes("优化") || lowerMessage.includes("改进")) {
      return "AI识别出以下优化机会：\n1. 面试流程：技术面试平均时长可缩短15分钟\n2. 问题库：建议更新20%的技术问题\n3. 评分标准：软技能权重可适当提升\n4. 候选人体验：面试安排响应时间可缩短至2小时内\n需要我详细解释某个方面吗？";
    } else {
      return "感谢您的问题！作为AI招聘助手，我可以帮您：\n✨ 分析候选人匹配度和潜力\n📊 预测面试成功率和招聘趋势\n🎯 推荐最佳面试时间和问题\n⚡ 识别流程瓶颈和优化机会\n\n请告诉我您最想了解哪个方面？";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // 模拟AI思考时间
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: simulateAIResponse(input),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-4">
      <div className="bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">AI招聘助手</h3>
              <p className="text-xs opacity-90">智能分析 · 实时响应</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.type === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full flex-shrink-0 ${
                    message.type === "user"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-2xl ${
                    message.type === "user"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="p-2 rounded-full flex-shrink-0 bg-gray-100 text-gray-600">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 rounded-2xl bg-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={2}
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {/* 快捷问题 */}
          <div className="mt-3 flex flex-wrap gap-2">
            {["候选人质量分析", "面试通过率预测", "优化建议", "趋势分析"].map(
              (question) => (
                <button
                  key={question}
                  onClick={() => setInput(question)}
                  className="text-xs px-3 py-1 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
                  disabled={isTyping}
                >
                  {question}
                </button>
              )
            )}
          </div>
        </div>

        {/* 底部状态 */}
        <div className="px-4 py-2 bg-gray-50 rounded-b-lg border-t">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <Sparkles className="h-3 w-3 mr-1" />
            由AI智能分析引擎驱动
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
