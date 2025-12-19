#!/bin/bash

echo "=========================================="
echo "初始化 Git 仓库并准备推送到 GitHub"
echo "=========================================="

# 检查是否已安装 git
if ! command -v git &> /dev/null; then
    echo "错误: 未安装 Git"
    echo "请先安装 Git: https://git-scm.com/downloads"
    exit 1
fi

# 初始化 git 仓库
if [ ! -d .git ]; then
    echo "正在初始化 Git 仓库..."
    git init
    echo "✓ Git 仓库初始化完成"
else
    echo "✓ Git 仓库已存在"
fi

# 添加所有文件
echo "正在添加文件..."
git add .

# 创建初始提交
echo "正在创建提交..."
git commit -m "Initial commit: 硅宝项目 - 完整的静态网站项目"

echo ""
echo "=========================================="
echo "Git 仓库准备完成！"
echo "=========================================="
echo ""
echo "接下来请按以下步骤操作："
echo ""
echo "1. 在 GitHub 上创建新仓库："
echo "   - 访问 https://github.com/new"
echo "   - 输入仓库名称（例如：siliconbom）"
echo "   - 选择 Public 或 Private"
echo "   - 不要勾选 'Initialize this repository with a README'"
echo "   - 点击 'Create repository'"
echo ""
echo "2. 连接本地仓库到 GitHub（替换 YOUR_USERNAME 和 REPO_NAME）："
echo "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo ""
echo "3. 推送到 GitHub："
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "或者，如果你想使用 SSH（如果已配置SSH密钥）："
echo "   git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git"
echo "   git push -u origin main"
echo ""

