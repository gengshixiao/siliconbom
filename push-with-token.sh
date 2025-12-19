#!/bin/bash

# GitHub Personal Access Token
GITHUB_TOKEN="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"
GITHUB_USER="gengshixiao"
REPO_NAME="siliconbom"

echo "=========================================="
echo "使用Token推送代码到GitHub"
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

# 添加所有文件
echo "添加文件..."
git add .

# 创建提交（如果没有提交）
if [ -z "$(git log --oneline -1 2>/dev/null)" ] || ! git diff --cached --quiet; then
    echo "创建提交..."
    git commit -m "Initial commit: 硅宝项目"
fi

# 配置远程仓库（使用token）
echo "配置远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git

# 设置主分支
git branch -M main

# 推送到GitHub
echo "推送到GitHub..."
if git push -u origin main; then
    echo ""
    echo "=========================================="
    echo "✓ 成功！代码已推送到 GitHub"
    echo "=========================================="
    echo ""
    echo "访问: https://github.com/gengshixiao/siliconbom"
    echo ""
    echo "注意: 出于安全考虑，建议从脚本中删除token，"
    echo "      并使用 git credential helper 存储凭据"
else
    echo ""
    echo "✗ Push 失败，请检查错误信息"
fi

