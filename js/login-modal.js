/**
 * 登录弹窗功能
 */
(function() {
    // 固定账号密码（用于演示）
    const DEMO_ACCOUNT = {
        phone: '18100617218',
        password: '123456',
        smsCode: '847392'
    };

    let loginModal = null;
    let phoneBindModal = null;
    let currentTab = 'sms';
    // 模拟是否已绑定手机号（开发演示用，可以切换测试）
    let isPhoneBound = false; // 设置为 false 来测试未绑定流程

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
                        <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/a98360672e312beb0fcc5fdaaf57a568.png" alt="硅宝 Logo" class="logo">
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
                                    <input type="text" class="form-input" id="smsCode" placeholder="请输入验证码" value="847392">
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
                            <div class="forgot-password-wrapper">
                                <a href="#" class="forgot-password-link" id="forgotPasswordLink">忘记密码？</a>
                            </div>
                            <button class="login-btn" id="accountLoginBtn">登录</button>
                        </div>
                    </div>
                    <div class="login-right">
                        <div style="font-size: 16px; font-weight: 600; color: #0F172A; margin-bottom: 20px; text-align: center;">微信扫码登录</div>
                        <div style="width: 200px; height: 200px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 16px; background: #F8FAFC; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/c455a13364e4e34dda5337633114e0fd.png" alt="微信登录二维码" style="width: 100%; height: 100%; object-fit: contain;">
                        </div>
                        <button class="demo-scan-btn" id="demoScanBtn" style="width: 100%; padding: 10px 16px; background: #F1F5F9; border: 1px solid var(--border-color); border-radius: 8px; color: #64748B; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-bottom: 12px;">模拟扫码登录（开发演示）</button>
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
                    if (window.showToast) {
                        window.showToast('登录成功！');
                    }
                } else {
                    if (window.showToast) {
                        window.showToast('手机号或验证码错误（演示账号：手机号 ' + DEMO_ACCOUNT.phone + '，验证码 ' + DEMO_ACCOUNT.smsCode + '）');
                    } else {
                        alert('手机号或验证码错误\n演示账号：手机号 ' + DEMO_ACCOUNT.phone + '，验证码 ' + DEMO_ACCOUNT.smsCode);
                    }
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
                    if (window.showToast) {
                        window.showToast('登录成功！');
                    }
                } else {
                    if (window.showToast) {
                        window.showToast('账号或密码错误（演示账号：手机号 ' + DEMO_ACCOUNT.phone + '，密码 ' + DEMO_ACCOUNT.password + '）');
                    } else {
                        alert('账号或密码错误\n演示账号：手机号 ' + DEMO_ACCOUNT.phone + '，密码 ' + DEMO_ACCOUNT.password);
                    }
                }
            });
        }

        // 关闭按钮
        const closeBtn = loginModal.querySelector('#loginCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLoginModal);
        }

        // 忘记密码
        const forgotPasswordLink = loginModal.querySelector('#forgotPasswordLink');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                closeLoginModal();
                // 打开重置密码弹窗
                if (window.openResetPasswordModal) {
                    window.openResetPasswordModal();
                }
            });
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

        // 模拟扫码登录按钮
        const demoScanBtn = loginModal.querySelector('#demoScanBtn');
        if (demoScanBtn) {
            demoScanBtn.addEventListener('click', () => {
                // 模拟扫码成功
                console.log('模拟扫码成功');
                
                // 检查是否已绑定手机号
                if (isPhoneBound) {
                    // 已绑定，直接登录成功
                    if (window.showToast) {
                        window.showToast('微信登录成功！（开发演示：已绑定手机号，直接登录）');
                    } else {
                        alert('微信登录成功！\n（开发演示：已绑定手机号，直接登录）');
                    }
                    Auth.setLoggedIn(true);
                    closeLoginModal();
                } else {
                    // 未绑定，显示手机号绑定弹窗
                    openPhoneBindModal();
                }
            });

            // 添加hover样式
            demoScanBtn.addEventListener('mouseenter', () => {
                demoScanBtn.style.background = '#E2E8F0';
                demoScanBtn.style.color = 'var(--trace-active)';
                demoScanBtn.style.borderColor = 'var(--trace-active)';
            });
            demoScanBtn.addEventListener('mouseleave', () => {
                demoScanBtn.style.background = '#F1F5F9';
                demoScanBtn.style.color = '#64748B';
                demoScanBtn.style.borderColor = 'var(--border-color)';
            });
        }
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

    // 创建手机号绑定弹窗
    function createPhoneBindModal() {
        if (phoneBindModal) return phoneBindModal;

        const modal = document.createElement('div');
        modal.className = 'phone-bind-modal';
        modal.id = 'phoneBindModal';
        modal.innerHTML = `
            <div class="phone-bind-content">
                <button class="phone-bind-close" id="phoneBindClose">×</button>
                <div class="phone-bind-header">
                    <h2 class="phone-bind-title">绑定手机号</h2>
                    <p class="phone-bind-subtitle">微信登录需要绑定手机号以完成注册</p>
                </div>
                <div class="phone-bind-body">
                    <div class="form-group">
                        <input type="tel" class="form-input" id="bindPhone" placeholder="请输入手机号" value="${DEMO_ACCOUNT.phone}">
                    </div>
                    <div class="form-group">
                        <div class="verification-wrapper">
                            <input type="text" class="form-input" id="bindCode" placeholder="请输入验证码" value="847392">
                            <button class="get-code-btn" id="getBindCode">获取验证码</button>
                        </div>
                    </div>
                    <button class="login-btn" id="bindSubmitBtn">确认绑定</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        phoneBindModal = modal;
        initPhoneBindModalEvents();
        return modal;
    }

    // 初始化手机号绑定弹窗事件
    function initPhoneBindModalEvents() {
        const getBindCodeBtn = phoneBindModal.querySelector('#getBindCode');
        const bindSubmitBtn = phoneBindModal.querySelector('#bindSubmitBtn');
        const bindPhoneInput = phoneBindModal.querySelector('#bindPhone');
        const bindCodeInput = phoneBindModal.querySelector('#bindCode');
        const phoneBindClose = phoneBindModal.querySelector('#phoneBindClose');

        // 关闭按钮
        phoneBindClose.addEventListener('click', closePhoneBindModal);

        // 点击遮罩层关闭
        phoneBindModal.addEventListener('click', (e) => {
            if (e.target === phoneBindModal) {
                closePhoneBindModal();
            }
        });

        // 获取绑定验证码
        let bindCountdown = 0;
        getBindCodeBtn.addEventListener('click', () => {
            if (bindCountdown > 0) return;
            
            const phone = bindPhoneInput.value.trim();
            if (!phone) {
                if (window.showToast) {
                    window.showToast('请输入手机号');
                } else {
                    alert('请输入手机号');
                }
                return;
            }
            
            if (!/^1[3-9]\d{9}$/.test(phone)) {
                if (window.showToast) {
                    window.showToast('请输入正确的手机号');
                } else {
                    alert('请输入正确的手机号');
                }
                return;
            }
            
            // 模拟发送验证码
            console.log('发送验证码到：', phone);
            if (window.showToast) {
                window.showToast('验证码已发送（开发演示：验证码为 847392）');
            } else {
                alert('验证码已发送（开发演示：验证码为 847392）');
            }
            
            bindCountdown = 60;
            getBindCodeBtn.disabled = true;
            
            const timer = setInterval(() => {
                getBindCodeBtn.textContent = `${bindCountdown}秒后重试`;
                bindCountdown--;
                
                if (bindCountdown < 0) {
                    clearInterval(timer);
                    getBindCodeBtn.disabled = false;
                    getBindCodeBtn.textContent = '获取验证码';
                }
            }, 1000);
        });

        // 确认绑定
        bindSubmitBtn.addEventListener('click', () => {
            const phone = bindPhoneInput.value.trim();
            const code = bindCodeInput.value.trim();
            
            if (!phone) {
                if (window.showToast) {
                    window.showToast('请输入手机号');
                } else {
                    alert('请输入手机号');
                }
                return;
            }
            
            if (!/^1[3-9]\d{9}$/.test(phone)) {
                if (window.showToast) {
                    window.showToast('请输入正确的手机号');
                } else {
                    alert('请输入正确的手机号');
                }
                return;
            }
            
            if (!code) {
                if (window.showToast) {
                    window.showToast('请输入验证码');
                } else {
                    alert('请输入验证码');
                }
                return;
            }
            
            // 模拟验证（开发演示：验证码为 847392）
            if (code === '847392') {
                // 绑定成功
                isPhoneBound = true;
                closePhoneBindModal();
                Auth.setLoggedIn(true);
                closeLoginModal();
                if (window.showToast) {
                    window.showToast('微信登录成功！');
                }
            } else {
                if (window.showToast) {
                    window.showToast('验证码错误（开发演示：正确验证码为 847392）');
                } else {
                    alert('验证码错误\n（开发演示：正确验证码为 847392）');
                }
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && phoneBindModal.classList.contains('show')) {
                closePhoneBindModal();
            }
        });
    }

    // 打开手机号绑定弹窗
    function openPhoneBindModal() {
        createPhoneBindModal();
        phoneBindModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // 关闭手机号绑定弹窗
    function closePhoneBindModal() {
        if (phoneBindModal) {
            phoneBindModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // 暴露全局函数
    window.openLoginModal = openLoginModal;
    window.closeLoginModal = closeLoginModal;
})();

