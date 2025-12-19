#!/bin/bash

echo "=========================================="
echo "推送代码到 GitHub"
echo "=========================================="

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "错误: 请在项目根目录执行此脚本"
    exit 1
fi

# 检查git是否已初始化
if [ ! -d ".git" ]; then
    echo "正在初始化 Git 仓库..."
    git init
    echo "✓ Git 仓库初始化完成"
fi

# 添加所有文件
echo "正在添加文件..."
git add .

# 创建提交
echo "正在创建提交..."
git commit -m "Initial commit: 硅宝项目" || echo "提示: 如果没有更改，可能已经提交过了"

# 添加远程仓库
echo "正在添加远程仓库..."
git remote remove origin 2>/dev/null  # 如果已存在则删除
git remote add origin https://github.com/gengshixiao/siliconbom.git

# 设置主分支
git branch -M main

# 推送到GitHub
echo "正在推送到 GitHub..."
echo "注意: 如果提示输入用户名密码，请输入你的GitHub账号信息"
git push -u origin main

echo ""
echo "=========================================="
echo "完成！"
echo "=========================================="
echo "代码已推送到: https://github.com/gengshixiao/siliconbom"
echo ""

