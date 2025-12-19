#!/bin/bash

# GitHub Personal Access Token
GITHUB_TOKEN="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"
GITHUB_USER="gengshixiao"
REPO_NAME="siliconbom"

echo "=========================================="
echo "完整设置并推送代码到GitHub"
echo "=========================================="

cd /Users/geng/Downloads/硅宝

# 检查git是否已安装
if ! command -v git &> /dev/null; then
    echo "错误: Git 未安装"
    exit 1
fi

# 配置Git用户信息（如果还没配置）
echo "配置Git用户信息..."
if [ -z "$(git config --global user.email 2>/dev/null)" ]; then
    git config --global user.email "gengshixiao@users.noreply.github.com"
    echo "✓ 已设置邮箱: gengshixiao@users.noreply.github.com"
fi

if [ -z "$(git config --global user.name 2>/dev/null)" ]; then
    git config --global user.name "gengshixiao"
    echo "✓ 已设置用户名: gengshixiao"
fi

# 显示当前配置
echo ""
echo "当前Git配置:"
echo "  用户名: $(git config --global user.name)"
echo "  邮箱: $(git config --global user.email)"

# 初始化Git仓库（如果需要）
if [ ! -d ".git" ]; then
    echo ""
    echo "初始化Git仓库..."
    git init
fi

# 添加所有文件
echo ""
echo "添加所有文件..."
git add .

# 检查是否有文件要提交
echo ""
echo "检查文件状态..."
if git diff --cached --quiet && [ -n "$(git log --oneline -1 2>/dev/null)" ]; then
    echo "提示: 没有新文件，已有提交记录"
else
    echo "创建提交..."
    git commit -m "Initial commit: 硅宝项目"
    echo "✓ 提交创建成功"
fi

# 确认有提交记录
if [ -z "$(git log --oneline -1 2>/dev/null)" ]; then
    echo ""
    echo "错误: 仍然没有提交记录！"
    echo "检查文件列表:"
    git status
    exit 1
fi

# 确保在main分支
echo ""
echo "检查分支..."
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ -z "$CURRENT_BRANCH" ]; then
    git checkout -b main
    echo "✓ 创建并切换到main分支"
elif [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
    echo "✓ 重命名为main分支"
else
    echo "✓ 已在main分支"
fi

# 配置远程仓库（使用token）
echo ""
echo "配置远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git

# 最终检查
echo ""
echo "最终检查:"
echo "  分支: $(git branch --show-current)"
echo "  提交: $(git log --oneline -1)"
echo "  远程: $(git remote get-url origin)"

# 推送到GitHub
echo ""
echo "=========================================="
echo "推送到GitHub..."
echo "=========================================="
if git push -u origin main; then
    echo ""
    echo "=========================================="
    echo "✓ 成功！代码已推送到 GitHub"
    echo "=========================================="
    echo ""
    echo "访问: https://github.com/gengshixiao/siliconbom"
    echo ""
else
    echo ""
    echo "=========================================="
    echo "✗ Push 失败"
    echo "=========================================="
    echo ""
    echo "请检查错误信息"
    exit 1
fi

