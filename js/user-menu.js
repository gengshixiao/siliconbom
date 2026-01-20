/**
 * 个人中心菜单功能
 */
(function() {
    let userMenuPopup = null;
    let languageSelector = null;
    let isMenuOpen = false;
    let currentLanguage = 'zh-CN';

    // 语言文本
    const texts = {
        'zh-CN': {
            settings: '个人设置',
            language: 'Language',
            feedback: '提交反馈',
            logout: '退出登录'
        },
        'en-US': {
            settings: 'Settings',
            language: 'Language',
            feedback: 'Feedback',
            logout: 'Logout'
        },
        'ja-JP': {
            settings: '個人設定',
            language: '言語',
            feedback: 'フィードバック',
            logout: 'ログアウト'
        }
    };

    // 创建语言选择器
    function createLanguageSelector() {
        if (languageSelector) return languageSelector;

        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.id = 'languageSelector';
        selector.innerHTML = `
            <div class="language-option selected" data-lang="zh-CN">
                <span class="language-option-name">中文</span>
                <span class="language-check">✓</span>
            </div>
            <div class="language-option disabled" data-lang="en-US">
                <span class="language-option-name">English</span>
                <span class="language-check">✓</span>
            </div>
            <div class="language-option disabled" data-lang="ja-JP">
                <span class="language-option-name">日本語</span>
                <span class="language-check">✓</span>
            </div>
        `;
        document.body.appendChild(selector);
        languageSelector = selector;
        initLanguageSelectorEvents();
        return selector;
    }

    function initLanguageSelectorEvents() {
        const languageOptions = languageSelector.querySelectorAll('.language-option');
        
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const lang = this.getAttribute('data-lang');
                
                // 如果语言选项被禁用，不执行任何操作
                if (this.classList.contains('disabled')) {
                    return;
                }
                
                updateLanguage(lang);
                languageSelector.classList.remove('show');
            });
        });
    }

    // 更新语言
    function updateLanguage(lang) {
        currentLanguage = lang;
        const langTexts = texts[lang];
        
        if (userMenuPopup) {
            const settingsItem = userMenuPopup.querySelector('[data-action="settings"] span:last-child');
            const languageItem = userMenuPopup.querySelector('[data-action="language"] span:last-child');
            const feedbackItem = userMenuPopup.querySelector('[data-action="feedback"] span:last-child');
            const logoutItem = userMenuPopup.querySelector('[data-action="logout"] span:last-child');
            
            if (settingsItem) settingsItem.textContent = langTexts.settings;
            if (languageItem) languageItem.textContent = langTexts.language;
            if (feedbackItem) feedbackItem.textContent = langTexts.feedback;
            if (logoutItem) logoutItem.textContent = langTexts.logout;
        }
        
        if (languageSelector) {
            const languageOptions = languageSelector.querySelectorAll('.language-option');
            languageOptions.forEach(option => {
                option.classList.remove('selected');
                if (option.getAttribute('data-lang') === lang) {
                    option.classList.add('selected');
                }
            });
        }
    }

    // 创建个人中心菜单
    function createUserMenu() {
        if (userMenuPopup) return userMenuPopup;

        const menu = document.createElement('div');
        menu.className = 'user-menu-popup';
        menu.id = 'userMenuPopup';
        
        // 创建菜单项 - 使用 onclick 直接绑定
        const settingsItem = document.createElement('div');
        settingsItem.className = 'user-menu-item';
        settingsItem.innerHTML = '<span class="user-menu-item-icon">⚙️</span><span>个人设置</span>';
        settingsItem.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            closeUserMenu();
            setTimeout(function() {
                window.openSettingsModal();
            }, 50);
        };
        settingsItem.style.cursor = 'pointer';
        
        const languageItem = document.createElement('div');
        languageItem.className = 'user-menu-item';
        languageItem.id = 'languageMenuItem';
        languageItem.innerHTML = '<span class="user-menu-item-icon">🌐</span><span>Language</span>';
        
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'user-menu-item';
        feedbackItem.innerHTML = '<span class="user-menu-item-icon">💬</span><span>提交反馈</span>';
        feedbackItem.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            closeUserMenu();
            setTimeout(function() {
                window.openFeedbackModal();
            }, 50);
        };
        feedbackItem.style.cursor = 'pointer';
        
        const logoutItem = document.createElement('div');
        logoutItem.className = 'user-menu-item';
        logoutItem.innerHTML = '<span class="user-menu-item-icon">🚪</span><span>退出登录</span>';
        logoutItem.onclick = function(e) {
            e.stopPropagation();
            if (confirm('确定要退出登录吗？')) {
                Auth.logout();
                closeUserMenu();
            }
        };
        
        menu.appendChild(settingsItem);
        menu.appendChild(languageItem);
        menu.appendChild(feedbackItem);
        menu.appendChild(logoutItem);
        
        document.body.appendChild(menu);
        userMenuPopup = menu;
        initUserMenuEvents();
        return menu;
    }

    // 初始化菜单事件
    function initUserMenuEvents() {
        if (!userMenuPopup) return;
        
        const languageMenuItem = userMenuPopup.querySelector('#languageMenuItem');
        
        // 语言菜单项悬浮事件
        if (languageMenuItem) {
            languageMenuItem.addEventListener('mouseenter', function() {
                if (isMenuOpen) {
                    createLanguageSelector();
                    const menuRect = userMenuPopup.getBoundingClientRect();
                    const itemRect = languageMenuItem.getBoundingClientRect();
                    
                    languageSelector.style.left = (menuRect.right + 8) + 'px';
                    languageSelector.style.top = itemRect.top + 'px';
                    languageSelector.classList.add('show');
                }
            });

            languageMenuItem.addEventListener('mouseleave', function(e) {
                if (languageSelector && !languageSelector.contains(e.relatedTarget)) {
                    languageSelector.classList.remove('show');
                }
            });
        }

        // 语言选择器悬浮事件
        if (languageSelector) {
            languageSelector.addEventListener('mouseenter', function() {
                languageSelector.classList.add('show');
            });

            languageSelector.addEventListener('mouseleave', function() {
                languageSelector.classList.remove('show');
            });
        }
    }

    // 显示菜单
    function showUserMenu() {
        if (!Auth.isLoggedIn()) {
            // 未登录时打开登录弹窗
            if (window.openLoginModal) {
                window.openLoginModal();
            }
            return;
        }

        createUserMenu();
        const userBlock = document.getElementById('userBlock');
        if (userBlock) {
            const rect = userBlock.getBoundingClientRect();
            userMenuPopup.style.left = rect.left + 'px';
            userMenuPopup.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
        }
        userMenuPopup.classList.add('show');
        isMenuOpen = true;
    }

    // 关闭菜单
    function closeUserMenu() {
        if (userMenuPopup) {
            userMenuPopup.classList.remove('show');
            isMenuOpen = false;
        }
        if (languageSelector) {
            languageSelector.classList.remove('show');
        }
    }

    // 点击用户区域
    function initUserBlockClick() {
        // 使用事件委托，确保即使元素是动态显示的也能正常工作
        const sidebarUnit = document.getElementById('sidebarUnit');
        if (sidebarUnit) {
            // 移除之前可能存在的监听器，避免重复绑定
            sidebarUnit.removeEventListener('click', handleUserBlockClick);
            sidebarUnit.addEventListener('click', handleUserBlockClick);
        }

        // 点击登录按钮
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            // 移除之前可能存在的监听器
            loginButton.removeEventListener('click', handleLoginButtonClick);
            loginButton.addEventListener('click', handleLoginButtonClick);
        }
    }

    // 处理用户区域点击事件
    function handleUserBlockClick(e) {
        const userBlock = document.getElementById('userBlock');
        if (userBlock && userBlock.contains(e.target)) {
            e.stopPropagation();
            if (isMenuOpen) {
                closeUserMenu();
            } else {
                showUserMenu();
            }
        }
    }

    // 处理登录按钮点击事件
    function handleLoginButtonClick(e) {
        e.stopPropagation();
        if (window.openLoginModal) {
            window.openLoginModal();
        }
    }

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function(e) {
        if (isMenuOpen && userMenuPopup && !userMenuPopup.contains(e.target)) {
            const userBlock = document.getElementById('userBlock');
            if (userBlock && !userBlock.contains(e.target)) {
                if (languageSelector && !languageSelector.contains(e.target)) {
                    closeUserMenu();
                }
            }
        }
    });

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initUserBlockClick();
            createLanguageSelector();
        });
    } else {
        initUserBlockClick();
        createLanguageSelector();
    }

    // 暴露全局函数
    window.showUserMenu = showUserMenu;
    window.closeUserMenu = closeUserMenu;
})();
