#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 切换到 demo 目录
cd "$(dirname "$0")/.." || { echo -e "${RED}无法切换到 demo 目录${NC}"; exit 1; }

echo -e "${YELLOW}当前目录: $(pwd)${NC}"

# 停止所有容器
echo -e "${YELLOW}停止所有容器...${NC}"
docker-compose down
if [ $? -ne 0 ]; then
    echo -e "${RED}停止容器失败${NC}"
    exit 1
fi
echo -e "${GREEN}容器已停止${NC}"

# 重新构建前端
echo -e "${YELLOW}重新构建前端...${NC}"
docker-compose build frontend
BUILD_STATUS=$?
if [ $BUILD_STATUS -ne 0 ]; then
    echo -e "${RED}前端构建失败，错误代码: $BUILD_STATUS${NC}"
    echo -e "${YELLOW}显示 docker-compose 日志...${NC}"
    docker-compose logs frontend
    exit 1
fi
echo -e "${GREEN}前端构建成功${NC}"

# 启动所有容器
echo -e "${YELLOW}启动所有容器...${NC}"
docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}启动容器失败${NC}"
    echo -e "${YELLOW}显示 docker-compose 日志...${NC}"
    docker-compose logs
    exit 1
fi
echo -e "${GREEN}容器已启动${NC}"

# 检查前端容器是否正常运行
echo -e "${YELLOW}检查前端容器状态...${NC}"
sleep 5 # 等待容器启动
FRONTEND_STATUS=$(docker-compose ps frontend | grep "Up" | wc -l)
if [ "$FRONTEND_STATUS" -eq 0 ]; then
    echo -e "${RED}前端容器未正常运行${NC}"
    echo -e "${YELLOW}显示前端容器日志...${NC}"
    docker-compose logs frontend
    exit 1
fi

echo -e "${GREEN}前端重建完成并成功运行！${NC}"
echo -e "${YELLOW}前端容器日志:${NC}"
docker-compose logs --tail=20 frontend

exit 0