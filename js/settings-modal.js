/**
 * 个人设置弹窗
 */
(function() {
    let settingsModal = null;

    function createSettingsModal() {
        if (settingsModal) return settingsModal;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'settingsModal';
        modal.innerHTML = `
            <div class="settings-modal">
                <!-- 头部 -->
                <div class="modal-header">
                    <h2 class="modal-title">
                        <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/a98360672e312beb0fcc5fdaaf57a568.png" alt="硅宝" class="modal-title-icon">
                        <span>个人设置</span>
                    </h2>
                    <button class="close-btn" id="settingsCloseBtn">×</button>
                </div>

                <!-- 主体内容 -->
                <div class="modal-body">
                    <!-- 左侧菜单 -->
                    <div class="settings-menu">
                        <div class="menu-item active" data-tab="profile">
                            <svg class="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>个人资料</span>
                        </div>
                        <div class="menu-item" data-tab="preferences">
                            <svg class="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            <span>研发偏好</span>
                        </div>
                        <div class="menu-item" data-tab="password">
                            <svg class="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span>修改密码</span>
                        </div>
                    </div>

                    <!-- 右侧内容 -->
                    <div class="settings-content">
                        <!-- 个人资料内容 -->
                        <div class="content-section active" id="profile-section">
                            <div class="profile-form">
                                <!-- 头像上传 -->
                                <div class="avatar-section">
                                    <div class="avatar-upload">
                                        <img 
                                            id="avatarPreview" 
                                            src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/a98360672e312beb0fcc5fdaaf57a568.png" 
                                            alt="头像" 
                                            class="avatar-image"
                                        >
                                        <div class="avatar-overlay">
                                            <div class="avatar-overlay-icon">📷</div>
                                            <div>更换头像</div>
                                        </div>
                                        <input 
                                            type="file" 
                                            id="avatarInput" 
                                            accept="image/jpeg,image/png,image/jpg,image/gif"
                                        >
                                    </div>
                                </div>

                                <!-- 名称 -->
                                <div class="form-group">
                                    <label class="form-label">名称</label>
                                    <div class="input-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            id="profileName" 
                                            placeholder="请输入名称"
                                            value="136****6079"
                                            maxlength="20"
                                        >
                                        <span class="char-counter">
                                            <span id="nameCharCount">11</span> / 20
                                        </span>
                                    </div>
                                </div>

                                <!-- 手机号 -->
                                <div class="form-group">
                                    <label class="form-label">手机号</label>
                                    <input 
                                        type="tel" 
                                        class="form-input" 
                                        id="profilePhone" 
                                        value="136****6079"
                                        readonly
                                    >
                                </div>

                                <!-- 第三方账号绑定 -->
                                <div class="form-group">
                                    <label class="form-label">第三方账号绑定</label>
                                    <div class="third-party-bind-container" id="thirdPartyBindContainer">
                                        <!-- 微信绑定项 -->
                                        <div class="third-party-item" id="wechatBindItem">
                                            <div class="third-party-item-left">
                                                <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/4e7ee1a094eb86888135ac51fc4b1bfa.png" alt="微信" class="third-party-icon">
                                                <span class="third-party-name">微信</span>
                                            </div>
                                            <div class="third-party-item-right">
                                                <span class="third-party-status" id="wechatBindStatus">未绑定</span>
                                                <button class="third-party-action-btn" id="wechatBindBtn">绑定</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 研发偏好内容 -->
                        <div class="content-section" id="preferences-section">
                            <div class="preferences-form">
                                <!-- 研发风格 -->
                                <div class="form-section">
                                    <div class="form-section-title">研发风格</div>
                                    <div class="tags-container">
                                        <div class="preference-tag selected" data-mode="balanced">
                                            <span class="preference-tag-icon">⚖️</span>
                                            <span>均衡模式</span>
                                            <div class="preference-tag-tooltip">
                                                在任务深度和时间上做了平衡，适用于大多数工程师
                                            </div>
                                        </div>
                                        <div class="preference-tag" data-mode="efficiency">
                                            <span class="preference-tag-icon">⚡</span>
                                            <span>效率模式</span>
                                            <div class="preference-tag-tooltip">
                                                硅宝将专注于执行你发出的指令，速度最快，但不会帮你思考过多内容
                                            </div>
                                        </div>
                                        <div class="preference-tag" data-mode="inspiration">
                                            <span class="preference-tag-icon">💡</span>
                                            <span>启发模式</span>
                                            <div class="preference-tag-tooltip">
                                                硅宝将使用更复杂的模型和更多的数据与你协作，结果更丰富和全面，但耗时更久
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 选型偏好 -->
                                <div class="form-section">
                                    <div class="form-section-title">选型偏好</div>
                                    <textarea 
                                        class="preference-textarea" 
                                        id="selectionPreference"
                                        placeholder="描述你的选型倾向，例如：&#10;• 偏好的品牌（TI、ADI、国产等）&#10;• 技术参数要求（功耗、精度、速度等）&#10;• 应用场景特点（车规、工业、消费级）&#10;• 其他考虑因素"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- 修改密码内容 -->
                        <div class="content-section" id="password-section">
                            <h3 class="section-title">设置密码</h3>
                            <p class="password-tip">您还未设置密码，设置后可使用密码登录</p>
                            <form class="password-form" id="passwordForm">
                                <!-- 手机号显示 -->
                                <div class="form-group">
                                    <label class="form-label">绑定手机号</label>
                                    <input 
                                        type="tel" 
                                        class="form-input" 
                                        id="passwordPhone" 
                                        value="136****6079"
                                        readonly
                                    >
                                </div>

                                <!-- 新密码 -->
                                <div class="form-group">
                                    <label class="form-label">
                                        设置密码
                                        <span class="form-label-required">*</span>
                                    </label>
                                    <div class="input-wrapper">
                                        <input 
                                            type="password" 
                                            class="form-input" 
                                            id="newPassword" 
                                            placeholder="8-20位，包含数字/大小写字母/字符至少3种"
                                            required
                                        >
                                        <button class="password-toggle" type="button" data-target="newPassword">
                                            <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="form-hint">
                                        密码长度为8-20位，需包含数字、大写字母、小写字母、特殊字符中的至少3种
                                    </div>
                                </div>

                                <!-- 确认密码 -->
                                <div class="form-group">
                                    <label class="form-label">
                                        确认密码
                                        <span class="form-label-required">*</span>
                                    </label>
                                    <div class="input-wrapper">
                                        <input 
                                            type="password" 
                                            class="form-input" 
                                            id="confirmPassword" 
                                            placeholder="请再次输入密码"
                                            required
                                        >
                                        <button class="password-toggle" type="button" data-target="confirmPassword">
                                            <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <!-- 验证码 -->
                                <div class="form-group">
                                    <label class="form-label">
                                        验证码
                                        <span class="form-label-required">*</span>
                                    </label>
                                    <div class="verification-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-input" 
                                            id="passwordVerifyCode" 
                                            placeholder="请输入验证码"
                                            maxlength="6"
                                            required
                                        >
                                        <button class="get-code-btn" type="button" id="getPasswordCode">获取验证码</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- 底部按钮 -->
                <div class="modal-footer">
                    <button class="btn btn-cancel" id="settingsCancelBtn">取消</button>
                    <button class="btn btn-save" id="settingsSaveBtn">保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        settingsModal = modal;
        initSettingsModalEvents();
        initThirdPartyBind(); // 初始化第三方账号绑定
        return modal;
    }

    function initSettingsModalEvents() {
        const closeBtn = settingsModal.querySelector('#settingsCloseBtn');
        const cancelBtn = settingsModal.querySelector('#settingsCancelBtn');
        const saveBtn = settingsModal.querySelector('#settingsSaveBtn');
        const menuItems = settingsModal.querySelectorAll('.menu-item');
        const contentSections = settingsModal.querySelectorAll('.content-section');

        // 菜单切换
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                const tabName = this.getAttribute('data-tab');
                contentSections.forEach(section => section.classList.remove('active'));
                settingsModal.querySelector(`#${tabName}-section`).classList.add('active');
            });
        });

        // 关闭弹窗
        function closeModal() {
            settingsModal.classList.remove('show');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        settingsModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });

        settingsModal.querySelector('.settings-modal').addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 密码显示/隐藏
        const passwordToggles = settingsModal.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const input = settingsModal.querySelector(`#${targetId}`);
                const svg = this.querySelector('.eye-icon');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
                } else {
                    input.type = 'password';
                    svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"></path>';
                }
            });
        });

        // 验证码倒计时
        const getPasswordCodeBtn = settingsModal.querySelector('#getPasswordCode');
        if (getPasswordCodeBtn) {
            let countdown = 0;
            getPasswordCodeBtn.addEventListener('click', function() {
                if (countdown > 0) return;
                
                const phone = settingsModal.querySelector('#passwordPhone').value;
                if (!phone) {
                    if (window.showToast) {
                        window.showToast('手机号不存在');
                    }
                    return;
                }
                
                // 模拟发送验证码（不显示提示）
                countdown = 60;
                getPasswordCodeBtn.disabled = true;
                
                const timer = setInterval(() => {
                    getPasswordCodeBtn.textContent = `${countdown}秒后重试`;
                    countdown--;
                    
                    if (countdown < 0) {
                        clearInterval(timer);
                        getPasswordCodeBtn.disabled = false;
                        getPasswordCodeBtn.textContent = '获取验证码';
                    }
                }, 1000);
            });
        }

        // 头像上传
        const avatarInput = settingsModal.querySelector('#avatarInput');
        const avatarPreview = settingsModal.querySelector('#avatarPreview');
        if (avatarInput) {
            avatarInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
                    if (!validTypes.includes(file.type)) {
                        if (window.showToast) {
                            window.showToast('只支持 JPG、PNG、GIF 格式的图片');
                        }
                        return;
                    }
                    const maxSize = 5 * 1024 * 1024;
                    if (file.size > maxSize) {
                        if (window.showToast) {
                            window.showToast('图片大小不能超过 5MB');
                        }
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        avatarPreview.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // 名称字符计数
        const profileName = settingsModal.querySelector('#profileName');
        const nameCharCount = settingsModal.querySelector('#nameCharCount');
        if (profileName && nameCharCount) {
            function updateCharCount() {
                nameCharCount.textContent = profileName.value.length;
            }
            profileName.addEventListener('input', updateCharCount);
            updateCharCount();
        }

        // 研发风格标签选择
        const preferenceTags = settingsModal.querySelectorAll('.preference-tag');
        // 从 localStorage 加载当前模式，如果没有则使用默认值
        let selectedMode = localStorage.getItem('developmentMode') || 'balanced';
        
        // 初始化选中状态
        preferenceTags.forEach(tag => {
            if (tag.getAttribute('data-mode') === selectedMode) {
                tag.classList.add('selected');
            }
        });
        
        preferenceTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const mode = this.getAttribute('data-mode');
                if (selectedMode === mode) {
                    // 如果点击已选中的，取消选中（可选行为）
                    // this.classList.remove('selected');
                    // selectedMode = null;
                } else {
                    preferenceTags.forEach(t => t.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedMode = mode;
                }
            });
        });

        // 保存按钮
        saveBtn.addEventListener('click', function() {
            const passwordSection = settingsModal.querySelector('#password-section');
            const profileSection = settingsModal.querySelector('#profile-section');
            const preferencesSection = settingsModal.querySelector('#preferences-section');
            
            if (passwordSection.classList.contains('active')) {
                handlePasswordChange();
            } else if (profileSection.classList.contains('active')) {
                handleProfileSave();
            } else if (preferencesSection.classList.contains('active')) {
                handlePreferencesSave();
            }
            closeModal();
        });

        function handleProfileSave() {
            const name = profileName.value.trim();
            if (!name) {
                if (window.showToast) {
                    window.showToast('请输入名称');
                }
                return;
            }
            // 保存逻辑
            if (window.showToast) {
                window.showToast('个人资料保存成功！');
            }
        }

        function handlePreferencesSave() {
            const selectionPreference = settingsModal.querySelector('#selectionPreference').value.trim();
            
            // 保存研发风格模式
            const selectedTag = settingsModal.querySelector('.preference-tag.selected');
            if (selectedTag) {
                const modeToSave = selectedTag.getAttribute('data-mode');
                if (modeToSave) {
                    localStorage.setItem('developmentMode', modeToSave);
                    selectedMode = modeToSave; // 更新局部变量
                    // 触发自定义事件，通知其他模块模式已改变
                    const event = new CustomEvent('developmentModeChanged', {
                        detail: { mode: modeToSave }
                    });
                    window.dispatchEvent(event);
                }
            }
            
            // 保存选型偏好
            if (selectionPreference) {
                localStorage.setItem('selectionPreference', selectionPreference);
            }
            
            // 保存逻辑
            if (window.showToast) {
                window.showToast('研发偏好保存成功！');
            }
        }

        function handlePasswordChange() {
            const verifyCode = settingsModal.querySelector('#passwordVerifyCode').value;
            const newPassword = settingsModal.querySelector('#newPassword').value;
            const confirmPassword = settingsModal.querySelector('#confirmPassword').value;

            // 验证验证码
            if (!verifyCode) {
                if (window.showToast) {
                    window.showToast('请输入验证码');
                }
                return;
            }

            if (verifyCode.length !== 6) {
                if (window.showToast) {
                    window.showToast('验证码格式不正确');
                }
                return;
            }

            // 验证新密码
            if (!newPassword || !confirmPassword) {
                if (window.showToast) {
                    window.showToast('请填写完整信息');
                }
                return;
            }

            if (newPassword.length < 8 || newPassword.length > 20) {
                if (window.showToast) {
                    window.showToast('密码长度必须在8-20位之间');
                }
                return;
            }

            const hasNumber = /[0-9]/.test(newPassword);
            const hasUpper = /[A-Z]/.test(newPassword);
            const hasLower = /[a-z]/.test(newPassword);
            const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
            const typeCount = [hasNumber, hasUpper, hasLower, hasSpecial].filter(Boolean).length;

            if (typeCount < 3) {
                if (window.showToast) {
                    window.showToast('密码必须包含数字、大写字母、小写字母、特殊字符中的至少3种');
                }
                return;
            }

            if (newPassword !== confirmPassword) {
                if (window.showToast) {
                    window.showToast('两次输入的密码不一致');
                }
                return;
            }

            // 保存逻辑（实际项目中需要调用后端 API）
            if (window.showToast) {
                window.showToast('密码设置成功！');
            }
            settingsModal.querySelector('#passwordForm').reset();
        }

        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && settingsModal.classList.contains('show')) {
                closeModal();
            }
        });
    }

    // 初始化第三方账号绑定功能
    function initThirdPartyBind() {
        if (!settingsModal) return;

        let isWechatBound = false; // 默认未绑定
        const wechatBindBtn = settingsModal.querySelector('#wechatBindBtn');
        const wechatBindStatus = settingsModal.querySelector('#wechatBindStatus');
        
        if (!wechatBindBtn || !wechatBindStatus) return;

        // 更新微信绑定状态显示
        function updateWechatBindStatus() {
            if (isWechatBound) {
                wechatBindStatus.textContent = '已绑定';
                wechatBindStatus.classList.add('bound');
                wechatBindBtn.textContent = '解绑';
                wechatBindBtn.classList.add('unbind');
            } else {
                wechatBindStatus.textContent = '未绑定';
                wechatBindStatus.classList.remove('bound');
                wechatBindBtn.textContent = '绑定';
                wechatBindBtn.classList.remove('unbind');
            }
        }

        // 初始化绑定状态
        updateWechatBindStatus();

        // 创建微信绑定弹窗
        function createWechatBindModal() {
            let wechatBindModal = document.getElementById('wechatBindModal');
            if (wechatBindModal) return wechatBindModal;

            const modal = document.createElement('div');
            modal.className = 'wechat-bind-modal';
            modal.id = 'wechatBindModal';
            modal.innerHTML = `
                <div class="wechat-bind-content">
                    <button class="wechat-bind-close" id="wechatBindClose">×</button>
                    <div class="wechat-bind-header">
                        <h2 class="wechat-bind-title">绑定微信账号</h2>
                        <p class="wechat-bind-subtitle">使用微信扫码完成账号绑定</p>
                    </div>
                    <div class="wechat-bind-body">
                        <div class="wechat-qr-code">
                            <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/c455a13364e4e34dda5337633114e0fd.png" alt="微信登录二维码">
                        </div>
                        <button class="demo-bind-btn" id="demoBindBtn">模拟绑定（开发演示）</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            return modal;
        }

        // 打开微信绑定弹窗
        function openWechatBindModal() {
            const wechatBindModal = createWechatBindModal();
            const wechatBindClose = wechatBindModal.querySelector('#wechatBindClose');
            const demoBindBtn = wechatBindModal.querySelector('#demoBindBtn');

            wechatBindModal.classList.add('show');
            document.body.style.overflow = 'hidden';

            // 关闭按钮
            wechatBindClose.onclick = () => {
                wechatBindModal.classList.remove('show');
                document.body.style.overflow = '';
            };

            // 点击遮罩层关闭
            wechatBindModal.onclick = (e) => {
                if (e.target === wechatBindModal) {
                    wechatBindModal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            };

            // 模拟绑定按钮
            demoBindBtn.onclick = () => {
                isWechatBound = true;
                updateWechatBindStatus();
                wechatBindModal.classList.remove('show');
                document.body.style.overflow = '';
                if (window.showToast) {
                    window.showToast('微信账号绑定成功！');
                } else {
                    alert('微信账号绑定成功！');
                }
            };

            // ESC键关闭
            const escHandler = (e) => {
                if (e.key === 'Escape' && wechatBindModal.classList.contains('show')) {
                    wechatBindModal.classList.remove('show');
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        // 绑定按钮点击事件
        wechatBindBtn.addEventListener('click', () => {
            if (isWechatBound) {
                // 解绑：二次确认
                if (confirm('确定要解绑微信账号吗？')) {
                    isWechatBound = false;
                    updateWechatBindStatus();
                    if (window.showToast) {
                        window.showToast('微信账号已解绑');
                    } else {
                        alert('微信账号已解绑');
                    }
                }
            } else {
                // 绑定：打开扫码弹窗
                openWechatBindModal();
            }
        });
    }

    function openSettingsModal() {
        createSettingsModal();
        
        // 确保设置弹窗在最上层
        settingsModal.style.zIndex = '100001';
        
        // 加载并显示当前保存的模式
        const savedMode = localStorage.getItem('developmentMode') || 'balanced';
        const preferenceTags = settingsModal.querySelectorAll('.preference-tag');
        preferenceTags.forEach(tag => {
            tag.classList.remove('selected');
            if (tag.getAttribute('data-mode') === savedMode) {
                tag.classList.add('selected');
            }
        });
        
        // 加载选型偏好
        const savedPreference = localStorage.getItem('selectionPreference');
        const selectionPreferenceInput = settingsModal.querySelector('#selectionPreference');
        if (selectionPreferenceInput && savedPreference) {
            selectionPreferenceInput.value = savedPreference;
        }
        
        settingsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeSettingsModal() {
        if (settingsModal) {
            settingsModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // 暴露全局函数
    window.openSettingsModal = openSettingsModal;
    window.closeSettingsModal = closeSettingsModal;
})();
