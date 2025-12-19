/**
 * 项目项菜单功能（会话列表的重命名和删除）
 */
(function() {
    function initProjectItemMenu() {
        const projectItems = document.querySelectorAll('.project-item');
        let currentOpenMenu = null;

        // 计算并设置菜单位置
        function setMenuPosition(menu, item) {
            const itemRect = item.getBoundingClientRect();
            const menuWidth = 120; // 菜单宽度
            const menuHeight = 80; // 估算菜单高度

            // 计算位置：在项目项的右侧，垂直居中
            const left = itemRect.right - menuWidth - 8;
            const top = itemRect.top + (itemRect.height / 2) - (menuHeight / 2);

            menu.style.left = left + 'px';
            menu.style.top = top + 'px';
        }

        projectItems.forEach(function(item) {
            const moreBtn = item.querySelector('.project-item-more');
            const menu = item.querySelector('.project-item-menu');

            if (moreBtn && menu) {
                // 点击三个点按钮，显示/隐藏菜单
                moreBtn.addEventListener('click', function(e) {
                    e.stopPropagation();

                    // 如果当前菜单已打开，则关闭它
                    if (currentOpenMenu === menu) {
                        menu.classList.remove('show');
                        currentOpenMenu = null;
                    } else {
                        // 关闭其他已打开的菜单
                        if (currentOpenMenu) {
                            currentOpenMenu.classList.remove('show');
                        }
                        // 计算并设置位置
                        setMenuPosition(menu, item);
                        // 打开当前菜单
                        menu.classList.add('show');
                        currentOpenMenu = menu;
                    }
                });
            }
        });

        // 点击页面其他地方时关闭菜单
        document.addEventListener('click', function(e) {
            if (currentOpenMenu && !currentOpenMenu.contains(e.target)) {
                const moreBtn = currentOpenMenu.parentElement.querySelector('.project-item-more');
                if (moreBtn && !moreBtn.contains(e.target)) {
                    currentOpenMenu.classList.remove('show');
                    currentOpenMenu = null;
                }
            }
        });

        // 滚动时重新计算菜单位置
        const projectList = document.getElementById('projectList');
        if (projectList) {
            projectList.addEventListener('scroll', function() {
                if (currentOpenMenu) {
                    const item = currentOpenMenu.parentElement;
                    setMenuPosition(currentOpenMenu, item);
                }
            });
        }

        // 处理重命名和删除操作
        document.querySelectorAll('.project-item-menu-item').forEach(menuItem => {
            menuItem.addEventListener('click', function(e) {
                e.stopPropagation();
                const item = this.closest('.project-item');
                const itemText = item.querySelector('.project-item-text');
                const action = this.classList.contains('rename') ? 'rename' : 'delete';

                if (action === 'rename') {
                    handleRename(item, itemText);
                } else if (action === 'delete') {
                    handleDelete(item);
                }

                // 关闭菜单
                if (currentOpenMenu) {
                    currentOpenMenu.classList.remove('show');
                    currentOpenMenu = null;
                }
            });
        });
    }

    // 处理重命名
    function handleRename(item, textElement) {
        const oldText = textElement.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = oldText;
        input.style.cssText = 'width: 100%; padding: 4px 8px; border: 1px solid var(--trace-active); border-radius: 4px; font-size: 13px; background: #fff;';
        
        textElement.textContent = '';
        textElement.appendChild(input);
        input.focus();
        input.select();

        function finishRename() {
            const newText = input.value.trim() || oldText;
            textElement.textContent = newText;
            if (window.showToast) {
                window.showToast('重命名成功');
            }
        }

        input.addEventListener('blur', finishRename);
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                finishRename();
            } else if (e.key === 'Escape') {
                textElement.textContent = oldText;
            }
        });
    }

    // 处理删除
    function handleDelete(item) {
        const itemText = item.querySelector('.project-item-text').textContent;
        
        if (window.showConfirm) {
            window.showConfirm(`确定要删除 "${itemText}" 吗？`, function() {
                item.remove();
                if (window.showToast) {
                    window.showToast('已删除');
                }
            });
        } else {
            if (confirm(`确定要删除 "${itemText}" 吗？`)) {
                item.remove();
                if (window.showToast) {
                    window.showToast('已删除');
                }
            }
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectItemMenu);
    } else {
        initProjectItemMenu();
    }
})();

