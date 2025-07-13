#!/bin/bash

echo "尝试在端口3000上启动服务..."

# 切换到项目目录
cd /home/devbox/project/fluid-dynamics-sim

# 尝试杀死可能占用3000端口的进程
echo "尝试释放3000端口..."
pkill -f "node.*vite" || echo "没有找到运行中的vite进程"
sleep 2

# 尝试启动服务器
echo "启动开发服务器在端口3000..."
npm run dev

# 如果上面的命令失败，可能是因为端口仍然被占用
# 我们可以尝试修改package.json中的dev命令来强制使用3000端口
if [ $? -ne 0 ]; then
  echo "无法在3000端口启动服务器，尝试使用--port=3000参数..."
  npx vite --port=3000 --strictPort
fi 