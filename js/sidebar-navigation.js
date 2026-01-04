/**
 * 侧边栏导航功能
 */
(function() {
    // 菜单项点击事件 - 根据当前页面路径自动调整
    function getBasePath() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop();
        // 如果在pages目录下，需要返回上一级
        if (path.includes('/pages/')) {
            return '../';
        }
        return './';
    }

    const basePath = getBasePath();
    const menuItems = {
        newProject: basePath + 'index.html',
        bomArchive: basePath + 'bom-archive.html',
        knowledgeBase: basePath + 'knowledge-base.html',
        viewAllProjects: basePath + 'conversation-list.html'
    };

    // 初始化导航
    function initNavigation() {
        // 新建会话
        const newProjectBtn = document.getElementById('newProject');
        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', function() {
                window.location.href = menuItems.newProject;
            });
        }

        // BOM档案
        const bomArchiveBtn = document.getElementById('bomArchive');
        if (bomArchiveBtn) {
            bomArchiveBtn.addEventListener('click', function() {
                window.location.href = menuItems.bomArchive;
            });
        }

        // 知识库
        const knowledgeBaseBtn = document.getElementById('knowledgeBase');
        if (knowledgeBaseBtn) {
            knowledgeBaseBtn.addEventListener('click', function() {
                window.location.href = menuItems.knowledgeBase;
            });
        }

        // 查看全部会话
        const viewAllProjectsBtn = document.getElementById('viewAllProjects');
        if (viewAllProjectsBtn) {
            viewAllProjectsBtn.addEventListener('click', function() {
                window.location.href = menuItems.viewAllProjects;
            });
        }

        // 搜索框快捷键
        const searchInput = document.getElementById('sidebarSearchInput');
        if (searchInput) {
            document.addEventListener('keydown', function(e) {
                // ⌘ + K 或 Ctrl + K
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
})();

