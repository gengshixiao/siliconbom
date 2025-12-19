#!/bin/bash

echo "=========================================="
echo "推送代码到 GitHub"
echo "=========================================="

# 进入项目目录
cd /Users/geng/Downloads/硅宝

# 检查git是否已安装
if ! command -v git &> /dev/null; then
    echo "错误: Git 未安装，请先安装 Git"
    exit 1
fi

echo ""
echo "第一步: 初始化Git仓库..."
if [ ! -d ".git" ]; then
    git init
    echo "✓ Git仓库初始化完成"
else
    echo "✓ Git仓库已存在"
fi

echo ""
echo "第二步: 添加文件..."
git add .
echo "✓ 文件已添加"

echo ""
echo "第三步: 创建提交..."
if git diff --cached --quiet && [ -n "$(git log --oneline -1 2>/dev/null)" ]; then
    echo "提示: 没有新更改，已有提交记录"
else
    git commit -m "Initial commit: 硅宝项目"
    echo "✓ 提交创建完成"
fi

echo ""
echo "第四步: 配置远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/gengshixiao/siliconbom.git
echo "✓ 远程仓库配置完成"

echo ""
echo "第五步: 设置主分支..."
git branch -M main
echo "✓ 分支设置完成"

echo ""
echo "第六步: 推送到GitHub..."
echo "----------------------------------------"
echo "提示: 如果提示输入用户名，请输入: gengshixiao"
echo "提示: 如果提示输入密码，请输入你的 GitHub Personal Access Token"
echo "      （不是GitHub密码！需要去 https://github.com/settings/tokens 创建）"
echo "----------------------------------------"
echo ""

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
    echo "常见问题："
    echo "1. 需要GitHub认证 - 请创建 Personal Access Token"
    echo "2. 如果已配置SSH密钥，可以使用SSH方式："
    echo "   git remote set-url origin git@github.com:gengshixiao/siliconbom.git"
    echo "   git push -u origin main"
fi

