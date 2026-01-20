/**
 * 知识库页面功能
 */
(function() {
    // 模拟文档数据
    let documents = [
        {
            id: 1,
            name: 'GD25Q64ESIGR 数据手册.pdf',
            type: 'PDF',
            size: '2.3 MB',
            status: '已就绪',
            uploadTime: '2025-12-16',
            statusClass: 'ready'
        },
        {
            id: 2,
            name: 'STM32F103 参考手册.pdf',
            type: 'PDF',
            size: '5.8 MB',
            status: '处理中',
            uploadTime: '2025-12-15',
            statusClass: 'processing'
        },
        {
            id: 3,
            name: '电源管理设计指南.pdf',
            type: 'PDF',
            size: '3.5 MB',
            status: '失败',
            uploadTime: '2025-12-14',
            statusClass: 'failed'
        }
    ];

    // 初始化
    function init() {
        bindEvents();
        initSearch();
        initPreviewPanel();
        initChatPanel();
        bindDocRowEvents();
    }

    // 绑定事件
    function bindEvents() {
        // 全选复选框
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('.doc-checkbox');
                checkboxes.forEach(cb => {
                    cb.checked = this.checked;
                });
            });
        }

        // 上传文档按钮
        const uploadBtn = document.getElementById('uploadDocBtn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', handleUpload);
        }
    }

    // 绑定文档行事件
    function bindDocRowEvents() {
        // 预览按钮
        document.querySelectorAll('.doc-action-btn.preview').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const docId = parseInt(this.getAttribute('data-doc-id'));
                const row = this.closest('tr[data-doc-id]');
                if (row) {
                    const docName = row.querySelector('.doc-name')?.textContent || '';
                    openPreviewPanel(docId, docName);
                }
            });
        });

        // 删除按钮
        document.querySelectorAll('.doc-action-btn.delete').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const docId = parseInt(this.getAttribute('data-doc-id'));
                const row = this.closest('tr[data-doc-id]');
                if (row) {
                    const docName = row.querySelector('.doc-name')?.textContent || '';
                    handleDelete(docId, docName, row);
                }
            });
        });

        // 失败状态的重试功能
        document.querySelectorAll('.doc-status.failed').forEach(statusSpan => {
            statusSpan.addEventListener('click', function(e) {
                e.stopPropagation();
                if (this.classList.contains('failed')) {
                    const row = this.closest('tr[data-doc-id]');
                    if (!row) return;
                    
                    // 改为处理中状态
                    this.classList.remove('failed');
                    this.classList.add('processing');
                    const statusText = this.querySelector('.doc-status-text');
                    const statusIcon = this.querySelector('.doc-status-icon');
                    const tooltip = this.querySelector('.doc-status-retry-tooltip');
                    
                    if (statusText) {
                        statusText.textContent = '处理中';
                        statusText.style.display = '';
                    }
                    if (statusIcon) {
                        statusIcon.style.display = 'none';
                    }
                    if (tooltip) {
                        tooltip.style.display = 'none';
                    }
                    
                    row.setAttribute('data-status', 'processing');
                    
                    // 模拟处理完成，3秒后变为就绪
                    setTimeout(() => {
                        this.classList.remove('processing');
                        this.classList.add('ready');
                        if (statusText) {
                            statusText.textContent = '已就绪';
                            statusText.style.display = '';
                        }
                        row.setAttribute('data-status', 'ready');
                    }, 3000);
                }
            });
        });
    }

    // 初始化搜索
    function initSearch() {
        const searchInput = document.getElementById('docSearchInput');
        if (!searchInput) return;

        // 搜索输入
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const keyword = this.value.trim().toLowerCase();
                const rows = document.querySelectorAll('#docTableBody tr[data-doc-id]');
                rows.forEach(row => {
                    const docName = row.querySelector('.doc-name')?.textContent || '';
                    const docType = row.querySelector('.doc-type')?.textContent || '';
                    const shouldShow = !keyword || 
                        docName.toLowerCase().includes(keyword) ||
                        docType.toLowerCase().includes(keyword);
                    row.style.display = shouldShow ? '' : 'none';
                });
            }, 300);
        });

        // 搜索快捷键 ⌘/Ctrl + K
        document.addEventListener('keydown', function(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // 处理上传
    function handleUpload() {
        // 创建文件输入
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx,.txt,.md';
        input.multiple = true;
        
        input.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            files.forEach(file => {
                // 验证文件类型
                const validTypes = ['.pdf', '.doc', '.docx', '.txt', '.md'];
                const fileExt = '.' + file.name.split('.').pop().toLowerCase();
                if (!validTypes.includes(fileExt)) {
                    if (window.showToast) {
                        window.showToast(`不支持的文件类型: ${fileExt}`);
                    }
                    return;
                }

                // 验证文件大小（限制50MB）
                const maxSize = 50 * 1024 * 1024;
                if (file.size > maxSize) {
                    if (window.showToast) {
                        window.showToast(`文件 ${file.name} 超过50MB限制`);
                    }
                    return;
                }

                // 添加新文档到表格
                const tbody = document.getElementById('docTableBody');
                if (!tbody) return;

                const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-doc-id', newId);
                newRow.setAttribute('data-status', 'processing');
                
                newRow.innerHTML = `
                    <td style="text-align: center;">
                        <input type="checkbox" class="doc-checkbox" data-doc-id="${newId}">
                    </td>
                    <td>
                        <div class="doc-name-cell">
                            <div class="doc-icon">📄</div>
                            <div class="doc-name-info">
                                <div class="doc-name">${escapeHtml(file.name)}</div>
                                <div class="doc-type">${fileExt.toUpperCase().substring(1)}文档</div>
                            </div>
                        </div>
                    </td>
                    <td style="text-align: center;">${fileExt.toUpperCase().substring(1)}</td>
                    <td style="text-align: center;">${formatFileSize(file.size)}</td>
                    <td style="text-align: center;">
                        <span class="doc-status processing">处理中</span>
                    </td>
                    <td style="text-align: center;">${new Date().toISOString().split('T')[0]}</td>
                    <td style="text-align: center;">
                        <button class="doc-action-btn preview" title="预览" data-doc-id="${newId}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        <button class="doc-action-btn delete" title="删除" data-doc-id="${newId}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </td>
                `;
                
                tbody.insertBefore(newRow, tbody.firstChild);
                
                // 重新绑定事件
                bindDocRowEvents();
                
                // 模拟处理完成
                setTimeout(() => {
                    const statusSpan = newRow.querySelector('.doc-status');
                    if (statusSpan) {
                        statusSpan.classList.remove('processing');
                        statusSpan.classList.add('ready');
                        statusSpan.textContent = '已就绪';
                    }
                    newRow.setAttribute('data-status', 'ready');
                }, 2000);
            });

            if (window.showToast) {
                window.showToast(`成功上传 ${files.length} 个文档`);
            }
        });

        input.click();
    }

    // 处理删除
    function handleDelete(docId, docName, row) {
        if (window.showConfirm) {
            window.showConfirm(`确定要删除文档 "${docName}" 吗？`, function() {
                row.remove();
                documents = documents.filter(d => d.id !== docId);
                if (window.showToast) {
                    window.showToast('文档已删除');
                }
            });
        } else {
            if (confirm(`确定要删除文档 "${docName}" 吗？`)) {
                row.remove();
                documents = documents.filter(d => d.id !== docId);
                if (window.showToast) {
                    window.showToast('文档已删除');
                }
            }
        }
    }

    // 预览面板功能
    function openPreviewPanel(docId, docName) {
        const previewPanel = document.getElementById('previewPanel');
        const previewTitle = document.getElementById('previewTitle');
        const previewContent = document.getElementById('previewContent');
        
        if (previewPanel && previewTitle && previewContent) {
            previewTitle.textContent = docName;
            
            // 模拟加载效果
            previewContent.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 16px; opacity: 0.5;">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    <p>正在加载文档...</p>
                </div>
            `;
            
            // 模拟PDF内容加载
            setTimeout(() => {
                previewContent.innerHTML = `
                    <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 24px;">
                            <h2 style="color: var(--text-main); margin-bottom: 8px;">${docName.replace('.pdf', '').replace('.docx', '').replace('.doc', '')}</h2>
                            <p style="color: var(--text-secondary); font-size: 14px;">技术文档</p>
                        </div>
                        
                        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                            <h3 style="color: var(--text-main); margin-bottom: 12px; font-size: 16px;">文档概述</h3>
                            <p style="color: var(--text-secondary); line-height: 1.6; font-size: 14px;">
                                这是关于 ${docName.replace('.pdf', '').replace('.docx', '').replace('.doc', '')} 的技术文档。
                                该文档包含了详细的技术规格、应用说明和使用指南，为工程师提供全面的参考资料。
                            </p>
                        </div>

                        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                            <h3 style="color: var(--text-main); margin-bottom: 12px; font-size: 16px;">主要特性</h3>
                            <ul style="color: var(--text-secondary); line-height: 1.8; font-size: 14px; padding-left: 20px;">
                                <li>详细的技术规格说明</li>
                                <li>完整的参数表格和性能指标</li>
                                <li>实用的应用电路设计指南</li>
                                <li>封装信息和尺寸规格</li>
                                <li>使用注意事项和常见问题解答</li>
                                <li>参考设计和应用案例</li>
                            </ul>
                        </div>

                        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                            <h3 style="color: var(--text-main); margin-bottom: 12px; font-size: 16px;">技术参数</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                                <div style="color: var(--text-secondary);"><strong>文档类型:</strong> PDF文档</div>
                                <div style="color: var(--text-secondary);"><strong>文档ID:</strong> ${docId}</div>
                                <div style="color: var(--text-secondary);"><strong>上传日期:</strong> ${new Date().toLocaleDateString('zh-CN')}</div>
                                <div style="color: var(--text-secondary);"><strong>文件大小:</strong> 5.2 MB</div>
                            </div>
                        </div>

                        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px;">
                            <h3 style="color: var(--text-main); margin-bottom: 12px; font-size: 16px;">应用领域</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; color: var(--text-secondary);">
                                <div>• 嵌入式系统开发</div>
                                <div>• 物联网设备</div>
                                <div>• 工业控制系统</div>
                                <div>• 消费电子产品</div>
                                <div>• 通信设备</div>
                                <div>• 汽车电子</div>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
                            <p style="color: var(--text-secondary); font-size: 12px;">
                                文档预览 • 实际使用时将显示完整的PDF内容
                            </p>
                        </div>
                    </div>
                `;
            }, 800);
            
            // 关闭其他面板
            document.getElementById('chatPanel')?.classList.remove('open');
            previewPanel.classList.add('open');
        }
    }

    // 初始化预览面板
    function initPreviewPanel() {
        const previewPanel = document.getElementById('previewPanel');
        const previewPanelClose = document.getElementById('previewPanelClose');
        
        if (previewPanelClose && previewPanel) {
            previewPanelClose.addEventListener('click', function() {
                previewPanel.classList.remove('open');
            });
        }
    }

    // 初始化知识问答面板
    function initChatPanel() {
        const chatPanel = document.getElementById('chatPanel');
        const previewPanel = document.getElementById('previewPanel');
        const toggleChatBtn = document.getElementById('toggleChatPanel');
        const chatPanelClose = document.getElementById('chatPanelClose');
        
        if (toggleChatBtn && chatPanel) {
            toggleChatBtn.addEventListener('click', function() {
                // 关闭预览面板（如果打开）
                if (previewPanel) {
                    previewPanel.classList.remove('open');
                }
                chatPanel.classList.add('open');
            });
        }
        
        if (chatPanelClose && chatPanel) {
            chatPanelClose.addEventListener('click', function() {
                chatPanel.classList.remove('open');
            });
        }

        // 清空会话按钮
        const clearChatBtn = document.getElementById('clearChatBtn');
        const chatMessagesContainer = document.getElementById('chatMessagesContainer');
        
        if (clearChatBtn && chatMessagesContainer) {
            clearChatBtn.addEventListener('click', function() {
                // 显示确认对话框
                if (window.showConfirm) {
                    window.showConfirm('确定要清空所有会话记录吗？', function() {
                        chatMessagesContainer.innerHTML = `
                            <div class="chat-message assistant">
                                <div class="chat-message-avatar">
                                    <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/a98360672e312beb0fcc5fdaaf57a568.png" alt="硅宝">
                                </div>
                                <div class="chat-message-content">
                                    <div class="chat-message-bubble">
                                        您好！我是硅宝知识管家。我可以帮您解答关于已上传文档的问题。我会基于所有已解析完成的文档为您提供答案。
                                    </div>
                                    <div class="chat-message-time">刚刚</div>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    if (confirm('确定要清空所有会话记录吗？')) {
                        chatMessagesContainer.innerHTML = `
                            <div class="chat-message assistant">
                                <div class="chat-message-avatar">
                                    <img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/a98360672e312beb0fcc5fdaaf57a568.png" alt="硅宝">
                                </div>
                                <div class="chat-message-content">
                                    <div class="chat-message-bubble">
                                        您好！我是硅宝知识管家。我可以帮您解答关于已上传文档的问题。我会基于所有已解析完成的文档为您提供答案。
                                    </div>
                                    <div class="chat-message-time">刚刚</div>
                                </div>
                            </div>
                        `;
                    }
                }
            });
        }

        // 知识问答功能
        const chatInput = document.getElementById('chatInput');
        const chatSendBtn = document.getElementById('chatSendBtn');
        
        // 自动调整textarea高度
        if (chatInput) {
            chatInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });
            
            // 回车发送消息（Shift+Enter换行）
            chatInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
        
        if (chatSendBtn) {
            chatSendBtn.addEventListener('click', sendMessage);
        }
        
        function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // 添加用户消息
            addChatMessage('user', message);
            
            // 清空输入框
            chatInput.value = '';
            chatInput.style.height = 'auto';
            
            // 模拟AI回复
            setTimeout(() => {
                const reply = `我正在分析您的问题："${message}"。\n\n这是一个模拟回复。实际使用时，这里会调用AI模型基于文档内容生成回答。`;
                addChatMessage('assistant', reply);
            }, 1000);
        }
        
        function addChatMessage(role, content) {
            const chatMessagesContainer = document.getElementById('chatMessagesContainer');
            if (!chatMessagesContainer) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${role}`;
            
            const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
            
            messageDiv.innerHTML = `
                <div class="chat-message-avatar">
                    ${role === 'user' ? 'L' : '<img src="https://chat-web-1253214834.cos.ap-beijing.myqcloud.com/image/a98360672e312beb0fcc5fdaaf57a568.png" alt="硅宝">'}
                </div>
                <div class="chat-message-content">
                    <div class="chat-message-bubble">${content.replace(/\n/g, '<br>')}</div>
                    <div class="chat-message-time">${time}</div>
                </div>
            `;
            
            chatMessagesContainer.appendChild(messageDiv);
            
            // 滚动到底部
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
