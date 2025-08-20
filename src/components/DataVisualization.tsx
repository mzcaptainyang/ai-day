import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface TrendData {
  period: string;
  value: number;
  change: number;
}

interface DataVisualizationProps {
  className?: string;
}

const DataVisualization = ({ className }: DataVisualizationProps) => {
  // 模拟招聘漏斗数据
  const funnelData: ChartData[] = [
    { label: "简历投递", value: 280, color: "bg-blue-500" },
    { label: "初步筛选", value: 140, color: "bg-green-500" },
    { label: "技术面试", value: 85, color: "bg-yellow-500" },
    { label: "终面", value: 42, color: "bg-purple-500" },
    { label: "录用", value: 28, color: "bg-red-500" },
  ];

  // 模拟面试成功率趋势
  const trendData: TrendData[] = [
    { period: "1月", value: 68, change: 0 },
    { period: "2月", value: 72, change: 4 },
    { period: "3月", value: 75, change: 3 },
    { period: "4月", value: 78, change: 3 },
    { period: "5月", value: 82, change: 4 },
    { period: "6月", value: 85, change: 3 },
  ];

  // 计算最大值用于比例缩放
  const maxValue = Math.max(...funnelData.map((item) => item.value));
  const maxTrendValue = Math.max(...trendData.map((item) => item.value));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI驱动的招聘漏斗分析 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 text-primary-500 mr-2" />
            智能招聘漏斗分析
          </h3>
          <div className="flex items-center text-sm text-primary-600">
            <Zap className="h-4 w-4 mr-1" />
            AI实时优化
          </div>
        </div>

        <div className="space-y-4">
          {funnelData.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const conversionRate =
              index > 0
                ? ((item.value / funnelData[index - 1].value) * 100).toFixed(1)
                : null;

            return (
              <div key={item.label} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${item.color}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-semibold text-gray-900 mr-2">
                      {item.value}
                    </span>
                    {conversionRate && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {conversionRate}% 转化
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`h-6 rounded-full transition-all duration-1000 ${item.color} flex items-center justify-end pr-3`}
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-white text-xs font-medium">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900">AI洞察建议</p>
              <p className="text-xs text-blue-700 mt-1">
                技术面试转化率偏低，建议优化面试流程和题目难度，预计可提升15%通过率
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 面试成功率趋势分析 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
            成功率趋势预测
          </h3>
          <div className="text-sm text-green-600 font-medium">
            ↗ 持续上升趋势
          </div>
        </div>

        <div className="relative">
          {/* 趋势线图 */}
          <div className="flex items-end justify-between h-40 mb-4">
            {trendData.map((item, index) => {
              const height = (item.value / maxTrendValue) * 100;
              return (
                <div
                  key={item.period}
                  className="flex flex-col items-center flex-1 relative"
                >
                  <div className="relative flex-1 flex items-end">
                    <div
                      className="w-8 bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all duration-1000"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 font-medium">
                    {item.period}
                  </div>
                  <div className="absolute -top-6 bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">
                    {item.value}%
                  </div>
                  {item.change > 0 && (
                    <div className="absolute -top-10 text-xs text-green-600">
                      +{item.change}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-green-800">当前成功率</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">92%</div>
                <div className="text-sm text-blue-800">预测峰值</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">+17%</div>
                <div className="text-sm text-purple-800">6个月增长</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 候选人质量分析矩阵 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 text-purple-500 mr-2" />
            候选人质量矩阵
          </h3>
          <div className="text-sm text-gray-500">基于AI多维度评估</div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* 高潜力区 */}
          <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg relative">
            <div className="text-lg font-bold text-green-800">高潜力</div>
            <div className="text-3xl font-bold text-green-600 my-2">12</div>
            <div className="text-sm text-green-700">技能匹配度 &gt; 85%</div>
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          {/* 待培养区 */}
          <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg relative">
            <div className="text-lg font-bold text-yellow-800">待培养</div>
            <div className="text-3xl font-bold text-yellow-600 my-2">8</div>
            <div className="text-sm text-yellow-700">技能匹配度 60-85%</div>
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          {/* 需提升区 */}
          <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-lg relative">
            <div className="text-lg font-bold text-red-800">需提升</div>
            <div className="text-3xl font-bold text-red-600 my-2">5</div>
            <div className="text-sm text-red-700">技能匹配度 &lt; 60%</div>
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Users className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">AI建议:</span>
            重点关注高潜力候选人，为待培养候选人制定个性化培训计划，考虑调整招聘标准。
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
