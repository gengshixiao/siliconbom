/**
 * 登录状态管理
 */
const Auth = {
    // 保存原始会话列表HTML
    originalProjectListHTML: null,

    // 检查是否已登录
    isLoggedIn: function() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    // 设置登录状态
    setLoggedIn: function(value) {
        localStorage.setItem('isLoggedIn', value ? 'true' : 'false');
        this.updateUI();
    },

    // 更新UI显示
    updateUI: function() {
        const isLoggedIn = this.isLoggedIn();
        const userBlock = document.getElementById('userBlock');
        const loginButton = document.getElementById('loginButton');
        
        if (userBlock) {
            userBlock.style.display = isLoggedIn ? 'flex' : 'none';
        }
        
        if (loginButton) {
            loginButton.style.display = isLoggedIn ? 'none' : 'block';
        }

        // 如果未登录，清空会话列表并隐藏查看全部按钮
        if (!isLoggedIn) {
            this.clearConversationList();
            this.hideViewAllButton();
            this.hideUserAvatar();
        } else {
            // 登录后，恢复会话列表并显示查看全部按钮
            this.restoreConversationList();
            this.showViewAllButton();
            this.showUserAvatar();
        }
    },

    // 隐藏查看全部按钮
    hideViewAllButton: function() {
        const viewAllBtn = document.getElementById('viewAllProjects');
        if (viewAllBtn) {
            viewAllBtn.style.display = 'none';
        }
    },

    // 显示查看全部按钮
    showViewAllButton: function() {
        const viewAllBtn = document.getElementById('viewAllProjects');
        if (viewAllBtn) {
            viewAllBtn.style.display = '';
        }
    },

    // 隐藏用户头像（未登录时）- header中的头像始终隐藏，底部user-block会自动处理
    hideUserAvatar: function() {
        const userAvatar = document.querySelector('.user-avatar-header');
        if (userAvatar) {
            userAvatar.setAttribute('data-logged-out', 'true');
            userAvatar.style.display = 'none';
        }
    },

    // 显示用户头像（登录时）- header中的头像始终隐藏，底部user-block会自动处理
    showUserAvatar: function() {
        const userAvatar = document.querySelector('.user-avatar-header');
        if (userAvatar) {
            userAvatar.removeAttribute('data-logged-out');
            // header中的头像始终隐藏，收起时底部user-block会自动显示user-avatar图标
            userAvatar.style.display = 'none';
        }
    },

    // 初始化时检查侧边栏状态并更新头像
    initAvatarState: function() {
        // header中的user-avatar-header始终隐藏，底部user-block会根据登录状态自动显示/隐藏
        // 不需要额外处理
    },

    // 保存原始会话列表HTML
    saveOriginalProjectList: function() {
        const projectList = document.getElementById('projectList');
        if (projectList && !this.originalProjectListHTML) {
            this.originalProjectListHTML = projectList.innerHTML;
        }
    },

    // 清空会话列表
    clearConversationList: function() {
        // 先保存原始HTML（如果还没有保存）
        this.saveOriginalProjectList();

        // 清空会话列表页面（conversation-list.html）
        const conversationList = document.getElementById('conversationList');
        if (conversationList) {
            conversationList.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <div class="empty-state-title">请先登录</div>
                    <div class="empty-state-description">登录后即可查看您的会话记录</div>
                </div>
            `;
        }

        // 清空主页侧边栏的项目列表（index.html）
        const projectList = document.getElementById('projectList');
        if (projectList) {
            projectList.innerHTML = `
                <div class="empty-state" style="padding: 40px 20px; text-align: center; color: #94A3B8;">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; margin: 0 auto 16px; opacity: 0.5;">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">请先登录</div>
                    <div style="font-size: 12px; opacity: 0.8;">登录后即可查看您的会话记录</div>
                </div>
            `;
        }
    },

    // 恢复会话列表
    restoreConversationList: function() {
        // 恢复会话列表页面（conversation-list.html）- 如果有全局函数则调用
        if (window.renderConversations) {
            window.renderConversations();
        }

        // 恢复主页侧边栏的项目列表（index.html）
        const projectList = document.getElementById('projectList');
        if (projectList && this.originalProjectListHTML) {
            projectList.innerHTML = this.originalProjectListHTML;
        }
    },

    // 登出
    logout: function() {
        this.setLoggedIn(false);
        // 退出登录后跳转到首页
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();
        // 如果不在首页，则跳转到首页
        if (fileName !== 'index.html' && fileName !== '' && fileName !== '/') {
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            window.location.href = basePath + 'index.html';
        }
    }
};

// 初始化登录按钮点击事件
function initLoginButton() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        const loginBtn = loginButton.querySelector('.login-btn-sidebar');
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.openLoginModal) {
                    window.openLoginModal();
                }
            });
        }
    }
}

// 页面加载时更新UI和绑定事件
function initAuth() {
    // 先保存原始会话列表HTML（无论是否登录都要保存，以便登录后恢复）
    Auth.saveOriginalProjectList();
    
    Auth.updateUI();
    initLoginButton();
    Auth.initAvatarState();
    
    // 监听侧边栏折叠事件（底部user-block会自动处理显示，不需要额外处理）
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

