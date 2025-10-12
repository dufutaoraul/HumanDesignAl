# 人类图 AI - 带代理启动脚本
# 使用说明：在 PowerShell 中运行此脚本

Write-Host "🚀 正在启动人类图 AI 开发服务器（已配置代理）..." -ForegroundColor Green
Write-Host ""

# 设置代理（Clash 默认端口 7890）
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"

Write-Host "✅ 代理已配置: http://127.0.0.1:7890" -ForegroundColor Cyan
Write-Host "   如果您的代理端口不是 7890，请修改此脚本" -ForegroundColor Yellow
Write-Host ""

# 启动开发服务器
Write-Host "📦 正在启动 Next.js 开发服务器..." -ForegroundColor Green
npm run dev
