/**
 * 登录状态管理
 */
const Auth = {
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
    },

    // 登出
    logout: function() {
        this.setLoggedIn(false);
        // 可以在这里添加其他清理逻辑
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
    Auth.updateUI();
    initLoginButton();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

