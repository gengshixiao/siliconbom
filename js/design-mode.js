/**
 * 设计模式模块 - 独立功能模块，与现有功能解耦
 */
(function() {
    'use strict';

    // 元器件图标映射（SVG图标）
    const componentIcons = {
        'battery': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="6" width="18" height="10" rx="2"/>
            <line x1="23" y1="13" x2="23" y2="11"/>
        </svg>`,
        'battery-monitor': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="16" height="10" rx="2"/>
            <line x1="6" y1="11" x2="6" y2="13"/>
            <line x1="10" y1="11" x2="10" y2="13"/>
            <line x1="14" y1="11" x2="14" y2="13"/>
            <line x1="22" y1="11" x2="22" y2="13"/>
        </svg>`,
        'battery-housing': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="8" width="14" height="8" rx="1"/>
            <line x1="7" y1="12" x2="7" y2="14"/>
            <line x1="11" y1="12" x2="11" y2="14"/>
            <line x1="15" y1="12" x2="15" y2="14"/>
        </svg>`,
        'mcu': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <circle cx="12" cy="12" r="2"/>
            <line x1="12" y1="6" x2="12" y2="8"/>
            <line x1="12" y1="16" x2="12" y2="18"/>
            <line x1="6" y1="12" x2="8" y2="12"/>
            <line x1="16" y1="12" x2="18" y2="12"/>
        </svg>`,
        'processor': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <rect x="9" y="9" width="6" height="6"/>
            <line x1="9" y1="1" x2="9" y2="4"/>
            <line x1="15" y1="1" x2="15" y2="4"/>
            <line x1="9" y1="20" x2="9" y2="23"/>
            <line x1="15" y1="20" x2="15" y2="23"/>
            <line x1="20" y1="9" x2="23" y2="9"/>
            <line x1="20" y1="14" x2="23" y2="14"/>
            <line x1="1" y1="9" x2="4" y2="9"/>
            <line x1="1" y1="14" x2="4" y2="14"/>
        </svg>`,
        'gas-sensor': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="5"/>
            <path d="M12 13v8"/>
            <line x1="8" y1="18" x2="16" y2="18"/>
            <line x1="10" y1="21" x2="14" y2="21"/>
        </svg>`,
        'temp-sensor': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
        </svg>`,
        'buzzer': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5Z"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>`,
        'led': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24 4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24 4.24-4.24"/>
        </svg>`,
        'display': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>`,
        'dc-dc': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <path d="M6 10h12M6 14h12"/>
            <circle cx="8" cy="12" r="1"/>
            <circle cx="16" cy="12" r="1"/>
        </svg>`,
        'ldo': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="6" width="18" height="12" rx="1"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
            <line x1="12" y1="9" x2="12" y2="15"/>
        </svg>`,
        'voltage-monitor': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            <path d="M7 10h10M7 14h10"/>
            <circle cx="9" cy="12" r="1"/>
            <circle cx="15" cy="12" r="1"/>
            <line x1="12" y1="4" x2="12" y2="2"/>
        </svg>`,
        'power-mosfet': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="6" width="16" height="12" rx="1"/>
            <line x1="8" y1="10" x2="16" y2="10"/>
            <line x1="8" y1="14" x2="16" y2="14"/>
            <line x1="12" y1="6" x2="12" y2="4"/>
            <line x1="12" y1="18" x2="12" y2="20"/>
            <line x1="4" y1="12" x2="2" y2="12"/>
            <line x1="20" y1="12" x2="22" y2="12"/>
        </svg>`,
        'isolated-dc-dc': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <path d="M6 10h12M6 14h12"/>
            <line x1="2" y1="12" x2="0" y2="12"/>
            <line x1="22" y1="12" x2="24" y2="12"/>
            <circle cx="8" cy="12" r="1"/>
            <circle cx="16" cy="12" r="1"/>
        </svg>`,
        'current-sense-resistor': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="10" width="16" height="4" rx="1"/>
            <line x1="2" y1="12" x2="4" y2="12"/>
            <line x1="20" y1="12" x2="22" y2="12"/>
            <line x1="8" y1="8" x2="8" y2="10"/>
            <line x1="16" y1="8" x2="16" y2="10"/>
            <line x1="8" y1="14" x2="8" y2="16"/>
            <line x1="16" y1="14" x2="16" y2="16"/>
        </svg>`,
        'protection-diode': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l6-6M9 12l6 6"/>
            <line x1="3" y1="12" x2="9" y2="12"/>
            <line x1="15" y1="12" x2="21" y2="12"/>
            <circle cx="12" cy="12" r="1"/>
        </svg>`,
        'mcu-f030': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <circle cx="12" cy="12" r="2"/>
            <line x1="12" y1="6" x2="12" y2="8"/>
            <line x1="12" y1="16" x2="12" y2="18"/>
            <line x1="6" y1="12" x2="8" y2="12"/>
            <line x1="16" y1="12" x2="18" y2="12"/>
            <line x1="8" y1="8" x2="8" y2="8"/>
            <line x1="16" y1="8" x2="16" y2="8"/>
        </svg>`
    };

    // 元器件物料编码映射（标准料号格式）
    const componentPartNumbers = {
        'battery': '18650-3.7V-2000mAh',
        'battery-monitor': 'BQ27441-G1',
        'battery-housing': 'BH-18650-2S',
        'mcu': 'STM32F103C8T6',
        'processor': 'STM32F407VGT6',
        'gas-sensor': 'MQ-2',
        'temp-sensor': 'DS18B20',
        'buzzer': 'PZT-5V-12MM',
        'led': 'LED-RED-5MM',
        'display': 'OLED-12864-I2C',
        'dc-dc': 'LM2596S-ADJ',
        'ldo': 'AMS1117-3.3',
        'voltage-monitor': 'TPS3813K33DBVR',
        'power-mosfet': 'IRFB4115PBF',
        'isolated-dc-dc': 'TMR 3-2412WI',
        'current-sense-resistor': 'WSL2512R0100FEA',
        'protection-diode': 'MBRS340T3G',
        'mcu-f030': 'STM32F030C8T6'
    };

    // 元器件库数据
    const componentLibrary = {
        '电池管理': {
            expanded: true,
            items: [
                { id: 'battery', label: '电池', ports: ['SUPPLY'] },
                { id: 'battery-monitor', label: '电池监控', ports: ['I2C'] },
                { id: 'battery-housing', label: '电池外壳', ports: [] },
            ]
        },
        '嵌入式处理': {
            expanded: true,
            items: [
                { id: 'mcu', label: '微控制器', ports: ['SUPPLY', 'I2C', 'GPIO', 'GPIO'] },
                { id: 'processor', label: '处理器', ports: ['SUPPLY', 'I2C', 'GPIO'] },
            ]
        },
        '测量和传感': {
            expanded: true,
            items: [
                { id: 'gas-sensor', label: '气体/液体浓度传感器', ports: ['I2C', 'SUPPLY'] },
                { id: 'temp-sensor', label: '温度传感器', ports: ['I2C'] },
            ]
        },
        '人机界面': {
            expanded: false,
            items: [
                { id: 'buzzer', label: '蜂鸣器', ports: ['GPIO'] },
                { id: 'led', label: '标准LED', ports: ['GPIO'] },
                { id: 'display', label: '显示屏', ports: ['I2C', 'GPIO'] },
            ]
        },
        '电源管理': {
            expanded: false,
            items: [
                { id: 'dc-dc', label: '开关式DC-DC转换', ports: ['SUPPLY', 'SUPPLY'] },
                { id: 'isolated-dc-dc', label: '隔离型DC-DC转换器', ports: ['SUPPLY', 'SUPPLY'] },
                { id: 'ldo', label: 'LDO稳压器', ports: ['SUPPLY', 'SUPPLY'] },
                { id: 'voltage-monitor', label: '电压检测芯片', ports: ['SUPPLY', 'GPIO'] },
                { id: 'power-mosfet', label: '功率MOSFET', ports: ['SUPPLY', 'GPIO', 'SUPPLY'] },
                { id: 'protection-diode', label: '保护二极管', ports: ['SUPPLY', 'SUPPLY'] },
            ]
        },
        '被动元件': {
            expanded: false,
            items: [
                { id: 'current-sense-resistor', label: '电流检测电阻', ports: ['SUPPLY', 'SUPPLY'] },
            ]
        }
    };

    // 设计状态
    let designState = {
        components: [],
        connections: [],
        nextComponentId: 1,
        selectedComponent: null,
        activities: [] // 操作记录
    };

    // 面板状态
    let panelState = {
        libraryVisible: true,
        copilotVisible: true
    };

    // 画布状态
    let canvasState = {
        scale: 1,
        panX: 0,
        panY: 0,
        isPanning: false,
        panStartX: 0,
        panStartY: 0,
        connecting: false,
        connectionStart: null
    };

    // 初始化画布状态（居中显示）
    function initCanvasState() {
        const canvasWrapper = document.querySelector('.design-canvas-wrapper');
        if (canvasWrapper) {
            const rect = canvasWrapper.getBoundingClientRect();
            // 将画布中心对齐到viewport中心
            canvasState.panX = rect.width / 2 - 2500;
            canvasState.panY = rect.height / 2 - 2500;
            updateCanvasTransform();
        }
    }

    // 初始化
    function init() {
        initBackHome();
        initPanelToggles();
        initLibraryPanel();
        initCanvas();
        initCopilot();
        initEventListeners();
        initTitleEditor();
        initTopbarActions();
        initActivityLog();
        initPopupMenus();
    }

    // 初始化返回首页功能
    function initBackHome() {
        const backHomeBtn = document.getElementById('backHomeBtn');
        if (backHomeBtn) {
            backHomeBtn.addEventListener('click', () => {
                window.location.href = './index.html';
            });
        }
    }

    // 初始化面板切换功能
    function initPanelToggles() {
        const toggleLibraryBtn = document.getElementById('toggleLibraryBtn');
        const toggleSiliconBtn = document.getElementById('toggleSiliconBtn');
        const libraryPanel = document.getElementById('designLibraryPanel');
        const copilotPanel = document.getElementById('designCopilotPanel');

        if (toggleLibraryBtn && libraryPanel) {
            toggleLibraryBtn.addEventListener('click', () => {
                panelState.libraryVisible = !panelState.libraryVisible;
                libraryPanel.classList.toggle('collapsed', !panelState.libraryVisible);
                toggleLibraryBtn.classList.toggle('active', panelState.libraryVisible);
            });
            toggleLibraryBtn.classList.add('active');
        }

        if (toggleSiliconBtn && copilotPanel) {
            toggleSiliconBtn.addEventListener('click', () => {
                panelState.copilotVisible = !panelState.copilotVisible;
                copilotPanel.classList.toggle('collapsed', !panelState.copilotVisible);
                toggleSiliconBtn.classList.toggle('active', panelState.copilotVisible);
            });
            toggleSiliconBtn.classList.add('active');
        }
    }

    // 初始化元器件库面板
    function initLibraryPanel() {
        const libraryContent = document.getElementById('libraryContent');
        if (!libraryContent) return;

        libraryContent.innerHTML = '';

        Object.keys(componentLibrary).forEach(categoryName => {
            const category = componentLibrary[categoryName];
            const categoryEl = createCategoryElement(categoryName, category);
            libraryContent.appendChild(categoryEl);
        });

        const searchInput = document.getElementById('librarySearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', handleLibrarySearch);
        }
    }

    // 创建分类元素
    function createCategoryElement(name, category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'component-category' + (category.expanded ? ' expanded' : '');

        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <span class="category-header-title">${name}</span>
            <svg class="category-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;
        header.addEventListener('click', () => {
            categoryDiv.classList.toggle('expanded');
        });

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'category-items';

        category.items.forEach(item => {
            const itemEl = createComponentItem(item);
            itemsDiv.appendChild(itemEl);
        });

        categoryDiv.appendChild(header);
        categoryDiv.appendChild(itemsDiv);

        return categoryDiv;
    }

    // 创建元器件项
    function createComponentItem(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'component-item';
        itemDiv.draggable = true;
        
        const iconHtml = componentIcons[item.id] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
        </svg>`;
        
        itemDiv.innerHTML = `
            <div class="component-item-icon">${iconHtml}</div>
            <div class="component-item-label">${item.label}</div>
        `;

        itemDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify(item));
            e.dataTransfer.effectAllowed = 'copy';
        });

        return itemDiv;
    }

    // 搜索处理
    function handleLibrarySearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const categories = document.querySelectorAll('.component-category');

        categories.forEach(categoryEl => {
            const items = categoryEl.querySelectorAll('.component-item');
            let hasMatch = false;

            items.forEach(item => {
                const label = item.querySelector('.component-item-label').textContent.toLowerCase();
                if (label.includes(searchTerm)) {
                    item.style.display = '';
                    hasMatch = true;
                } else {
                    item.style.display = 'none';
                }
            });

            if (searchTerm && hasMatch) {
                categoryEl.classList.add('expanded');
            }
        });
    }

    // 初始化画布
    function initCanvas() {
        const canvasWrapper = document.querySelector('.design-canvas-wrapper');
        const canvas = document.getElementById('designCanvas');
        if (!canvas || !canvasWrapper) return;

        // 初始化SVG尺寸（连接线和网格）- SVG作为canvas子元素会自动跟随transform
        const connectionsSvg = document.getElementById('canvasConnections');
        const gridSvg = document.getElementById('canvasGrid');
        if (connectionsSvg) {
            connectionsSvg.setAttribute('width', '5000');
            connectionsSvg.setAttribute('height', '5000');
            connectionsSvg.setAttribute('viewBox', '0 0 5000 5000');
        }
        if (gridSvg) {
            gridSvg.setAttribute('width', '5000');
            gridSvg.setAttribute('height', '5000');
            gridSvg.setAttribute('viewBox', '0 0 5000 5000');
        }

        // 初始化画布位置（居中）
        initCanvasState();

        // 全局阻止右键菜单（在画布区域）
        const preventContextMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        canvasWrapper.addEventListener('contextmenu', preventContextMenu, { passive: false });
        canvas.addEventListener('contextmenu', preventContextMenu, { passive: false });

        // 鼠标滚轮/触控板：仅平移画布（缩放交给按钮）
        canvasWrapper.addEventListener('wheel', (e) => {
            e.preventDefault();

            const scrollSpeed = e.deltaMode === 0 ? 1 : 10; // 触控板用1，鼠标用10
            canvasState.panX -= e.deltaX * scrollSpeed;
            canvasState.panY -= e.deltaY * scrollSpeed;

            updateCanvasTransform();
        }, { passive: false });

        // 拖拽平移（空格键+左键，或者中键）
        let spaceKeyPressed = false;
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.key === ' ') {
                spaceKeyPressed = true;
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space' || e.key === ' ') {
                spaceKeyPressed = false;
            }
        });
        
        canvasWrapper.addEventListener('mousedown', (e) => {
            // 如果点击的是连接点，不处理平移
            if (e.target.classList.contains('port-connector')) {
                return;
            }
            
            // 只响应中键（button === 1）或者空格键+左键
            const isMiddleButton = e.button === 1;
            const isSpaceLeftButton = e.button === 0 && spaceKeyPressed;
            
            if (!isMiddleButton && !isSpaceLeftButton) {
                return;
            }
            
            if (e.target === canvasWrapper || e.target.classList.contains('design-canvas') || 
                e.target.classList.contains('canvas-components') || e.target.classList.contains('canvas-connections') ||
                e.target.classList.contains('canvas-grid')) {
                canvasState.isPanning = true;
                const rect = canvasWrapper.getBoundingClientRect();
                canvasState.panStartX = e.clientX - rect.left - canvasState.panX;
                canvasState.panStartY = e.clientY - rect.top - canvasState.panY;
                canvasWrapper.classList.add('panning');
                e.preventDefault();
                e.stopPropagation();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (canvasState.isPanning) {
                e.preventDefault();
                const rect = canvasWrapper.getBoundingClientRect();
                canvasState.panX = e.clientX - rect.left - canvasState.panStartX;
                canvasState.panY = e.clientY - rect.top - canvasState.panStartY;
                updateCanvasTransform();
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (canvasState.isPanning) {
                canvasState.isPanning = false;
                canvasWrapper.classList.remove('panning');
                e.preventDefault();
            }
        });

        // 拖拽放置元器件
        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            if (!data) return;

            try {
                const component = JSON.parse(data);
                const wrapperRect = canvasWrapper.getBoundingClientRect();
                const canvas = document.getElementById('designCanvas');
                const canvasRect = canvas.getBoundingClientRect();
                
                // 转换屏幕坐标到画布坐标
                // 先计算相对于canvas元素的坐标
                const canvasX = e.clientX - canvasRect.left;
                const canvasY = e.clientY - canvasRect.top;
                
                // 考虑缩放，转换为画布实际坐标
                const worldX = canvasX / canvasState.scale;
                const worldY = canvasY / canvasState.scale;

                addComponentToCanvas(component, worldX, worldY);
            } catch (error) {
                console.error('Failed to parse component data:', error);
            }
        });

        // 连线系统的临时连线
        canvasWrapper.addEventListener('mousemove', (e) => {
            if (canvasState.connecting) {
                updateTempConnection(e);
            }
        });

        // 连线完成：在画布空白处点击取消连线
        canvasWrapper.addEventListener('mousedown', (e) => {
            // 如果点击的是连接点，不处理（让连接点的mousedown事件处理）
            if (e.target.classList.contains('port-connector')) {
                return;
            }
            
            if (canvasState.connecting) {
                // 如果点击的不是连接点，取消连线
                cancelConnection();
            }
        });

        initCanvasZoomControls();
    }

    // 将屏幕坐标转换为canvas本地坐标
    function screenToCanvas(screenX, screenY) {
        const canvasWrapper = document.querySelector('.design-canvas-wrapper');
        const canvas = document.getElementById('designCanvas');
        if (!canvasWrapper || !canvas) return { x: 0, y: 0 };

        const wrapperRect = canvasWrapper.getBoundingClientRect();
        const centerX = wrapperRect.width / 2;
        const centerY = wrapperRect.height / 2;
        
        // 屏幕坐标相对于wrapper
        const relX = screenX - wrapperRect.left;
        const relY = screenY - wrapperRect.top;
        
        // 转换为canvas本地坐标
        const canvasX = (relX - centerX - canvasState.panX + 2500 * canvasState.scale) / canvasState.scale;
        const canvasY = (relY - centerY - canvasState.panY + 2500 * canvasState.scale) / canvasState.scale;
        
        return { x: canvasX, y: canvasY };
    }

    // 更新画布变换
    function updateCanvasTransform() {
        const canvas = document.getElementById('designCanvas');
        if (!canvas) return;

        const canvasWrapper = document.querySelector('.design-canvas-wrapper');
        if (!canvasWrapper) return;
        
        const rect = canvasWrapper.getBoundingClientRect();
        // 计算画布中心点应该对齐到的位置
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // panX和panY是相对于viewport中心的偏移
        // 画布中心(2500, 2500)应该对齐到(centerX + panX, centerY + panY)
        const translateX = centerX + canvasState.panX - 2500 * canvasState.scale;
        const translateY = centerY + canvasState.panY - 2500 * canvasState.scale;
        
        canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${canvasState.scale})`;
        canvas.style.transformOrigin = '0 0';
        updateZoomLevel();
    }

    function initCanvasZoomControls() {
        const zoomInBtn = document.getElementById('canvasZoomIn');
        const zoomOutBtn = document.getElementById('canvasZoomOut');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                zoomCanvasByStep(0.1);
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                zoomCanvasByStep(-0.1);
            });
        }

        updateZoomLevel();
    }

    function zoomCanvasByStep(step) {
        const canvasWrapper = document.querySelector('.design-canvas-wrapper');
        if (!canvasWrapper) return;

        const rect = canvasWrapper.getBoundingClientRect();
        const anchorScreenX = rect.left + rect.width / 2;
        const anchorScreenY = rect.top + rect.height / 2;
        const viewportCenterX = rect.width / 2;
        const viewportCenterY = rect.height / 2;

        const anchorCanvas = screenToCanvas(anchorScreenX, anchorScreenY);
        const targetScale = Math.max(0.2, Math.min(2.5, canvasState.scale + step));

        canvasState.scale = targetScale;
        canvasState.panX = anchorScreenX - rect.left - viewportCenterX - anchorCanvas.x * targetScale + 2500 * targetScale;
        canvasState.panY = anchorScreenY - rect.top - viewportCenterY - anchorCanvas.y * targetScale + 2500 * targetScale;

        updateCanvasTransform();
    }

    function updateZoomLevel() {
        const zoomLevel = document.getElementById('canvasZoomLevel');
        if (!zoomLevel) return;
        zoomLevel.textContent = `${Math.round(canvasState.scale * 100)}%`;
    }

    // 添加元器件到画布
    function addComponentToCanvas(componentData, x, y) {
        const componentsContainer = document.getElementById('canvasComponents');
        if (!componentsContainer) return;

        const componentId = designState.nextComponentId++;
        const component = {
            id: componentId,
            type: componentData.id,
            label: componentData.label,
            ports: [...(componentData.ports || [])], // 复制数组
            x: x,
            y: y,
            partNumber: componentPartNumbers[componentData.id] || componentData.id // 存储物料编码
        };

        designState.components.push(component);

        const componentEl = createComponentBlock(component);
        componentsContainer.appendChild(componentEl);
        updateConnections();

        addActivityLog(`添加 ${component.label} 到画布`);
    }

    // 创建元器件块元素（统一连接点布局：每条边中心一个连接点）
    function createComponentBlock(component) {
        const block = document.createElement('div');
        block.className = 'canvas-component-block';
        block.dataset.componentId = component.id;
        block.style.left = component.x + 'px';
        block.style.top = component.y + 'px';
        
        const iconHtml = componentIcons[component.type] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
        </svg>`;
        
        // 如果物料编码为null/undefined，显示空字符串；否则显示物料编码或默认值
        const partNumber = (component.partNumber !== null && component.partNumber !== undefined) 
            ? component.partNumber 
            : '';
        const partNumberDisplay = partNumber || '待选型';

        // 先设置内容部分
        block.innerHTML = `
            <div class="component-block-content">
                <div class="component-block-number">${component.id}</div>
                <div class="component-block-icon">${iconHtml}</div>
                <div class="component-block-type">${component.label}</div>
                <div class="component-block-label">${partNumberDisplay}</div>
            </div>
        `;

        // 统一的连接点布局：每条边中心一个连接点
        const sides = ['top', 'right', 'bottom', 'left'];
        sides.forEach((side, index) => {
            const connector = document.createElement('div');
            connector.className = `port-connector ${side}`;
            connector.dataset.componentId = component.id;
            connector.dataset.portIndex = index; // 统一编号：0=top, 1=right, 2=bottom, 3=left
            connector.dataset.portSide = side;
            
            // 添加连接点事件
            connector.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!canvasState.connecting) {
                    startConnection(connector, component);
                } else {
                    // 如果已经在连线状态，点击另一个连接点完成连线
                    completeConnection(connector);
                }
            });
            
            // 直接追加到block
            block.appendChild(connector);
        });

        // 拖拽移动
        makeComponentDraggable(block, component);

        // 点击选择并显示操作气泡
        block.addEventListener('click', (e) => {
            if (!e.target.classList.contains('port-connector')) {
                e.stopPropagation();
                selectComponent(component.id);
                showComponentActionsPopup(e, component);
            }
        });

        return block;
    }

    // 开始连线
    function startConnection(connector, component) {
        canvasState.connecting = true;
        canvasState.connectionStart = {
            componentId: component.id,
            portIndex: parseInt(connector.dataset.portIndex),
            connector: connector
        };
        connector.classList.add('connecting');
    }

    // 更新临时连线
    function updateTempConnection(e) {
        if (!canvasState.connectionStart) return;

        const connectionsSvg = document.getElementById('canvasConnections');
        if (!connectionsSvg) return;

        // 获取起点位置
        const startConnector = canvasState.connectionStart.connector;
        const startComp = designState.components.find(c => c.id === canvasState.connectionStart.componentId);
        
        if (!startComp) return;
        
        const blockWidth = 180;
        const blockHeight = 100;
        let startX, startY;
        
        if (startConnector.dataset.portSide === 'top') {
            startX = startComp.x + blockWidth / 2;
            startY = startComp.y;
        } else if (startConnector.dataset.portSide === 'right') {
            startX = startComp.x + blockWidth;
            startY = startComp.y + blockHeight / 2;
        } else if (startConnector.dataset.portSide === 'bottom') {
            startX = startComp.x + blockWidth / 2;
            startY = startComp.y + blockHeight;
        } else { // left
            startX = startComp.x;
            startY = startComp.y + blockHeight / 2;
        }

        // 获取终点位置（鼠标位置，转换为canvas本地坐标）
        const endPos = screenToCanvas(e.clientX, e.clientY);

        // 生成路径
        const path = createOrthogonalPath(
            startX, startY, 
            endPos.x, endPos.y, 
            startConnector.dataset.portSide, 
            null
        );

        // 更新或创建临时连线
        let tempLine = connectionsSvg.querySelector('.temp-connection');
        if (!tempLine) {
            tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            tempLine.setAttribute('class', 'temp-connection connecting-line');
            connectionsSvg.appendChild(tempLine);
        }
        tempLine.setAttribute('d', path);
    }

    // 创建直角路径（根据连接点方向做更自然的出线与拐角）
    function createOrthogonalPath(x1, y1, x2, y2, side1, side2) {
        const offset = 30;
        const exit1 = getExitPoint(x1, y1, side1, offset);
        const exit2 = getExitPoint(x2, y2, side2, offset);

        // 临时连线：直接从起点出线后对齐到鼠标
        if (!side2) {
            if (side1 === 'left' || side1 === 'right') {
                return `M ${x1} ${y1} L ${exit1.x} ${exit1.y} L ${exit1.x} ${y2} L ${x2} ${y2}`;
            }
            return `M ${x1} ${y1} L ${exit1.x} ${exit1.y} L ${x2} ${exit1.y} L ${x2} ${y2}`;
        }

        const sameOrientation = isHorizontalSide(side1) === isHorizontalSide(side2);

        if (sameOrientation) {
            // 同向：使用中间走廊，避免拐角紧贴器件
            if (isHorizontalSide(side1)) {
                if (side1 === side2) {
                    const corridorX = side1 === 'left'
                        ? Math.min(exit1.x, exit2.x) - offset
                        : Math.max(exit1.x, exit2.x) + offset;
                    return `M ${x1} ${y1} L ${exit1.x} ${exit1.y} L ${corridorX} ${exit1.y} L ${corridorX} ${exit2.y} L ${exit2.x} ${exit2.y} L ${x2} ${y2}`;
                }
                const midX = (exit1.x + exit2.x) / 2;
                return `M ${x1} ${y1} L ${exit1.x} ${exit1.y} L ${midX} ${exit1.y} L ${midX} ${exit2.y} L ${exit2.x} ${exit2.y} L ${x2} ${y2}`;
            }
            if (side1 === side2) {
                const corridorY = side1 === 'top'
                    ? Math.min(exit1.y, exit2.y) - offset
                    : Math.max(exit1.y, exit2.y) + offset;
                return `M ${x1} ${y1} L ${exit1.x} ${exit1.y} L ${exit1.x} ${corridorY} L ${exit2.x} ${corridorY} L ${exit2.x} ${exit2.y} L ${x2} ${y2}`;
            }
            const midY = (exit1.y + exit2.y) / 2;
            return `M ${x1} ${y1} L ${exit1.x} ${exit1.y} L ${exit1.x} ${midY} L ${exit2.x} ${midY} L ${exit2.x} ${exit2.y} L ${x2} ${y2}`;
        }

        // 垂直/水平组合：优先走“出线 -> 对齐 -> 入线”
        if (isHorizontalSide(side1)) {
            return `M ${x1} ${y1} L ${exit1.x} ${exit1.y} L ${exit1.x} ${exit2.y} L ${exit2.x} ${exit2.y} L ${x2} ${y2}`;
        }
        return `M ${x1} ${y1} L ${exit1.x} ${exit1.y} L ${exit2.x} ${exit1.y} L ${exit2.x} ${exit2.y} L ${x2} ${y2}`;
    }

    function isHorizontalSide(side) {
        return side === 'left' || side === 'right';
    }

    function getExitPoint(x, y, side, offset) {
        if (side === 'left') return { x: x - offset, y: y };
        if (side === 'right') return { x: x + offset, y: y };
        if (side === 'top') return { x: x, y: y - offset };
        if (side === 'bottom') return { x: x, y: y + offset };
        return { x, y };
    }

    // 完成连接
    function completeConnection(targetConnector) {
        if (!canvasState.connectionStart) return;

        // 不能连接到同一个连接点
        if (canvasState.connectionStart.componentId === parseInt(targetConnector.dataset.componentId) &&
            canvasState.connectionStart.portIndex === parseInt(targetConnector.dataset.portIndex)) {
            cancelConnection();
            return;
        }

        // 简化逻辑：任意两个连接点都可以连接，不做类型检查
        const connection = {
            from: {
                componentId: canvasState.connectionStart.componentId,
                portIndex: canvasState.connectionStart.portIndex
            },
            to: {
                componentId: parseInt(targetConnector.dataset.componentId),
                portIndex: parseInt(targetConnector.dataset.portIndex)
            }
        };

        designState.connections.push(connection);
        cancelConnection();
        updateConnections();
        
        // 记录连线操作
        const fromComp = designState.components.find(c => c.id === connection.from.componentId);
        const toComp = designState.components.find(c => c.id === connection.to.componentId);
        if (fromComp && toComp) {
            addActivityLog(`连接 ${fromComp.label} 和 ${toComp.label}`);
        }
    }

    // 取消连接
    function cancelConnection() {
        canvasState.connecting = false;
        if (canvasState.connectionStart) {
            canvasState.connectionStart.connector.classList.remove('connecting');
            canvasState.connectionStart = null;
        }
        const tempLine = document.querySelector('.temp-connection');
        if (tempLine) {
            tempLine.remove();
        }
    }

    // 更新所有连接线
    function updateConnections() {
        const connectionsSvg = document.getElementById('canvasConnections');
        if (!connectionsSvg) return;

        // 确保SVG尺寸和viewBox正确
        connectionsSvg.setAttribute('width', '5000');
        connectionsSvg.setAttribute('height', '5000');
        connectionsSvg.setAttribute('viewBox', '0 0 5000 5000');
        connectionsSvg.style.width = '5000px';
        connectionsSvg.style.height = '5000px';

        // 清除所有永久连接线（保留临时连线）
        const existingLines = connectionsSvg.querySelectorAll('.connection-line');
        existingLines.forEach(line => line.remove());

        // 绘制所有连接线
        designState.connections.forEach(conn => {
            const fromComp = designState.components.find(c => c.id === conn.from.componentId);
            const toComp = designState.components.find(c => c.id === conn.to.componentId);
            
            if (!fromComp || !toComp) return;

            // 只查找组件块，不要匹配连接点
            const fromBlock = document.querySelector(`.canvas-component-block[data-component-id="${conn.from.componentId}"]`);
            const toBlock = document.querySelector(`.canvas-component-block[data-component-id="${conn.to.componentId}"]`);
            
            if (!fromBlock || !toBlock) return;

            const fromConnector = fromBlock.querySelector(`[data-port-index="${conn.from.portIndex}"]`);
            const toConnector = toBlock.querySelector(`[data-port-index="${conn.to.portIndex}"]`);
            
            if (!fromConnector || !toConnector) return;

            // 计算连接点坐标
            const blockWidth = 180;
            const blockHeight = 100;
            
            let x1, y1, x2, y2;
            
            // 起点坐标
            const fromSide = fromConnector.dataset.portSide;
            if (fromSide === 'top') {
                x1 = fromComp.x + blockWidth / 2;
                y1 = fromComp.y;
            } else if (fromSide === 'right') {
                x1 = fromComp.x + blockWidth;
                y1 = fromComp.y + blockHeight / 2;
            } else if (fromSide === 'bottom') {
                x1 = fromComp.x + blockWidth / 2;
                y1 = fromComp.y + blockHeight;
            } else { // left
                x1 = fromComp.x;
                y1 = fromComp.y + blockHeight / 2;
            }
            
            // 终点坐标
            const toSide = toConnector.dataset.portSide;
            if (toSide === 'top') {
                x2 = toComp.x + blockWidth / 2;
                y2 = toComp.y;
            } else if (toSide === 'right') {
                x2 = toComp.x + blockWidth;
                y2 = toComp.y + blockHeight / 2;
            } else if (toSide === 'bottom') {
                x2 = toComp.x + blockWidth / 2;
                y2 = toComp.y + blockHeight;
            } else { // left
                x2 = toComp.x;
                y2 = toComp.y + blockHeight / 2;
            }

            // 生成路径数据
            const pathData = createOrthogonalPath(x1, y1, x2, y2, fromSide, toSide);
            
            // 验证路径数据
            if (!pathData || pathData.trim() === '') {
                console.warn('Invalid path data for connection:', conn);
                return;
            }

            // 创建SVG路径元素
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('class', 'connection-line connecting-line');
            pathEl.setAttribute('d', pathData);
            pathEl.setAttribute('data-connection-id', `${conn.from.componentId}-${conn.from.portIndex}-${conn.to.componentId}-${conn.to.portIndex}`);
            
            // 添加点击事件
            pathEl.addEventListener('click', (e) => {
                e.stopPropagation();
                showConnectionDeletePopup(e, conn);
            });
            
            connectionsSvg.appendChild(pathEl);
        });
    }

    // 使元器件可拖拽
    function makeComponentDraggable(element, component) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        element.addEventListener('mousedown', (e) => {
            // 只响应左键
            if (e.button !== 0) return;
            
            if (e.target.classList.contains('component-block-number') || 
                e.target.classList.contains('port-connector')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = component.x;
            initialY = component.y;

            element.style.cursor = 'grabbing';
            e.preventDefault();
            e.stopPropagation();
        });
        
        // 阻止组件块的右键菜单
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = (e.clientX - startX) / canvasState.scale;
            const deltaY = (e.clientY - startY) / canvasState.scale;
            
            component.x = initialX + deltaX;
            component.y = initialY + deltaY;

            element.style.left = component.x + 'px';
            element.style.top = component.y + 'px';
            updateConnections();
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'move';
            }
        });
    }

    // 选择元器件
    function selectComponent(componentId) {
        designState.selectedComponent = componentId;

        document.querySelectorAll('.canvas-component-block').forEach(block => {
            block.classList.remove('selected');
            if (parseInt(block.dataset.componentId) === componentId) {
                block.classList.add('selected');
            }
        });
    }

    // 初始化Copilot
    function initCopilot() {
        const sendBtn = document.getElementById('copilotSendBtn');
        const input = document.getElementById('copilotInput');
        const exampleBtn = document.getElementById('copilotExampleBtn');

        if (sendBtn && input) {
            sendBtn.addEventListener('click', handleCopilotSend);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCopilotSend();
                }
            });
        }

        // 输入框焦点事件：显示"查看案例"按钮
        if (input && exampleBtn) {
            input.addEventListener('focus', () => {
                exampleBtn.style.display = 'flex';
            });
            
            input.addEventListener('blur', (e) => {
                // 如果点击的是"查看案例"按钮，不隐藏
                if (!exampleBtn.contains(e.relatedTarget)) {
                    setTimeout(() => {
                        if (document.activeElement !== input) {
                            exampleBtn.style.display = 'none';
                        }
                    }, 200);
                }
            });
        }

        // "查看案例"按钮点击事件
        if (exampleBtn) {
            exampleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // 隐藏按钮，不再显示
                exampleBtn.style.display = 'none';
                showBomExample();
            });
        }

        addCopilotMessage('assistant', '您好！我是设计助手，可以帮助您设计和优化电子系统。请描述您的需求，或者从左侧元器件库拖拽组件到画布上开始设计。');
    }

    // 获取输入框文本（支持textarea和contenteditable）
    function getInputText(input) {
        if (input.contentEditable === 'true') {
            // 提取文本和mention标签
            const clone = input.cloneNode(true);
            const mentionTags = clone.querySelectorAll('.mention-tag');
            mentionTags.forEach(tag => {
                const text = tag.querySelector('.mention-tag-text')?.textContent || tag.textContent;
                tag.replaceWith(` ${text} `);
            });
            return clone.textContent || clone.innerText || '';
        } else {
            return input.value || '';
        }
    }

    // 清空输入框（支持textarea和contenteditable）
    function clearInput(input) {
        if (input.contentEditable === 'true') {
            input.textContent = '';
        } else {
            input.value = '';
        }
    }

    // 发送Copilot消息
    function handleCopilotSend() {
        const input = document.getElementById('copilotInput');
        if (!input) return;

        const message = getInputText(input).trim();
        if (!message) return;

        addCopilotMessage('user', message);
        clearInput(input);

        setTimeout(() => {
            handleCopilotResponse(message);
        }, 500);
    }

    // 处理Copilot响应
    function handleCopilotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('烟雾') || lowerMessage.includes('报警')) {
            addCopilotMessage('assistant', generateSmokeAlarmDesign());
        } else {
            addCopilotMessage('assistant', '我理解您的需求。您可以通过拖拽左侧的元器件到画布上来构建设计，或者告诉我更多细节，我可以为您提供建议。');
        }
    }

    // 生成烟雾报警系统设计
    function generateSmokeAlarmDesign() {
        return `已为您设计了一个以STM32微控制器为核心的烟雾自动报警系统。

设计说明：
• 烟雾传感器通过I2C与MCU通信
• 蜂鸣器和LED通过GPIO由MCU控制
• 电池供电，通过DC-DC转换器为系统供电

如需进一步细化传感器型号、报警逻辑或通信方式，请告知！`;
    }

    // 添加Copilot消息
    function addCopilotMessage(role, content) {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `copilot-message ${role}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'message-meta';
        metaDiv.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(metaDiv);
        messagesContainer.appendChild(messageDiv);

        scrollCopilotToBottom();
    }

    function scrollCopilotToBottom() {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;
        requestAnimationFrame(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
    }

    // 初始化事件监听器
    function initEventListeners() {
        const canvas = document.getElementById('designCanvas');
        if (canvas) {
            canvas.addEventListener('click', (e) => {
                if (e.target === canvas || e.target.classList.contains('canvas-components')) {
                    designState.selectedComponent = null;
                    document.querySelectorAll('.canvas-component-block').forEach(block => {
                        block.classList.remove('selected');
                    });
                }
            });
        }
    }

    // 初始化标题编辑功能
    function initTitleEditor() {
        const titleElement = document.getElementById('designTitleEditable');
        if (!titleElement) return;

        let isEditing = false;
        let originalText = titleElement.textContent;

        titleElement.addEventListener('click', (e) => {
            if (!isEditing) {
                isEditing = true;
                originalText = titleElement.textContent;
                titleElement.contentEditable = 'true';
                titleElement.focus();
                
                // 选中所有文本
                const range = document.createRange();
                range.selectNodeContents(titleElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        titleElement.addEventListener('blur', () => {
            if (isEditing) {
                isEditing = false;
                titleElement.contentEditable = 'false';
                
                // 如果内容为空，恢复原文本
                const newText = titleElement.textContent.trim();
                if (newText === '') {
                    titleElement.textContent = originalText;
                } else if (newText !== originalText) {
                    // 记录标题修改
                    addActivityLog(`修改项目名称为: ${newText}`);
                }
            }
        });

        titleElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                titleElement.blur();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                titleElement.textContent = originalText;
                titleElement.blur();
            }
        });
    }

    // 初始化顶部操作按钮
    function initTopbarActions() {
        const exportBtn = document.getElementById('exportBtn');
        const bomBtn = document.getElementById('bomBtn');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                addActivityLog('导出项目');
            });
        }

        if (bomBtn) {
            bomBtn.addEventListener('click', () => {
                addActivityLog('查看BOM');
            });
        }
    }

    // 初始化操作记录
    function initActivityLog() {
        // 初始化时添加一条欢迎记录
        addActivityLog('开始设计');
    }

    // 添加操作记录
    function addActivityLog(text) {
        const activity = {
            time: new Date(),
            text: text
        };
        designState.activities.push(activity);
        renderActivityItem(activity);
    }

    // 渲染操作记录项（最新在最上面）
    function renderActivityItem(activity) {
        const activityContent = document.getElementById('activityContent');
        if (!activityContent) return;

        const item = document.createElement('div');
        item.className = 'activity-item';

        const time = document.createElement('div');
        time.className = 'activity-time';
        time.textContent = activity.time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

        const text = document.createElement('div');
        text.className = 'activity-text';
        text.textContent = activity.text;

        item.appendChild(time);
        item.appendChild(text);
        
        // 插入到最前面（最新在最上面）
        activityContent.insertBefore(item, activityContent.firstChild);
        
        // 滚动到顶部
        activityContent.scrollTop = 0;
    }

    // 显示连线删除气泡
    function showConnectionDeletePopup(e, connection) {
        hideAllPopups();
        const popup = document.getElementById('connectionDeletePopup');
        if (!popup) return;
        
        const rect = e.target.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const midY = rect.top + rect.height / 2;
        
        popup.style.display = 'block';
        popup.style.left = midX + 'px';
        popup.style.top = midY + 'px';
        popup.dataset.connectionId = `${connection.from.componentId}-${connection.from.portIndex}-${connection.to.componentId}-${connection.to.portIndex}`;
    }

    // 显示组件操作气泡
    function showComponentActionsPopup(e, component) {
        hideAllPopups();
        const popup = document.getElementById('componentActionsPopup');
        if (!popup) return;
        
        const block = e.currentTarget;
        const rect = block.getBoundingClientRect();
        
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.left = rect.right + 8 + 'px';
        popup.style.top = rect.top + 'px';
        popup.dataset.componentId = component.id;
    }

    // 隐藏所有气泡
    function hideAllPopups() {
        const connectionPopup = document.getElementById('connectionDeletePopup');
        const componentPopup = document.getElementById('componentActionsPopup');
        const alternativesDropdown = document.getElementById('alternativesDropdown');
        
        if (connectionPopup) connectionPopup.style.display = 'none';
        if (componentPopup) componentPopup.style.display = 'none';
        if (alternativesDropdown) alternativesDropdown.style.display = 'none';
    }

    // 初始化气泡菜单
    function initPopupMenus() {
        // 点击其他地方隐藏气泡
        document.addEventListener('click', (e) => {
            const connectionPopup = document.getElementById('connectionDeletePopup');
            const componentPopup = document.getElementById('componentActionsPopup');
            const alternativesDropdown = document.getElementById('alternativesDropdown');
            
            if (connectionPopup && !connectionPopup.contains(e.target) && 
                !e.target.classList.contains('connecting-line') &&
                !e.target.classList.contains('connection-line')) {
                connectionPopup.style.display = 'none';
            }
            
            if (componentPopup && !componentPopup.contains(e.target) &&
                !e.target.closest('.canvas-component-block')) {
                componentPopup.style.display = 'none';
                if (alternativesDropdown) alternativesDropdown.style.display = 'none';
            }
        });

        // 删除连线按钮
        const deleteConnectionBtn = document.getElementById('deleteConnectionBtn');
        if (deleteConnectionBtn) {
            deleteConnectionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const popup = document.getElementById('connectionDeletePopup');
                if (!popup) return;
                
                const connectionId = popup.dataset.connectionId;
                if (!connectionId) return;
                
                const [fromId, fromPort, toId, toPort] = connectionId.split('-').map(Number);
                
                // 从连接列表中删除
                designState.connections = designState.connections.filter(conn => {
                    return !(conn.from.componentId === fromId && 
                            conn.from.portIndex === fromPort &&
                            conn.to.componentId === toId &&
                            conn.to.portIndex === toPort);
                });
                
                updateConnections();
                hideAllPopups();
                
                // 记录操作
                addActivityLog('删除连线');
            });
        }

        // 替代料按钮
        const alternativeBtn = document.getElementById('alternativeBtn');
        const alternativesDropdown = document.getElementById('alternativesDropdown');
        if (alternativeBtn && alternativesDropdown) {
            alternativeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (alternativesDropdown.style.display === 'none' || !alternativesDropdown.style.display) {
                    alternativesDropdown.style.display = 'block';
                } else {
                    alternativesDropdown.style.display = 'none';
                }
            });
        }

        // 替代料选项点击
        if (alternativesDropdown) {
            alternativesDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                const option = e.target.closest('.alternative-option');
                if (!option) return;
                
                const partNumber = option.dataset.part;
                const popup = document.getElementById('componentActionsPopup');
                if (!popup) return;
                
                const componentId = parseInt(popup.dataset.componentId);
                const component = designState.components.find(c => c.id === componentId);
                if (component) {
                    // 更新物料编码（存储到组件实例）
                    const oldPartNumber = component.partNumber || componentPartNumbers[component.type] || component.type;
                    component.partNumber = partNumber;
                    
                    // 更新画布上显示的物料编码
                    const block = document.querySelector(`.canvas-component-block[data-component-id="${componentId}"]`);
                    if (block) {
                        const label = block.querySelector('.component-block-label');
                        if (label) {
                            label.textContent = partNumber;
                        }
                    }
                    
                    // 关闭所有弹窗
                    hideAllPopups();
                    
                    // 记录操作
                    addActivityLog(`将 ${component.label} 的物料编码从 ${oldPartNumber} 替换为 ${partNumber}`);
                }
            });
        }

        // 引用按钮
        const mentionBtn = document.getElementById('mentionBtn');
        if (mentionBtn) {
            mentionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const popup = document.getElementById('componentActionsPopup');
                if (!popup) return;
                
                const componentId = parseInt(popup.dataset.componentId);
                const component = designState.components.find(c => c.id === componentId);
                if (!component) return;
                
                const partNumber = component.partNumber || componentPartNumbers[component.type] || component.type;
                const copilotInput = document.getElementById('copilotInput');
                if (copilotInput) {
                    // 创建mention标签元素
                    const mentionTag = document.createElement('span');
                    mentionTag.className = 'mention-tag';
                    mentionTag.contentEditable = 'false';
                    mentionTag.innerHTML = `<span class="mention-tag-icon">C</span><span class="mention-tag-text">@${partNumber}</span>`;
                    
                    // 添加空格
                    const space = document.createTextNode(' ');
                    
                    // 插入到输入框
                    const range = window.getSelection().getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(space);
                    range.insertNode(mentionTag);
                    
                    // 移动光标到末尾
                    range.setStartAfter(space);
                    range.collapse(true);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    copilotInput.focus();
                }
                
                hideAllPopups();
                addActivityLog(`引用 ${component.label} (${partNumber})`);
            });
        }

        // 删除组件按钮
        const deleteComponentBtn = document.getElementById('deleteComponentBtn');
        if (deleteComponentBtn) {
            deleteComponentBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const popup = document.getElementById('componentActionsPopup');
                if (!popup) return;
                
                const componentId = parseInt(popup.dataset.componentId);
                const component = designState.components.find(c => c.id === componentId);
                if (!component) return;
                
                // 删除所有相关连线
                designState.connections = designState.connections.filter(conn => {
                    return conn.from.componentId !== componentId && conn.to.componentId !== componentId;
                });
                
                // 删除组件
                designState.components = designState.components.filter(c => c.id !== componentId);
                
                // 从DOM中移除
                const block = document.querySelector(`.canvas-component-block[data-component-id="${componentId}"]`);
                if (block && block.parentNode) {
                    block.parentNode.removeChild(block);
                }
                
                updateConnections();
                hideAllPopups();
                
                // 清除选择
                designState.selectedComponent = null;
                
                addActivityLog(`删除 ${component.label}`);
            });
        }
    }

    // ========== 演示工作流功能 ==========
    let demoWorkflow = {
        isActive: false,
        isFirstClick: true,
        componentsAdded: [],
        connectionMap: {}
    };

    // 电源切换模块演示配置
    const powerSwitchDemoConfig = {
        requirement: "帮我设计一个电源切换模块，要求是：双路输入（主电源和备用电源），自动切换，输出12V/3A，带过流保护，支持热插拔",
        components: [
            { type: 'mcu', label: '微控制器', x: 2400, y: 2400, ports: ['SUPPLY', 'I2C', 'GPIO', 'GPIO'] },
            { type: 'battery', label: '主电源', x: 2200, y: 2400, ports: ['SUPPLY'] },
            { type: 'battery', label: '备用电源', x: 2200, y: 2500, ports: ['SUPPLY'] },
            { type: 'dc-dc', label: 'DC-DC转换器', x: 2600, y: 2400, ports: ['SUPPLY', 'SUPPLY'] },
            { type: 'battery-monitor', label: '电源监控', x: 2400, y: 2500, ports: ['I2C'] }
        ],
        connections: [
            { fromIndex: 1, fromPort: 0, toIndex: 3, toPort: 0 },
            { fromIndex: 2, fromPort: 0, toIndex: 3, toPort: 1 },
            { fromIndex: 0, fromPort: 2, toIndex: 3, toPort: 2 },
            { fromIndex: 0, fromPort: 1, toIndex: 4, toPort: 0 }
        ],
        selectionWorkflow: [
            { componentIndex: 0, delay: 2000, partNumber: 'STM32F103C8T6', description: 'MCU选型完成：STM32F103C8T6 - ST微电子，72MHz，64KB Flash，20KB RAM' },
            { componentIndex: 3, delay: 3500, partNumber: 'LM2596S-ADJ', description: 'DC-DC转换器选型完成：LM2596S-ADJ - 输入4.5-40V，输出1.23-37V可调，最大3A输出' },
            { componentIndex: 1, delay: 5000, partNumber: '18650-3.7V-2000mAh', description: '主电源选型完成：18650-3.7V-2000mAh - 锂电池，3.7V，2000mAh容量' },
            { componentIndex: 2, delay: 6500, partNumber: '18650-3.7V-2000mAh', description: '备用电源选型完成：18650-3.7V-2000mAh - 锂电池，3.7V，2000mAh容量' },
            { componentIndex: 4, delay: 8000, partNumber: 'BQ27441-G1', description: '电源监控选型完成：BQ27441-G1 - 电池电量监测芯片，I2C接口' }
        ]
    };

    // 添加带HTML内容的消息
    function addCopilotMessageHTML(role, htmlContent) {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `copilot-message ${role}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = htmlContent;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'message-meta';
        metaDiv.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(metaDiv);
        messagesContainer.appendChild(messageDiv);

        scrollCopilotToBottom();
    }

    // 显示推荐问题提示框
    function showRecommendedQuestion() {
        const hint = document.getElementById('recommendedQuestionHint');
        if (!hint || !demoWorkflow.isFirstClick) return;
        
        hint.style.display = 'block';
        demoWorkflow.isFirstClick = false;
    }
    
    // 触发演示流程（用户点击提示框时调用）
    function triggerDemoWorkflow() {
        const hint = document.getElementById('recommendedQuestionHint');
        if (hint) {
            hint.style.display = 'none';
        }
        
        // 显示用户输入（完全复刻最佳实践）
        const messagesContainer = document.getElementById('copilotMessages');
        if (messagesContainer) {
            // 先显示上传文档消息
            const userMessage1 = document.createElement('div');
            userMessage1.className = 'copilot-message user';
            userMessage1.innerHTML = `
                <div class="message-content">
                    <div class="uploaded-file">
                        <div class="file-icon">DOC</div>
                        <span>电源切换模块需求说明书.docx</span>
                    </div>
                </div>
                <div class="message-meta">${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div>
            `;
            messagesContainer.appendChild(userMessage1);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // 然后显示文字需求消息
            setTimeout(() => {
                const userMessage2 = document.createElement('div');
                userMessage2.className = 'copilot-message user';
                userMessage2.innerHTML = `
                    <div class="message-content">
                        <div class="message-text">基于这个需求文档，帮我生成完整的BOM</div>
                    </div>
                    <div class="message-meta">${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div>
                `;
                messagesContainer.appendChild(userMessage2);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                // 自动触发响应
                setTimeout(() => {
                    handleRequirementConfirmation();
                }, 500);
            }, 300);
        }
    }

    // 从componentLibrary中查找组件数据（演示专用）
    function findComponentDataInLibrary(typeId) {
        for (const categoryName in componentLibrary) {
            const category = componentLibrary[categoryName];
            const item = category.items.find(item => item.id === typeId);
            if (item) {
                return item;
            }
        }
        return null;
    }

    // 自动添加组件（不带物料编码，演示专用）
    function addComponentForDemo(componentConfig, index) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const componentData = findComponentDataInLibrary(componentConfig.type);
                
                if (!componentData) {
                    console.error('找不到组件数据:', componentConfig.type);
                    resolve(null);
                    return;
                }

                const componentId = designState.nextComponentId++;
                const component = {
                    id: componentId,
                    type: componentConfig.type,
                    label: componentConfig.label,
                    ports: componentConfig.ports || componentData.ports || [],
                    x: componentConfig.x,
                    y: componentConfig.y,
                    partNumber: null // 初始为空，演示用
                };

                designState.components.push(component);

                const componentEl = createComponentBlock(component);
                const componentsContainer = document.getElementById('canvasComponents');
                if (componentsContainer) {
                    componentsContainer.appendChild(componentEl);
                    demoWorkflow.componentsAdded[index] = componentId;
                    updateConnections();
                    addActivityLog(`添加 ${component.label} 到画布`);
                }

                resolve(componentId);
            }, index * 300);
        });
    }

    // 自动连接组件
    function connectComponentsForDemo(connectionConfig) {
        return new Promise((resolve) => {
            const fromComponentId = demoWorkflow.componentsAdded[connectionConfig.fromIndex];
            const toComponentId = demoWorkflow.componentsAdded[connectionConfig.toIndex];
            
            if (!fromComponentId || !toComponentId) {
                resolve(false);
                return;
            }

            const fromBlock = document.querySelector(`[data-component-id="${fromComponentId}"]`);
            const toBlock = document.querySelector(`[data-component-id="${toComponentId}"]`);
            
            if (!fromBlock || !toBlock) {
                resolve(false);
                return;
            }

            const fromConnector = fromBlock.querySelector(`[data-port-index="${connectionConfig.fromPort}"]`);
            const toConnector = toBlock.querySelector(`[data-port-index="${connectionConfig.toPort}"]`);
            
            if (!fromConnector || !toConnector) {
                resolve(false);
                return;
            }

            const connection = {
                from: {
                    componentId: fromComponentId,
                    portIndex: connectionConfig.fromPort
                },
                to: {
                    componentId: toComponentId,
                    portIndex: connectionConfig.toPort
                }
            };

            designState.connections.push(connection);
            updateConnections();
            resolve(true);
        });
    }

    // 更新组件物料编码
    function updateComponentPartNumberForDemo(componentIndex, partNumber, description) {
        return new Promise((resolve) => {
            const componentId = demoWorkflow.componentsAdded[componentIndex];
            if (!componentId) {
                resolve(false);
                return;
            }

            const component = designState.components.find(c => c.id === componentId);
            if (!component) {
                resolve(false);
                return;
            }

            component.partNumber = partNumber;

            const block = document.querySelector(`.canvas-component-block[data-component-id="${componentId}"]`);
            if (block) {
                const label = block.querySelector('.component-block-label');
                if (label) {
                    label.textContent = partNumber;
                }
            }

            addActivityLog(description);
            resolve(true);
        });
    }

    // 启动演示工作流（完全独立的演示逻辑）
    async function startDemoWorkflow() {
        if (demoWorkflow.isActive) return;
        demoWorkflow.isActive = true;
        demoWorkflow.componentsAdded = [];

        const config = powerSwitchDemoConfig;

        // 步骤1：工具调用 - 分析需求
        addCopilotMessageHTML('assistant', `
            <div>我来为您设计电源切换模块。让我先分析需求并添加必要的组件...</div>
            <div class="tool-call" style="margin-top: 12px;">
                <div class="tool-call-header">
                    <div class="tool-call-icon">🔍</div>
                    <div class="tool-call-name">设计分析工具</div>
                    <div class="tool-call-status">执行中...</div>
                </div>
                <div class="tool-call-content">
                    正在分析需求：双路输入、自动切换、12V/3A输出、过流保护、热插拔支持<br>
                    正在生成组件列表和连接方案...
                </div>
            </div>
        `);

        // 延迟后显示工具完成
        setTimeout(() => {
            const toolCall = document.querySelector('.copilot-message.assistant:last-child .tool-call .tool-call-status');
            if (toolCall) {
                toolCall.textContent = '已完成';
            }
        }, 1500);

        // 步骤2：自动添加组件到画布（初始物料编码为空）
        setTimeout(async () => {
            for (let i = 0; i < config.components.length; i++) {
                await addComponentForDemo(config.components[i], i);
            }
        }, 1800);

        // 步骤3：自动连线
        setTimeout(async () => {
            addCopilotMessage('assistant', '正在连接组件...');
            for (let i = 0; i < config.connections.length; i++) {
                await connectComponentsForDemo(config.connections[i]);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }, 1800 + config.components.length * 300 + 500);

        // 步骤4：开始物料选型流程（工具调用、表格、BOM）
        setTimeout(() => {
            addCopilotMessageHTML('assistant', `
                <div>开始进行物料选型，将逐一查询并选择最适合的器件...</div>
                <div class="tool-call" style="margin-top: 12px;">
                    <div class="tool-call-header">
                        <div class="tool-call-icon">📚</div>
                        <div class="tool-call-name">物料查询工具</div>
                        <div class="tool-call-status">执行中...</div>
                    </div>
                    <div class="tool-call-content">
                        正在并行查询MCU、DC-DC转换器、电池、电源监控芯片的参数和选型建议...
                    </div>
                </div>
            `);
            
            setTimeout(() => {
                const toolCall = document.querySelector('.copilot-message.assistant:last-child .tool-call .tool-call-status');
                if (toolCall) {
                    toolCall.textContent = '已完成';
                }
            }, 1500);
        }, 1800 + config.components.length * 300 + config.connections.length * 200 + 800);

        // 步骤5：逐步选型，显示参数表格，最后显示BOM
        config.selectionWorkflow.forEach((selection, index) => {
            setTimeout(() => {
                // 显示选型完成的参数表格
                showComponentSelectionResult(selection, index === config.selectionWorkflow.length - 1);
                // 更新画布上的物料编码
                updateComponentPartNumberForDemo(selection.componentIndex, selection.partNumber, selection.description);
            }, 1800 + config.components.length * 300 + config.connections.length * 200 + 3300 + selection.delay);
        });
    }

    // 显示组件选型结果（带参数表格）
    function showComponentSelectionResult(selection, isLast) {
        const componentNames = ['微控制器', '主电源', '备用电源', 'DC-DC转换器', '电源监控'];
        const componentName = componentNames[selection.componentIndex] || '组件';
        const partNumber = selection.partNumber;
        
        let paramTableHTML = '';
        if (selection.componentIndex === 0) {
            // MCU参数表格
            paramTableHTML = `
                <div class="chip-info-table" style="margin-top: 12px;">
                    <div class="chip-info-header">📱 ${partNumber} 技术参数</div>
                    <div class="chip-info-body">
                        <div class="chip-param-row">
                            <div class="chip-param-label">制造商</div>
                            <div class="chip-param-value">ST微电子 (STMicroelectronics)</div>
                        </div>
                        <div class="chip-param-row">
                            <div class="chip-param-label">主频</div>
                            <div class="chip-param-value">72MHz</div>
                        </div>
                        <div class="chip-param-row">
                            <div class="chip-param-label">Flash</div>
                            <div class="chip-param-value">64KB</div>
                        </div>
                        <div class="chip-param-row">
                            <div class="chip-param-label">RAM</div>
                            <div class="chip-param-value">20KB</div>
                        </div>
                        <div class="chip-param-row">
                            <div class="chip-param-label">工作电压</div>
                            <div class="chip-param-value">2.0V ~ 3.6V</div>
                        </div>
                        <div class="chip-param-row">
                            <div class="chip-param-label">封装</div>
                            <div class="chip-param-value">LQFP48</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (selection.componentIndex === 3) {
            // DC-DC参数表格
            paramTableHTML = `
                <div class="chip-info-table" style="margin-top: 12px;">
                    <div class="chip-info-header">⚡ ${partNumber} 技术参数</div>
                    <div class="chip-info-body">
                        <div class="chip-param-row">
                            <div class="chip-param-label">输入电压</div>
                            <div class="chip-param-value">4.5V ~ 40V</div>
                        </div>
                        <div class="chip-param-row">
                            <div class="chip-param-label">输出电压</div>
                            <div class="chip-param-value">1.23V ~ 37V 可调</div>
                        </div>
                        <div class="chip-param-row">
                            <div class="chip-param-label">最大输出电流</div>
                            <div class="chip-param-value">3A</div>
                        </div>
                        <div class="chip-param-row">
                            <div class="chip-param-label">效率</div>
                            <div class="chip-param-value">最高 92%</div>
                        </div>
                        <div class="chip-param-row">
                            <div class="chip-param-label">封装</div>
                            <div class="chip-param-value">TO-263-5</div>
                        </div>
                    </div>
                </div>
            `;
        }

        addCopilotMessageHTML('assistant', `
            <div>${selection.description}</div>
            ${paramTableHTML}
        `);

        // 如果是最后一个，显示BOM表格
        if (isLast) {
            setTimeout(() => {
                showBOMTable();
            }, 500);
        }
    }

    // 显示最终的BOM表格
    function showBOMTable() {
        addCopilotMessageHTML('assistant', `
            <div style="margin-top: 8px;">所有组件选型完成！以下是完整的BOM清单：</div>
            <div class="bom-table-container" style="margin-top: 12px;">
                <div class="bom-table-header">📋 电源切换模块 BOM清单 v1.0</div>
                <table class="bom-table">
                    <thead>
                        <tr>
                            <th>型号</th>
                            <th style="text-align: center;">已应用BOM数</th>
                            <th>位号</th>
                            <th>分类</th>
                            <th>核心参数</th>
                            <th>封装</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>STM32F103C8T6</td>
                            <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                            <td>U1</td>
                            <td>微控制器</td>
                            <td>72MHz，64KB Flash，20KB RAM</td>
                            <td>LQFP48</td>
                        </tr>
                        <tr>
                            <td>LM2596S-ADJ</td>
                            <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                            <td>U2</td>
                            <td>DC-DC转换器</td>
                            <td>输入4.5-40V，输出1.23-37V可调，3A</td>
                            <td>TO-263-5</td>
                        </tr>
                        <tr>
                            <td>18650-3.7V-2000mAh</td>
                            <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                            <td>BAT1</td>
                            <td>主电源</td>
                            <td>3.7V，2000mAh</td>
                            <td>18650</td>
                        </tr>
                        <tr>
                            <td>18650-3.7V-2000mAh</td>
                            <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                            <td>BAT2</td>
                            <td>备用电源</td>
                            <td>3.7V，2000mAh</td>
                            <td>18650</td>
                        </tr>
                        <tr>
                            <td>BQ27441-G1</td>
                            <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                            <td>U3</td>
                            <td>电源监控</td>
                            <td>电池电量监测，I2C接口</td>
                            <td>DSBGA-12</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 12px; color: #64748B; font-size: 13px;">
                电源切换模块设计完成！所有组件已选型完毕，系统已就绪。
            </div>
        `);
    }

    // 处理需求确认（完全复刻最佳实践的研发任务研究流程）
    function handleRequirementConfirmation() {
        // 第一步：显示需求解析和器件需求分解表单（完全复刻最佳实践）
        addCopilotMessageHTML('assistant', `
            <div class="message-text">
                我已经分析了您上传的电源切换模块需求说明书。根据文档内容，这是一个双电源自动切换系统，主要技术要求如下：
            </div>
            
            <div class="message-text">
                <strong>📋 核心需求解析：</strong><br>
                • 主电源：12V/5A，备用电源：24V转12V/3A<br>
                • 自动检测主电源状态，故障时无缝切换<br>
                • 切换时间 ≤ 10ms，支持手动强制切换<br>
                • 工作温度：-20°C ~ +70°C<br>
                • 具备过压、欠压、过流保护功能
            </div>

            <!-- 需求表单 -->
            <div class="requirements-form">
                <div class="form-header">
                    🔧 器件需求分解表单
                </div>
                <div class="form-body">
                    <div class="requirement-item">
                        <div class="requirement-type">电压检测芯片</div>
                        <div class="requirement-desc">
                            <input type="text" class="requirement-input" value="检测12V主电源，欠压阈值10.8V，过压阈值13.2V，响应时间<1ms" disabled>
                        </div>
                    </div>
                    <div class="requirement-item">
                        <div class="requirement-type">功率MOSFET</div>
                        <div class="requirement-desc">
                            <input type="text" class="requirement-input" value="N沟道，Vds≥20V，Id≥8A，Rds(on)≤50mΩ，TO-252封装" disabled>
                        </div>
                    </div>
                    <div class="requirement-item">
                        <div class="requirement-type">DC-DC转换器</div>
                        <div class="requirement-desc">
                            <input type="text" class="requirement-input" value="24V转12V，输出电流≥3A，效率≥85%，隔离型" disabled>
                        </div>
                    </div>
                    <div class="requirement-item">
                        <div class="requirement-type">控制MCU</div>
                        <div class="requirement-desc">
                            <input type="text" class="requirement-input" value="ARM Cortex-M0+，Flash≥32KB，GPIO≥16个，ADC≥8通道" disabled>
                        </div>
                    </div>
                    <div class="requirement-item">
                        <div class="requirement-type">电流检测电阻</div>
                        <div class="requirement-desc">
                            <input type="text" class="requirement-input" value="精密电阻，阻值10mΩ，功率≥2W，精度≤1%，2512封装" disabled>
                        </div>
                    </div>
                    <div class="requirement-item">
                        <div class="requirement-type">保护二极管</div>
                        <div class="requirement-desc">
                            <input type="text" class="requirement-input" value="肖特基二极管，Vf≤0.5V，If≥5A，Vr≥20V，SMA封装" disabled>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="confirm-btn" id="bomConfirmBtn">确认需求，开始生成BOM</button>
                </div>
            </div>
        `);

        // 绑定确认按钮事件
        setTimeout(() => {
            const confirmBtn = document.getElementById('bomConfirmBtn');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    startBomGenerationDemo();
                });
            }
        }, 100);
    }

    // 修改handleCopilotResponse以支持演示
    const originalHandleCopilotResponse = handleCopilotResponse;
    handleCopilotResponse = function(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (userMessage.includes('电源切换') || userMessage.includes('切换模块')) {
            handleRequirementConfirmation();
        } else {
            originalHandleCopilotResponse(userMessage);
        }
    };

    // 修改initCopilot以添加推荐问题
    const originalInitCopilot = initCopilot;
    initCopilot = function() {
        originalInitCopilot();
        
        const input = document.getElementById('copilotInput');
        if (input) {
            input.addEventListener('focus', showRecommendedQuestion);
        }
    };

    // 修改handleCopilotSend以处理推荐问题
    const originalHandleCopilotSend = handleCopilotSend;
    handleCopilotSend = function() {
        const input = document.getElementById('copilotInput');
        if (!input) return;

        let message = '';
        if (input.contentEditable === 'true') {
            const questionEl = input.querySelector('.recommended-question');
            if (questionEl) {
                message = powerSwitchDemoConfig.requirement;
            } else {
                message = getInputText(input).trim();
            }
        } else {
            message = input.value.trim();
        }

        if (!message) return;

        addCopilotMessage('user', message);
        clearInput(input);

        setTimeout(() => {
            handleCopilotResponse(message);
        }, 500);
    };

    // ========== BOM案例对话流程（完整复刻最佳实践） ==========
    
    // 显示BOM案例对话
    function showBomExample() {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;

        // 清空现有消息
        messagesContainer.innerHTML = '';
        
        // 先显示用户消息（文档上传）
        showUserDocumentMessage();
        
        // 延迟显示文字需求
        setTimeout(() => {
            showUserTextMessage();
            
            // 延迟显示"正在分析"加载状态
            setTimeout(() => {
                showAnalyzingMessage();
                
                // 延迟显示分析结果和表单
                setTimeout(() => {
                    renderBomChatMessages();
                }, 2000);
            }, 800);
        }, 500);
        
        // 保持滚动在最新消息
        scrollCopilotToBottom();
    }
    
    // 显示用户文档消息
    function showUserDocumentMessage() {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;
        
        const userMessage = document.createElement('div');
        userMessage.className = 'copilot-message user';
        userMessage.innerHTML = `
            <div class="message-content">
                <div class="uploaded-file">
                    <div class="file-icon-word">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" fill="#2B579A"/>
                            <path d="M7 7h10v10H7z" fill="#FFFFFF" opacity="0.1"/>
                            <text x="12" y="16" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">W</text>
                        </svg>
                    </div>
                    <span class="file-name">电源切换模块需求说明书.docx</span>
                </div>
                <div class="message-meta">14:25</div>
            </div>
        `;
        
        messagesContainer.appendChild(userMessage);
        
        // 滚动到底部
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 50);
    }
    
    // 显示用户文字消息
    function showUserTextMessage() {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;
        
        const userMessage = document.createElement('div');
        userMessage.className = 'copilot-message user';
        userMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text">基于这个需求文档，帮我生成完整的BOM</div>
                <div class="message-meta">14:25</div>
            </div>
        `;
        
        messagesContainer.appendChild(userMessage);
        
        // 滚动到底部
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 50);
    }
    
    // 显示"正在分析"消息
    function showAnalyzingMessage() {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;
        
        const analyzingMessage = document.createElement('div');
        analyzingMessage.className = 'copilot-message assistant';
        analyzingMessage.id = 'analyzingMessage';
        
        analyzingMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span>正在分析需求文档...</span>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(analyzingMessage);
        
        // 滚动到底部
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 50);
    }

    // 渲染BOM对话内容（分析结果和表单）
    function renderBomChatMessages() {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;
        
        // 移除"正在分析"消息
        const analyzingMsg = document.getElementById('analyzingMessage');
        if (analyzingMsg) {
            analyzingMsg.remove();
        }
        
        // 创建助手回复消息
        const assistantMessage = document.createElement('div');
        assistantMessage.className = 'copilot-message assistant';
        
        assistantMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    我已经分析了您上传的电源切换模块需求说明书。根据文档内容，这是一个双电源自动切换系统，主要技术要求如下：
                </div>
                
                <div class="message-text">
                    <strong>📋 核心需求解析：</strong><br>
                    • 主电源：12V/5A，备用电源：24V转12V/3A<br>
                    • 自动检测主电源状态，故障时无缝切换<br>
                    • 切换时间 ≤ 10ms，支持手动强制切换<br>
                    • 工作温度：-20°C ~ +70°C<br>
                    • 具备过压、欠压、过流保护功能
                </div>

                <!-- 需求表单 -->
                <div class="requirements-form" id="requirementsForm">
                    <div class="form-header">
                        🔧 器件需求分解表单
                    </div>
                    <div class="form-body" id="formBody">
                        <!-- 表单项将通过JavaScript逐步添加 -->
                    </div>
                    <div class="form-actions">
                        <button class="confirm-btn" id="bomConfirmBtn" style="opacity: 0; pointer-events: none;">确认需求，开始生成BOM</button>
                    </div>
                </div>

                <div class="message-meta">14:26</div>
            </div>
        `;
        
        messagesContainer.appendChild(assistantMessage);
        
        // 滚动到底部
        scrollCopilotToBottom();
        
        // 逐步显示表单项
        showRequirementsFormItems(assistantMessage);
    }
    
    // 逐步显示表单项
    function showRequirementsFormItems(assistantMessage) {
        const formBody = assistantMessage.querySelector('#formBody');
        const confirmBtn = assistantMessage.querySelector('#bomConfirmBtn');
        if (!formBody || !confirmBtn) return;
        
        const requirements = [
            { type: '电压检测芯片', desc: '检测12V主电源，欠压阈值10.8V，过压阈值13.2V，响应时间<1ms', componentId: 'voltage-monitor' },
            { type: '功率MOSFET', desc: 'N沟道，Vds≥20V，Id≥8A，Rds(on)≤50mΩ，TO-252封装', componentId: 'power-mosfet', count: 2 },
            { type: 'DC-DC转换器', desc: '24V转12V，输出电流≥3A，效率≥85%，隔离型', componentId: 'isolated-dc-dc' },
            { type: '控制MCU', desc: 'ARM Cortex-M0+，Flash≥32KB，GPIO≥16个，ADC≥8通道', componentId: 'mcu' },
            { type: '电流检测电阻', desc: '精密电阻，阻值10mΩ，功率≥2W，精度≤1%，2512封装', componentId: 'current-sense-resistor', count: 2 },
            { type: '保护二极管', desc: '肖特基二极管，Vf≤0.5V，If≥5A，Vr≥20V，SMA封装', componentId: 'protection-diode', count: 2 }
        ];
        
        let currentIndex = 0;
        
        const addNextItem = () => {
            if (currentIndex >= requirements.length) {
                // 所有项显示完成，显示确认按钮
                confirmBtn.style.opacity = '1';
                confirmBtn.style.pointerEvents = 'auto';
                confirmBtn.style.transition = 'opacity 0.3s';
                
                // 为确认按钮添加点击事件
                confirmBtn.addEventListener('click', () => {
                    startBomGeneration();
                });
                
                // 表单显示完成后，自动添加物料到画布
                setTimeout(() => {
                    console.log('准备调用autoAddComponentsToCanvas');
                    try {
                        autoAddComponentsToCanvas(requirements);
                    } catch (error) {
                        console.error('添加物料时出错:', error);
                    }
                }, 500);
                
                return;
            }
            
            const req = requirements[currentIndex];
            const itemDiv = document.createElement('div');
            itemDiv.className = 'requirement-item';
            itemDiv.style.opacity = '0';
            itemDiv.style.transform = 'translateY(10px)';
            itemDiv.style.transition = 'opacity 0.4s, transform 0.4s';
            
            itemDiv.innerHTML = `
                <div class="requirement-type">${req.type}</div>
                <div class="requirement-desc">
                    <input type="text" class="requirement-input" value="${req.desc}" disabled>
                </div>
            `;
            
            formBody.appendChild(itemDiv);
            
            // 触发动画
            setTimeout(() => {
                itemDiv.style.opacity = '1';
                itemDiv.style.transform = 'translateY(0)';
                scrollCopilotToBottom();
            }, 50);
            
            currentIndex++;
            setTimeout(addNextItem, 400); // 每400ms添加一项
        };
        
        // 延迟开始，让消息先显示
        setTimeout(addNextItem, 300);
    }
    
    // 自动添加物料到画布
    function autoAddComponentsToCanvas(requirements) {
        console.log('=== 开始自动添加物料到画布 ===', requirements);
        
        const canvasWrapper = document.querySelector('.design-canvas-wrapper');
        const canvas = document.getElementById('designCanvas');
        const componentsContainer = document.getElementById('canvasComponents');
        
        if (!canvasWrapper || !canvas || !componentsContainer) {
            console.error('找不到必要的DOM元素');
            return;
        }
        
        // 获取当前画布的实际可见中心位置
        // 根据当前的transform，计算画布中心(2500, 2500)在屏幕上的位置
        const rect = canvasWrapper.getBoundingClientRect();
        const viewportCenterX = rect.width / 2;
        const viewportCenterY = rect.height / 2;
        
        // 根据当前的panX和panY，反推画布中心在画布坐标系中的实际位置
        // updateCanvasTransform: translateX = centerX + panX - 2500 * scale
        // 所以画布中心(2500, 2500)在屏幕上的位置是：
        // screenX = viewportCenterX + panX - 2500 * scale + 2500 * scale = viewportCenterX + panX
        // 反推：如果屏幕中心对应画布上的点canvasX，那么：
        // canvasX * scale + translateX = viewportCenterX
        // canvasX * scale + viewportCenterX + panX - 2500 * scale = viewportCenterX
        // canvasX = 2500 - panX / scale
        
        // 更简单的方法：直接使用当前视口中心对应的画布坐标
        // 根据updateCanvasTransform的逻辑，屏幕中心(viewportCenterX, viewportCenterY)对应的画布坐标是：
        const currentCanvasCenterX = 2500 - canvasState.panX / canvasState.scale;
        const currentCanvasCenterY = 2500 - canvasState.panY / canvasState.scale;
        
        // 如果画布没有被移动过，使用默认中心(2500, 2500)
        // 否则使用当前可见中心
        const centerX = (Math.abs(canvasState.panX) < 100 && Math.abs(canvasState.panY) < 100) 
            ? 2500 
            : currentCanvasCenterX;
        const centerY = (Math.abs(canvasState.panX) < 100 && Math.abs(canvasState.panY) < 100) 
            ? 2500 
            : currentCanvasCenterY;
        
        console.log('计算出的布局中心:', {
            centerX: centerX,
            centerY: centerY,
            currentCanvasState: {
                scale: canvasState.scale,
                panX: canvasState.panX,
                panY: canvasState.panY
            },
            currentCanvasCenter: {
                x: currentCanvasCenterX,
                y: currentCanvasCenterY
            }
        });
        
        // 定义物料映射和布局（相对于计算出的中心）
        // 布局采用分层结构，避免覆盖：
        // 第一层（最上）：保护二极管（2个，水平排列）
        // 第二层：电压检测芯片（左）和控制MCU（右）
        // 第三层：DC-DC转换器（左）和功率MOSFET（2个，水平排列在右侧）
        // 第四层（最下）：电流检测电阻（2个，水平排列）
        const blockWidth = 180;
        const blockHeight = 100;
        const columnGap = 240; // 列间距（左/右两列）
        const rowGap = 170; // 行间距（分层排布）
        const mosfetOffset = 220; // MOSFET与电阻的水平间距
        
        const leftColumnX = centerX - columnGap;
        const rightColumnX = centerX + columnGap;
        const rowTopY = centerY - rowGap * 2;
        const rowUpperY = centerY - rowGap;
        const rowMidY = centerY;
        const rowLowerY = centerY + rowGap;
        
        // 统一分层：上-中-下，保持垂直连线和水平连线更清晰
        const componentLayout = {
            'protection-diode': { 
                x: centerX, 
                y: rowTopY, 
                label: '保护二极管', 
                partNumber: '待选型', 
                count: 2, 
                offset: columnGap * 2 
            },
            'voltage-monitor': { 
                x: leftColumnX, 
                y: rowUpperY, 
                label: '电压检测芯片', 
                partNumber: '待选型' 
            },
            'mcu': { 
                x: rightColumnX, 
                y: rowUpperY, 
                label: '微控制器', 
                partNumber: '待选型' 
            },
            'isolated-dc-dc': { 
                x: leftColumnX, 
                y: rowMidY, 
                label: 'DC-DC转换器', 
                partNumber: '待选型' 
            },
            'power-mosfet': { 
                x: rightColumnX + mosfetOffset / 2, 
                y: rowMidY, 
                label: '功率MOSFET', 
                partNumber: '待选型', 
                count: 2, 
                offset: mosfetOffset 
            },
            'current-sense-resistor': { 
                x: rightColumnX + mosfetOffset / 2, 
                y: rowLowerY, 
                label: '电流检测电阻', 
                partNumber: '待选型', 
                count: 2, 
                offset: mosfetOffset 
            }
        };
        
        const addedComponents = [];
        
        // 添加组件到画布
        requirements.forEach((req, index) => {
            const layout = componentLayout[req.componentId];
            if (!layout) {
                console.warn('找不到布局配置:', req.componentId);
                return;
            }
            
            const count = req.count || 1;
            
            for (let i = 0; i < count; i++) {
                const componentData = findComponentDataInLibrary(req.componentId);
                if (!componentData) {
                    console.error('找不到组件数据:', req.componentId);
                    return;
                }
                
                console.log('准备添加组件:', {
                    componentId: req.componentId,
                    componentData: componentData,
                    layout: layout,
                    index: index,
                    i: i
                });
                
                // 计算位置
                let x = layout.x;
                let y = layout.y;
                
                if (count > 1 && layout.offset) {
                    // 多个组件时，水平排列
                    const totalWidth = (count - 1) * layout.offset;
                    const startX = layout.x - totalWidth / 2;
                    x = startX + i * layout.offset;
                }
                
                // 添加组件
                const component = {
                    id: designState.nextComponentId++,
                    type: req.componentId,
                    label: layout.label + (count > 1 ? ` ${i + 1}` : ''),
                    ports: [...(componentData.ports || [])],
                    x: x,
                    y: y,
                    partNumber: layout.partNumber
                };
                
                designState.components.push(component);
                
                const componentEl = createComponentBlock(component);
                const componentsContainer = document.getElementById('canvasComponents');
                if (componentsContainer) {
                    // 确保容器有正确的尺寸
                    const canvas = document.getElementById('designCanvas');
                    if (canvas) {
                        componentsContainer.style.width = '5000px';
                        componentsContainer.style.height = '5000px';
                    }
                    
                    componentsContainer.appendChild(componentEl);
                    
                    // 验证组件位置
                    setTimeout(() => {
                        const elementRect = componentEl.getBoundingClientRect();
                        const containerRect = componentsContainer.getBoundingClientRect();
                        const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
                        
                        console.log('组件添加验证:', {
                            componentId: component.id,
                            componentType: component.type,
                            componentLabel: component.label,
                            componentPosition: { x: component.x, y: component.y },
                            elementStyle: {
                                left: componentEl.style.left,
                                top: componentEl.style.top,
                                position: window.getComputedStyle(componentEl).position
                            },
                            elementRect: elementRect,
                            containerRect: containerRect,
                            canvasRect: canvasRect,
                            isVisible: elementRect.width > 0 && elementRect.height > 0
                        });
                    }, 100);
                } else {
                    console.error('找不到canvasComponents容器');
                }
                
                addedComponents.push(component);
                
                // 添加动画效果
                componentEl.style.opacity = '0';
                componentEl.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    componentEl.style.transition = 'opacity 0.3s, transform 0.3s';
                    componentEl.style.opacity = '1';
                    componentEl.style.transform = 'scale(1)';
                }, index * 100 + i * 50);
            }
        });
        
        // 所有组件添加完成后，先调整视图，再连线
        setTimeout(() => {
            // 先调整视图以显示所有组件
            adjustViewToShowComponents(addedComponents);
            
            // 视图调整完成后再连线（延迟一点确保视图调整完成）
            setTimeout(() => {
                autoConnectComponents(addedComponents);
            }, 300);
        }, requirements.length * 100 + 500);
    }
    
    // 调整视图以显示所有组件
    function adjustViewToShowComponents(components) {
        if (components.length === 0) return;
        
        // 计算所有组件的边界框
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        components.forEach(comp => {
            const blockWidth = 180;
            const blockHeight = 100;
            minX = Math.min(minX, comp.x);
            minY = Math.min(minY, comp.y);
            maxX = Math.max(maxX, comp.x + blockWidth);
            maxY = Math.max(maxY, comp.y + blockHeight);
        });
        
        // 添加一些边距
        const padding = 100;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;
        
        // 计算中心点
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        
        // 计算需要的缩放比例
        const canvasWrapper = document.querySelector('.design-canvas-wrapper');
        if (!canvasWrapper) return;
        
        const rect = canvasWrapper.getBoundingClientRect();
        const width = maxX - minX;
        const height = maxY - minY;
        
        // 计算合适的缩放比例（留出边距）
        const scaleX = (rect.width * 0.8) / width;
        const scaleY = (rect.height * 0.8) / height;
        const newScale = Math.min(scaleX, scaleY, 1.5); // 最大不超过1.5倍
        
        // 更新缩放
        canvasState.scale = Math.max(0.3, newScale);
        
        // 调整平移，使组件中心对齐到视图中心
        // 根据updateCanvasTransform: translateX = viewportCenterX + panX - 2500 * scale
        // 画布上的点canvasX在屏幕上的位置 = canvasX * scale + translateX
        // = canvasX * scale + viewportCenterX + panX - 2500 * scale
        // 要让组件中心componentCenterX对齐到viewport中心：
        // componentCenterX * scale + viewportCenterX + panX - 2500 * scale = viewportCenterX
        // componentCenterX * scale + panX - 2500 * scale = 0
        // panX = (2500 - componentCenterX) * scale
        
        const viewportCenterX = rect.width / 2;
        const viewportCenterY = rect.height / 2;
        
        // 使用正确的公式
        canvasState.panX = (2500 - centerX) * canvasState.scale;
        canvasState.panY = (2500 - centerY) * canvasState.scale;
        
        updateCanvasTransform();
        
        console.log('调整视图:', {
            componentCenter: { x: centerX, y: centerY },
            viewportCenter: { x: viewportCenterX, y: viewportCenterY },
            scale: canvasState.scale,
            panX: canvasState.panX,
            panY: canvasState.panY,
            calculatedTranslateX: viewportCenterX + canvasState.panX - 2500 * canvasState.scale,
            componentScreenX: centerX * canvasState.scale + (viewportCenterX + canvasState.panX - 2500 * canvasState.scale)
        });
    }
    
    // 自动连线组件
    function autoConnectComponents(components) {
        // 找到各个组件
        const voltageMonitor = components.find(c => c.type === 'voltage-monitor');
        const mcu = components.find(c => c.type === 'mcu');
        const mosfets = components.filter(c => c.type === 'power-mosfet').sort((a, b) => a.id - b.id);
        const dcDc = components.find(c => c.type === 'isolated-dc-dc');
        const resistors = components.filter(c => c.type === 'current-sense-resistor').sort((a, b) => a.id - b.id);
        const diodes = components.filter(c => c.type === 'protection-diode').sort((a, b) => a.id - b.id);
        
        const connections = [];
        
        // 连接点索引：0=top, 1=right, 2=bottom, 3=left
        
        // 1. 保护二极管连接到电压检测芯片和MCU（从上到下）
        // 第一个二极管 -> 电压检测芯片
        if (diodes[0] && voltageMonitor) {
            connections.push({
                from: { componentId: diodes[0].id, portIndex: 2 }, // bottom
                to: { componentId: voltageMonitor.id, portIndex: 0 } // top
            });
        }
        // 第二个二极管 -> MCU
        if (diodes.length > 1 && diodes[1] && mcu) {
            connections.push({
                from: { componentId: diodes[1].id, portIndex: 2 }, // bottom
                to: { componentId: mcu.id, portIndex: 0 } // top
            });
        }
        
        // 2. MCU连接到电压检测芯片（水平连接，从左到右）
        // 电压检测芯片的right -> MCU的left
        if (mcu && voltageMonitor) {
            connections.push({
                from: { componentId: voltageMonitor.id, portIndex: 1 }, // right
                to: { componentId: mcu.id, portIndex: 3 } // left
            });
        }
        
        // 3. MCU连接到MOSFET（从上到下）
        // MCU的bottom -> MOSFET的top
        if (mcu && mosfets.length > 0) {
            mosfets.forEach((mosfet, index) => {
                if (index === 0) {
                    // 第一个MOSFET直接连接
                    connections.push({
                        from: { componentId: mcu.id, portIndex: 2 }, // bottom
                        to: { componentId: mosfet.id, portIndex: 0 } // top
                    });
                }
            });
        }
        
        // 4. 电压检测芯片连接到DC-DC转换器（从上到下）
        // 电压检测芯片的bottom -> DC-DC转换器的top
        if (voltageMonitor && dcDc) {
            connections.push({
                from: { componentId: voltageMonitor.id, portIndex: 2 }, // bottom
                to: { componentId: dcDc.id, portIndex: 0 } // top
            });
        }
        
        // 5. DC-DC转换器连接到MOSFET（水平连接，从左到右）
        // DC-DC转换器的right -> MOSFET的left
        if (dcDc && mosfets.length > 0) {
            if (mosfets[0]) {
                connections.push({
                    from: { componentId: dcDc.id, portIndex: 1 }, // right
                    to: { componentId: mosfets[0].id, portIndex: 3 } // left
                });
            }
        }
        
        // 6. MOSFET连接到电流检测电阻（从上到下）
        // MOSFET的bottom -> 电阻的top
        if (mosfets.length > 0 && resistors.length > 0) {
            mosfets.forEach((mosfet, index) => {
                if (resistors[index]) {
                    connections.push({
                        from: { componentId: mosfet.id, portIndex: 2 }, // bottom
                        to: { componentId: resistors[index].id, portIndex: 0 } // top
                    });
                }
            });
        }
        
        // 7. 两个MOSFET之间的连接（水平连接，从左到右）
        // 第一个MOSFET的right -> 第二个MOSFET的left
        if (mosfets.length > 1) {
            connections.push({
                from: { componentId: mosfets[0].id, portIndex: 1 }, // right
                to: { componentId: mosfets[1].id, portIndex: 3 } // left
            });
        }
        
        // 8. 两个电阻之间的连接（水平连接，从左到右）
        // 第一个电阻的right -> 第二个电阻的left
        if (resistors.length > 1) {
            connections.push({
                from: { componentId: resistors[0].id, portIndex: 1 }, // right
                to: { componentId: resistors[1].id, portIndex: 3 } // left
            });
        }
        
        // 添加连接
        connections.forEach(conn => {
            designState.connections.push(conn);
        });
        
        // 更新连接线显示
        updateConnections();
        
        // 添加活动日志
        addActivityLog('自动添加物料并完成连线');
    }
    
    // BOM生成流程
    function startBomGeneration() {
        const confirmBtn = document.getElementById('bomConfirmBtn');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = '✓ 已确认';
            confirmBtn.style.background = '#10B981';
            confirmBtn.style.cursor = 'not-allowed';
        }
        
        // 显示并行任务
        setTimeout(() => {
            showParallelTasks();
            // 滚动到最新消息
            setTimeout(() => {
                const messagesContainer = document.getElementById('copilotMessages');
                if (messagesContainer) {
                    const lastMessage = messagesContainer.lastElementChild;
                    if (lastMessage) {
                        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                }
            }, 100);
        }, 500);
    }
    
    // 显示并行任务
    function showParallelTasks() {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;
        
        const assistantMessage = document.createElement('div');
        assistantMessage.className = 'copilot-message assistant';
        
        assistantMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    收到确认！现在开始并行执行物料查询和选型任务，我将同时为每个器件类型寻找最优解决方案：
                </div>
                
                <div class="parallel-tasks" id="parallelTasks">
                    <div class="task-card processing" id="task1">
                        <div class="task-header">
                            <div class="task-status processing"></div>
                            <div class="task-title">电压检测芯片选型</div>
                        </div>
                        <div class="task-content">
                            <div class="task-progress">正在搜索电压监控芯片数据库...</div>
                        </div>
                    </div>
                    
                    <div class="task-card processing" id="task2">
                        <div class="task-header">
                            <div class="task-status processing"></div>
                            <div class="task-title">功率MOSFET选型</div>
                        </div>
                        <div class="task-content">
                            <div class="task-progress">正在分析MOSFET参数要求...</div>
                        </div>
                    </div>
                    
                    <div class="task-card processing" id="task3">
                        <div class="task-header">
                            <div class="task-status processing"></div>
                            <div class="task-title">DC-DC转换器选型</div>
                        </div>
                        <div class="task-content">
                            <div class="task-progress">正在搜索隔离型DC-DC模块...</div>
                        </div>
                    </div>
                    
                    <div class="task-card processing" id="task4">
                        <div class="task-header">
                            <div class="task-status processing"></div>
                            <div class="task-title">控制MCU选型</div>
                        </div>
                        <div class="task-content">
                            <div class="task-progress">正在匹配ARM Cortex-M系列...</div>
                        </div>
                    </div>
                    
                    <div class="task-card processing" id="task5">
                        <div class="task-header">
                            <div class="task-status processing"></div>
                            <div class="task-title">电流检测电阻选型</div>
                        </div>
                        <div class="task-content">
                            <div class="task-progress">正在查询精密电阻规格...</div>
                        </div>
                    </div>
                    
                    <div class="task-card processing" id="task6">
                        <div class="task-header">
                            <div class="task-status processing"></div>
                            <div class="task-title">保护二极管选型</div>
                        </div>
                        <div class="task-content">
                            <div class="task-progress">正在筛选肖特基二极管...</div>
                        </div>
                    </div>
                </div>
                
                <div class="message-meta">14:27</div>
            </div>
        `;
        
        messagesContainer.appendChild(assistantMessage);
        
        // 滚动到最新消息
        setTimeout(() => {
            if (messagesContainer) {
                assistantMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 100);
        
        // 模拟任务完成过程
        simulateTaskCompletion();
    }
    
    // 模拟任务完成
    function simulateTaskCompletion() {
        const tasks = [
            {
                id: 'task1',
                delay: 2000,
                result: {
                    component: 'TPS3813K33DBVR',
                    reason: '德州仪器，3.3V基准，1%精度，SOT-23封装，响应时间0.5ms'
                }
            },
            {
                id: 'task2', 
                delay: 2500,
                result: {
                    component: 'IRFB4115PBF',
                    reason: 'Infineon，150V/104A，Rds(on)=8.7mΩ，TO-220封装，性价比优秀'
                }
            },
            {
                id: 'task3',
                delay: 3000,
                result: {
                    component: 'TMR 3-2412WI',
                    reason: 'TRACO POWER，24V转12V/3A，效率87%，3kV隔离，DIP24封装'
                }
            },
            {
                id: 'task4',
                delay: 3500,
                result: {
                    component: 'STM32F030C8T6',
                    reason: 'ST，Cortex-M0，64KB Flash，39个GPIO，12位ADC，LQFP48封装'
                }
            },
            {
                id: 'task5',
                delay: 4000,
                result: {
                    component: 'WSL2512R0100FEA',
                    reason: 'Vishay，10mΩ/2W，±1%精度，2512封装，低温漂系数'
                }
            },
            {
                id: 'task6',
                delay: 4500,
                result: {
                    component: 'MBRS340T3G',
                    reason: 'ON Semi，40V/3A，Vf=0.45V，SMA封装，快速恢复特性'
                }
            }
        ];

        tasks.forEach(task => {
            setTimeout(() => {
                completeTask(task.id, task.result);
            }, task.delay);
        });

        // 所有任务完成后显示BOM生成加载动画
        setTimeout(() => {
            showBomLoading();
        }, 5000);
    }
    
    // 完成单个任务
    function completeTask(taskId, result) {
        const taskCard = document.getElementById(taskId);
        if (!taskCard) return;
        
        const taskStatus = taskCard.querySelector('.task-status');
        const taskContent = taskCard.querySelector('.task-content');
        
        taskCard.classList.remove('processing');
        taskCard.classList.add('completed');
        if (taskStatus) {
            taskStatus.classList.remove('processing');
            taskStatus.classList.add('completed');
        }
        
        if (taskContent) {
            taskContent.innerHTML = `
                <div class="task-progress">✅ 选型完成</div>
                <div class="task-result">
                    <div class="selected-component">${result.component}</div>
                    <div class="component-reason">${result.reason}</div>
                </div>
            `;
        }
        
        // 同步更新画布上的组件物料编码
        updateCanvasComponentPartNumber(taskId, result.component);
    }
    
    // 更新画布上组件的物料编码
    function updateCanvasComponentPartNumber(taskId, partNumber) {
        // 任务ID到组件类型的映射
        const taskToComponentType = {
            'task1': 'voltage-monitor',
            'task2': 'power-mosfet',
            'task3': 'isolated-dc-dc',
            'task4': 'mcu',
            'task5': 'current-sense-resistor',
            'task6': 'protection-diode'
        };
        
        const componentType = taskToComponentType[taskId];
        if (!componentType) {
            console.warn('找不到任务对应的组件类型:', taskId);
            return;
        }
        
        // 找到画布上所有对应类型的组件
        const components = designState.components.filter(c => c.type === componentType);
        
        if (components.length === 0) {
            console.warn('画布上找不到对应类型的组件:', componentType);
            return;
        }
        
        // 更新所有匹配组件的物料编码
        components.forEach(component => {
            component.partNumber = partNumber;
            
            // 更新画布上显示的物料编码
            const block = document.querySelector(`.canvas-component-block[data-component-id="${component.id}"]`);
            if (block) {
                const label = block.querySelector('.component-block-label');
                if (label) {
                    label.textContent = partNumber;
                    
                    // 添加更新动画效果
                    label.style.transition = 'all 0.3s';
                    label.style.color = '#10B981';
                    setTimeout(() => {
                        label.style.color = '';
                    }, 1000);
                }
            }
        });
        
        console.log('已更新画布组件物料编码:', {
            taskId: taskId,
            componentType: componentType,
            partNumber: partNumber,
            updatedComponents: components.length
        });
    }
    
    // 显示BOM生成加载动画
    function showBomLoading() {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;
        
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'copilot-message assistant';
        loadingMessage.id = 'bomLoadingMessage';
        
        loadingMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    所有器件选型已完成！现在开始生成BOM清单...
                </div>
                
                <div class="bom-loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">正在生成BOM清单</div>
                    <div class="loading-progress" id="loadingProgress">正在处理数据...</div>
                    
                    <div class="loading-steps">
                        <div class="loading-step active" id="step1">
                            <div class="loading-step-icon"></div>
                            <span>整理器件参数信息</span>
                        </div>
                        <div class="loading-step" id="step2">
                            <div class="loading-step-icon"></div>
                            <span>生成BOM表格结构</span>
                        </div>
                        <div class="loading-step" id="step3">
                            <div class="loading-step-icon"></div>
                            <span>关联替代料数据</span>
                        </div>
                        <div class="loading-step" id="step4">
                            <div class="loading-step-icon"></div>
                            <span>完成BOM清单</span>
                        </div>
                    </div>
                </div>
                
                <div class="message-meta">14:28</div>
            </div>
        `;
        
        messagesContainer.appendChild(loadingMessage);
        
        // 滚动到最新消息
        setTimeout(() => {
            if (messagesContainer) {
                loadingMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 100);
        
        // 模拟加载步骤
        simulateLoadingSteps();
    }
    
    // 模拟加载步骤
    function simulateLoadingSteps() {
        const steps = ['step1', 'step2', 'step3', 'step4'];
        const progressTexts = [
            '正在整理器件参数...',
            '正在生成表格结构...',
            '正在关联替代料...',
            '即将完成...'
        ];
        
        let currentStep = 0;
        
        const stepInterval = setInterval(() => {
            if (currentStep > 0) {
                const prevStep = document.getElementById(steps[currentStep - 1]);
                if (prevStep) {
                    prevStep.classList.remove('active');
                    prevStep.classList.add('completed');
                }
            }
            
            if (currentStep < steps.length) {
                const currentStepEl = document.getElementById(steps[currentStep]);
                if (currentStepEl) {
                    currentStepEl.classList.add('active');
                }
                
                const progressEl = document.getElementById('loadingProgress');
                if (progressEl) {
                    progressEl.textContent = progressTexts[currentStep];
                }
                
                currentStep++;
            } else {
                const lastStep = document.getElementById(steps[steps.length - 1]);
                if (lastStep) {
                    lastStep.classList.remove('active');
                    lastStep.classList.add('completed');
                }
                
                clearInterval(stepInterval);
                
                setTimeout(() => {
                    const loadingMsg = document.getElementById('bomLoadingMessage');
                    if (loadingMsg) {
                        loadingMsg.remove();
                    }
                    generateBomTable();
                }, 800);
            }
        }, 1000);
    }
    
    // 生成BOM表格
    function generateBomTable() {
        const messagesContainer = document.getElementById('copilotMessages');
        if (!messagesContainer) return;
        
        const bomMessage = document.createElement('div');
        bomMessage.className = 'copilot-message assistant';
        
        bomMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    🎉 所有器件选型完成！基于需求分析和并行查询结果，我为您生成了初版BOM清单。您可以点击器件型号查看替代方案：
                </div>
                
                <div class="bom-table-container">
                    <div class="bom-table-header">
                        📋 电源切换模块 BOM清单 v1.0
                    </div>
                    <div class="bom-table-wrapper">
                        <table class="bom-table">
                            <thead>
                                <tr>
                                    <th>型号</th>
                                    <th style="text-align: center;">已应用BOM数</th>
                                    <th>位号</th>
                                    <th>分类</th>
                                    <th>核心参数</th>
                                    <th>封装</th>
                                    <th>制造商</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'voltage-monitor')">
                                                TPS3813K33DBVR
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-voltage-monitor">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'TPS3813K33DBVR', 'Texas Instruments')">
                                                    <div class="alternative-name">TPS3813K33DBVR <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - 3.3V基准，1%精度，SOT-23</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'MAX6369KA+T', 'Maxim Integrated')">
                                                    <div class="alternative-name">MAX6369KA+T <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">3.08V基准，1.5%精度，SOT-23</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'MCP130T-300I/TT', 'Microchip')">
                                                    <div class="alternative-name">MCP130T-300I/TT <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">3.0V基准，2%精度，SOT-23</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                                    <td>U1</td>
                                    <td>电压检测芯片</td>
                                    <td>3.3V基准，1%精度</td>
                                    <td>SOT-23</td>
                                    <td>Texas Instruments</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'mosfet')">
                                                IRFB4115PBF
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-mosfet">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'IRFB4115PBF', 'Infineon')">
                                                    <div class="alternative-name">IRFB4115PBF <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - 150V/104A，Rds=8.7mΩ</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'IRFP4468PBF', 'Infineon')">
                                                    <div class="alternative-name">IRFP4468PBF <span class="alternative-tag tag-same-manufacturer">同厂家</span></div>
                                                    <div class="alternative-desc">100V/195A，Rds=2.8mΩ，更低阻抗</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'STB80NF10T4', 'STMicroelectronics')">
                                                    <div class="alternative-name">STB80NF10T4 <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">100V/80A，Rds=9.5mΩ，性价比高</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                                    <td>Q1,Q2</td>
                                    <td>功率MOSFET</td>
                                    <td>150V/104A，Rds=8.7mΩ</td>
                                    <td>TO-220</td>
                                    <td>Infineon</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'dcdc')">
                                                TMR 3-2412WI
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-dcdc">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'TMR 3-2412WI', 'TRACO POWER')">
                                                    <div class="alternative-name">TMR 3-2412WI <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - 24V转12V/3A，87%效率</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'IB2412S-3W', 'XP Power')">
                                                    <div class="alternative-name">IB2412S-3W <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">24V转12V/3W，85%效率，SIP封装</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'NME2412SC', 'Murata')">
                                                    <div class="alternative-name">NME2412SC <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">24V转12V/2W，88%效率，SMD封装</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                                    <td>U2</td>
                                    <td>DC-DC转换器</td>
                                    <td>24V转12V/3A，87%效率</td>
                                    <td>DIP24</td>
                                    <td>TRACO POWER</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'mcu')">
                                                STM32F030C8T6
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-mcu">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'STM32F030C8T6', 'STMicroelectronics')">
                                                    <div class="alternative-name">STM32F030C8T6 <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - Cortex-M0，64KB Flash</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'STM32F072CBT6', 'STMicroelectronics')">
                                                    <div class="alternative-name">STM32F072CBT6 <span class="alternative-tag tag-same-manufacturer">同厂家</span></div>
                                                    <div class="alternative-desc">Cortex-M0，128KB Flash，更多外设</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'GD32F130C8T6', 'GigaDevice')">
                                                    <div class="alternative-name">GD32F130C8T6 <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">Cortex-M3，64KB Flash，兼容STM32</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                                    <td>U3</td>
                                    <td>控制MCU</td>
                                    <td>Cortex-M0，64KB Flash</td>
                                    <td>LQFP48</td>
                                    <td>STMicroelectronics</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'resistor')">
                                                WSL2512R0100FEA
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-resistor">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'WSL2512R0100FEA', 'Vishay')">
                                                    <div class="alternative-name">WSL2512R0100FEA <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - 10mΩ/2W，±1%精度</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'CRCW2512R010FKEAC', 'Vishay')">
                                                    <div class="alternative-name">CRCW2512R010FKEAC <span class="alternative-tag tag-same-manufacturer">同厂家</span></div>
                                                    <div class="alternative-desc">10mΩ/1W，±1%精度，厚膜工艺</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'LVR10R010FER', 'Rohm')">
                                                    <div class="alternative-name">LVR10R010FER <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">10mΩ/3W，±1%精度，金属箔工艺</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                                    <td>R1,R2</td>
                                    <td>电流检测电阻</td>
                                    <td>10mΩ/2W，±1%精度</td>
                                    <td>2512</td>
                                    <td>Vishay</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'diode')">
                                                MBRS340T3G
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-diode">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'MBRS340T3G', 'ON Semi')">
                                                    <div class="alternative-name">MBRS340T3G <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - 40V/3A，Vf=0.45V</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'MBR340S', 'ON Semi')">
                                                    <div class="alternative-name">MBR340S <span class="alternative-tag tag-same-manufacturer">同厂家</span></div>
                                                    <div class="alternative-desc">40V/3A，Vf=0.48V，SMA封装</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'SS34', 'Diodes Inc')">
                                                    <div class="alternative-name">SS34 <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">40V/3A，Vf=0.5V，SMA封装，性价比高</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="text-align: center;">${Math.floor(Math.random() * 50) + 1}</td>
                                    <td>D1,D2</td>
                                    <td>保护二极管</td>
                                    <td>40V/3A，Vf=0.45V</td>
                                    <td>SMA</td>
                                    <td>ON Semi</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- BOM操作按钮区域 -->
                    <div class="bom-table-actions">
                        <button class="bom-action-btn bom-btn-download">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            下载
                        </button>
                        <button class="bom-action-btn bom-btn-save primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                <polyline points="17 21 17 13 7 13 7 21"/>
                                <polyline points="7 3 7 8 15 8"/>
                            </svg>
                            保存BOM版本
                        </button>
                    </div>
                </div>

                <div class="message-meta">14:30</div>
            </div>
        `;
        
        messagesContainer.appendChild(bomMessage);
        
        // 滚动到底部显示最新内容
        setTimeout(() => {
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 100);
        
        // 初始化BOM操作按钮事件
        initBomActions(bomMessage);
    }
    
    // 初始化BOM操作按钮
    function initBomActions(bomMessage) {
        const downloadBtn = bomMessage.querySelector('.bom-btn-download');
        const saveBtn = bomMessage.querySelector('.bom-btn-save');
        
        // 下载按钮
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // 仅展示，不做任何操作
            });
        }
        
        // 保存BOM版本按钮
        if (saveBtn) {
            saveBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // 仅展示，不做任何操作
            });
        }
    }

    // 显示替代料下拉框
    function showBomAlternatives(element, type) {
        // 隐藏所有其他下拉菜单
        document.querySelectorAll('.alternatives-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        
        // 显示当前下拉菜单
        const dropdown = document.getElementById(`dropdown-${type}`);
        if (dropdown) {
            dropdown.classList.add('show');
        }
        
        // 点击其他地方关闭下拉菜单
        setTimeout(() => {
            const closeHandler = function(e) {
                if (!element.closest('.component-select').contains(e.target)) {
                    if (dropdown) {
                        dropdown.classList.remove('show');
                    }
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 100);
    }
    
    // 选择替代方案
    function selectBomAlternative(element, partNumber, manufacturer) {
        const componentSelect = element.closest('.component-select');
        if (!componentSelect) return;
        
        const componentName = componentSelect.querySelector('.component-name');
        const row = componentSelect.closest('tr');
        
        if (componentName && row && row.cells) {
            // 更新显示（保留SVG图标）
            const svg = componentName.querySelector('svg');
            const svgHTML = svg ? svg.outerHTML : '';
            componentName.innerHTML = partNumber + ' ' + svgHTML;
            
            // 更新制造商（第6列，索引5）
            const manufacturerCell = row.cells[5];
            if (manufacturerCell) {
                manufacturerCell.textContent = manufacturer;
            }
            
            // 隐藏下拉菜单
            const dropdown = componentSelect.querySelector('.alternatives-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
            
            // 显示更新提示
            row.style.backgroundColor = '#F0FDF4';
            setTimeout(() => {
                row.style.backgroundColor = '';
            }, 2000);
            
            // 同步更新画布上的组件物料编码
            // 从下拉框的id中提取类型（格式：dropdown-{type}）
            if (dropdown && dropdown.id) {
                const dropdownType = dropdown.id.replace('dropdown-', '');
                updateCanvasComponentFromBom(dropdownType, partNumber);
            }
        }
    }
    
    // 从BOM表格选择更新画布组件
    function updateCanvasComponentFromBom(bomType, partNumber) {
        // BOM表格类型到画布组件类型的映射
        const bomTypeToComponentType = {
            'voltage-monitor': 'voltage-monitor',
            'mosfet': 'power-mosfet',
            'dcdc': 'isolated-dc-dc',
            'mcu': 'mcu-f030',
            'resistor': 'current-sense-resistor',
            'diode': 'protection-diode'
        };
        
        const componentType = bomTypeToComponentType[bomType];
        if (!componentType) {
            console.warn('找不到BOM类型对应的组件类型:', bomType);
            return;
        }
        
        // 找到画布上所有对应类型的组件
        const components = designState.components.filter(c => c.type === componentType);
        
        if (components.length === 0) {
            console.warn('画布上找不到对应类型的组件:', componentType);
            return;
        }
        
        // 更新所有匹配组件的物料编码
        components.forEach(component => {
            component.partNumber = partNumber;
            
            // 更新画布上显示的物料编码
            const block = document.querySelector(`.canvas-component-block[data-component-id="${component.id}"]`);
            if (block) {
                const label = block.querySelector('.component-block-label');
                if (label) {
                    label.textContent = partNumber;
                    
                    // 添加更新动画效果
                    label.style.transition = 'all 0.3s';
                    label.style.color = '#6DD5E8';
                    label.style.fontWeight = '600';
                    setTimeout(() => {
                        label.style.color = '';
                        label.style.fontWeight = '';
                    }, 1000);
                }
            }
        });
        
        console.log('已从BOM表格更新画布组件物料编码:', {
            bomType: bomType,
            componentType: componentType,
            partNumber: partNumber,
            updatedComponents: components.length
        });
    }
    
    // 打开BOM PDF（占位函数）
    function openBomPdf(filename) {
        // 仅展示，不做任何操作
        console.log('打开PDF:', filename);
    }
    
    // 将函数暴露到全局
    window.showBomAlternatives = showBomAlternatives;
    window.selectBomAlternative = selectBomAlternative;
    window.openBomPdf = openBomPdf;

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
