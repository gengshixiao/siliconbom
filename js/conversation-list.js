/**
 * 历史会话列表功能
 */
(function() {
    // 会话数据（纯前端演示数据）
    const conversationsData = [
        {
            id: 1,
            title: "新电源芯片MOS选型咨询",
            preview: "我需要为一个12V输入、5V/3A输出的DC-DC转换器选择合适的MOSFET。请推荐几款低Rds(on)、高效率的N沟道MOSFET，封装要求是SO-8或DFN。",
            date: "2025年12月16日",
            selected: false
        },
        {
            id: 2,
            title: "60V耐压MOS管参数查询",
            preview: "项目需要60V耐压的P沟道MOSFET，电流需求15A，请帮我查找符合要求的器件，并提供详细的电气参数对比表。重点关注导通电阻和开关特性。",
            date: "2025年12月15日",
            selected: false
        },
        {
            id: 3,
            title: "电源切换模块BOM生成",
            preview: "设计一个双电源自动切换电路，主电源12V，备用电源24V转12V。需要包含电压检测、切换控制和保护电路的完整BOM清单。",
            date: "2025年12月14日",
            selected: false
        },
        {
            id: 4,
            title: "BOM更新需求分析",
            preview: "分析当前BOM清单，识别需要更新的组件，并提供替代方案。",
            date: "2025年12月13日",
            selected: false
        },
        {
            id: 5,
            title: "BOM中MOS替换分析",
            preview: "查找BOM中MOSFET的替代料，要求参数兼容且成本更低。",
            date: "2025年12月12日",
            selected: false
        },
        {
            id: 6,
            title: "R26系列同规格产品推荐",
            preview: "寻找R26系列电阻器的同规格替代产品，用于成本优化。",
            date: "2025年12月11日",
            selected: false
        }
    ];

    const conversationList = document.getElementById('conversationList');
    const conversationSearchInput = document.getElementById('conversationSearchInput');
    const batchOperations = document.getElementById('batchOperations');
    const batchCount = document.getElementById('batchCount');

    let conversations = [...conversationsData];
    let selectedConversations = new Set();

    // 渲染会话列表
    function renderConversations(conversationsToRender = conversations) {
        if (!conversationList) return;

        if (conversationsToRender.length === 0) {
            conversationList.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <div class="empty-state-title">暂无会话记录</div>
                    <div class="empty-state-description">开始新的对话来创建您的第一个会话记录</div>
                </div>
            `;
            return;
        }

        conversationList.innerHTML = conversationsToRender.map(conversation => `
            <div class="conversation-item ${conversation.selected ? 'selected' : ''}" data-id="${conversation.id}">
                <div class="conversation-checkbox">
                    <input type="checkbox" ${conversation.selected ? 'checked' : ''} onchange="window.toggleConversationSelection(${conversation.id})">
                </div>
                <div class="conversation-content">
                    <div class="conversation-header">
                        <div class="conversation-title" title="${escapeHtml(conversation.title)}">${escapeHtml(conversation.title)}</div>
                        <div class="conversation-meta">
                            <div class="conversation-date">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                ${escapeHtml(conversation.date)}
                            </div>
                        </div>
                    </div>
                    ${conversation.preview ? `<div class="conversation-preview" title="${escapeHtml(conversation.preview)}">${escapeHtml(conversation.preview)}</div>` : ''}
                </div>
                <div class="conversation-actions">
                    <button class="conversation-action-btn edit" onclick="window.editConversation(${conversation.id})" title="编辑标题">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="conversation-action-btn delete" onclick="window.deleteConversation(${conversation.id})" title="删除">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // HTML转义函数
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 切换会话选择状态
    window.toggleConversationSelection = function(id) {
        const conversation = conversations.find(c => c.id === id);
        if (conversation) {
            conversation.selected = !conversation.selected;
            if (conversation.selected) {
                selectedConversations.add(id);
            } else {
                selectedConversations.delete(id);
            }
            updateBatchOperations();
            renderConversations();
        }
    };

    // 更新批量操作栏
    function updateBatchOperations() {
        if (!batchCount || !batchOperations) return;
        
        const count = selectedConversations.size;
        batchCount.textContent = count;
        
        if (count > 0) {
            batchOperations.classList.add('show');
        } else {
            batchOperations.classList.remove('show');
        }
    }

    // 编辑会话标题
    window.editConversation = function(id) {
        const conversation = conversations.find(c => c.id === id);
        if (conversation) {
            const newTitle = prompt('编辑会话标题:', conversation.title);
            if (newTitle && newTitle.trim()) {
                conversation.title = newTitle.trim();
                renderConversations();
                // 可以在这里添加保存到localStorage的逻辑
            }
        }
    };

    // 删除单个会话
    window.deleteConversation = function(id) {
        if (confirm('确定要删除这个会话吗？')) {
            conversations = conversations.filter(c => c.id !== id);
            selectedConversations.delete(id);
            updateBatchOperations();
            renderConversations();
            // 可以在这里添加保存到localStorage的逻辑
        }
    };

    // 搜索功能
    if (conversationSearchInput) {
        conversationSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                renderConversations();
                return;
            }
            
            const filteredConversations = conversations.filter(conversation => {
                return conversation.title.toLowerCase().includes(searchTerm) ||
                       (conversation.preview && conversation.preview.toLowerCase().includes(searchTerm));
            });
            
            renderConversations(filteredConversations);
        });
    }

    // 批量操作功能
    const batchExitBtn = document.getElementById('batchExit');
    const batchDeleteBtn = document.getElementById('batchDelete');

    if (batchExitBtn) {
        batchExitBtn.addEventListener('click', () => {
            conversations.forEach(c => c.selected = false);
            selectedConversations.clear();
            updateBatchOperations();
            renderConversations();
        });
    }

    if (batchDeleteBtn) {
        batchDeleteBtn.addEventListener('click', () => {
            const selectedIds = Array.from(selectedConversations);
            if (selectedIds.length === 0) return;
            
            if (confirm(`确定要删除选中的 ${selectedIds.length} 个会话吗？`)) {
                conversations = conversations.filter(c => !selectedIds.includes(c.id));
                selectedConversations.clear();
                updateBatchOperations();
                renderConversations();
                // 可以在这里添加保存到localStorage的逻辑
            }
        });
    }

    // 动态更新批量操作栏位置
    function updateBatchOperationsPosition() {
        const sidebarUnit = document.getElementById('sidebarUnit');
        if (sidebarUnit && batchOperations) {
            const isCollapsed = sidebarUnit.classList.contains('collapsed');
            const leftPosition = isCollapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)';
            batchOperations.style.left = leftPosition;
        }
    }

    // 监听侧边栏状态变化
    const sidebarUnit = document.getElementById('sidebarUnit');
    if (sidebarUnit) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    updateBatchOperationsPosition();
                }
            });
        });
        
        observer.observe(sidebarUnit, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        updateBatchOperationsPosition();
    }

    // 初始化渲染
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            renderConversations();
        });
    } else {
        renderConversations();
    }

    // 暴露全局函数：获取会话列表
    window.getConversationsList = function() {
        return conversations.map(conv => ({
            id: conv.id,
            title: conv.title
        }));
    };
})();

