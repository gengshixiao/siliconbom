/**
 * 提交反馈弹窗
 */
(function() {
    let feedbackModal = null;

    // 填充会话下拉框
    function populateConversationSelect() {
        if (!feedbackModal) return;
        const select = feedbackModal.querySelector('#conversationSelect');
        if (!select) return;

        // 清空现有选项（保留第一个默认选项）
        select.innerHTML = '<option value="">请选择会话</option>';

        // 优先从全局函数获取会话列表
        if (window.getConversationsList) {
            const conversations = window.getConversationsList();
            conversations.forEach(conv => {
                const option = document.createElement('option');
                option.value = conv.id;
                option.textContent = conv.title;
                select.appendChild(option);
            });
        } else {
            // 如果全局函数不存在，从侧边栏的会话列表中获取
            const projectList = document.getElementById('projectList');
            if (projectList) {
                const projectItems = projectList.querySelectorAll('.project-item');
                projectItems.forEach((item, index) => {
                    const titleElement = item.querySelector('.project-item-text');
                    if (titleElement) {
                        const title = titleElement.textContent.trim();
                        if (title) {
                            const option = document.createElement('option');
                            option.value = index + 1; // 使用索引作为ID
                            option.textContent = title;
                            select.appendChild(option);
                        }
                    }
                });
            }
        }
    }

    function createFeedbackModal() {
        if (feedbackModal) return feedbackModal;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'feedbackModal';
        modal.innerHTML = `
            <div class="feedback-modal">
                <!-- 头部 -->
                <div class="modal-header">
                    <h2 class="modal-title">
                        <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/a98360672e312beb0fcc5fdaaf57a568.png" alt="硅宝" class="modal-title-icon">
                        <span>用户反馈</span>
                    </h2>
                    <button class="close-btn" id="feedbackCloseBtn">×</button>
                </div>

                <!-- 内容 -->
                <div class="modal-content">
                    <div class="question-text">
                        <svg class="question-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <span>与硅宝协作时遇到了什么问题?</span>
                    </div>
                    
                    <textarea 
                        class="feedback-textarea" 
                        id="feedbackText"
                        placeholder="畅所欲言，期待你的真知灼见"
                    ></textarea>

                    <div class="conversation-select-section">
                        <label class="conversation-select-label">
                            <svg class="conversation-select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span>选择出现问题的会话</span>
                        </label>
                        <select class="conversation-select" id="conversationSelect">
                            <option value="">请选择会话</option>
                        </select>
                    </div>

                    <div class="tags-section">
                        <div class="tags-container">
                            <div class="tag-item" data-tag="物料数据不全">📊 物料数据不全</div>
                            <div class="tag-item" data-tag="聊起来笨笨的">🐽 聊起来笨笨的</div>
                            <div class="tag-item" data-tag="系统延迟/吐字慢">🐢 系统延迟/吐字慢</div>
                            <div class="tag-item" data-tag="功能bug">🐛 功能bug</div>
                            <div class="tag-item" data-tag="长得丑">🤡 长得丑</div>
                        </div>
                    </div>

                    <div class="upload-section">
                        <div class="upload-hint">有图有真相，没图靠想象。</div>
                        <div class="upload-area" id="uploadArea">
                            <div class="upload-btn" id="uploadBtn">
                                <span class="upload-btn-icon">+</span>
                                <input type="file" id="fileInput" accept="image/*" multiple>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 底部按钮 -->
                <div class="modal-footer">
                    <button class="btn btn-cancel" id="feedbackCancelBtn">取消</button>
                    <button class="btn btn-submit" id="feedbackSubmitBtn">提交反馈</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        feedbackModal = modal;
        initFeedbackModalEvents();
        return modal;
    }

    function initFeedbackModalEvents() {
        const closeBtn = feedbackModal.querySelector('#feedbackCloseBtn');
        const cancelBtn = feedbackModal.querySelector('#feedbackCancelBtn');
        const submitBtn = feedbackModal.querySelector('#feedbackSubmitBtn');
        const feedbackText = feedbackModal.querySelector('#feedbackText');
        const fileInput = feedbackModal.querySelector('#fileInput');
        const uploadArea = feedbackModal.querySelector('#uploadArea');
        const uploadBtn = feedbackModal.querySelector('#uploadBtn');

        let uploadedImages = [];
        let selectedTags = [];
        let selectedConversationId = null;

        // 会话选择变化事件
        const conversationSelect = feedbackModal.querySelector('#conversationSelect');
        if (conversationSelect) {
            conversationSelect.addEventListener('change', function() {
                selectedConversationId = this.value || null;
            });
        }

        // 标签点击事件
        feedbackModal.querySelectorAll('.tag-item').forEach(tag => {
            tag.addEventListener('click', function() {
                const tagValue = this.getAttribute('data-tag');
                const index = selectedTags.indexOf(tagValue);
                
                if (index > -1) {
                    selectedTags.splice(index, 1);
                    this.classList.remove('selected');
                } else {
                    selectedTags.push(tagValue);
                    this.classList.add('selected');
                }
            });
        });

        // 关闭弹窗
        function closeModal() {
            feedbackModal.classList.remove('show');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        feedbackModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });

        feedbackModal.querySelector('.feedback-modal').addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 文件选择
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            const maxImages = 9;
            
            files.forEach(file => {
                if (uploadedImages.length >= maxImages) {
                    if (window.showToast) {
                        window.showToast(`最多只能上传${maxImages}张图片`);
                    }
                    return;
                }
                
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const imageUrl = event.target.result;
                        uploadedImages.push({
                            file: file,
                            url: imageUrl
                        });
                        addImagePreview(imageUrl, uploadedImages.length - 1);
                    };
                    reader.readAsDataURL(file);
                }
            });

            this.value = '';
        });

        // 添加图片预览
        function addImagePreview(imageUrl, index) {
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.innerHTML = `
                <img src="${imageUrl}" alt="预览图片">
                <div class="image-remove" data-index="${index}">×</div>
            `;
            
            uploadArea.insertBefore(preview, uploadBtn);
            
            preview.querySelector('.image-remove').addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                uploadedImages.splice(idx, 1);
                preview.remove();
                renderImagePreviews();
            });
        }

        // 重新渲染图片预览
        function renderImagePreviews() {
            const previews = uploadArea.querySelectorAll('.image-preview');
            previews.forEach(preview => preview.remove());
            uploadedImages.forEach((item, index) => {
                addImagePreview(item.url, index);
            });
        }

        // 粘贴图片
        document.addEventListener('paste', function(e) {
            if (!feedbackModal.classList.contains('show')) return;
            
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const imageUrl = event.target.result;
                        uploadedImages.push({
                            file: blob,
                            url: imageUrl
                        });
                        addImagePreview(imageUrl, uploadedImages.length - 1);
                    };
                    reader.readAsDataURL(blob);
                    break;
                }
            }
        });

        // 提交反馈
        submitBtn.addEventListener('click', function() {
            const text = feedbackText.value.trim();
            
            if (!text && uploadedImages.length === 0) {
                if (window.showToast) {
                    window.showToast('请输入反馈内容或上传图片');
                }
                return;
            }

            const feedbackData = {
                text: text,
                tags: selectedTags,
                images: uploadedImages.map(img => img.url),
                conversationId: selectedConversationId
            };

            console.log('提交反馈:', feedbackData);
            
            if (window.showToast) {
                window.showToast('反馈提交成功！');
            }
            
            // 重置表单
            feedbackText.value = '';
            uploadedImages = [];
            selectedTags = [];
            selectedConversationId = null;
            if (conversationSelect) {
                conversationSelect.value = '';
            }
            renderImagePreviews();
            feedbackModal.querySelectorAll('.tag-item').forEach(tag => {
                tag.classList.remove('selected');
            });
            
            closeModal();
        });

        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && feedbackModal.classList.contains('show')) {
                closeModal();
            }
        });
    }

    function openFeedbackModal() {
        createFeedbackModal();
        // 填充会话下拉框
        populateConversationSelect();
        feedbackModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeFeedbackModal() {
        if (feedbackModal) {
            feedbackModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // 暴露全局函数
    window.openFeedbackModal = openFeedbackModal;
    window.closeFeedbackModal = closeFeedbackModal;
})();

