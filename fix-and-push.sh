#!/bin/bash

# GitHub Personal Access Token
GITHUB_TOKEN="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"
GITHUB_USER="gengshixiao"
REPO_NAME="siliconbom"

echo "=========================================="
echo "修复并推送代码到GitHub"
echo "=========================================="

cd /Users/geng/Downloads/硅宝

# 检查git是否已安装
if ! command -v git &> /dev/null; then
    echo "错误: Git 未安装"
    exit 1
fi

# 初始化Git仓库（如果需要）
if [ ! -d ".git" ]; then
    echo "初始化Git仓库..."
    git init
fi

# 显示当前状态
echo ""
echo "当前Git状态:"
git status

echo ""
echo "检查分支:"
git branch -a

echo ""
echo "检查提交记录:"
git log --oneline -5 2>/dev/null || echo "（暂无提交记录）"

# 添加所有文件
echo ""
echo "添加所有文件..."
git add .

# 检查是否有文件要提交
if git diff --cached --quiet; then
    echo "提示: 暂存区没有新文件"
    if [ -z "$(git log --oneline -1 2>/dev/null)" ]; then
        echo "错误: 没有任何提交记录！"
        echo "正在创建初始提交..."
        git commit -m "Initial commit: 硅宝项目"
    fi
else
    echo "创建提交..."
    git commit -m "Initial commit: 硅宝项目"
fi

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
echo ""
echo "当前分支: ${CURRENT_BRANCH:-（无）}"

# 确保有提交记录
if [ -z "$(git log --oneline -1 2>/dev/null)" ]; then
    echo "错误: 仍然没有提交记录，无法推送"
    exit 1
fi

# 重命名为main分支（如果需要）
if [ "$CURRENT_BRANCH" != "main" ] && [ -n "$CURRENT_BRANCH" ]; then
    echo "重命名分支为 main..."
    git branch -M main
elif [ -z "$CURRENT_BRANCH" ]; then
    # 如果没有分支，创建一个
    git checkout -b main
fi

# 配置远程仓库（使用token）
echo ""
echo "配置远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git

# 再次检查
echo ""
echo "最终检查:"
echo "分支: $(git branch --show-current)"
echo "提交: $(git log --oneline -1)"
echo "远程: $(git remote -v | grep origin)"

# 推送到GitHub
echo ""
echo "推送到GitHub..."
if git push -u origin main; then
    echo ""
    echo "=========================================="
    echo "✓ 成功！代码已推送到 GitHub"
    echo "=========================================="
    echo ""
    echo "访问: https://github.com/gengshixiao/siliconbom"
else
    echo ""
    echo "=========================================="
    echo "✗ Push 失败"
    echo "=========================================="
    echo ""
    echo "请检查："
    echo "1. 是否有提交记录: git log"
    echo "2. 当前分支: git branch"
    echo "3. 远程配置: git remote -v"
fi

