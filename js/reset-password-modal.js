/**
 * 重置密码弹窗功能
 */
(function() {
    // 固定验证码（用于演示）
    const DEMO_CODE = '123456';

    let resetPasswordModal = null;

    // 创建重置密码弹窗HTML
    function createResetPasswordModal() {
        if (resetPasswordModal) return resetPasswordModal;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'resetPasswordModal';
        modal.innerHTML = `
            <div class="reset-password-modal">
                <div class="reset-password-header">
                    <div class="logo-container">
                        <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/a98360672e312beb0fcc5fdaaf57a568.png" alt="硅宝 Logo" class="logo">
                    </div>
                    <h1 class="reset-password-title">重置密码</h1>
                    <p class="reset-password-subtitle">请输入您的手机号和验证码来重置密码</p>
                </div>
                <div class="reset-password-content">
                    <form id="resetPasswordForm">
                        <div class="form-group">
                            <input type="tel" class="form-input" id="resetPhone" placeholder="请输入手机号" maxlength="11">
                        </div>
                        <div class="form-group">
                            <div class="verification-wrapper">
                                <input type="text" class="form-input" id="resetVerifyCode" placeholder="请输入验证码" maxlength="6">
                                <button type="button" class="get-code-btn" id="getResetCode">获取验证码</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-wrapper">
                                <input type="password" class="form-input" id="newPassword" placeholder="请输入新密码" minlength="6">
                                <button class="password-toggle" id="toggleNewPassword" type="button">👁</button>
                            </div>
                            <div class="password-hint">密码长度至少6位</div>
                        </div>
                        <div class="form-group">
                            <div class="input-wrapper">
                                <input type="password" class="form-input" id="confirmPassword" placeholder="请再次输入新密码" minlength="6">
                                <button class="password-toggle" id="toggleConfirmPassword" type="button">👁</button>
                            </div>
                        </div>
                        <button type="submit" class="login-btn" id="resetPasswordBtn">重置密码</button>
                        <div class="back-to-login">
                            <a href="#" id="backToLogin">返回登录</a>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        resetPasswordModal = modal;
        initResetPasswordModalEvents();
        return modal;
    }

    // 初始化重置密码弹窗事件
    function initResetPasswordModalEvents() {
        // 密码显示/隐藏
        const toggleNewPassword = resetPasswordModal.querySelector('#toggleNewPassword');
        const toggleConfirmPassword = resetPasswordModal.querySelector('#toggleConfirmPassword');
        
        if (toggleNewPassword) {
            toggleNewPassword.addEventListener('click', () => {
                const input = resetPasswordModal.querySelector('#newPassword');
                if (input.type === 'password') {
                    input.type = 'text';
                    toggleNewPassword.textContent = '👁️‍🗨️';
                } else {
                    input.type = 'password';
                    toggleNewPassword.textContent = '👁';
                }
            });
        }

        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', () => {
                const input = resetPasswordModal.querySelector('#confirmPassword');
                if (input.type === 'password') {
                    input.type = 'text';
                    toggleConfirmPassword.textContent = '👁️‍🗨️';
                } else {
                    input.type = 'password';
                    toggleConfirmPassword.textContent = '👁';
                }
            });
        }

        // 获取验证码
        const getResetCodeBtn = resetPasswordModal.querySelector('#getResetCode');
        if (getResetCodeBtn) {
            let countdown = 0;
            getResetCodeBtn.addEventListener('click', () => {
                if (countdown > 0) return;
                
                const phone = resetPasswordModal.querySelector('#resetPhone').value;
                if (!phone) {
                    alert('请先输入手机号');
                    return;
                }
                if (!/^1[3-9]\d{9}$/.test(phone)) {
                    alert('请输入正确的手机号');
                    return;
                }
                
                countdown = 60;
                getResetCodeBtn.disabled = true;
                
                const timer = setInterval(() => {
                    getResetCodeBtn.textContent = `${countdown}秒后重试`;
                    countdown--;
                    
                    if (countdown < 0) {
                        clearInterval(timer);
                        getResetCodeBtn.disabled = false;
                        getResetCodeBtn.textContent = '获取验证码';
                    }
                }, 1000);

                // 提示验证码已发送
                if (window.showToast) {
                    window.showToast('验证码已发送，演示验证码为：' + DEMO_CODE);
                } else {
                    alert('验证码已发送，演示验证码为：' + DEMO_CODE);
                }
            });
        }

        // 重置密码表单提交
        const resetPasswordForm = resetPasswordModal.querySelector('#resetPasswordForm');
        if (resetPasswordForm) {
            resetPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const phone = resetPasswordModal.querySelector('#resetPhone').value;
                const code = resetPasswordModal.querySelector('#resetVerifyCode').value;
                const newPassword = resetPasswordModal.querySelector('#newPassword').value;
                const confirmPassword = resetPasswordModal.querySelector('#confirmPassword').value;
                
                // 验证表单
                if (!phone) {
                    alert('请输入手机号');
                    return;
                }
                if (!/^1[3-9]\d{9}$/.test(phone)) {
                    alert('请输入正确的手机号');
                    return;
                }
                if (!code) {
                    alert('请输入验证码');
                    return;
                }
                if (!newPassword) {
                    alert('请输入新密码');
                    return;
                }
                if (newPassword.length < 6) {
                    alert('密码长度至少6位');
                    return;
                }
                if (newPassword !== confirmPassword) {
                    alert('两次输入的密码不一致');
                    return;
                }
                
                // 验证验证码
                if (code !== DEMO_CODE) {
                    alert('验证码错误\n演示验证码：' + DEMO_CODE);
                    return;
                }
                
                // 模拟重置密码成功
                if (window.showToast) {
                    window.showToast('密码重置成功！');
                } else {
                    alert('密码重置成功！');
                }
                
                // 关闭重置密码弹窗，清空表单
                closeResetPasswordModal();
                resetPasswordForm.reset();
                
                // 打开登录弹窗
                if (window.openLoginModal) {
                    window.openLoginModal();
                }
            });
        }

        // 返回登录
        const backToLogin = resetPasswordModal.querySelector('#backToLogin');
        if (backToLogin) {
            backToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                closeResetPasswordModal();
                if (window.openLoginModal) {
                    window.openLoginModal();
                }
            });
        }

        // 点击遮罩层关闭
        resetPasswordModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeResetPasswordModal();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && resetPasswordModal.classList.contains('show')) {
                closeResetPasswordModal();
            }
        });
    }

    // 打开重置密码弹窗
    function openResetPasswordModal() {
        createResetPasswordModal();
        resetPasswordModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // 关闭重置密码弹窗
    function closeResetPasswordModal() {
        if (resetPasswordModal) {
            resetPasswordModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // 暴露全局函数
    window.openResetPasswordModal = openResetPasswordModal;
    window.closeResetPasswordModal = closeResetPasswordModal;
})();

