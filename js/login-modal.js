/**
 * 登录弹窗功能
 */
(function() {
    // 固定账号密码（用于演示）
    const DEMO_ACCOUNT = {
        phone: '18100617218',
        password: '123456',
        smsCode: '123456'
    };

    let loginModal = null;
    let currentTab = 'sms';

    // 创建登录弹窗HTML
    function createLoginModal() {
        if (loginModal) return loginModal;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'loginModal';
        modal.innerHTML = `
            <div class="login-modal">
                <button class="close-btn" id="loginCloseBtn">×</button>
                <div class="login-header">
                    <div class="logo-container">
                        <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/f4f1acead1b2b1cfc74946089e643749.png" alt="硅宝 Logo" class="logo">
                    </div>
                    <h1 class="welcome-title">欢迎使用硅宝</h1>
                </div>
                <div class="login-content">
                    <div class="login-left">
                        <div class="tab-container">
                            <button class="tab active" data-tab="sms">短信登录</button>
                            <button class="tab" data-tab="account">账号登录</button>
                        </div>
                        <!-- 短信登录表单 -->
                        <div id="smsForm" class="form-panel active">
                            <div class="form-group">
                                <input type="tel" class="form-input" id="smsPhone" placeholder="请输入手机号" value="${DEMO_ACCOUNT.phone}">
                            </div>
                            <div class="form-group">
                                <div class="verification-wrapper">
                                    <input type="text" class="form-input" id="smsCode" placeholder="请输入验证码">
                                    <button class="get-code-btn" id="getSmsCode">获取验证码</button>
                                </div>
                            </div>
                            <button class="login-btn" id="smsLoginBtn">登录</button>
                        </div>
                        <!-- 账号登录表单 -->
                        <div id="accountForm" class="form-panel">
                            <div class="form-group">
                                <input type="text" class="form-input" id="accountPhone" placeholder="请输入手机号/账号" value="${DEMO_ACCOUNT.phone}">
                            </div>
                            <div class="form-group">
                                <div class="input-wrapper">
                                    <input type="password" class="form-input" id="accountPassword" placeholder="请输入密码" value="${DEMO_ACCOUNT.password}">
                                    <button class="password-toggle" id="togglePassword" type="button">👁</button>
                                </div>
                            </div>
                            <button class="login-btn" id="accountLoginBtn">登录</button>
                        </div>
                    </div>
                    <div class="login-right">
                        <div style="font-size: 16px; font-weight: 600; color: #0F172A; margin-bottom: 20px; text-align: center;">微信扫码登录</div>
                        <div style="width: 200px; height: 200px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 16px; background: #F8FAFC; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/c455a13364e4e34dda5337633114e0fd.png" alt="微信登录二维码" style="width: 100%; height: 100%; object-fit: contain;">
                        </div>
                    </div>
                </div>
                <div class="agreement">
                    <input type="checkbox" id="agreementCheck" checked>
                    <div>我已阅读并同意<a href="#" style="color: var(--link-color);">《服务条款》</a>和<a href="#" style="color: var(--link-color);">《隐私政策》</a></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        loginModal = modal;
        initLoginModalEvents();
        return modal;
    }

    // 初始化登录弹窗事件
    function initLoginModalEvents() {
        // Tab切换
        const tabs = loginModal.querySelectorAll('.tab');
        const formPanels = loginModal.querySelectorAll('.form-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                currentTab = targetTab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                formPanels.forEach(panel => panel.classList.remove('active'));
                if (targetTab === 'sms') {
                    loginModal.querySelector('#smsForm').classList.add('active');
                } else {
                    loginModal.querySelector('#accountForm').classList.add('active');
                }
            });
        });

        // 密码显示/隐藏
        const togglePassword = loginModal.querySelector('#togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const input = loginModal.querySelector('#accountPassword');
                if (input.type === 'password') {
                    input.type = 'text';
                    togglePassword.textContent = '👁️‍🗨️';
                } else {
                    input.type = 'password';
                    togglePassword.textContent = '👁';
                }
            });
        }

        // 获取验证码
        const getSmsCodeBtn = loginModal.querySelector('#getSmsCode');
        if (getSmsCodeBtn) {
            let countdown = 0;
            getSmsCodeBtn.addEventListener('click', () => {
                if (countdown > 0) return;
                
                countdown = 60;
                getSmsCodeBtn.disabled = true;
                
                const timer = setInterval(() => {
                    getSmsCodeBtn.textContent = `${countdown}秒后重试`;
                    countdown--;
                    
                    if (countdown < 0) {
                        clearInterval(timer);
                        getSmsCodeBtn.disabled = false;
                        getSmsCodeBtn.textContent = '获取验证码';
                    }
                }, 1000);
            });
        }

        // 登录按钮
        const smsLoginBtn = loginModal.querySelector('#smsLoginBtn');
        const accountLoginBtn = loginModal.querySelector('#accountLoginBtn');

        if (smsLoginBtn) {
            smsLoginBtn.addEventListener('click', () => {
                const phone = loginModal.querySelector('#smsPhone').value;
                const code = loginModal.querySelector('#smsCode').value;
                const agreed = loginModal.querySelector('#agreementCheck').checked;
                
                if (!phone || !code) {
                    alert('请填写完整信息');
                    return;
                }
                if (!agreed) {
                    alert('请先同意服务条款和隐私政策');
                    return;
                }
                
                // 模拟登录验证
                if (phone === DEMO_ACCOUNT.phone && code === DEMO_ACCOUNT.smsCode) {
                    Auth.setLoggedIn(true);
                    closeLoginModal();
                    alert('登录成功！');
                } else {
                    alert('手机号或验证码错误\n演示账号：手机号 ' + DEMO_ACCOUNT.phone + '，验证码 ' + DEMO_ACCOUNT.smsCode);
                }
            });
        }

        if (accountLoginBtn) {
            accountLoginBtn.addEventListener('click', () => {
                const phone = loginModal.querySelector('#accountPhone').value;
                const password = loginModal.querySelector('#accountPassword').value;
                const agreed = loginModal.querySelector('#agreementCheck').checked;
                
                if (!phone || !password) {
                    alert('请填写完整信息');
                    return;
                }
                if (!agreed) {
                    alert('请先同意服务条款和隐私政策');
                    return;
                }
                
                // 模拟登录验证
                if (phone === DEMO_ACCOUNT.phone && password === DEMO_ACCOUNT.password) {
                    Auth.setLoggedIn(true);
                    closeLoginModal();
                    // 登录成功，不显示浏览器提示
                } else {
                    alert('账号或密码错误\n演示账号：手机号 ' + DEMO_ACCOUNT.phone + '，密码 ' + DEMO_ACCOUNT.password);
                }
            });
        }

        // 关闭按钮
        const closeBtn = loginModal.querySelector('#loginCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLoginModal);
        }

        // 点击遮罩层关闭
        loginModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLoginModal();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && loginModal.classList.contains('show')) {
                closeLoginModal();
            }
        });
    }

    // 打开登录弹窗
    function openLoginModal() {
        createLoginModal();
        loginModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // 关闭登录弹窗
    function closeLoginModal() {
        if (loginModal) {
            loginModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // 暴露全局函数
    window.openLoginModal = openLoginModal;
    window.closeLoginModal = closeLoginModal;
})();

