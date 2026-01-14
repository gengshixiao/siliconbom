/**
 * BOM档案管理功能
 */
(function() {
    // 模拟项目数据
    let projects = [
        {
            id: 1,
            name: '电源切换模块BOM',
            description: '双电源自动切换系统的BOM管理，这是一个用于工业控制系统的关键模块，支持主电源和备用电源之间的无缝切换，确保系统在电源故障时能够持续稳定运行，适用于各种高可靠性要求的应用场景',
            versions: [
                {
                    version: 'v2.1',
                    date: '2024-05-10',
                    updateTime: '2024-05-10 14:30',
                    createMethod: '手动更新',
                    description: '优化了IC选型，增加了肖特基二极管和电阻的配置',
                    bomItems: [
                        { id: 1, refDes: 'C3,C4,C5,C6', category: 'IC', value: '', package: '', manufacturer: '', mpn: '', detailSpec: '链接到明细参数表' },
                        { id: 2, refDes: 'L1,L2,L3,L4', category: '肖特基二极管', value: '', package: '', manufacturer: '', mpn: '', detailSpec: '' },
                        { id: 3, refDes: 'R1,R2', category: '电阻', value: '10K', package: '0805', manufacturer: 'YAGEO', mpn: 'RC0805FR-0710KL', detailSpec: '' }
                    ]
                },
                {
                    version: 'v2.0',
                    date: '2024-03-20',
                    updateTime: '2024-03-20 10:15',
                    createMethod: '模板导入',
                    description: '通过Excel模板导入的初始BOM数据',
                    bomItems: [
                        { id: 1, refDes: 'C3,C4,C5,C6', category: 'IC', value: '', package: '', manufacturer: '', mpn: '', detailSpec: '链接到明细参数表' },
                        { id: 2, refDes: 'L1,L2', category: '肖特基二极管', value: '', package: '', manufacturer: '', mpn: '', detailSpec: '' }
                    ]
                },
                {
                    version: 'v1.0',
                    date: '2024-01-15',
                    updateTime: '2024-01-15 09:00',
                    createMethod: '硅宝创建',
                    description: '通过硅宝AI助手生成的初始BOM版本',
                    bomItems: [
                        { id: 1, refDes: 'C3,C4', category: 'IC', value: '', package: '', manufacturer: '', mpn: '', detailSpec: '' }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: '新电源芯片mos选型',
            description: 'MOS管选型项目，针对不同电压等级和电流需求进行功率MOSFET的筛选和评估，包括导通电阻、开关速度、热特性等关键参数的对比分析，为产品设计提供最优的器件选择方案',
            versions: [
                {
                    version: 'v1.5',
                    date: '2024-04-12',
                    updateTime: '2024-04-12 16:45',
                    createMethod: '手动更新',
                    description: '调整了MOSFET的数量和选型',
                    bomItems: [
                        { id: 1, refDes: 'Q1,Q2,Q3', category: 'MOSFET', value: '', package: 'TO-220', manufacturer: 'Infineon', mpn: 'IRF540N', detailSpec: '' }
                    ]
                },
                {
                    version: 'v1.0',
                    date: '2024-02-01',
                    updateTime: '2024-02-01 11:20',
                    createMethod: '硅宝创建',
                    description: '初始版本，通过AI分析生成的BOM',
                    bomItems: [
                        { id: 1, refDes: 'Q1,Q2', category: 'MOSFET', value: '', package: 'TO-220', manufacturer: 'Infineon', mpn: 'IRF540N', detailSpec: '' }
                    ]
                }
            ]
        }
    ];

    let currentProjectId = null;
    let currentView = 'list'; // 'list' or 'detail'
    let originalBomData = null; // 保存原始BOM数据用于变更检测

    // 初始化
    function init() {
        bindEvents();
        initSearch();
        renderProjectList();
        initProjectModal();
        initVersionViewModal();
        initNewVersionModal();
        initImportBomModal();
    }

    // 绑定事件
    function bindEvents() {
        // 全选复选框
        const selectAllProjects = document.getElementById('selectAllProjects');
        if (selectAllProjects) {
            selectAllProjects.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('.project-checkbox');
                checkboxes.forEach(cb => {
                    cb.checked = this.checked;
                });
                updateExportButtonState();
            });
        }

        // 新建项目按钮
        const createProjectBtn = document.getElementById('createProjectBtn');
        if (createProjectBtn) {
            createProjectBtn.addEventListener('click', function() {
                openProjectModal();
            });
        }

        // 导出项目BOM按钮
        const exportProjectsBtn = document.getElementById('exportProjectsBtn');
        if (exportProjectsBtn) {
            exportProjectsBtn.addEventListener('click', function() {
                exportSelectedProjects();
            });
        }

        // 返回列表按钮
        const backToListBtn = document.getElementById('backToListBtn');
        if (backToListBtn) {
            backToListBtn.addEventListener('click', function() {
                showProjectList();
            });
        }

        // 版本标签切换
        const versionTabs = document.querySelectorAll('.version-tab');
        versionTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabType = this.getAttribute('data-tab');
                switchVersionTab(tabType);
            });
        });


        // 版本列表导出按钮
        const exportVersionsBtn = document.getElementById('exportVersionsBtn');
        if (exportVersionsBtn) {
            exportVersionsBtn.addEventListener('click', function() {
                exportSelectedVersions();
            });
        }

        // 保存为新版本按钮
        const saveAsNewVersionBtn = document.getElementById('saveAsNewVersionBtn');
        if (saveAsNewVersionBtn) {
            saveAsNewVersionBtn.addEventListener('click', function() {
                openNewVersionModal();
            });
        }
    }

    // 初始化搜索
    function initSearch() {
        const searchInput = document.getElementById('projectSearchInput');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const keyword = this.value.trim().toLowerCase();
                const rows = document.querySelectorAll('#projectTableBody tr[data-project-id]');
                rows.forEach(row => {
                    const projectName = row.querySelector('.project-name')?.textContent || '';
                    const shouldShow = !keyword || projectName.toLowerCase().includes(keyword);
                    row.style.display = shouldShow ? '' : 'none';
                });
            }, 300);
        });
    }

    // 渲染项目列表
    function renderProjectList() {
        const tbody = document.getElementById('projectTableBody');
        if (!tbody) return;

        if (projects.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 80px 20px;">
                        <div class="empty-state">
                            <div class="empty-icon">📦</div>
                            <div class="empty-text">暂无项目</div>
                            <div class="empty-subtext">点击"新建项目"开始创建您的第一个BOM项目</div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = projects.map(project => {
            const latestVersion = project.versions[0];
            const versionCount = project.versions.length;
            // 格式化更新时间，精确到分钟
            let updateTime = '-';
            if (latestVersion && latestVersion.date) {
                // 如果有时间信息，使用时间；否则使用日期+默认时间
                if (latestVersion.updateTime) {
                    const date = new Date(latestVersion.updateTime);
                    updateTime = date.toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    }).replace(/\//g, '-');
                } else {
                    // 只有日期，添加默认时间
                    updateTime = latestVersion.date + ' 00:00';
                }
            }

            const description = project.description || '';
            const descriptionDisplay = description || '-';
            
            return `
                <tr data-project-id="${project.id}" style="cursor: pointer;">
                    <td style="text-align: center;" onclick="event.stopPropagation()">
                        <input type="checkbox" class="project-checkbox" data-project-id="${project.id}" onchange="window.bomArchiveModule.updateExportButtonState()">
                    </td>
                    <td onclick="window.bomArchiveModule.showProjectDetail(${project.id})">
                        <div class="project-name">${escapeHtml(project.name)}</div>
                    </td>
                    <td onclick="window.bomArchiveModule.showProjectDetail(${project.id})" style="position: relative;">
                        <div class="project-description" ${description ? `data-tooltip="${escapeHtml(description)}"` : ''}>
                            ${escapeHtml(descriptionDisplay)}
                        </div>
                    </td>
                    <td style="text-align: center;" onclick="window.bomArchiveModule.showProjectDetail(${project.id})">
                        ${versionCount}
                    </td>
                    <td style="text-align: center;" onclick="window.bomArchiveModule.showProjectDetail(${project.id})">
                        <span class="version-badge">${latestVersion ? latestVersion.version : '-'}</span>
                    </td>
                    <td style="text-align: center;" onclick="window.bomArchiveModule.showProjectDetail(${project.id})">
                        ${updateTime}
                    </td>
                    <td style="text-align: center;">
                        <button class="project-action-btn edit" title="编辑" onclick="event.stopPropagation(); window.bomArchiveModule.editProject(${project.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="project-action-btn delete" title="删除" onclick="event.stopPropagation(); window.bomArchiveModule.deleteProject(${project.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
        // 更新导出按钮状态
        updateExportButtonState();
        
        // 初始化描述tooltip
        initDescriptionTooltips();
    }

    // 初始化描述tooltip
    function initDescriptionTooltips() {
        const descriptions = document.querySelectorAll('.project-description[data-tooltip]');
        let tooltip = document.getElementById('descriptionTooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'descriptionTooltip';
            tooltip.className = 'description-tooltip';
            document.body.appendChild(tooltip);
        }
        
        descriptions.forEach(desc => {
            desc.addEventListener('mouseenter', function(e) {
                const text = this.getAttribute('data-tooltip');
                if (!text) return;
                
                const rect = this.getBoundingClientRect();
                tooltip.textContent = text;
                tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                tooltip.style.top = (rect.top - 8) + 'px';
                tooltip.style.transform = 'translate(-50%, -100%)';
                tooltip.classList.add('show');
                
                e.stopPropagation();
            });
            
            desc.addEventListener('mouseleave', function() {
                tooltip.classList.remove('show');
            });
        });
    }

    // 更新导出按钮状态
    function updateExportButtonState() {
        const exportBtn = document.getElementById('exportProjectsBtn');
        if (!exportBtn) return;
        
        const checkedBoxes = document.querySelectorAll('.project-checkbox:checked');
        const hasSelected = checkedBoxes.length > 0;
        
        exportBtn.disabled = !hasSelected;
    }

    // 导出选中的项目
    function exportSelectedProjects() {
        const checkedBoxes = document.querySelectorAll('.project-checkbox:checked');
        if (checkedBoxes.length === 0) {
            if (window.showToast) {
                window.showToast('请选择要导出的项目');
            }
            return;
        }

        // 导出功能暂未实现，仅作按钮示意
        // const selectedIds = Array.from(checkedBoxes).map(cb => parseInt(cb.getAttribute('data-project-id')));
        // const selectedProjects = projects.filter(p => selectedIds.includes(p.id));
        // ... 导出BOM的实际代码已屏蔽
    }

    // 显示项目详情
    function showProjectDetail(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        currentProjectId = projectId;
        currentView = 'detail';

        // 切换视图
        document.getElementById('projectListView').style.display = 'none';
        document.getElementById('projectDetailView').style.display = 'block';

        // 更新详情页标题
        document.getElementById('projectNameDisplay').textContent = project.name;
        document.getElementById('projectDescription').textContent = project.description || '查看和管理项目的BOM版本';

        // 渲染当前版本
        renderCurrentVersion(project);
        renderHistoryVersions(project);

        // 保存原始BOM数据用于变更检测
        saveOriginalBomData(project);

        // 切换到当前版本标签
        switchVersionTab('current');
    }

    // 渲染当前版本BOM
    function renderCurrentVersion(project) {
        const tbody = document.getElementById('bomTableBody');
        if (!tbody) return;

        const latestVersion = project.versions[0];
        if (!latestVersion) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 80px 20px;">
                        <div class="empty-state">
                            <div class="empty-icon">📋</div>
                            <div class="empty-text">暂无BOM数据</div>
                            <div class="empty-subtext">点击"导入BOM"开始导入您的BOM数据</div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // 更新版本标签
        document.getElementById('currentVersionBadge').textContent = latestVersion.version;

        // 渲染BOM表格
        tbody.innerHTML = latestVersion.bomItems.map((item, index) => {
            // 随机生成已应用BOM数（1-50之间的整数）
            const appliedBomCount = item.appliedBomCount !== undefined ? item.appliedBomCount : Math.floor(Math.random() * 50) + 1;
            return `
            <tr data-item-id="${item.id}">
                <td><input type="text" value="${escapeHtml(item.refDes || '')}" onchange="window.bomArchiveModule.updateBomItem(${item.id}, 'refDes', this.value)" placeholder="如：C3,C4,C5"></td>
                <td>
                    <select onchange="window.bomArchiveModule.updateBomItem(${item.id}, 'category', this.value)" class="category-select">
                        <option value="">请选择</option>
                        <option value="电阻" ${item.category === '电阻' ? 'selected' : ''}>电阻</option>
                        <option value="电容" ${item.category === '电容' ? 'selected' : ''}>电容</option>
                        <option value="电感" ${item.category === '电感' ? 'selected' : ''}>电感</option>
                        <option value="二极管" ${item.category === '二极管' ? 'selected' : ''}>二极管</option>
                        <option value="三极管" ${item.category === '三极管' ? 'selected' : ''}>三极管</option>
                        <option value="MOSFET" ${item.category === 'MOSFET' ? 'selected' : ''}>MOSFET</option>
                        <option value="IC" ${item.category === 'IC' ? 'selected' : ''}>IC</option>
                        <option value="连接器" ${item.category === '连接器' ? 'selected' : ''}>连接器</option>
                        <option value="晶振" ${item.category === '晶振' ? 'selected' : ''}>晶振</option>
                        <option value="LED" ${item.category === 'LED' ? 'selected' : ''}>LED</option>
                        <option value="保险丝" ${item.category === '保险丝' ? 'selected' : ''}>保险丝</option>
                        <option value="开关" ${item.category === '开关' ? 'selected' : ''}>开关</option>
                    </select>
                </td>
                <td><input type="text" value="${escapeHtml(item.value || '')}" onchange="window.bomArchiveModule.updateBomItem(${item.id}, 'value', this.value)" placeholder="核心参数"></td>
                <td><input type="text" value="${escapeHtml(item.package || '')}" onchange="window.bomArchiveModule.updateBomItem(${item.id}, 'package', this.value)" placeholder="如：0805"></td>
                <td><input type="text" value="${escapeHtml(item.manufacturer || '')}" onchange="window.bomArchiveModule.updateBomItem(${item.id}, 'manufacturer', this.value)" placeholder="制造商名称"></td>
                <td><input type="text" value="${escapeHtml(item.mpn || '')}" onchange="window.bomArchiveModule.updateBomItem(${item.id}, 'mpn', this.value)" placeholder="制造商料号"></td>
                <td style="text-align: center;">${appliedBomCount}</td>
                <td style="text-align: center;">
                    <button class="bom-action-btn delete" title="删除" onclick="window.bomArchiveModule.deleteBomItem(${item.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
        }).join('');

        // 添加新行按钮
        const addRowBtn = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 16px;">
                    <button class="btn btn-secondary" onclick="window.bomArchiveModule.addBomItem()" style="width: auto;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        添加物料
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', addRowBtn);
        
        // 检查变更并更新保存按钮状态
        checkBomChanges();
    }

    // 渲染版本列表（包括当前版本）
    function renderHistoryVersions(project) {
        const container = document.getElementById('historyVersionList');
        if (!container) return;

        // 显示所有版本，从新到旧
        const allVersions = [...project.versions];
        document.getElementById('historyVersionCount').textContent = `(${allVersions.length})`;

        if (allVersions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <div class="empty-text">暂无版本</div>
                    <div class="empty-subtext">当您更新BOM时，版本会自动保存</div>
                </div>
            `;
            return;
        }

        container.innerHTML = allVersions.map((version, index) => {
            const itemCount = version.bomItems.length;
            const isCurrent = index === 0;
            const createMethod = version.createMethod || '手动更新';
            const description = version.description || '';
            const createMethodClass = createMethod === '硅宝创建' ? 'create-method-ai' : 
                                     createMethod === '手动更新' ? 'create-method-manual' : 'create-method-import';
            
            return `
                <div class="history-version-item ${isCurrent ? 'current-version' : ''}">
                    <div class="history-version-checkbox" onclick="event.stopPropagation()">
                        <input type="checkbox" class="version-checkbox" data-version="${version.version}" data-version-index="${index}" onchange="window.bomArchiveModule.updateVersionExportButtonState()">
                    </div>
                    <div class="history-version-content" onclick="window.bomArchiveModule.viewVersionDetail('${version.version}', ${index})">
                        <div class="history-version-header">
                            <div class="history-version-title">
                                <span class="history-version-badge">${version.version}</span>
                                ${isCurrent ? '<span class="current-badge">当前版本</span>' : ''}
                                <span class="history-version-date">${version.updateTime || version.date}</span>
                            </div>
                            <div class="history-version-actions" onclick="event.stopPropagation()">
                                <button class="history-version-btn" onclick="window.bomArchiveModule.viewVersionDetail('${version.version}', ${index})">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                    查看
                                </button>
                            </div>
                        </div>
                        <div class="history-version-info">
                            <div class="history-version-info-item">
                                <div class="history-version-info-label">物料数量</div>
                                <div class="history-version-info-value">${itemCount} 项</div>
                            </div>
                            <div class="history-version-info-item">
                                <div class="history-version-info-label">创建日期</div>
                                <div class="history-version-info-value">${version.date}</div>
                            </div>
                            <div class="history-version-info-item">
                                <div class="history-version-info-label">创建方式</div>
                                <div class="history-version-info-value">
                                    <span class="create-method-tag ${createMethodClass}">${escapeHtml(createMethod)}</span>
                                </div>
                            </div>
                        </div>
                        ${description ? `
                        <div class="history-version-description" ${description ? `data-tooltip="${escapeHtml(description)}"` : ''}>
                            ${escapeHtml(description)}
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // 更新版本导出按钮状态
        updateVersionExportButtonState();
        
        // 初始化版本描述tooltip
        initVersionDescriptionTooltips();
    }

    // 切换版本标签
    function switchVersionTab(tabType) {
        // 更新标签状态
        document.querySelectorAll('.version-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.version-tab[data-tab="${tabType}"]`).classList.add('active');

        // 切换内容
        if (tabType === 'current') {
            document.getElementById('currentVersionContent').style.display = 'block';
            document.getElementById('historyVersionContent').style.display = 'none';
            // 隐藏版本列表的导出按钮
            const versionTabsActions = document.getElementById('versionTabsActions');
            if (versionTabsActions) {
                versionTabsActions.style.display = 'none';
            }
        } else {
            document.getElementById('currentVersionContent').style.display = 'none';
            document.getElementById('historyVersionContent').style.display = 'block';
            // 显示版本列表的导出按钮
            const versionTabsActions = document.getElementById('versionTabsActions');
            if (versionTabsActions) {
                versionTabsActions.style.display = 'flex';
            }
        }
    }

    // 显示项目列表
    function showProjectList() {
        currentView = 'list';
        currentProjectId = null;

        document.getElementById('projectListView').style.display = 'block';
        document.getElementById('projectDetailView').style.display = 'none';

        renderProjectList();
        updateExportButtonState();
    }

    // 初始化项目模态框
    function initProjectModal() {
        const overlay = document.getElementById('projectModalOverlay');
        const closeBtn = document.getElementById('projectModalClose');
        const cancelBtn = document.getElementById('projectModalCancel');
        const confirmBtn = document.getElementById('projectModalConfirm');

        function closeModal() {
            overlay.style.display = 'none';
            document.getElementById('projectNameInput').value = '';
            document.getElementById('projectDescInput').value = '';
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) closeModal();
            });
        }
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                const name = document.getElementById('projectNameInput').value.trim();
                if (!name) {
                    if (window.showToast) {
                        window.showToast('请输入项目名称');
                    }
                    return;
                }
                saveProject(name, document.getElementById('projectDescInput').value.trim());
                closeModal();
            });
        }
    }

    // 打开项目模态框
    function openProjectModal(projectId = null) {
        const modal = document.getElementById('projectModalOverlay');
        const title = document.getElementById('projectModalTitle');
        const nameInput = document.getElementById('projectNameInput');
        const descInput = document.getElementById('projectDescInput');

        if (projectId) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                title.textContent = '编辑项目';
                nameInput.value = project.name;
                descInput.value = project.description || '';
                modal.setAttribute('data-project-id', projectId);
            }
        } else {
            title.textContent = '新建项目';
            nameInput.value = '';
            descInput.value = '';
            modal.removeAttribute('data-project-id');
        }

        modal.style.display = 'flex';
        nameInput.focus();
    }

    // 保存项目
    function saveProject(name, description) {
        const modal = document.getElementById('projectModalOverlay');
        const projectId = modal.getAttribute('data-project-id');

        if (projectId) {
            // 编辑项目
            const project = projects.find(p => p.id === parseInt(projectId));
            if (project) {
                project.name = name;
                project.description = description;
                if (window.showToast) {
                    window.showToast('项目已更新');
                }
            }
        } else {
            // 新建项目
            const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
            projects.unshift({
                id: newId,
                name: name,
                description: description,
                versions: []
            });
            if (window.showToast) {
                window.showToast('项目已创建');
            }
        }

        renderProjectList();
        updateExportButtonState();
    }

    // 编辑项目
    function editProject(projectId) {
        openProjectModal(projectId);
    }

    // 删除项目
    function deleteProject(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        if (window.showConfirm) {
            window.showConfirm(`确定要删除项目 "${project.name}" 吗？此操作不可恢复。`, function() {
                projects = projects.filter(p => p.id !== projectId);
                renderProjectList();
                updateExportButtonState();
                if (window.showToast) {
                    window.showToast('项目已删除');
                }
            });
        } else {
            if (confirm(`确定要删除项目 "${project.name}" 吗？此操作不可恢复。`)) {
                projects = projects.filter(p => p.id !== projectId);
                renderProjectList();
                updateExportButtonState();
                if (window.showToast) {
                    window.showToast('项目已删除');
                }
            }
        }
    }

    // 更新BOM项
    function updateBomItem(itemId, field, value) {
        if (!currentProjectId) return;
        const project = projects.find(p => p.id === currentProjectId);
        if (!project || !project.versions[0]) return;

        const item = project.versions[0].bomItems.find(i => i.id === itemId);
        if (item) {
            item[field] = value;
        }
    }

    // 添加BOM项
    function addBomItem() {
        if (!currentProjectId) return;
        const project = projects.find(p => p.id === currentProjectId);
        if (!project) return;

        if (!project.versions[0]) {
            // 创建第一个版本
            project.versions.unshift({
                version: 'v1.0',
                date: new Date().toISOString().split('T')[0],
                bomItems: []
            });
        }

        const latestVersion = project.versions[0];
        const newId = latestVersion.bomItems.length > 0 
            ? Math.max(...latestVersion.bomItems.map(i => i.id)) + 1 
            : 1;

        latestVersion.bomItems.push({
            id: newId,
            refDes: '',
            category: '',
            value: '',
            package: '',
            manufacturer: '',
            mpn: '',
            detailSpec: '',
            appliedBomCount: Math.floor(Math.random() * 50) + 1
        });

        renderCurrentVersion(project);
        checkBomChanges();
    }

    // 删除BOM项
    function deleteBomItem(itemId) {
        if (!currentProjectId) return;
        const project = projects.find(p => p.id === currentProjectId);
        if (!project || !project.versions[0]) return;

        if (window.showConfirm) {
            window.showConfirm('确定要删除这个物料吗？', function() {
                project.versions[0].bomItems = project.versions[0].bomItems.filter(i => i.id !== itemId);
                renderCurrentVersion(project);
                checkBomChanges();
            });
        } else {
            if (confirm('确定要删除这个物料吗？')) {
                project.versions[0].bomItems = project.versions[0].bomItems.filter(i => i.id !== itemId);
                renderCurrentVersion(project);
                checkBomChanges();
            }
        }
    }

    // 查看版本详情
    function viewVersionDetail(version, versionIndex) {
        if (!currentProjectId) return;
        const project = projects.find(p => p.id === currentProjectId);
        if (!project) return;

        const targetVersion = project.versions[versionIndex];
        if (!targetVersion) return;

        // 打开版本查看弹窗
        openVersionViewModal(targetVersion);
    }

    // 打开版本查看弹窗
    function openVersionViewModal(version) {
        const overlay = document.getElementById('versionViewModalOverlay');
        const modal = document.getElementById('versionViewModal');
        const title = document.getElementById('versionViewModalTitle');
        const tbody = document.getElementById('versionViewBomTableBody');

        if (!overlay || !modal || !title || !tbody) return;

        // 设置标题
        title.textContent = version.version;

        // 渲染BOM表格
        if (!version.bomItems || version.bomItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 80px 20px;">
                        <div class="empty-state">
                            <div class="empty-icon">📋</div>
                            <div class="empty-text">该版本暂无BOM数据</div>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = version.bomItems.map(item => {
                // 随机生成已应用BOM数（1-50之间的整数）
                const appliedBomCount = item.appliedBomCount !== undefined ? item.appliedBomCount : Math.floor(Math.random() * 50) + 1;
                return `
                <tr>
                    <td>${escapeHtml(item.refDes || '')}</td>
                    <td>${escapeHtml(item.category || '')}</td>
                    <td>${escapeHtml(item.value || '')}</td>
                    <td>${escapeHtml(item.package || '')}</td>
                    <td>${escapeHtml(item.manufacturer || '')}</td>
                    <td>${escapeHtml(item.mpn || '')}</td>
                    <td style="text-align: center;">${appliedBomCount}</td>
                </tr>
            `;
            }).join('');
        }

        // 显示弹窗
        overlay.style.display = 'flex';
    }

    // 关闭版本查看弹窗
    function closeVersionViewModal() {
        const overlay = document.getElementById('versionViewModalOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // 初始化版本查看弹窗
    function initVersionViewModal() {
        const overlay = document.getElementById('versionViewModalOverlay');
        const closeBtn = document.getElementById('versionViewModalClose');

        if (closeBtn) {
            closeBtn.addEventListener('click', closeVersionViewModal);
        }

        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closeVersionViewModal();
                }
            });
        }
    }

    // 下载模板
    function downloadTemplate() {
        // 创建CSV模板
        const headers = ['序号', '物料编码', '物料名称', '规格型号', '数量', '单位', '备注'];
        const csvContent = headers.join(',') + '\n';
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'BOM模板.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (window.showToast) {
            window.showToast('模板已下载');
        }
    }

    // 导入BOM
    function importBOM() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.xlsx,.xls';
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // 这里应该解析文件并导入BOM数据
            // 暂时显示提示
            if (window.showToast) {
                window.showToast('BOM导入功能开发中，敬请期待');
            }
        });
        input.click();
    }

    // 导出BOM
    function exportBOM() {
        if (!currentProjectId) return;
        const project = projects.find(p => p.id === currentProjectId);
        if (!project || !project.versions[0]) {
            if (window.showToast) {
                window.showToast('当前没有可导出的BOM数据');
            }
            return;
        }

        const version = project.versions[0];
        const headers = ['序号', '物料编码', '物料名称', '规格型号', '数量', '单位', '备注'];
        const rows = version.bomItems.map(item => [
            item.seq,
            item.code,
            item.name,
            item.spec,
            item.quantity,
            item.unit,
            item.remark || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${project.name}_${version.version}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (window.showToast) {
            window.showToast('BOM已导出');
        }
    }

    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 保存原始BOM数据
    function saveOriginalBomData(project) {
        if (!project || !project.versions[0]) {
            originalBomData = null;
            return;
        }
        // 深拷贝当前版本的BOM数据
        originalBomData = JSON.parse(JSON.stringify(project.versions[0].bomItems));
    }
    
    // 检查BOM是否有变更
    function checkBomChanges() {
        const saveBtn = document.getElementById('saveAsNewVersionBtn');
        if (!saveBtn) return;
        
        if (!currentProjectId || !originalBomData) {
            saveBtn.disabled = true;
            return;
        }
        
        const project = projects.find(p => p.id === currentProjectId);
        if (!project || !project.versions[0]) {
            saveBtn.disabled = true;
            return;
        }
        
        const currentBomData = project.versions[0].bomItems;
        const hasChanges = JSON.stringify(currentBomData) !== JSON.stringify(originalBomData);
        
        saveBtn.disabled = !hasChanges;
    }
    
    // 更新版本导出按钮状态
    function updateVersionExportButtonState() {
        const exportBtn = document.getElementById('exportVersionsBtn');
        if (!exportBtn) return;
        
        const checkedBoxes = document.querySelectorAll('.version-checkbox:checked');
        const hasSelected = checkedBoxes.length > 0;
        
        exportBtn.disabled = !hasSelected;
    }
    
    // 导出选中的版本
    function exportSelectedVersions() {
        const checkedBoxes = document.querySelectorAll('.version-checkbox:checked');
        if (checkedBoxes.length === 0) {
            if (window.showToast) {
                window.showToast('请选择要导出的版本');
            }
            return;
        }
        
        // 导出功能暂未实现，仅作按钮示意
        // const selectedIndices = Array.from(checkedBoxes).map(cb => parseInt(cb.getAttribute('data-version-index')));
        // const project = projects.find(p => p.id === currentProjectId);
        // if (!project) return;
        // ... 导出BOM的实际代码已屏蔽
    }
    
    // 初始化版本描述tooltip
    function initVersionDescriptionTooltips() {
        const descriptionElements = document.querySelectorAll('.history-version-description[data-tooltip]');
        let tooltipElement = null;

        function createTooltip() {
            if (!tooltipElement) {
                tooltipElement = document.createElement('div');
                tooltipElement.className = 'description-tooltip';
                document.body.appendChild(tooltipElement);
            }
            return tooltipElement;
        }

        function showTooltip(element, text) {
            const tooltipEl = createTooltip();
            tooltipEl.textContent = text;

            const rect = element.getBoundingClientRect();
            tooltipEl.style.left = (rect.left + rect.width / 2) + 'px';
            tooltipEl.style.top = (rect.top - 12) + 'px';
            tooltipEl.style.transform = 'translate(-50%, -100%)';

            tooltipEl.classList.add('show');
        }

        function hideTooltip() {
            if (tooltipElement) {
                tooltipElement.classList.remove('show');
            }
        }

        descriptionElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                if (tooltipText) {
                    showTooltip(this, tooltipText);
                }
            });

            element.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        });
    }
    
    // 打开发布新版本弹窗
    function openNewVersionModal() {
        const overlay = document.getElementById('newVersionModalOverlay');
        if (!overlay) return;
        
        // 清空输入
        document.getElementById('newVersionNumberInput').value = '';
        document.getElementById('newVersionDescInput').value = '';
        
        overlay.style.display = 'flex';
    }
    
    // 关闭发布新版本弹窗
    function closeNewVersionModal() {
        const overlay = document.getElementById('newVersionModalOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    // 保存为新版本
    function saveAsNewVersion() {
        const versionNumber = document.getElementById('newVersionNumberInput').value.trim();
        const versionDesc = document.getElementById('newVersionDescInput').value.trim();
        
        if (!versionNumber) {
            if (window.showToast) {
                window.showToast('请输入版本号');
            }
            return;
        }
        
        if (!versionDesc) {
            if (window.showToast) {
                window.showToast('请输入版本描述');
            }
            return;
        }
        
        if (!currentProjectId) return;
        const project = projects.find(p => p.id === currentProjectId);
        if (!project || !project.versions[0]) return;
        
        // 创建新版本
        const newVersion = {
            version: versionNumber,
            date: new Date().toISOString().split('T')[0],
            updateTime: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5),
            createMethod: '手动更新',
            description: versionDesc,
            bomItems: JSON.parse(JSON.stringify(project.versions[0].bomItems))
        };
        
        // 插入到最前面（最新版本）
        project.versions.unshift(newVersion);
        
        // 更新原始数据
        saveOriginalBomData(project);
        
        // 重新渲染
        renderCurrentVersion(project);
        renderHistoryVersions(project);
        
        // 关闭弹窗
        closeNewVersionModal();
        
        // 显示成功提示
        if (window.showToast) {
            window.showToast('新版本已保存');
        }
    }
    
    // 初始化发布新版本弹窗
    function initNewVersionModal() {
        const overlay = document.getElementById('newVersionModalOverlay');
        const closeBtn = document.getElementById('newVersionModalClose');
        const cancelBtn = document.getElementById('newVersionModalCancel');
        const confirmBtn = document.getElementById('newVersionModalConfirm');

        if (closeBtn) closeBtn.addEventListener('click', closeNewVersionModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeNewVersionModal);
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) closeNewVersionModal();
            });
        }
        if (confirmBtn) {
            confirmBtn.addEventListener('click', saveAsNewVersion);
        }
    }

    // 初始化导入BOM弹窗
    function initImportBomModal() {
        const importBomBtn = document.getElementById('importBomBtn');
        const overlay = document.getElementById('importBomModalOverlay');
        const closeBtn = document.getElementById('importBomModalClose');
        const cancelBtn = document.getElementById('importBomModalCancel');
        const confirmBtn = document.getElementById('importBomModalConfirm');
        const fileSelectBox = document.getElementById('fileSelectBox');
        const fileSelectLabel = document.getElementById('fileSelectLabel');
        const btnClearFile = document.getElementById('btnClearFile');
        const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');

        let hasFile = false;

        // 打开导入弹窗
        if (importBomBtn) {
            importBomBtn.addEventListener('click', function() {
                openImportBomModal();
            });
        }

        // 关闭弹窗
        if (closeBtn) closeBtn.addEventListener('click', closeImportBomModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeImportBomModal);
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) closeImportBomModal();
            });
        }

        // 点击文件选择框 - 模拟选择文件
        if (fileSelectBox) {
            fileSelectBox.addEventListener('click', function(e) {
                if (!e.target.closest('.btn-clear-file') && !hasFile) {
                    selectFile();
                }
            });
        }

        // 清除文件
        if (btnClearFile) {
            btnClearFile.addEventListener('click', function(e) {
                e.stopPropagation();
                clearFile();
            });
        }

        // 下载模板
        if (downloadTemplateBtn) {
            downloadTemplateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                downloadTemplate();
            });
        }

        // 确认导入
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                importBom();
            });
        }

        // 模拟选择文件
        function selectFile() {
            hasFile = true;
            fileSelectBox.classList.add('has-file');
            if (fileSelectLabel) {
                fileSelectLabel.textContent = 'BOM数据表.xlsx';
            }
            if (btnClearFile) {
                btnClearFile.style.display = 'flex';
            }
            if (confirmBtn) {
                confirmBtn.disabled = false;
            }
            if (window.showToast) {
                window.showToast('文件已选择', 'success');
            }
        }

        // 清除文件
        function clearFile() {
            hasFile = false;
            fileSelectBox.classList.remove('has-file');
            if (fileSelectLabel) {
                fileSelectLabel.textContent = '点击选择Excel文件';
            }
            if (btnClearFile) {
                btnClearFile.style.display = 'none';
            }
            if (confirmBtn) {
                confirmBtn.disabled = true;
            }
        }

        // 下载模板
        function downloadTemplate() {
            if (window.showToast) {
                window.showToast('BOM导入模板下载成功！', 'success');
            }
        }

        // 导入BOM
        function importBom() {
            if (!hasFile) {
                if (window.showToast) {
                    window.showToast('请先选择文件', 'error');
                }
                return;
            }

            // 显示加载状态
            confirmBtn.disabled = true;
            const originalText = confirmBtn.innerHTML;
            confirmBtn.innerHTML = '<span>导入中...</span>';

            // 模拟导入过程
            setTimeout(function() {
                if (window.showToast) {
                    window.showToast('BOM导入成功！', 'success');
                }
                
                // 模拟添加新的BOM数据
                const project = projects.find(p => p.id === currentProjectId);
                if (project && project.versions.length > 0) {
                    // 添加一些示例数据到当前版本
                    const currentVersion = project.versions[0];
                    const newItems = [
                        { id: Date.now(), refDes: 'C7,C8', category: '电容', value: '100uF', package: '0805', manufacturer: 'Samsung', mpn: 'CL21A107MQCLQNC', detailSpec: '' },
                        { id: Date.now() + 1, refDes: 'R3,R4,R5', category: '电阻', value: '4.7K', package: '0603', manufacturer: 'YAGEO', mpn: 'RC0603FR-074K7L', detailSpec: '' }
                    ];
                    currentVersion.bomItems.push(...newItems);
                    
                    // 重新渲染当前版本
                    renderCurrentVersion();
                }
                
                confirmBtn.innerHTML = originalText;
                closeImportBomModal();
            }, 1500);
        }

        // 打开弹窗
        function openImportBomModal() {
            if (overlay) overlay.style.display = 'flex';
            setTimeout(function() {
                const modal = document.getElementById('importBomModal');
                if (modal) modal.style.opacity = '1';
            }, 10);
        }

        // 关闭弹窗
        function closeImportBomModal() {
            const modal = document.getElementById('importBomModal');
            if (modal) modal.style.opacity = '0';
            setTimeout(function() {
                if (overlay) overlay.style.display = 'none';
                clearFile();
            }, 300);
        }
    }

    // 导出到全局
    window.bomArchiveModule = {
        showProjectDetail,
        editProject,
        deleteProject,
        updateBomItem,
        addBomItem,
        deleteBomItem,
        viewVersionDetail,
        updateExportButtonState,
        updateVersionExportButtonState
    };

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

