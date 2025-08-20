#!/bin/bash

echo "🚀 启动 AI 面试系统..."
echo ""

# 检查 Node.js 版本
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js (建议版本 18.0+)"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖中..."
    npm install
fi

echo "🌟 启动开发服务器..."
echo "📖 访问地址: http://localhost:3000"
echo "⏹️  按 Ctrl+C 停止服务器"
echo ""

npm run dev
