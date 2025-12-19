#!/bin/bash

echo "=========================================="
echo "检查 Git 状态"
echo "=========================================="

echo ""
echo "1. 检查 Git 仓库状态:"
git status

echo ""
echo "2. 检查提交记录:"
git log --oneline -5

echo ""
echo "3. 检查远程仓库配置:"
git remote -v

echo ""
echo "4. 检查分支:"
git branch -a

echo ""
echo "5. 尝试查看push错误（如果有）:"
git push -u origin main 2>&1

