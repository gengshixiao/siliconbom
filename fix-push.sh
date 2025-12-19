#!/bin/bash

echo "=========================================="
echo "修复并推送代码到 GitHub"
echo "=========================================="

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "错误: 请在项目根目录执行此脚本"
    exit 1
fi

# 确保git已初始化
if [ ! -d ".git" ]; then
    echo "正在初始化 Git 仓库..."
    git init
fi

# 添加远程仓库（如果不存在）
if ! git remote | grep -q origin; then
    echo "正在添加远程仓库..."
    git remote add origin https://github.com/gengshixiao/siliconbom.git
else
    echo "正在更新远程仓库地址..."
    git remote set-url origin https://github.com/gengshixiao/siliconbom.git
fi

# 添加所有文件
echo "正在添加文件..."
git add .

# 检查是否有更改需要提交
if git diff --cached --quiet; then
    echo "提示: 没有新的更改需要提交"
    if [ -z "$(git log --oneline -1 2>/dev/null)" ]; then
        echo "错误: 没有任何提交记录！"
        echo "正在创建初始提交..."
        git commit -m "Initial commit: 硅宝项目"
    else
        echo "已有提交记录，跳过提交步骤"
    fi
else
    echo "正在创建提交..."
    git commit -m "Initial commit: 硅宝项目"
fi

# 设置主分支
git branch -M main

# 显示当前状态
echo ""
echo "当前Git状态:"
git status
echo ""
echo "提交记录:"
git log --oneline -3
echo ""

# 推送到GitHub
echo "正在推送到 GitHub..."
echo "如果提示输入用户名，请输入: gengshixiao"
echo "如果提示输入密码，请输入你的 GitHub Personal Access Token"
echo ""
echo "（如果没有Token，访问: https://github.com/settings/tokens）"
echo ""

# 尝试push
if git push -u origin main 2>&1; then
    echo ""
    echo "=========================================="
    echo "✓ 成功！代码已推送到 GitHub"
    echo "=========================================="
    echo "访问: https://github.com/gengshixiao/siliconbom"
else
    echo ""
    echo "=========================================="
    echo "✗ Push 失败"
    echo "=========================================="
    echo ""
    echo "可能的原因："
    echo "1. 需要GitHub认证（用户名/密码或Token）"
    echo "2. 网络问题"
    echo ""
    echo "解决方案："
    echo "1. 创建 Personal Access Token:"
    echo "   https://github.com/settings/tokens"
    echo "   选择 'Generate new token (classic)'"
    echo "   勾选 'repo' 权限，生成后复制token"
    echo ""
    echo "2. 使用SSH方式（如果已配置SSH密钥）:"
    echo "   git remote set-url origin git@github.com:gengshixiao/siliconbom.git"
    echo "   git push -u origin main"
    echo ""
fi

