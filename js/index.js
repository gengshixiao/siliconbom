

// 楼层切换：workbench <-> tutorial
function setActiveFloor(target) {
    const container = document.getElementById('floorsContainer');
    if (!container) return;
    container.className = 'floors-container';
    if (target === 'tutorial') {
        container.classList.add('is-tutorial');
    } else if (target === 'practices') {
        container.classList.add('is-practices');
    } else {
        // workbench - 默认状态
    }
}

 // 教程页：绘制底部线路 + “回到工作台”按钮（SVG）
 function renderTutorialFloor() {
     const floor = document.querySelector('.floor-tutorial');
     const svg = floor?.querySelector('.pcb-layer-svg');
     if (!floor || !svg) return;

     const svgRect = svg.getBoundingClientRect();
     const floorRect = floor.getBoundingClientRect();
     if (!svgRect.width || !svgRect.height) return;

     const viewBox = svg.viewBox.baseVal;
     const scaleX = viewBox.width / svgRect.width;
     const scaleY = viewBox.height / svgRect.height;

    // 固定在页面中心 X，保持与工作台居中对齐感
    const centerX = (floorRect.width / 2) * scaleX;
    const buttonY = viewBox.height - 80;
    
    // 获取教程容器的位置和尺寸
    const tutorialContainer = floor.querySelector('.tutorial-container');
    if (!tutorialContainer) return;
    const cardRect = tutorialContainer.getBoundingClientRect();
    const cardLeft = (cardRect.left - floorRect.left) * scaleX;
    const cardRight = (cardRect.right - floorRect.left) * scaleX;
    const cardTop = (cardRect.top - floorRect.top) * scaleY;
    const cardBottom = (cardRect.bottom - floorRect.top) * scaleY;
    const cardWidth = cardRect.width * scaleX;
    const cardHeight = cardRect.height * scaleY;
    const cardCenterX = cardLeft + cardWidth / 2;
    const cardCenterY = cardTop + cardHeight / 2;

    svg.innerHTML = '';

    const createPath = (d, className = 'trace-path', strokeWidth = 1.5, opacity = 1) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', className);
        path.setAttribute('stroke-width', strokeWidth);
        if (opacity < 1) path.setAttribute('opacity', opacity);
        return path;
    };

    const createCircle = (cx, cy, r = 3, fill = '#CBD5E1', opacity = 0.9, stroke = null, strokeWidth = 1) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', fill);
        if (opacity < 1) circle.setAttribute('opacity', opacity);
        if (stroke) {
            circle.setAttribute('stroke', stroke);
            circle.setAttribute('stroke-width', strokeWidth);
        }
        return circle;
    };

    // 主干线路：从下方按钮延伸到教程卡片底部（不再往上延伸）
    svg.appendChild(createPath(`M${centerX} ${cardBottom + 40} L${centerX} ${buttonY - 22}`, 'trace-path active', 2.5));
    svg.appendChild(createPath(`M${centerX} ${buttonY + 22} L${centerX} ${viewBox.height}`, 'trace-path active', 2.5));
    svg.appendChild(createCircle(centerX, cardBottom + 40, 4, '#6DD5E8', 0.9, '#fff', 1.5));
    svg.appendChild(createCircle(centerX, buttonY - 22, 3.6, '#6DD5E8', 0.9));
    svg.appendChild(createCircle(centerX, buttonY + 22, 3.6, '#6DD5E8', 0.9));

    // 从教程卡片底部延伸的多束竖线到按钮
    const offsets = [-180, -120, -70, -30, 0, 30, 70, 120, 180];
    offsets.forEach((offset, idx) => {
        const x = centerX + offset;
        const isActive = offset === 0;
        const startY = cardBottom + 40 + idx * 5;
        const endY = buttonY - 26;
        
        // 从卡片底部到按钮的线条
        svg.appendChild(createPath(
            `M${x} ${startY} L${x} ${endY}`,
            isActive ? 'trace-path active' : 'trace-path',
            isActive ? 2 : 1.4,
            isActive ? 1 : 0.7
        ));
        
        // 小节点
        svg.appendChild(createCircle(x, startY, 2.4, isActive ? '#6DD5E8' : '#CBD5E1', 0.8));
        svg.appendChild(createCircle(x, endY, 2.2, isActive ? '#6DD5E8' : '#CBD5E1', 0.7));
    });

    // 从教程卡片左右两侧延伸的线条
    // 左侧线条
    for (let i = 0; i < 6; i++) {
        const y = cardTop + (i + 1) * (cardHeight / 7);
        const offsetX = -80 - i * 25;
        const endX = cardLeft + offsetX;
        
        svg.appendChild(createPath(
            `M${cardLeft} ${y} L${endX} ${y} L${endX - 30} ${y + (i % 2 === 0 ? -20 : 20)}`,
            'trace-path',
            1.3,
            0.6
        ));
        svg.appendChild(createCircle(cardLeft, y, 2.5, '#CBD5E1', 0.7));
        svg.appendChild(createCircle(endX - 30, y + (i % 2 === 0 ? -20 : 20), 2, '#CBD5E1', 0.5));
    }
    
    // 右侧线条
    for (let i = 0; i < 6; i++) {
        const y = cardTop + (i + 1) * (cardHeight / 7);
        const offsetX = 80 + i * 25;
        const endX = cardRight + offsetX;
        
        svg.appendChild(createPath(
            `M${cardRight} ${y} L${endX} ${y} L${endX + 30} ${y + (i % 2 === 0 ? 20 : -20)}`,
            'trace-path',
            1.3,
            0.6
        ));
        svg.appendChild(createCircle(cardRight, y, 2.5, '#CBD5E1', 0.7));
        svg.appendChild(createCircle(endX + 30, y + (i % 2 === 0 ? 20 : -20), 2, '#CBD5E1', 0.5));
    }

    // 从教程卡片上方延伸的线条
    for (let i = 0; i < 5; i++) {
        const x = cardLeft + (i + 1) * (cardWidth / 6);
        const offsetY = -60 - i * 20;
        const endY = cardTop + offsetY;
        
        svg.appendChild(createPath(
            `M${x} ${cardTop} L${x} ${endY} L${x + (i % 2 === 0 ? -25 : 25)} ${endY - 30}`,
            'trace-path',
            1.3,
            0.6
        ));
        svg.appendChild(createCircle(x, cardTop, 2.5, '#CBD5E1', 0.7));
        svg.appendChild(createCircle(x + (i % 2 === 0 ? -25 : 25), endY - 30, 2, '#CBD5E1', 0.5));
    }

    // 添加装饰性背景走线网络（类似主页面）
    const createDecoPath = (d, opacity = 0.25, strokeWidth = 1, dashArray = null) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', 'trace-path');
        path.setAttribute('stroke-width', strokeWidth);
        path.setAttribute('opacity', opacity);
        if (dashArray) path.setAttribute('stroke-dasharray', dashArray);
        return path;
    };

    const createDecoCircle = (cx, cy, r = 2, opacity = 0.3) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', '#CBD5E1');
        circle.setAttribute('opacity', opacity);
        return circle;
    };

    // 四角装饰走线网络
    // 左上角
    for (let i = 0; i < 4; i++) {
        const offsetY = 50 + i * 20;
        svg.appendChild(createDecoPath(`M30 ${offsetY} L${80 + i * 15} ${offsetY} L${100 + i * 15} ${offsetY + 25}`, 0.2));
        svg.appendChild(createDecoCircle(80 + i * 15, offsetY, 2, 0.25));
    }
    
    // 右上角
    for (let i = 0; i < 4; i++) {
        const offsetY = 50 + i * 20;
        svg.appendChild(createDecoPath(`M${viewBox.width - 30} ${offsetY} L${viewBox.width - 80 - i * 15} ${offsetY} L${viewBox.width - 100 - i * 15} ${offsetY + 25}`, 0.2));
        svg.appendChild(createDecoCircle(viewBox.width - 80 - i * 15, offsetY, 2, 0.25));
    }
    
    // 左下角（避开卡片和按钮区域）
    for (let i = 0; i < 4; i++) {
        const offsetY = buttonY + 100 + i * 20;
        if (offsetY < viewBox.height - 50) {
            svg.appendChild(createDecoPath(`M30 ${offsetY} L${80 + i * 15} ${offsetY} L${100 + i * 15} ${offsetY - 25}`, 0.2));
            svg.appendChild(createDecoCircle(80 + i * 15, offsetY, 2, 0.25));
        }
    }
    
    // 右下角（避开卡片和按钮区域）
    for (let i = 0; i < 4; i++) {
        const offsetY = buttonY + 100 + i * 20;
        if (offsetY < viewBox.height - 50) {
            svg.appendChild(createDecoPath(`M${viewBox.width - 30} ${offsetY} L${viewBox.width - 80 - i * 15} ${offsetY} L${viewBox.width - 100 - i * 15} ${offsetY - 25}`, 0.2));
            svg.appendChild(createDecoCircle(viewBox.width - 80 - i * 15, offsetY, 2, 0.25));
        }
    }

    // 中间区域虚线网络（避开卡片区域）
    const dashPatterns = ['5,3', '8,4', '3,2'];
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        const startX = cardCenterX + Math.cos(angle) * cardWidth * 0.7;
        const startY = cardCenterY + Math.sin(angle) * cardHeight * 0.7;
        const endX = cardCenterX + Math.cos(angle) * cardWidth * 1.8;
        const endY = cardCenterY + Math.sin(angle) * cardHeight * 2.2;
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        // 确保线条不穿过卡片
        if (Math.abs(startX - cardCenterX) > cardWidth * 0.6 || Math.abs(startY - cardCenterY) > cardHeight * 0.6) {
            svg.appendChild(createDecoPath(
                `M${startX} ${startY} L${midX} ${midY} L${endX} ${endY}`,
                0.15, 1, dashPatterns[i % 3]
            ));
            svg.appendChild(createDecoCircle(midX, midY, 1.5, 0.2));
        }
    }

    // 交叉网格走线（避开卡片区域）
    for (let i = 0; i < 5; i++) {
        const x = 100 + i * (viewBox.width - 200) / 4;
        if (x < cardLeft - 50 || x > cardRight + 50) {
            svg.appendChild(createDecoPath(`M${x} 40 L${x} ${cardTop - 30}`, 0.12, 0.8));
            svg.appendChild(createDecoPath(`M${x} ${cardBottom + 50} L${x} ${buttonY - 50}`, 0.12, 0.8));
        }
    }
    for (let i = 0; i < 4; i++) {
        const y = 60 + i * (cardTop - 60) / 3;
        if (y < cardTop - 20) {
            svg.appendChild(createDecoPath(`M50 ${y} L${cardLeft - 30} ${y}`, 0.12, 0.8));
            svg.appendChild(createDecoPath(`M${cardRight + 30} ${y} L${viewBox.width - 50} ${y}`, 0.12, 0.8));
        }
    }

    // 随机装饰性节点和短走线（避开卡片区域）
    for (let i = 0; i < 25; i++) {
        const x = 60 + Math.random() * (viewBox.width - 120);
        let y;
        if (x < cardLeft - 40 || x > cardRight + 40) {
            y = 50 + Math.random() * (viewBox.height - 150);
        } else {
            // 如果在卡片上方或下方，避开卡片
            if (Math.random() > 0.5) {
                y = 50 + Math.random() * (cardTop - 80);
            } else {
                y = cardBottom + 60 + Math.random() * (viewBox.height - cardBottom - 150);
            }
        }
        
        // 确保不落在卡片内
        if (x < cardLeft - 30 || x > cardRight + 30 || y < cardTop - 30 || y > cardBottom + 30) {
            svg.appendChild(createDecoCircle(x, y, 1.5, 0.2));
            // 添加短走线
            if (i % 3 === 0) {
                const angle = Math.random() * Math.PI * 2;
                const len = 20 + Math.random() * 30;
                svg.appendChild(createDecoPath(
                    `M${x} ${y} L${x + Math.cos(angle) * len} ${y + Math.sin(angle) * len}`,
                    0.15, 0.8
                ));
            }
        }
    }

     // 底部“回到工作台”按钮（样式复用 floor-node）
     const backGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
     backGroup.setAttribute('class', 'floor-node');
     backGroup.setAttribute('data-nav', 'to-workbench');
     backGroup.innerHTML = `
         <circle cx="${centerX}" cy="${buttonY}" r="20" fill="#FFFFFF" stroke="#6DD5E8" stroke-width="2.5"/>
         <circle cx="${centerX}" cy="${buttonY}" r="15" fill="none" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="2,2"/>
         <path d="M${centerX - 5} ${buttonY - 3} L${centerX} ${buttonY + 2} L${centerX + 5} ${buttonY - 3}" 
               fill="none" stroke="#6DD5E8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
         <circle cx="${centerX}" cy="${buttonY}" r="4" fill="#6DD5E8"/>
         <!-- 气泡放到按钮上方，避免底部溢出 -->
         <g class="floor-node-bubble">
           <rect class="floor-node-bubble-bg" x="${centerX - 50}" y="${buttonY - 58}" width="100" height="28" rx="10" />
           <text class="floor-node-label" x="${centerX}" y="${buttonY - 44}" text-anchor="middle" dominant-baseline="middle">回到工作台</text>
         </g>
     `;
     svg.appendChild(backGroup);

     bindFloorNodeEvents(floor);
 }

 // 最佳实践页：绘制顶部线路 + "回到工作台"按钮（SVG）
 function renderPracticesFloor() {
     const floor = document.querySelector('.floor-practices');
     const svg = floor?.querySelector('.pcb-layer-svg');
     if (!floor || !svg) return;

     const svgRect = svg.getBoundingClientRect();
     const floorRect = floor.getBoundingClientRect();
     if (!svgRect.width || !svgRect.height) return;

     const viewBox = svg.viewBox.baseVal;
     const scaleX = viewBox.width / svgRect.width;
     const scaleY = viewBox.height / svgRect.height;

     // 固定在页面中心 X，保持与工作台居中对齐感
     const centerX = (floorRect.width / 2) * scaleX;
     const buttonY = 80; // 顶部按钮位置
     
     // 获取最佳实践卡片容器的位置和尺寸
     const practicesContainer = floor.querySelector('.practices-container');
     if (!practicesContainer) return;
     const containerRect = practicesContainer.getBoundingClientRect();
     const containerLeft = (containerRect.left - floorRect.left) * scaleX;
     const containerRight = (containerRect.right - floorRect.left) * scaleX;
     const containerTop = (containerRect.top - floorRect.top) * scaleY;
     const containerBottom = (containerRect.bottom - floorRect.top) * scaleY;
     const containerWidth = containerRect.width * scaleX;
     const containerHeight = containerRect.height * scaleY;
     const containerCenterX = containerLeft + containerWidth / 2;
     const containerCenterY = containerTop + containerHeight / 2;

     svg.innerHTML = '';

     const createPath = (d, className = 'trace-path', strokeWidth = 1.5, opacity = 1) => {
         const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
         path.setAttribute('d', d);
         path.setAttribute('class', className);
         path.setAttribute('stroke-width', strokeWidth);
         if (opacity < 1) path.setAttribute('opacity', opacity);
         return path;
     };

     const createCircle = (cx, cy, r = 3, fill = '#CBD5E1', opacity = 0.9, stroke = null, strokeWidth = 1) => {
         const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
         circle.setAttribute('cx', cx);
         circle.setAttribute('cy', cy);
         circle.setAttribute('r', r);
         circle.setAttribute('fill', fill);
         if (opacity < 1) circle.setAttribute('opacity', opacity);
         if (stroke) {
             circle.setAttribute('stroke', stroke);
             circle.setAttribute('stroke-width', strokeWidth);
         }
         return circle;
     };

     // 主干线路：从上方按钮延伸到最佳实践卡片顶部（不再往下延伸）
     svg.appendChild(createPath(`M${centerX} 0 L${centerX} ${buttonY - 22}`, 'trace-path active', 2.5));
     svg.appendChild(createPath(`M${centerX} ${buttonY + 22} L${centerX} ${containerTop - 40}`, 'trace-path active', 2.5));
     svg.appendChild(createCircle(centerX, buttonY - 22, 3.6, '#6DD5E8', 0.9));
     svg.appendChild(createCircle(centerX, buttonY + 22, 3.6, '#6DD5E8', 0.9));
     svg.appendChild(createCircle(centerX, containerTop - 40, 4, '#6DD5E8', 0.9, '#fff', 1.5));

     // 从最佳实践卡片顶部延伸的多束竖线到按钮
     const offsets = [-180, -120, -70, -30, 0, 30, 70, 120, 180];
     offsets.forEach((offset, idx) => {
         const x = centerX + offset;
         const isActive = offset === 0;
         const startY = containerTop - 40 - idx * 5;
         const endY = buttonY + 26;
         
         // 从卡片顶部到按钮的线条
         svg.appendChild(createPath(
             `M${x} ${startY} L${x} ${endY}`,
             isActive ? 'trace-path active' : 'trace-path',
             isActive ? 2 : 1.4,
             isActive ? 1 : 0.7
         ));
         
         // 小节点
         svg.appendChild(createCircle(x, startY, 2.4, isActive ? '#6DD5E8' : '#CBD5E1', 0.8));
         svg.appendChild(createCircle(x, endY, 2.2, isActive ? '#6DD5E8' : '#CBD5E1', 0.7));
     });

     // 从最佳实践卡片左右两侧延伸的线条
     // 左侧线条
     for (let i = 0; i < 6; i++) {
         const y = containerTop + (i + 1) * (containerHeight / 7);
         const offsetX = -80 - i * 25;
         const endX = containerLeft + offsetX;
         
         svg.appendChild(createPath(
             `M${containerLeft} ${y} L${endX} ${y} L${endX - 30} ${y + (i % 2 === 0 ? -20 : 20)}`,
             'trace-path',
             1.3,
             0.6
         ));
         svg.appendChild(createCircle(containerLeft, y, 2.5, '#CBD5E1', 0.7));
         svg.appendChild(createCircle(endX - 30, y + (i % 2 === 0 ? -20 : 20), 2, '#CBD5E1', 0.5));
     }
     
     // 右侧线条
     for (let i = 0; i < 6; i++) {
         const y = containerTop + (i + 1) * (containerHeight / 7);
         const offsetX = 80 + i * 25;
         const endX = containerRight + offsetX;
         
         svg.appendChild(createPath(
             `M${containerRight} ${y} L${endX} ${y} L${endX + 30} ${y + (i % 2 === 0 ? 20 : -20)}`,
             'trace-path',
             1.3,
             0.6
         ));
         svg.appendChild(createCircle(containerRight, y, 2.5, '#CBD5E1', 0.7));
         svg.appendChild(createCircle(endX + 30, y + (i % 2 === 0 ? 20 : -20), 2, '#CBD5E1', 0.5));
     }

     // 从最佳实践卡片下方延伸的线条
     for (let i = 0; i < 5; i++) {
         const x = containerLeft + (i + 1) * (containerWidth / 6);
         const offsetY = 60 + i * 20;
         const endY = containerBottom + offsetY;
         
         svg.appendChild(createPath(
             `M${x} ${containerBottom} L${x} ${endY} L${x + (i % 2 === 0 ? -25 : 25)} ${endY + 30}`,
             'trace-path',
             1.3,
             0.6
         ));
         svg.appendChild(createCircle(x, containerBottom, 2.5, '#CBD5E1', 0.7));
         svg.appendChild(createCircle(x + (i % 2 === 0 ? -25 : 25), endY + 30, 2, '#CBD5E1', 0.5));
     }

     // 添加装饰性背景走线网络（类似教程页）
     const createDecoPath = (d, opacity = 0.25, strokeWidth = 1, dashArray = null) => {
         const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
         path.setAttribute('d', d);
         path.setAttribute('class', 'trace-path');
         path.setAttribute('stroke-width', strokeWidth);
         path.setAttribute('opacity', opacity);
         if (dashArray) path.setAttribute('stroke-dasharray', dashArray);
         return path;
     };

     const createDecoCircle = (cx, cy, r = 2, opacity = 0.3) => {
         const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
         circle.setAttribute('cx', cx);
         circle.setAttribute('cy', cy);
         circle.setAttribute('r', r);
         circle.setAttribute('fill', '#CBD5E1');
         circle.setAttribute('opacity', opacity);
         return circle;
     };

     // 四角装饰走线网络
     // 左上角
     for (let i = 0; i < 4; i++) {
         const offsetY = 50 + i * 20;
         svg.appendChild(createDecoPath(`M30 ${offsetY} L${80 + i * 15} ${offsetY} L${100 + i * 15} ${offsetY + 25}`, 0.2));
         svg.appendChild(createDecoCircle(80 + i * 15, offsetY, 2, 0.25));
     }
     
     // 右上角
     for (let i = 0; i < 4; i++) {
         const offsetY = 50 + i * 20;
         svg.appendChild(createDecoPath(`M${viewBox.width - 30} ${offsetY} L${viewBox.width - 80 - i * 15} ${offsetY} L${viewBox.width - 100 - i * 15} ${offsetY + 25}`, 0.2));
         svg.appendChild(createDecoCircle(viewBox.width - 80 - i * 15, offsetY, 2, 0.25));
     }
     
     // 左下角（避开卡片和按钮区域）
     for (let i = 0; i < 4; i++) {
         const offsetY = containerBottom + 100 + i * 20;
         if (offsetY < viewBox.height - 50) {
             svg.appendChild(createDecoPath(`M30 ${offsetY} L${80 + i * 15} ${offsetY} L${100 + i * 15} ${offsetY - 25}`, 0.2));
             svg.appendChild(createDecoCircle(80 + i * 15, offsetY, 2, 0.25));
         }
     }
     
     // 右下角（避开卡片和按钮区域）
     for (let i = 0; i < 4; i++) {
         const offsetY = containerBottom + 100 + i * 20;
         if (offsetY < viewBox.height - 50) {
             svg.appendChild(createDecoPath(`M${viewBox.width - 30} ${offsetY} L${viewBox.width - 80 - i * 15} ${offsetY} L${viewBox.width - 100 - i * 15} ${offsetY - 25}`, 0.2));
             svg.appendChild(createDecoCircle(viewBox.width - 80 - i * 15, offsetY, 2, 0.25));
         }
     }

     // 中间区域虚线网络（避开卡片区域）
     const dashPatterns = ['5,3', '8,4', '3,2'];
     for (let i = 0; i < 8; i++) {
         const angle = (i * 45) * Math.PI / 180;
         const startX = containerCenterX + Math.cos(angle) * containerWidth * 0.7;
         const startY = containerCenterY + Math.sin(angle) * containerHeight * 0.7;
         const endX = containerCenterX + Math.cos(angle) * containerWidth * 1.8;
         const endY = containerCenterY + Math.sin(angle) * containerHeight * 2.2;
         const midX = (startX + endX) / 2;
         const midY = (startY + endY) / 2;
         
         // 确保线条不穿过卡片
         if (Math.abs(startX - containerCenterX) > containerWidth * 0.6 || Math.abs(startY - containerCenterY) > containerHeight * 0.6) {
             svg.appendChild(createDecoPath(
                 `M${startX} ${startY} L${midX} ${midY} L${endX} ${endY}`,
                 0.15, 1, dashPatterns[i % 3]
             ));
             svg.appendChild(createDecoCircle(midX, midY, 1.5, 0.2));
         }
     }

     // 交叉网格走线（避开卡片区域）
     for (let i = 0; i < 5; i++) {
         const x = 100 + i * (viewBox.width - 200) / 4;
         if (x < containerLeft - 50 || x > containerRight + 50) {
             svg.appendChild(createDecoPath(`M${x} ${buttonY + 50} L${x} ${containerTop - 30}`, 0.12, 0.8));
             svg.appendChild(createDecoPath(`M${x} ${containerBottom + 50} L${x} ${viewBox.height - 50}`, 0.12, 0.8));
         }
     }
     for (let i = 0; i < 4; i++) {
         const y = containerBottom + 60 + i * (viewBox.height - containerBottom - 100) / 3;
         if (y < viewBox.height - 50) {
             svg.appendChild(createDecoPath(`M50 ${y} L${containerLeft - 30} ${y}`, 0.12, 0.8));
             svg.appendChild(createDecoPath(`M${containerRight + 30} ${y} L${viewBox.width - 50} ${y}`, 0.12, 0.8));
         }
     }

     // 随机装饰性节点和短走线（避开卡片区域）
     for (let i = 0; i < 25; i++) {
         const x = 60 + Math.random() * (viewBox.width - 120);
         let y;
         if (x < containerLeft - 40 || x > containerRight + 40) {
             y = buttonY + 60 + Math.random() * (viewBox.height - buttonY - 150);
         } else {
             // 如果在卡片上方或下方，避开卡片
             if (Math.random() > 0.5) {
                 y = buttonY + 60 + Math.random() * (containerTop - buttonY - 80);
             } else {
                 y = containerBottom + 60 + Math.random() * (viewBox.height - containerBottom - 150);
             }
         }
         
         // 确保不落在卡片内
         if (x < containerLeft - 30 || x > containerRight + 30 || y < containerTop - 30 || y > containerBottom + 30) {
             svg.appendChild(createDecoCircle(x, y, 1.5, 0.2));
             // 添加短走线
             if (i % 3 === 0) {
                 const angle = Math.random() * Math.PI * 2;
                 const len = 20 + Math.random() * 30;
                 svg.appendChild(createDecoPath(
                     `M${x} ${y} L${x + Math.cos(angle) * len} ${y + Math.sin(angle) * len}`,
                     0.15, 0.8
                 ));
             }
         }
     }

     // 顶部"回到工作台"按钮（样式复用 floor-node）
     const backGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
     backGroup.setAttribute('class', 'floor-node');
     backGroup.setAttribute('data-nav', 'to-workbench');
     backGroup.innerHTML = `
         <circle cx="${centerX}" cy="${buttonY}" r="20" fill="#FFFFFF" stroke="#6DD5E8" stroke-width="2.5"/>
         <circle cx="${centerX}" cy="${buttonY}" r="15" fill="none" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="2,2"/>
         <path d="M${centerX - 5} ${buttonY + 3} L${centerX} ${buttonY - 2} L${centerX + 5} ${buttonY + 3}" 
               fill="none" stroke="#6DD5E8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
         <circle cx="${centerX}" cy="${buttonY}" r="4" fill="#6DD5E8"/>
         <!-- 气泡放到按钮下方，避免顶部溢出 -->
         <g class="floor-node-bubble">
           <rect class="floor-node-bubble-bg" x="${centerX - 50}" y="${buttonY + 30}" width="100" height="28" rx="10" />
           <text class="floor-node-label" x="${centerX}" y="${buttonY + 44}" text-anchor="middle" dominant-baseline="middle">回到工作台</text>
         </g>
     `;
     svg.appendChild(backGroup);

     bindFloorNodeEvents(floor);
 }

 // 动态更新SVG走线，确保精确连接到芯片引脚
 function updateTraces() {
     const floor = document.querySelector('.floor-workbench');
     const svg = floor?.querySelector('.pcb-layer-svg');
     const chipPackage = floor?.querySelector('.chip-package');
     
     if (!svg || !chipPackage || !floor) return;
     
     // 创建或获取隐藏的文本测量容器（避免频繁创建/删除DOM元素）
     let measureContainer = svg.querySelector('.text-measure-container');
     if (!measureContainer) {
         measureContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
         measureContainer.setAttribute('class', 'text-measure-container');
         measureContainer.setAttribute('style', 'visibility: hidden; pointer-events: none;');
         // 将测量容器放在一个不影响布局的位置
         measureContainer.setAttribute('transform', 'translate(-10000, -10000)');
         svg.appendChild(measureContainer);
     }
     
     // 获取侧边栏状态和可用空间
     const sidebarUnit = document.getElementById('sidebarUnit');
     const isSidebarCollapsed = sidebarUnit?.classList.contains('collapsed') || false;
     const sidebarWidth = isSidebarCollapsed ? 64 : 260; // 从 CSS 变量获取，这里硬编码对应值
     const windowWidth = window.innerWidth;
     const availableWidth = windowWidth - sidebarWidth;
     
     // 获取所有引脚元素
     const topPins = Array.from(chipPackage.querySelectorAll('.pin-array.top .pin-lead'));
     const bottomPins = Array.from(chipPackage.querySelectorAll('.pin-array.bottom .pin-lead'));
     const leftPins = Array.from(chipPackage.querySelectorAll('.pin-array.left .pin-lead'));
     const rightPins = Array.from(chipPackage.querySelectorAll('.pin-array.right .pin-lead'));
     
     // 计算坐标转换函数
     const svgRect = svg.getBoundingClientRect();
     const floorRect = floor.getBoundingClientRect();
     const viewBox = svg.viewBox.baseVal;
     const scaleX = viewBox.width / svgRect.width;
     const scaleY = viewBox.height / svgRect.height;
     
     // 计算可用空间的 SVG 坐标
     // SVG 的 viewBox 是相对于 floor 的，所以左边界是 0，右边界是 viewBox.width
     // 但需要留出一些边距，避免推荐问题被侧边栏遮挡或超出屏幕
     const leftBoundarySVG = 10; // 左侧留出 10px 边距（SVG 坐标系）
     const rightBoundarySVG = viewBox.width - 10; // 右侧留出 10px 边距（SVG 坐标系）
     
     // 将DOM坐标转换为SVG坐标
     const toSVGCoords = (element) => {
         const rect = element.getBoundingClientRect();
         const centerX = rect.left + rect.width / 2;
         const centerY = rect.top + rect.height / 2;
         return {
             x: (centerX - floorRect.left) * scaleX,
             y: (centerY - floorRect.top) * scaleY
         };
     };
     
     // 获取所有引脚的SVG坐标
     const topPinCoords = topPins.map(toSVGCoords);
     const bottomPinCoords = bottomPins.map(toSVGCoords);
     const leftPinCoords = leftPins.map(toSVGCoords);
     const rightPinCoords = rightPins.map(toSVGCoords);
     
     // 计算芯片的实际尺寸和中心
     const chipRect = chipPackage.getBoundingClientRect();
     const chipCenterX = (chipRect.left + chipRect.width / 2 - floorRect.left) * scaleX;
     const chipCenterY = (chipRect.top + chipRect.height / 2 - floorRect.top) * scaleY;
     const chipWidthSVG = chipRect.width * scaleX;
     const chipHeightSVG = chipRect.height * scaleY;
     
     // 基于芯片尺寸计算间距参数
     const horizontalSpacing = chipWidthSVG * 0.5; // 水平转折距离为芯片宽度的50%
     const verticalSpacing = chipHeightSVG * 0.6; // 垂直转折距离为芯片高度的60%
     
     // 清空现有路径，重新绘制
     svg.innerHTML = '';
     
     // 创建SVG元素的辅助函数
     const createPath = (d, className = 'trace-path', strokeWidth = 1.5, opacity = 1) => {
         const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
         path.setAttribute('d', d);
         path.setAttribute('class', className);
         path.setAttribute('stroke-width', strokeWidth);
         if (opacity < 1) path.setAttribute('opacity', opacity);
         return path;
     };
     
     const createCircle = (cx, cy, r, fill, opacity = 1, stroke = null, strokeWidth = 1) => {
         const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
         circle.setAttribute('cx', cx);
         circle.setAttribute('cy', cy);
         circle.setAttribute('r', r);
         circle.setAttribute('fill', fill);
         if (opacity < 1) circle.setAttribute('opacity', opacity);
         if (stroke) {
             circle.setAttribute('stroke', stroke);
             circle.setAttribute('stroke-width', strokeWidth);
         }
         return circle;
     };
     
     // 计算文本实际宽度的函数（优化版：使用测量容器，避免频繁DOM操作）
     const calculateTextWidth = (text, fontSize = 11, fontFamily = 'system-ui, -apple-system, sans-serif') => {
         if (!text || text.length === 0) return 120;
         
         // 使用已存在的测量容器，避免频繁创建/删除DOM元素
         const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
         tempText.setAttribute('font-size', fontSize);
         tempText.setAttribute('font-weight', '500');
         tempText.setAttribute('font-family', fontFamily);
         tempText.setAttribute('text-anchor', 'start'); // 确保从起点测量
         tempText.textContent = text;
         measureContainer.appendChild(tempText);
         
         let actualWidth = 0;
         try {
             // 强制浏览器计算布局
             const bbox = tempText.getBBox();
             actualWidth = bbox.width;
             
             // 如果测量结果异常小，使用估算值
             if (actualWidth < 10) {
                 throw new Error('Measurement too small');
             }
         } catch (e) {
             // 如果测量失败，使用估算值（中文字符按11px，英文字符按6.5px计算）
             for (let i = 0; i < text.length; i++) {
                 const char = text[i];
                 // 判断是否为中文字符（包括中文标点）
                 if (/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(char)) {
                     actualWidth += 11; // 中文字符宽度
                 } else {
                     actualWidth += 6.5; // 英文字符和数字宽度
                 }
             }
         } finally {
             measureContainer.removeChild(tempText);
         }
         
         // 返回实际宽度加上左右内边距（各20px，确保文本不会紧贴边缘）
         // 增加一些额外的安全边距，避免文本溢出
         return Math.max(actualWidth + 40, 120); // 最小宽度120px，内边距40px
     };
     
    // 获取芯片输入框的位置，用于确定推荐问题节点的位置
    const searchWrapper = chipPackage?.querySelector('.search-wrapper');
    let searchWrapperY = chipCenterY;
    if (searchWrapper) {
        const searchRect = searchWrapper.getBoundingClientRect();
        searchWrapperY = (searchRect.top + searchRect.height / 2 - floorRect.top) * scaleY;
    }
    
    // 从侧边栏到芯片左侧引脚的走线 - 对称实现，与右侧风格一致
    // 左侧推荐问题列表
    const leftQuestions = [
        'GD25Q64ESIGR',
        '基于产品需求，生成BOM',
        'R26110692的内阻多大'
    ];
    
    leftPinCoords.forEach((pin, i) => {
        const startX = 0;
        // 完全对称于右侧：bendX1 对应右侧的 bendX1，bendX2 对应右侧的 bendX2
        const bendX1 = pin.x - horizontalSpacing * 0.2; // 从引脚向左的第一个拐点
        const bendX2 = pin.x - horizontalSpacing * 0.4 - i * (horizontalSpacing * 0.1); // 第二个拐点，对称于右侧
        const isActive = i === 0;
        // 与右侧完全相同的垂直偏移逻辑
        const offsetY = (i - 1) * (verticalSpacing * 0.25);
        
        // 左侧连线：从右往左展开，完全对称于右侧（右侧从左往右）
        // 右侧：M${pin.x} ${pin.y} L${bendX1} ${pin.y} L${bendX2} ${pin.y + offsetY} L${endX} ${pin.y + offsetY}
        // 左侧：M${pin.x} ${pin.y} L${bendX1} ${pin.y} L${bendX2} ${pin.y + offsetY} L${startX} ${pin.y + offsetY}
        svg.appendChild(createPath(
            `M${pin.x} ${pin.y} L${bendX1} ${pin.y} L${bendX2} ${pin.y + offsetY} L${startX} ${pin.y + offsetY}`,
            isActive ? 'trace-path active' : 'trace-path'
        ));
        
        svg.appendChild(createCircle(pin.x, pin.y, isActive ? 4 : 3, isActive ? '#6DD5E8' : '#CBD5E1', 0.9, isActive ? '#fff' : null, 1.5));
        svg.appendChild(createCircle(bendX2, pin.y + offsetY, isActive ? 3.5 : 2.5, isActive ? '#6DD5E8' : '#CBD5E1', 0.8));
        svg.appendChild(createCircle(startX, pin.y + offsetY, isActive ? 3.5 : 2.5, isActive ? '#6DD5E8' : '#CBD5E1', 0.8));
        
        // 在左侧连线上添加推荐问题节点（气泡样式）- 完全复用右侧的逻辑
        if (i < leftQuestions.length) {
            const questionText = leftQuestions[i];
            // 问题节点的Y坐标基于连线的实际位置（拐角后的Y坐标，跟随 offsetY）- 与右侧相同
            const questionY = pin.y + offsetY;
            // 气泡位置：在拐角点 bendX2 左侧（对应右侧的 bendX2 右侧）
            const questionX = bendX2 - 15; // 气泡在拐角点左侧
            const branchX = bendX2; // 分支从拐角点 bendX2 开始（与右侧相同）
            
            // 使用准确的方法计算文本宽度
            const textWidth = calculateTextWidth(questionText);
            const textHeight = 32;
            
            // 检查左侧边界，确保气泡不超出
            const bubbleLeftEdge = questionX - textWidth;
            const minLeftEdge = leftBoundarySVG; // 使用已定义的左边界
            const adjustedQuestionX = bubbleLeftEdge < minLeftEdge 
                ? minLeftEdge + textWidth 
                : questionX;
            
            // 优化连接线路径，避免交叉
            // 对于底部气泡（i=2），使用更平滑的路径，稍微向下偏移避免交叉
            const isBottomBubble = i === leftQuestions.length - 1;
            const connectionOffsetY = isBottomBubble ? 8 : 0; // 底部气泡向下偏移8px
            const branchEndX = adjustedQuestionX - 110;
            const connectionY = questionY + connectionOffsetY;
            
            // 从主线拐角点连接到问题节点的线条（带平滑拐角）
            // 使用二次贝塞尔曲线或平滑的L型路径
            if (isBottomBubble) {
                // 底部气泡：先水平延伸，再垂直向下，最后水平连接到气泡
                const midX = branchX - 50; // 中间点X坐标
                svg.appendChild(createPath(
                    `M${branchX} ${questionY} L${midX} ${questionY} L${midX} ${connectionY} L${branchEndX} ${connectionY}`,
                    'trace-path',
                    1.5,
                    0.8
                ));
            } else {
                // 其他气泡：直接水平连接
                svg.appendChild(createPath(
                    `M${branchX} ${questionY} L${branchEndX} ${questionY}`,
                    'trace-path',
                    1.5,
                    0.8
                ));
            }
            
            // 问题气泡节点 - 完全复用右侧的样式
            const questionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            questionGroup.setAttribute('class', 'question-node');
            questionGroup.setAttribute('style', 'cursor: pointer;');
            questionGroup.addEventListener('click', function(e) {
                e.stopPropagation();
                if (window.setMainInputValue) {
                    window.setMainInputValue(questionText);
                }
            });
            
            // 气泡背景
            const bubbleRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bubbleRect.setAttribute('x', adjustedQuestionX - textWidth);
            bubbleRect.setAttribute('y', questionY - textHeight / 2);
            bubbleRect.setAttribute('width', textWidth);
            bubbleRect.setAttribute('height', textHeight);
            bubbleRect.setAttribute('rx', '16');
            bubbleRect.setAttribute('fill', '#FFFFFF');
            bubbleRect.setAttribute('stroke', '#6DD5E8');
            bubbleRect.setAttribute('stroke-width', '1.5');
            bubbleRect.setAttribute('filter', 'drop-shadow(0 2px 8px rgba(109, 213, 232, 0.15))');
            questionGroup.appendChild(bubbleRect);
            
            // 文本
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', adjustedQuestionX - textWidth / 2);
            text.setAttribute('y', questionY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '11');
            text.setAttribute('fill', '#334155');
            text.setAttribute('font-weight', '500');
            text.textContent = questionText;
            questionGroup.appendChild(text);
            
            // 连接点（在分支线上，根据是否为底部气泡调整位置）
            svg.appendChild(createCircle(branchEndX, connectionY, 3, '#6DD5E8', 0.9));
            
            svg.appendChild(questionGroup);
        }
        
        // 添加更多装饰性分支走线 - 对称于右侧
        const branchY = pin.y + offsetY + (i - 1.5) * (verticalSpacing * 0.1);
        svg.appendChild(createPath(
            `M${bendX2} ${pin.y + offsetY} L${bendX2 - horizontalSpacing * 0.08} ${branchY} L${bendX2 - horizontalSpacing * 0.15} ${branchY}`,
            'trace-path', 1, 0.35
        ));
        svg.appendChild(createCircle(bendX2 - horizontalSpacing * 0.15, branchY, 2, '#CBD5E1', 0.5));
        
        // 额外的次级分支
        if (i === 2) {
            svg.appendChild(createPath(
                `M${bendX2 - horizontalSpacing * 0.08} ${branchY} L${bendX2 - horizontalSpacing * 0.08} ${branchY + 40} L${bendX2 - horizontalSpacing * 0.12} ${branchY + 60}`,
                'trace-path', 1, 0.25
            ));
        }
    });
     
     // 从芯片顶部引脚到上方按钮和页面顶部 - 基于芯片高度计算间距
     const upButtonY = 80;
     const centerTopIndex = Math.floor(topPinCoords.length / 2);
     
     topPinCoords.forEach((pin, i) => {
         const isCenter = i === centerTopIndex;
         const bendY1 = pin.y - verticalSpacing * 0.35;
         const bendY2 = pin.y - verticalSpacing * 0.65;
         
         if (isCenter) {
             // 中心主走线，穿过按钮
             svg.appendChild(createPath(`M${pin.x} ${pin.y} L${pin.x} ${upButtonY + 22}`, 'trace-path active', 2.5));
             svg.appendChild(createPath(`M${pin.x} ${upButtonY - 22} L${pin.x} 0`, 'trace-path active', 2.5));
         } else {
             // 其他引脚的分支走线 - 基于芯片宽度的偏移
             const offsetX = (i - centerTopIndex) * (chipWidthSVG * 0.08);
             svg.appendChild(createPath(
                 `M${pin.x} ${pin.y} L${pin.x} ${bendY1} L${pin.x + offsetX} ${bendY2} L${pin.x + offsetX} 0`,
                 'trace-path',
                 1.5,
                 0.7
             ));
             
             // 添加更多装饰性分支
             const branchX = pin.x + offsetX * 0.5;
             const branchY = bendY1 - verticalSpacing * 0.12;
             svg.appendChild(createPath(
                 `M${pin.x} ${bendY1} L${branchX} ${branchY} L${branchX + chipWidthSVG * 0.06} ${branchY}`,
                 'trace-path', 1, 0.3
             ));
             svg.appendChild(createCircle(branchX + chipWidthSVG * 0.06, branchY, 2, '#CBD5E1', 0.4));
             
             // 次级分支
             if (Math.abs(i - centerTopIndex) === 2) {
                 svg.appendChild(createPath(
                     `M${branchX} ${branchY} L${branchX} ${branchY - 40} L${branchX - 30} ${branchY - 70}`,
                     'trace-path', 1, 0.25
                 ));
             }
         }
         
         // 引脚连接点
         svg.appendChild(createCircle(pin.x, pin.y, isCenter ? 4 : 3, isCenter ? '#6DD5E8' : '#CBD5E1', 0.9, isCenter ? '#fff' : null, 1.5));
     });
     
     // 上方楼层切换按钮
     const centerTopPin = topPinCoords[centerTopIndex];
     const upButtonGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
     upButtonGroup.setAttribute('class', 'floor-node');
     upButtonGroup.setAttribute('data-floor', 'up');
     upButtonGroup.setAttribute('data-nav', 'to-tutorial');
     upButtonGroup.innerHTML = `
         <circle cx="${centerTopPin.x}" cy="${upButtonY}" r="20" fill="#FFFFFF" stroke="#6DD5E8" stroke-width="2.5"/>
         <circle cx="${centerTopPin.x}" cy="${upButtonY}" r="15" fill="none" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="2,2"/>
         <path d="M${centerTopPin.x - 5} ${upButtonY + 3} L${centerTopPin.x} ${upButtonY - 2} L${centerTopPin.x + 5} ${upButtonY + 3}" 
               fill="none" stroke="#6DD5E8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
         <circle cx="${centerTopPin.x}" cy="${upButtonY}" r="4" fill="#6DD5E8"/>
         <!-- 气泡放到按钮下方，避免顶部溢出 -->
         <g class="floor-node-bubble">
           <rect class="floor-node-bubble-bg" x="${centerTopPin.x - 42}" y="${upButtonY + 30}" width="84" height="28" rx="10" />
           <text class="floor-node-label" x="${centerTopPin.x}" y="${upButtonY + 44}" text-anchor="middle" dominant-baseline="middle">查看教程</text>
         </g>
     `;
     svg.appendChild(upButtonGroup);
     
     // 从芯片底部引脚到下方按钮和页面底部 - 基于芯片高度计算间距
     const downButtonY = viewBox.height - 80;
     const centerBottomIndex = Math.floor(bottomPinCoords.length / 2);
     
     bottomPinCoords.forEach((pin, i) => {
         const isCenter = i === centerBottomIndex;
         const bendY1 = pin.y + verticalSpacing * 0.35;
         const bendY2 = pin.y + verticalSpacing * 0.65;
         
         if (isCenter) {
             // 中心主走线，穿过按钮
             svg.appendChild(createPath(`M${pin.x} ${pin.y} L${pin.x} ${downButtonY - 22}`, 'trace-path active', 2.5));
             svg.appendChild(createPath(`M${pin.x} ${downButtonY + 22} L${pin.x} ${viewBox.height}`, 'trace-path active', 2.5));
         } else {
             // 其他引脚的分支走线 - 基于芯片宽度的偏移
             const offsetX = (i - centerBottomIndex) * (chipWidthSVG * 0.08);
             svg.appendChild(createPath(
                 `M${pin.x} ${pin.y} L${pin.x} ${bendY1} L${pin.x + offsetX} ${bendY2} L${pin.x + offsetX} ${viewBox.height}`,
                 'trace-path',
                 1.5,
                 0.7
             ));
             
             // 添加更多装饰性分支
             const branchX = pin.x + offsetX * 0.5;
             const branchY = bendY1 + verticalSpacing * 0.12;
             svg.appendChild(createPath(
                 `M${pin.x} ${bendY1} L${branchX} ${branchY} L${branchX + chipWidthSVG * 0.06} ${branchY}`,
                 'trace-path', 1, 0.3
             ));
             svg.appendChild(createCircle(branchX + chipWidthSVG * 0.06, branchY, 2, '#CBD5E1', 0.4));
             
             // 次级分支
             if (Math.abs(i - centerBottomIndex) === 2) {
                 svg.appendChild(createPath(
                     `M${branchX} ${branchY} L${branchX} ${branchY + 40} L${branchX - 30} ${branchY + 70}`,
                     'trace-path', 1, 0.25
                 ));
             }
         }
         
         // 引脚连接点
         svg.appendChild(createCircle(pin.x, pin.y, isCenter ? 4 : 3, isCenter ? '#6DD5E8' : '#CBD5E1', 0.9, isCenter ? '#fff' : null, 1.5));
     });
     
    // 下方楼层切换按钮
    const centerBottomPin = bottomPinCoords[centerBottomIndex];
    const downButtonGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    downButtonGroup.setAttribute('class', 'floor-node');
    downButtonGroup.setAttribute('data-nav', 'to-practices');
     downButtonGroup.innerHTML = `
         <circle cx="${centerBottomPin.x}" cy="${downButtonY}" r="20" fill="#FFFFFF" stroke="#6DD5E8" stroke-width="2.5"/>
         <circle cx="${centerBottomPin.x}" cy="${downButtonY}" r="15" fill="none" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="2,2"/>
         <path d="M${centerBottomPin.x - 5} ${downButtonY - 3} L${centerBottomPin.x} ${downButtonY + 2} L${centerBottomPin.x + 5} ${downButtonY - 3}" 
               fill="none" stroke="#6DD5E8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
         <circle cx="${centerBottomPin.x}" cy="${downButtonY}" r="4" fill="#6DD5E8"/>
         <!-- 气泡放到按钮上方，避免底部溢出 -->
         <g class="floor-node-bubble">
           <rect class="floor-node-bubble-bg" x="${centerBottomPin.x - 42}" y="${downButtonY - 58}" width="84" height="28" rx="10" />
           <text class="floor-node-label" x="${centerBottomPin.x}" y="${downButtonY - 44}" text-anchor="middle" dominant-baseline="middle">最佳实践</text>
         </g>
     `;
     svg.appendChild(downButtonGroup);
     
    // 从芯片右侧引脚到页面右侧 - 基于芯片宽度计算间距
    // 右侧推荐问题列表
    const rightQuestions = [
        '品牌为英飞凌，内阻小于 100mΩ的mos',
        'R26112362推荐同规格产品',
        'SCT1000N170平台解读'
    ];
    
    rightPinCoords.forEach((pin, i) => {
        const bendX1 = pin.x + horizontalSpacing * 0.2;
        const bendX2 = pin.x + horizontalSpacing * 0.4 + i * (horizontalSpacing * 0.1);
        const endX = viewBox.width;
        const isActive = i === 1;
        // 调整垂直偏移，让问题分布更均匀：上面的往上，下面的往下（与左侧对称）
        const offsetY = (i - 1) * (verticalSpacing * 0.25); // 增加间距，让分布更均匀
        
        svg.appendChild(createPath(
            `M${pin.x} ${pin.y} L${bendX1} ${pin.y} L${bendX2} ${pin.y + offsetY} L${endX} ${pin.y + offsetY}`,
            isActive ? 'trace-path active' : 'trace-path'
        ));
        
        svg.appendChild(createCircle(pin.x, pin.y, isActive ? 4 : 3, isActive ? '#6DD5E8' : '#CBD5E1', 0.9, isActive ? '#fff' : null, 1.5));
        svg.appendChild(createCircle(bendX2, pin.y + offsetY, isActive ? 3.5 : 2.5, isActive ? '#6DD5E8' : '#CBD5E1', 0.8));
        
        // 在右侧连线上添加推荐问题节点（气泡样式）- 连接到主线的拐角点
        if (i < rightQuestions.length) {
            const questionText = rightQuestions[i];
            // 问题节点的Y坐标基于连线的实际位置（拐角后的Y坐标，跟随 offsetY）
            const questionY = pin.y + offsetY;
            // 气泡位置：在拐角点 bendX2 右侧，留出连接空间
            const questionX = bendX2 + 15; // 气泡在拐角点右侧
            const branchX = bendX2; // 分支从拐角点 bendX2 开始
            
            // 使用准确的方法计算文本宽度
            const textWidth = calculateTextWidth(questionText);
            const textHeight = 32;
            
            // 检查右侧边界，确保气泡不超出
            const bubbleRightEdge = questionX + textWidth;
            const maxRightEdge = rightBoundarySVG; // 使用已定义的右边界
            const adjustedQuestionX = bubbleRightEdge > maxRightEdge 
                ? maxRightEdge - textWidth 
                : questionX;
            
            // 优化连接线路径，避免交叉
            // 对于底部气泡（i=2），使用更平滑的路径，稍微向下偏移避免交叉
            const isBottomBubble = i === rightQuestions.length - 1;
            const connectionOffsetY = isBottomBubble ? 8 : 0; // 底部气泡向下偏移8px
            const branchEndX = adjustedQuestionX + 110;
            const connectionY = questionY + connectionOffsetY;
            
            // 从主线拐角点连接到问题节点的线条（带平滑拐角）
            if (isBottomBubble) {
                // 底部气泡：先水平延伸，再垂直向下，最后水平连接到气泡
                const midX = branchX + 50; // 中间点X坐标
                svg.appendChild(createPath(
                    `M${branchX} ${questionY} L${midX} ${questionY} L${midX} ${connectionY} L${branchEndX} ${connectionY}`,
                    'trace-path',
                    1.5,
                    0.8
                ));
            } else {
                // 其他气泡：直接水平连接
                svg.appendChild(createPath(
                    `M${branchX} ${questionY} L${branchEndX} ${questionY}`,
                    'trace-path',
                    1.5,
                    0.8
                ));
            }
            
            // 问题气泡节点
            const questionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            questionGroup.setAttribute('class', 'question-node');
            questionGroup.setAttribute('style', 'cursor: pointer;');
            questionGroup.addEventListener('click', function(e) {
                e.stopPropagation();
                if (window.setMainInputValue) {
                    window.setMainInputValue(questionText);
                }
            });
            
            // 气泡背景
            const bubbleRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bubbleRect.setAttribute('x', adjustedQuestionX);
            bubbleRect.setAttribute('y', questionY - textHeight / 2);
            bubbleRect.setAttribute('width', textWidth);
            bubbleRect.setAttribute('height', textHeight);
            bubbleRect.setAttribute('rx', '16');
            bubbleRect.setAttribute('fill', '#FFFFFF');
            bubbleRect.setAttribute('stroke', '#6DD5E8');
            bubbleRect.setAttribute('stroke-width', '1.5');
            bubbleRect.setAttribute('filter', 'drop-shadow(0 2px 8px rgba(109, 213, 232, 0.15))');
            questionGroup.appendChild(bubbleRect);
            
            // 文本
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', adjustedQuestionX + textWidth / 2);
            text.setAttribute('y', questionY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '11');
            text.setAttribute('fill', '#334155');
            text.setAttribute('font-weight', '500');
            text.textContent = questionText;
            questionGroup.appendChild(text);
            
            // 连接点（在分支线上，根据是否为底部气泡调整位置）
            svg.appendChild(createCircle(branchEndX, connectionY, 3, '#6DD5E8', 0.9));
            
            svg.appendChild(questionGroup);
        }
        
        // 添加更多装饰性分支走线
        const branchY = pin.y + offsetY + (i - 1.5) * (verticalSpacing * 0.1);
        svg.appendChild(createPath(
            `M${bendX2} ${pin.y + offsetY} L${bendX2 + horizontalSpacing * 0.08} ${branchY} L${bendX2 + horizontalSpacing * 0.15} ${branchY}`,
            'trace-path', 1, 0.35
        ));
        svg.appendChild(createCircle(bendX2 + horizontalSpacing * 0.15, branchY, 2, '#CBD5E1', 0.5));
        
        // 额外的次级分支
        if (i === 2) {
            svg.appendChild(createPath(
                `M${bendX2 + horizontalSpacing * 0.08} ${branchY} L${bendX2 + horizontalSpacing * 0.08} ${branchY + 40} L${bendX2 + horizontalSpacing * 0.12} ${branchY + 60}`,
                'trace-path', 1, 0.25
            ));
        }
    });
     
     // 添加装饰性背景走线网络
     addDecorativeTraces(svg, viewBox, chipCenterX, chipCenterY, chipWidthSVG, chipHeightSVG);
     
     // 重新绑定按钮事件
     bindFloorNodeEvents(floor);
     
     // 重新初始化视觉效果
     setTimeout(() => {
         if (floor.classList.contains('floor-workbench')) {
             initWorkbenchEffects();
         } else if (floor.classList.contains('floor-tutorial')) {
             initTutorialEffects();
         } else if (floor.classList.contains('floor-practices')) {
             initPracticesEffects();
         }
     }, 300);
 }
 
 // 添加大量装饰性背景走线
 function addDecorativeTraces(svg, viewBox, centerX, centerY, chipWidth, chipHeight) {
     const createPath = (d, opacity = 0.25, strokeWidth = 1, dashArray = null) => {
         const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
         path.setAttribute('d', d);
         path.setAttribute('class', 'trace-path');
         path.setAttribute('stroke-width', strokeWidth);
         path.setAttribute('opacity', opacity);
         if (dashArray) path.setAttribute('stroke-dasharray', dashArray);
         return path;
     };
     
     const createCircle = (cx, cy, r = 2, opacity = 0.3) => {
         const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
         circle.setAttribute('cx', cx);
         circle.setAttribute('cy', cy);
         circle.setAttribute('r', r);
         circle.setAttribute('fill', '#CBD5E1');
         circle.setAttribute('opacity', opacity);
         return circle;
     };
     
     // 四角密集装饰走线网络
     // 左上角 - 多层走线
     for (let i = 0; i < 5; i++) {
         const offsetY = 60 + i * 25;
         svg.appendChild(createPath(`M20 ${offsetY} L${80 + i * 15} ${offsetY} L${110 + i * 15} ${offsetY + 30} L${180 + i * 20} ${offsetY + 30}`, 0.2));
         svg.appendChild(createCircle(80 + i * 15, offsetY, 2, 0.25));
     }
     // 左上角垂直走线
     for (let i = 0; i < 3; i++) {
         const offsetX = 60 + i * 40;
         svg.appendChild(createPath(`M${offsetX} 40 L${offsetX} 100 L${offsetX + 20} 130 L${offsetX + 20} 180`, 0.18));
     }
     
     // 右上角 - 多层走线
     for (let i = 0; i < 5; i++) {
         const offsetY = 60 + i * 25;
         svg.appendChild(createPath(`M${viewBox.width - 20} ${offsetY} L${viewBox.width - 80 - i * 15} ${offsetY} L${viewBox.width - 110 - i * 15} ${offsetY + 30} L${viewBox.width - 180 - i * 20} ${offsetY + 30}`, 0.2));
         svg.appendChild(createCircle(viewBox.width - 80 - i * 15, offsetY, 2, 0.25));
     }
     // 右上角垂直走线
     for (let i = 0; i < 3; i++) {
         const offsetX = viewBox.width - 60 - i * 40;
         svg.appendChild(createPath(`M${offsetX} 40 L${offsetX} 100 L${offsetX - 20} 130 L${offsetX - 20} 180`, 0.18));
     }
     
     // 左下角 - 多层走线
     for (let i = 0; i < 5; i++) {
         const offsetY = viewBox.height - 60 - i * 25;
         svg.appendChild(createPath(`M20 ${offsetY} L${80 + i * 15} ${offsetY} L${110 + i * 15} ${offsetY - 30} L${180 + i * 20} ${offsetY - 30}`, 0.2));
         svg.appendChild(createCircle(80 + i * 15, offsetY, 2, 0.25));
     }
     // 左下角垂直走线
     for (let i = 0; i < 3; i++) {
         const offsetX = 60 + i * 40;
         svg.appendChild(createPath(`M${offsetX} ${viewBox.height - 40} L${offsetX} ${viewBox.height - 100} L${offsetX + 20} ${viewBox.height - 130} L${offsetX + 20} ${viewBox.height - 180}`, 0.18));
     }
     
     // 右下角 - 多层走线
     for (let i = 0; i < 5; i++) {
         const offsetY = viewBox.height - 60 - i * 25;
         svg.appendChild(createPath(`M${viewBox.width - 20} ${offsetY} L${viewBox.width - 80 - i * 15} ${offsetY} L${viewBox.width - 110 - i * 15} ${offsetY - 30} L${viewBox.width - 180 - i * 20} ${offsetY - 30}`, 0.2));
         svg.appendChild(createCircle(viewBox.width - 80 - i * 15, offsetY, 2, 0.25));
     }
     // 右下角垂直走线
     for (let i = 0; i < 3; i++) {
         const offsetX = viewBox.width - 60 - i * 40;
         svg.appendChild(createPath(`M${offsetX} ${viewBox.height - 40} L${offsetX} ${viewBox.height - 100} L${offsetX - 20} ${viewBox.height - 130} L${offsetX - 20} ${viewBox.height - 180}`, 0.18));
     }
     
     // 中间区域虚线网络
     const dashPatterns = ['5,3', '8,4', '3,2'];
     for (let i = 0; i < 6; i++) {
         const angle = (i * 60) * Math.PI / 180;
         const startX = centerX + Math.cos(angle) * chipWidth * 0.8;
         const startY = centerY + Math.sin(angle) * chipHeight * 0.8;
         const endX = centerX + Math.cos(angle) * chipWidth * 1.5;
         const endY = centerY + Math.sin(angle) * chipHeight * 1.8;
         const midX = (startX + endX) / 2;
         const midY = (startY + endY) / 2;
         
         svg.appendChild(createPath(
             `M${startX} ${startY} L${midX} ${midY} L${endX} ${endY}`,
             0.15, 1, dashPatterns[i % 3]
         ));
         svg.appendChild(createCircle(midX, midY, 1.5, 0.2));
     }
     
     // 添加交叉网格走线
     for (let i = 0; i < 4; i++) {
         const x = 150 + i * (viewBox.width - 300) / 3;
         if (Math.abs(x - centerX) > chipWidth * 0.7) {
             svg.appendChild(createPath(`M${x} 50 L${x} ${viewBox.height - 50}`, 0.12, 0.8));
         }
     }
     for (let i = 0; i < 4; i++) {
         const y = 150 + i * (viewBox.height - 300) / 3;
         if (Math.abs(y - centerY) > chipHeight * 0.8) {
             svg.appendChild(createPath(`M50 ${y} L${viewBox.width - 50} ${y}`, 0.12, 0.8));
         }
     }
     
     // 随机装饰性节点和短走线
     for (let i = 0; i < 30; i++) {
         const x = 80 + Math.random() * (viewBox.width - 160);
         const y = 80 + Math.random() * (viewBox.height - 160);
         // 避开芯片中心区域
         if (Math.abs(x - centerX) > chipWidth * 0.6 || Math.abs(y - centerY) > chipHeight * 0.7) {
             svg.appendChild(createCircle(x, y, 1.5, 0.2));
             // 添加短走线
             if (i % 3 === 0) {
                 const angle = Math.random() * Math.PI * 2;
                 const len = 20 + Math.random() * 30;
                 svg.appendChild(createPath(
                     `M${x} ${y} L${x + Math.cos(angle) * len} ${y + Math.sin(angle) * len}`,
                     0.15, 0.8
                 ));
             }
         }
     }
 }
 
 // 绑定楼层切换按钮事件
 function bindFloorNodeEvents(root = document) {
     root.querySelectorAll('.floor-node').forEach(node => {
         node.addEventListener('click', function() {
             const nav = this.getAttribute('data-nav');
            if (nav === 'to-tutorial') {
                setActiveFloor('tutorial');
                // 进入新页面后重绘一次，保证位置准确
                requestAnimationFrame(() => {
                    renderTutorialFloor();
                    setTimeout(() => {
                        initTutorialEffects();
                    }, 400);
                });
                return;
            }
           if (nav === 'to-practices') {
               setActiveFloor('practices');
               // 进入新页面后重绘一次，保证位置准确
               requestAnimationFrame(() => {
                   renderPracticesFloor();
                   setTimeout(() => {
                       initPracticesEffects();
                   }, 400);
               });
               return;
           }
           if (nav === 'to-workbench') {
               setActiveFloor('workbench');
               setTimeout(() => {
                   initWorkbenchEffects();
               }, 400);
               return;
           }

            const floor = this.getAttribute('data-floor');
             if (floor) console.log('准备切换到楼层:', floor);
             
             this.style.transform = 'scale(0.9)';
             setTimeout(() => {
                 this.style.transform = '';
             }, 200);
         });
     });
 }
 
 // ========== 动画配置参数（可在此处调整所有动画节奏）==========
 // 提示：所有时长单位为毫秒（ms），CSS动画时长单位为秒（s）
 // 默认值已设置为原来的3倍（放慢3倍），可根据需要调整
 const ANIMATION_CONFIG = {
     // CSS动画时长（秒）
     breathingGlowDuration: 9,        // 呼吸灯动画时长（原3s，现9s）
     currentFlowPulseDuration: 3.6,   // 电流脉冲动画时长（原1.2s，现3.6s）
     
     // JavaScript定时器时长（毫秒）
     phase1BreathingDuration: 6000,  // 阶段1：随机激活线条时长（原2000ms，现6000ms）
     phase2CurrentFlowDuration: 3600, // 阶段2：电流传导时长（原1200ms，现3600ms）
     phase2Delay: 6000,               // 阶段2延迟开始时间（原2000ms，现6000ms）
     cycleInterval: 12000,            // 完整循环间隔（原4000ms，现12000ms）
     
     // 细节动画时长（毫秒）
     pathStaggerDelay: 60,            // 线条错开延迟（原20ms，现60ms）
     
     // 初始化延迟（毫秒）
     initDelay: 1500,                 // 初始化延迟（原500ms，现1500ms）
     resizeDelay: 900                 // 窗口大小改变后延迟（原300ms，现900ms）
 };
 
 // ========== 通用视觉效果系统 ==========
 
 /**
  * 有节奏的动效系统：随机激活线条 → 同时向外传导电流
  * @param {SVGElement} svg - SVG容器
  * @param {number} centerX - 中心X坐标
  * @param {number} centerY - 中心Y坐标
  */
 function initRhythmicEffects(svg, centerX, centerY) {
     // 应用CSS动画时长到SVG元素
     svg.style.setProperty('--breathing-duration', `${ANIMATION_CONFIG.breathingGlowDuration}s`);
     svg.style.setProperty('--current-flow-duration', `${ANIMATION_CONFIG.currentFlowPulseDuration}s`);
     if (!svg) return;
     
     // 获取所有主要线条（排除装饰性线条）
     const allPaths = Array.from(svg.querySelectorAll('.trace-path'));
     const mainPaths = allPaths.filter(path => {
         const opacity = parseFloat(path.getAttribute('opacity') || '1');
         const strokeWidth = parseFloat(path.getAttribute('stroke-width') || '1.5');
         // 放宽筛选条件：opacity >= 0.4 且 strokeWidth >= 1.2，确保教程页和最佳实践页的线条也能被选中
         return opacity >= 0.4 && strokeWidth >= 1.2;
     });
     
     if (mainPaths.length === 0) return;
     
     // 按方向分组线条（四个方向：上、下、左、右）
     const pathsByDirection = {
         top: [],
         bottom: [],
         left: [],
         right: []
     };
     
     mainPaths.forEach(path => {
         const d = path.getAttribute('d') || '';
         // 尝试匹配路径起点（M命令）
         let match = d.match(/M\s*([\d.]+)\s*([\d.]+)/);
         
         // 如果没找到M命令，尝试匹配第一个坐标点
         if (!match) {
             const coordMatch = d.match(/([\d.]+)\s+([\d.]+)/);
             if (coordMatch) {
                 match = [null, coordMatch[1], coordMatch[2]];
             }
         }
         
         if (match) {
             const startX = parseFloat(match[1]);
             const startY = parseFloat(match[2]);
             
             // 判断方向
             const dx = startX - centerX;
             const dy = startY - centerY;
             const absDx = Math.abs(dx);
             const absDy = Math.abs(dy);
             
             // 如果距离中心太近，根据路径整体方向判断
             if (absDx < 50 && absDy < 50) {
                 // 尝试从路径的其他点判断方向
                 const allCoords = d.match(/([\d.]+)\s+([\d.]+)/g);
                 if (allCoords && allCoords.length > 1) {
                     const lastCoord = allCoords[allCoords.length - 1].split(/\s+/);
                     const endX = parseFloat(lastCoord[0]);
                     const endY = parseFloat(lastCoord[1]);
                     const endDx = endX - centerX;
                     const endDy = endY - centerY;
                     
                     if (Math.abs(endDy) > Math.abs(endDx)) {
                         if (endDy < 0) pathsByDirection.top.push(path);
                         else pathsByDirection.bottom.push(path);
                     } else {
                         if (endDx < 0) pathsByDirection.left.push(path);
                         else pathsByDirection.right.push(path);
                     }
                 } else {
                     // 无法判断方向，放入最近的组
                     if (absDy > absDx) {
                         if (dy < 0) pathsByDirection.top.push(path);
                         else pathsByDirection.bottom.push(path);
                     } else {
                         if (dx < 0) pathsByDirection.left.push(path);
                         else pathsByDirection.right.push(path);
                     }
                 }
             } else {
                 // 正常判断方向
                 if (absDy > absDx) {
                     // 垂直方向
                     if (dy < 0) pathsByDirection.top.push(path);
                     else pathsByDirection.bottom.push(path);
                 } else {
                     // 水平方向
                     if (dx < 0) pathsByDirection.left.push(path);
                     else pathsByDirection.right.push(path);
                 }
             }
         } else {
             // 无法解析路径，放入默认组（底部）
             pathsByDirection.bottom.push(path);
         }
     });
     
     // 阶段1：随机激活线条（呼吸灯效果）
     function phase1_RandomBreathing() {
         // 清除所有效果
         mainPaths.forEach(path => path.classList.remove('breathing', 'current-flow'));
         
         // 每个方向随机激活 2-3 条线条
         Object.keys(pathsByDirection).forEach(direction => {
             const paths = pathsByDirection[direction];
             if (paths.length === 0) return;
             
             const count = Math.min(2 + Math.floor(Math.random() * 2), paths.length);
             const shuffled = [...paths].sort(() => Math.random() - 0.5);
             
             shuffled.slice(0, count).forEach(path => {
                 path.classList.add('breathing');
             });
         });
     }
     
     // 阶段2：同时向外传导电流
     function phase2_CurrentFlow() {
         // 清除呼吸灯效果
         mainPaths.forEach(path => path.classList.remove('breathing'));
         
         // 所有主要线条同时激活电流效果
         mainPaths.forEach((path, index) => {
             setTimeout(() => {
                 path.classList.add('current-flow');
             }, index * ANIMATION_CONFIG.pathStaggerDelay); // 稍微错开，形成波浪效果
         });
         
         // 清除电流效果
         setTimeout(() => {
             mainPaths.forEach(path => path.classList.remove('current-flow'));
         }, ANIMATION_CONFIG.phase2CurrentFlowDuration);
     }
     
     // 执行动效循环
     function runCycle() {
         // 阶段1：随机激活线条
         phase1_RandomBreathing();
         
         // 阶段2：电流传导（延迟后开始）
         setTimeout(() => {
             phase2_CurrentFlow();
         }, ANIMATION_CONFIG.phase2Delay);
     }
     
     // 立即执行第一次
     runCycle();
     
     // 循环执行
     return setInterval(runCycle, ANIMATION_CONFIG.cycleInterval);
 }
 
 // ========== 页面加载和窗口大小改变时更新走线 ==========
 // 存储各页面的定时器
 const effectIntervals = {
     workbench: null,
     tutorial: null,
     practices: null
 };
 
 /**
  * 通用特效初始化函数
  * @param {string} floorSelector - 楼层选择器
  * @param {string} centerElementSelector - 中心元素选择器（用于计算中心点）
  * @param {string} pageKey - 页面标识（用于存储定时器）
  */
 function initFloorEffects(floorSelector, centerElementSelector, pageKey) {
     const floor = document.querySelector(floorSelector);
     const svg = floor?.querySelector('.pcb-layer-svg');
     const centerElement = floor?.querySelector(centerElementSelector);
     
     if (!svg || !centerElement) return;
     
     // 清除之前的定时器
     if (effectIntervals[pageKey]) {
         clearInterval(effectIntervals[pageKey]);
         effectIntervals[pageKey] = null;
     }
     
     // 计算中心位置
     const centerRect = centerElement.getBoundingClientRect();
     const floorRect = floor.getBoundingClientRect();
     const viewBox = svg.viewBox.baseVal;
     const svgRect = svg.getBoundingClientRect();
     const scaleX = viewBox.width / svgRect.width;
     const scaleY = viewBox.height / svgRect.height;
     
     const centerX = (centerRect.left + centerRect.width / 2 - floorRect.left) * scaleX;
     const centerY = (centerRect.top + centerRect.height / 2 - floorRect.top) * scaleY;
     
     // 初始化有节奏的动效系统
     effectIntervals[pageKey] = initRhythmicEffects(svg, centerX, centerY);
 }
 
 // 工作台页面特效初始化
 function initWorkbenchEffects() {
     initFloorEffects('.floor-workbench', '.chip-package', 'workbench');
 }
 
 // 教程页面特效初始化
 function initTutorialEffects() {
    initFloorEffects('.floor-tutorial', '.tutorial-container', 'tutorial');
    initTutorialVideoModal();
 }
 
 // 最佳实践页面特效初始化
 function initPracticesEffects() {
     initFloorEffects('.floor-practices', '.practices-container', 'practices');
 }
 
// 教程步骤数据
const tutorialSteps = [
    {
        id: 1,
        title: '快速开始',
        subtitle: '了解硅宝的基本使用方法',
        features: [
            {
                title: '创建会话',
                description: '点击左侧"新建会话"按钮，开始您的第一个对话任务',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 5v14M5 12h14"></path>
                </svg>`
            },
            {
                title: '描述需求',
                description: '在工作台输入框中描述您的研发任务，例如："帮我选型一个60V的MOS管，用于电源管理"',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>`
            },
            {
                title: '获取方案',
                description: '硅宝会为您分析并提供选型建议，根据结果继续提问或调整需求',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>`
            }
        ]
    },
    {
        id: 2,
        title: '会话管理',
        subtitle: '管理和组织您的对话记录',
        features: [
            {
                title: '新建会话',
                description: '点击"新建会话"按钮，开始一个新的对话任务',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 5v14M5 12h14"></path>
                </svg>`
            },
            {
                title: '历史会话',
                description: '查看和管理您之前的所有会话记录，点击会话名称可以继续之前的对话',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <path d="M3 9h18M9 21V9"></path>
                </svg>`
            },
            {
                title: '搜索会话',
                description: '使用顶部搜索框快速查找特定会话，支持按标题和内容搜索',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>`
            },
            {
                title: '会话操作',
                description: '鼠标悬停显示菜单，支持重命名和删除操作，会话会自动保存',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                </svg>`
            }
        ]
    },
    {
        id: 3,
        title: '知识库管理',
        subtitle: '上传和管理技术文档',
        features: [
            {
                title: '上传文档',
                description: '点击工具栏的"上传文档"按钮，支持PDF、DOC、DOCX、TXT、MD格式，文件大小限制50MB以内',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>`
            },
            {
                title: '文档状态',
                description: '文档上传后会显示不同状态：已就绪、处理中或失败，可以点击状态重试',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>`
            },
            {
                title: '知识问答',
                description: '点击"知识问答"按钮打开问答面板，基于已上传的文档进行智能问答，支持多轮对话',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>`
            }
        ]
    },
    {
        id: 4,
        title: '工作台对话',
        subtitle: '与硅宝进行智能对话',
        features: [
            {
                title: '文本输入',
                description: '直接在输入框中描述您的需求，支持多行输入，按Enter发送，Shift+Enter换行',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>`
            },
            {
                title: '提及功能',
                description: '输入@可以调用BOM档案，快速引用物料信息',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>`
            },
            {
                title: '研发模式',
                description: '点击模式徽章切换研发风格：均衡模式、效率模式或启发模式',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>`
            },
            {
                title: '附件上传',
                description: '点击附件按钮上传文件，支持多种文档格式',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>`
            }
        ]
    },
    {
        id: 5,
        title: '使用技巧',
        subtitle: '提升使用效率的最佳实践',
        features: [
            {
                title: '具体明确',
                description: '描述清楚应用场景、参数要求，例如："需要一款用于12V转5V的LDO，输出电流500mA，低功耗"',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>`
            },
            {
                title: '提供上下文',
                description: '说明项目背景和约束条件，例如："车规级应用，温度范围-40°C到125°C"',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>`
            },
            {
                title: '分步提问',
                description: '复杂需求可以分多个问题：先确定器件类型，再细化参数要求，最后对比选型方案',
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>`
            }
        ]
    }
];

// 当前步骤索引
let currentStepIndex = 0;

// 渲染教程内容
function renderTutorialContent() {
    const tutorialStepsNav = document.getElementById('tutorialSteps');
    const tutorialContent = document.getElementById('tutorialContent');
    const prevBtn = document.getElementById('tutorialPrevBtn');
    const nextBtn = document.getElementById('tutorialNextBtn');
    const progressText = document.getElementById('tutorialProgressText');
    
    if (!tutorialStepsNav || !tutorialContent) return;

    // 渲染步骤导航
    tutorialStepsNav.innerHTML = tutorialSteps.map((step, index) => `
        <div class="tutorial-step-item ${index === currentStepIndex ? 'active' : ''}" data-step="${index}">
            <div class="tutorial-step-number">${step.id}</div>
            <div class="tutorial-step-text">${step.title}</div>
        </div>
    `).join('');

    // 渲染当前步骤内容
    renderStepContent(tutorialSteps[currentStepIndex]);

    // 更新导航按钮状态
    if (prevBtn) {
        prevBtn.disabled = currentStepIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentStepIndex === tutorialSteps.length - 1;
    }
    if (progressText) {
        progressText.textContent = `${currentStepIndex + 1} / ${tutorialSteps.length}`;
    }

    // 绑定步骤点击事件
    tutorialStepsNav.querySelectorAll('.tutorial-step-item').forEach(item => {
        item.addEventListener('click', function() {
            const stepIndex = parseInt(this.getAttribute('data-step'));
            switchStep(stepIndex);
        });
    });

    // 绑定导航按钮事件
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStepIndex > 0) {
                switchStep(currentStepIndex - 1);
            }
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStepIndex < tutorialSteps.length - 1) {
                switchStep(currentStepIndex + 1);
            }
        });
    }
}

// 渲染步骤内容
function renderStepContent(step) {
    const tutorialContent = document.getElementById('tutorialContent');
    if (!tutorialContent) return;

    const featuresHTML = step.features.map((feature, index) => `
        <div class="tutorial-feature-card" data-feature-title="${feature.title}" data-feature-description="${feature.description}">
            <div class="tutorial-feature-card-header">
                <div class="tutorial-feature-icon">${feature.icon}</div>
                <h3 class="tutorial-feature-title">${feature.title}</h3>
            </div>
            <p class="tutorial-feature-description">${feature.description}</p>
        </div>
    `).join('');

    tutorialContent.innerHTML = `
        <div class="tutorial-content-section active">
            <h1 class="tutorial-section-title">${step.title}</h1>
            <p class="tutorial-section-subtitle">${step.subtitle}</p>
            <div class="tutorial-feature-grid">
                ${featuresHTML}
            </div>
        </div>
    `;

    // 为每个卡片添加点击事件
    const featureCards = tutorialContent.querySelectorAll('.tutorial-feature-card');
    featureCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            // 直接从feature对象获取，避免HTML转义问题
            const feature = step.features[index];
            if (feature) {
                openTutorialVideoModal(feature.title, feature.description);
            }
        });
    });
}

// 打开教程视频弹窗
function openTutorialVideoModal(title, description) {
    const overlay = document.getElementById('tutorialVideoModalOverlay');
    const videoTitle = document.getElementById('tutorialVideoTitle');
    const videoDescription = document.getElementById('tutorialVideoDescription');
    
    if (!overlay || !videoTitle || !videoDescription) return;
    
    videoTitle.textContent = title;
    videoDescription.textContent = description;
    
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// 关闭教程视频弹窗
function closeTutorialVideoModal() {
    const overlay = document.getElementById('tutorialVideoModalOverlay');
    if (!overlay) return;
    
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// 初始化教程视频弹窗事件
function initTutorialVideoModal() {
    const overlay = document.getElementById('tutorialVideoModalOverlay');
    const closeBtn = document.getElementById('tutorialVideoClose');
    
    if (!overlay) return;
    
    // 关闭按钮点击事件
    if (closeBtn) {
        closeBtn.addEventListener('click', closeTutorialVideoModal);
    }
    
    // 点击遮罩层关闭
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeTutorialVideoModal();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('show')) {
            closeTutorialVideoModal();
        }
    });
}

// 切换步骤
function switchStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= tutorialSteps.length) return;
    
    currentStepIndex = stepIndex;
    renderTutorialContent();
}

// 初始化对话展示功能
function initChatDemo() {
    const practicesContainer = document.getElementById('practicesContainer');
    const practicesChatContainer = document.getElementById('practicesChatContainer');
    const practicesMessagesContainer = document.getElementById('practicesMessagesContainer');
    const practicesChatTitle = document.getElementById('practicesChatTitle');
    const chatBackBtn = document.getElementById('chatBackBtn');
    
    // 存储所有定时器的ID，用于清理
    let practiceTimers = [];
    let practiceIntervals = [];
    
    // 清除所有定时器的函数
    function clearAllPracticeTimers() {
        // 清除所有 setTimeout
        practiceTimers.forEach(timerId => {
            if (timerId) {
                clearTimeout(timerId);
            }
        });
        practiceTimers = [];
        
        // 清除所有 setInterval
        practiceIntervals.forEach(intervalId => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        });
        practiceIntervals = [];
    }
    
    // 为卡片添加点击事件
    const practiceItems = document.querySelectorAll('.practice-item');
    practiceItems.forEach((item, index) => {
        if (index === 0) { // 第一个卡片是"奋斗小青年陈工"
            item.addEventListener('click', () => {
                showChatDemo('chengong');
            });
        } else if (index === 1) { // 第二个卡片是"BOM管理员小陈"
            item.addEventListener('click', () => {
                showChatDemo('bomreview');
            });
        } else if (index === 2) { // 第三个卡片是"产品大佬"
            item.addEventListener('click', () => {
                showChatDemo('product');
            });
        } else if (index === 3) { // 第四个卡片是"CAD原理图解读"
            item.addEventListener('click', () => {
                window.location.href = 'cad-practice.html';
            });
        } else if (index === 4) { // 第五个卡片是"BOM智能生成"
            item.addEventListener('click', () => {
                window.location.href = 'bom-generation-practice.html';
            });
        } else if (index === 5) { // 第六个卡片是"BOM构建"（新版本）
            item.addEventListener('click', () => {
                window.location.href = 'bom-review-practice.html';
            });
        }
    });
    
    // 返回按钮
    if (chatBackBtn) {
        chatBackBtn.addEventListener('click', () => {
            hideChatDemo();
        });
    }
    
    function showChatDemo(type) {
        // 重要：在切换最佳实践时，先清除所有之前的定时器
        clearAllPracticeTimers();
        
        // 隐藏卡片列表，显示对话容器
        if (practicesContainer) {
            practicesContainer.style.display = 'none';
        }
        if (practicesChatContainer) {
            practicesChatContainer.style.display = 'flex';
        }
        
        // 根据类型设置标题和渲染对话内容
        // 注意：只有 type === 'bomreview' (第二个最佳实践) 才会自动执行
        // 第一个 (chengong) 和第三个 (product) 都是静态展示，不自动执行
        if (type === 'chengong') {
            // 第一个最佳实践：物料检索 - 静态展示，不自动执行
            if (practicesChatTitle) {
                practicesChatTitle.textContent = '@奋斗小青年陈工';
            }
            renderChatMessages(); // 静态展示，无自动执行逻辑
        } else if (type === 'bomreview') {
            // 第二个最佳实践：BOM构建 - 自动执行流程
            if (practicesChatTitle) {
                practicesChatTitle.textContent = '@BOM管理员小陈';
            }
            renderBomReviewChatMessages(); // 这个函数包含自动执行的 setTimeout
        } else if (type === 'product') {
            // 第三个最佳实践：研发任务研究 - 静态展示，需要用户点击确认按钮才执行，不自动执行
            if (practicesChatTitle) {
                practicesChatTitle.textContent = '@不愿意透露姓名的产品大佬';
            }
            renderBomChatMessages(); // 静态展示，需要用户点击按钮才会执行，无自动执行逻辑
        }
        
        // 滚动到顶部（从顶部开始展示）
        const scrollTimer = setTimeout(() => {
            if (practicesMessagesContainer) {
                practicesMessagesContainer.scrollTop = 0;
            }
        }, 100);
        practiceTimers.push(scrollTimer);
    }
    
    function hideChatDemo() {
        // 清除所有定时器，防止在返回后继续执行
        clearAllPracticeTimers();
        
        // 显示卡片列表，隐藏对话容器
        if (practicesContainer) {
            practicesContainer.style.display = 'block';
        }
        if (practicesChatContainer) {
            practicesChatContainer.style.display = 'none';
        }
    }
    
    // 渲染物料检索对话内容（第一个最佳实践 - 静态展示，不自动执行）
    function renderChatMessages() {
        if (!practicesMessagesContainer) return;
        
        practicesMessagesContainer.innerHTML = `
            <!-- 用户消息 -->
            <div class="message user">
                <div class="message-avatar">👨🏻‍💻</div>
                <div class="message-content">
                    <div class="message-bubble">
                        <div class="message-text">GD25Q64ESIGR</div>
                        <div class="message-time">14:32</div>
                    </div>
                </div>
            </div>

            <!-- 助手消息 -->
            <div class="message assistant">
                <div class="message-avatar"></div>
                <div class="message-content">
                    <div class="message-bubble">
                        <div class="message-text">
                            我来为您查询 GD25Q64ESIGR 这款芯片的详细信息。让我调用物料查询工具来获取相关数据。
                        </div>
                        
                        <!-- 工具调用 -->
                        <div class="tool-call">
                            <div class="tool-call-header">
                                <div class="tool-call-icon">🔍</div>
                                <div class="tool-call-name">物料查询工具</div>
                                <div class="tool-call-status">已完成</div>
                            </div>
                            <div class="tool-call-content">
                                正在查询芯片型号: GD25Q64ESIGR<br>
                                搜索范围: 存储器芯片数据库<br>
                                查询结果: 找到匹配的芯片信息
                            </div>
                        </div>

                        <div class="message-text">
                            查询完成！GD25Q64ESIGR 是一款由兆易创新(GigaDevice)生产的 64Mbit SPI NOR Flash 存储器芯片。以下是详细的技术参数：
                        </div>

                        <!-- 芯片参数表格 -->
                        <div class="chip-info-table">
                            <div class="chip-info-header">
                                📱 GD25Q64ESIGR 技术参数
                            </div>
                            <div class="chip-info-body">
                                <div class="chip-param-row">
                                    <div class="chip-param-label">制造商</div>
                                    <div class="chip-param-value">兆易创新 (GigaDevice)</div>
                                </div>
                                <div class="chip-param-row">
                                    <div class="chip-param-label">存储容量</div>
                                    <div class="chip-param-value">64Mbit (8MB)</div>
                                </div>
                                <div class="chip-param-row">
                                    <div class="chip-param-label">接口类型</div>
                                    <div class="chip-param-value">SPI (Serial Peripheral Interface)</div>
                                </div>
                                <div class="chip-param-row">
                                    <div class="chip-param-label">工作电压</div>
                                    <div class="chip-param-value">2.7V ~ 3.6V</div>
                                </div>
                                <div class="chip-param-row">
                                    <div class="chip-param-label">工作温度</div>
                                    <div class="chip-param-value">-40°C ~ +85°C (工业级)</div>
                                </div>
                                <div class="chip-param-row">
                                    <div class="chip-param-label">封装形式</div>
                                    <div class="chip-param-value">SOP8 (150mil)</div>
                                </div>
                                <div class="chip-param-row">
                                    <div class="chip-param-label">时钟频率</div>
                                    <div class="chip-param-value">最高 133MHz</div>
                                </div>
                                <div class="chip-param-row">
                                    <div class="chip-param-label">擦写次数</div>
                                    <div class="chip-param-value">100,000 次典型值</div>
                                </div>
                                <div class="chip-param-row">
                                    <div class="chip-param-label">数据保持</div>
                                    <div class="chip-param-value">20年 @ 85°C</div>
                                </div>
                                <div class="chip-param-row">
                                    <div class="chip-param-label">页编程时间</div>
                                    <div class="chip-param-value">0.7ms 典型值</div>
                                </div>
                            </div>
                        </div>

                        <div class="message-text">
                            📋 <strong>物料说明书要点：</strong><br>
                            • 支持标准SPI指令集，兼容性好<br>
                            • 具备硬件写保护功能<br>
                            • 支持双/四线SPI高速读取<br>
                            • 低功耗设计，待机电流&lt;1μA<br>
                            • 符合RoHS环保标准<br>
                            • 适用于嵌入式系统、物联网设备等应用
                        </div>

                        <!-- PDF文件标识 -->
                        <div class="pdf-file" onclick="openPdfDrawer('GD25Q64ESIGR_datasheet.pdf')">
                            <div class="pdf-file-icon">PDF</div>
                            <div class="pdf-file-info">
                                <div class="pdf-file-name">GD25Q64ESIGR 数据手册</div>
                                <div class="pdf-file-size">2.3 MB • 42页</div>
                            </div>
                            <div class="pdf-file-action">查看 →</div>
                        </div>

                        <!-- 替代料列表 -->
                        <div class="alternatives-list">
                            <div class="alternatives-header">
                                🔄 推荐替代料列表
                            </div>
                            <div class="alternative-item">
                                <div>
                                    <div class="alternative-name">W25Q64JVSSIQ</div>
                                    <div class="alternative-desc">华邦电子 64Mbit SPI Flash，SOP8封装</div>
                                </div>
                                <div class="alternative-compatibility compatibility-high">高兼容</div>
                            </div>
                            <div class="alternative-item">
                                <div>
                                    <div class="alternative-name">MX25L6433F</div>
                                    <div class="alternative-desc">旺宏电子 64Mbit SPI Flash，SOP8封装</div>
                                </div>
                                <div class="alternative-compatibility compatibility-high">高兼容</div>
                            </div>
                            <div class="alternative-item">
                                <div>
                                    <div class="alternative-name">AT25SF641</div>
                                    <div class="alternative-desc">Adesto 64Mbit SPI Flash，SOP8封装</div>
                                </div>
                                <div class="alternative-compatibility compatibility-medium">中等兼容</div>
                            </div>
                            <div class="alternative-item">
                                <div>
                                    <div class="alternative-name">S25FL064K</div>
                                    <div class="alternative-desc">赛普拉斯 64Mbit SPI Flash，SOP8封装</div>
                                </div>
                                <div class="alternative-compatibility compatibility-medium">中等兼容</div>
                            </div>
                        </div>

                        <div class="message-text">
                            以上就是 GD25Q64ESIGR 的完整技术信息。如果您需要了解更多细节，比如具体的应用电路设计、PCB布局建议，或者其他技术问题，请随时告诉我！
                        </div>

                        <div class="message-time">14:32</div>
                    </div>
                </div>
            </div>
        `;
        
        // 为PDF文件添加点击事件（如果onclick没有生效，使用事件监听）
        const pdfFile = practicesMessagesContainer.querySelector('.pdf-file');
        if (pdfFile) {
            pdfFile.addEventListener('click', () => {
                openPdfDrawer('GD25Q64ESIGR_datasheet.pdf');
            });
        }
    }
    
    // 渲染BOM评审对话内容（第二个最佳实践 - 自动执行）
    function renderBomReviewChatMessages() {
        if (!practicesMessagesContainer) return;
        
        practicesMessagesContainer.innerHTML = `
            <!-- 用户消息 - @项目调用 -->
            <div class="message user">
                <div class="message-avatar">📋</div>
                <div class="message-content">
                    <div class="message-bubble">
                        <div class="message-text">
                            <span class="mention-tag">
                                <span class="mention-tag-icon">B</span>
                                <span class="mention-tag-text">双电源自动切换系统</span>
                            </span>
                            这个项目现在需要提升耐高温性能，并且要纯国产，直接生成BOM
                        </div>
                        <div class="message-time">14:28</div>
                    </div>
                </div>
            </div>

            <!-- 助手消息 - 第一步 -->
            <div class="message assistant">
                <div class="message-avatar"></div>
                <div class="message-content">
                    <div class="message-bubble">
                    <div class="message-text">
                        收到！我将基于 <strong>双电源自动切换系统</strong> 项目的历史版本，分析并生成满足<strong>耐高温</strong>和<strong>纯国产</strong>要求的新BOM方案。
                    </div>
                        
                        <!-- 工具调用 - 读取BOM版本 -->
                        <div class="tool-call">
                            <div class="tool-call-header">
                                <div class="tool-call-icon">📚</div>
                                <div class="tool-call-name">BOM档案读取工具</div>
                                <div class="tool-call-status">执行中...</div>
                            </div>
                            <div class="tool-call-content" id="bomReadContent">
                                正在读取项目所有版本...
                            </div>
                        </div>

                        <div class="message-time">14:28</div>
                    </div>
                </div>
            </div>
        `;
        
        // 只有第二个最佳实践（BOM构建）才自动执行
        // 模拟读取BOM版本过程，保存定时器ID以便清理
        const timer1 = setTimeout(() => {
            showBomVersionsRead();
        }, 1500);
        practiceTimers.push(timer1);
    }
    
    // 显示读取的BOM版本信息
    function showBomVersionsRead() {
        const bomReadContent = document.getElementById('bomReadContent');
        const toolCallStatus = document.querySelector('.tool-call-status');
        
        if (bomReadContent && toolCallStatus) {
            toolCallStatus.textContent = '已完成';
            bomReadContent.innerHTML = `
                已读取项目 <strong>双电源自动切换系统</strong>，共找到 <strong>3个</strong> 历史版本：
                <div style="display: flex; gap: 12px; margin-top: 12px;">
                    <div class="bom-version-card" onclick="showBomVersionDetail('v1.0')" style="cursor: pointer;">
                        <div class="bom-version-icon">📄</div>
                        <div class="bom-version-name">v1.0</div>
                        <div class="bom-version-date">2024-01-15</div>
                        <div class="bom-version-info">初版设计 · 6个器件</div>
                    </div>
                    <div class="bom-version-card" onclick="showBomVersionDetail('v2.0')" style="cursor: pointer;">
                        <div class="bom-version-icon">📄</div>
                        <div class="bom-version-name">v2.0</div>
                        <div class="bom-version-date">2024-03-20</div>
                        <div class="bom-version-info">优化电源 · 6个器件</div>
                    </div>
                    <div class="bom-version-card" onclick="showBomVersionDetail('v2.1')" style="cursor: pointer;">
                        <div class="bom-version-icon">📄</div>
                        <div class="bom-version-name">v2.1</div>
                        <div class="bom-version-date">2024-05-10</div>
                        <div class="bom-version-info">降低成本 · 6个器件</div>
                    </div>
                </div>
            `;
        }
        
        // 继续显示分析结论，保存定时器ID以便清理
        const timer2 = setTimeout(() => {
            showVersionAnalysisConclusion();
        }, 2000);
        practiceTimers.push(timer2);
    }
    
    // 显示版本分析结论
    function showVersionAnalysisConclusion() {
        if (!practicesMessagesContainer) return;
        
        const conclusionMessage = document.createElement('div');
        conclusionMessage.className = 'message assistant';
        
        conclusionMessage.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">
                        分析完成。综合考虑新需求（耐高温性能 + 纯国产），建议基于 <strong>v2.1</strong> 版本进行改动。
                    </div>
                    
                    <div class="message-text">
                        <strong>选择理由：</strong><br>
                        v2.1 已具备 -40°C ~ +85°C 工作温度范围，是较好的起点；已有部分国产器件，改动成本相对较低；在成本控制上已做优化，符合经济性要求。
                    </div>

                    <div class="message-text">
                        <strong>需要改动的关键器件：</strong><br>
                        1. <strong>控制MCU</strong>: STM32F030C8T6 (ST) → 需替换为兼容的国产MCU，要求支持 -40~+125°C<br>
                        2. <strong>功率MOSFET</strong>: IRFB4115PBF (Infineon) → 需替换为耐高温国产MOS管
                    </div>

                    <div class="message-text">
                        其他器件（电压检测芯片、DC-DC转换器、电阻、二极管）沿用 v2.1 现有方案即可满足要求。
                    </div>

                    <div class="message-text">
                        现在调用物料查询与选型工具，为这2个关键器件寻找最优的国产替代方案。
                    </div>

                    <div class="message-time">14:29</div>
                </div>
            </div>
        `;
        
        practicesMessagesContainer.appendChild(conclusionMessage);
        
        // 滚动到最新消息，保存定时器ID以便清理
        const timer3 = setTimeout(() => {
            if (practicesMessagesContainer) {
                conclusionMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 100);
        practiceTimers.push(timer3);
        
        // 继续显示并行选型任务，保存定时器ID以便清理
        const timer4 = setTimeout(() => {
            showParallelSelectionTasks();
        }, 1500);
        practiceTimers.push(timer4);
    }
    
    // 显示并行选型任务（只选型2个关键器件）
    function showParallelSelectionTasks() {
        if (!practicesMessagesContainer) return;
        
        const tasksMessage = document.createElement('div');
        tasksMessage.className = 'message assistant';
        
        tasksMessage.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">
                        开始并行执行物料查询和选型任务：
                    </div>
                    
                    <div class="parallel-tasks" id="reviewParallelTasks">
                        <div class="task-card processing" id="reviewTask1">
                            <div class="task-header">
                                <div class="task-status processing"></div>
                                <div class="task-title">控制MCU选型</div>
                            </div>
                            <div class="task-content">
                                <div class="task-progress">正在匹配国产ARM MCU...</div>
                            </div>
                        </div>
                        
                        <div class="task-card processing" id="reviewTask2">
                            <div class="task-header">
                                <div class="task-status processing"></div>
                                <div class="task-title">功率MOSFET选型</div>
                            </div>
                            <div class="task-content">
                                <div class="task-progress">正在筛选耐高温国产MOS管...</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="message-time">14:29</div>
                </div>
            </div>
        `;
        
        practicesMessagesContainer.appendChild(tasksMessage);
        
        // 滚动到最新消息，保存定时器ID以便清理
        const timer5 = setTimeout(() => {
            if (practicesMessagesContainer) {
                tasksMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 100);
        practiceTimers.push(timer5);
        
        // 模拟任务完成
        simulateReviewTaskCompletion();
    }
    
    // 模拟选型任务完成（只有2个任务）
    function simulateReviewTaskCompletion() {
        const tasks = [
            {
                id: 'reviewTask1',
                delay: 1500,
                result: {
                    component: 'HC32F030C8TA',
                    reason: '华大半导体，Cortex-M0+，64KB Flash，LQFP48，pin-to-pin兼容STM32'
                }
            },
            {
                id: 'reviewTask2', 
                delay: 2000,
                result: {
                    component: 'NCE100N15',
                    reason: '新洁能，150V/100A，Rds=7.5mΩ，TO-220，-55~+175°C'
                }
            }
        ];

        tasks.forEach(task => {
            const taskTimer = setTimeout(() => {
                completeReviewTask(task.id, task.result);
            }, task.delay);
            practiceTimers.push(taskTimer);
        });

        // 所有任务完成后显示BOM生成，保存定时器ID以便清理
        const timer6 = setTimeout(() => {
            showBomGenerationForReview();
        }, 2800);
        practiceTimers.push(timer6);
    }
    
    // 完成单个选型任务
    function completeReviewTask(taskId, result) {
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
    }
    
    // 显示BOM生成过程
    function showBomGenerationForReview() {
        if (!practicesMessagesContainer) return;
        
        const generationMessage = document.createElement('div');
        generationMessage.className = 'message assistant';
        generationMessage.id = 'bomReviewGenerationMessage';
        
        generationMessage.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">
                        现在开始生成符合新要求的BOM清单...
                    </div>
                    
                    <div class="bom-loading">
                        <div class="loading-spinner"></div>
                        <div class="loading-text">正在生成BOM清单</div>
                        <div class="loading-progress" id="reviewLoadingProgress">正在整理器件信息...</div>
                        
                        <div class="loading-steps">
                            <div class="loading-step active" id="reviewStep1">
                                <div class="loading-step-icon"></div>
                                <span>验证国产器件兼容性</span>
                            </div>
                            <div class="loading-step" id="reviewStep2">
                                <div class="loading-step-icon"></div>
                                <span>确认高温特性参数</span>
                            </div>
                            <div class="loading-step" id="reviewStep3">
                                <div class="loading-step-icon"></div>
                                <span>生成BOM表格结构</span>
                            </div>
                            <div class="loading-step" id="reviewStep4">
                                <div class="loading-step-icon"></div>
                                <span>完成BOM清单</span>
                            </div>
                        </div>
                    </div>

                    <div class="message-time">14:29</div>
                </div>
            </div>
        `;
        
        practicesMessagesContainer.appendChild(generationMessage);
        
        // 滚动到最新消息，保存定时器ID以便清理
        const timer7 = setTimeout(() => {
            if (practicesMessagesContainer) {
                generationMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 100);
        practiceTimers.push(timer7);
        
        // 模拟生成步骤
        simulateReviewLoadingSteps();
    }
    
    // 模拟BOM评审生成步骤
    function simulateReviewLoadingSteps() {
        const steps = ['reviewStep1', 'reviewStep2', 'reviewStep3', 'reviewStep4'];
        const progressTexts = [
            '正在验证国产器件兼容性...',
            '正在确认高温特性参数...',
            '正在生成BOM表格结构...',
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
                
                const progressEl = document.getElementById('reviewLoadingProgress');
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
                
                const timer8 = setTimeout(() => {
                    const loadingMsg = document.getElementById('bomReviewGenerationMessage');
                    if (loadingMsg) {
                        loadingMsg.remove();
                    }
                    generateReviewBomTable();
                }, 800);
                practiceTimers.push(timer8);
            }
        }, 1000);
        // 保存 setInterval ID 以便清理
        practiceIntervals.push(stepInterval);
    }
    
    // 生成BOM评审的BOM表格（使用相同的表格结构）
    function generateReviewBomTable() {
        if (!practicesMessagesContainer) return;
        
        const bomMessage = document.createElement('div');
        bomMessage.className = 'message assistant';
        
        bomMessage.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">
                        BOM生成完成。基于原项目v2.1，替换了2个关键器件，生成了符合耐高温和纯国产要求的新版BOM清单（v3.0）：
                    </div>
                    
                    <div class="bom-table-container">
                        <div class="bom-table-header">
                            📋 电源切换模块 BOM清单 v3.0 (高温国产版)
                        </div>
                        <table class="bom-table">
                            <thead>
                                <tr>
                                    <th>型号</th>
                                    <th>位号</th>
                                    <th>分类</th>
                                    <th>核心参数</th>
                                    <th>封装</th>
                                    <th>制造商</th>
                                    <th>规格书</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'review-voltage-monitor')">
                                                SGM809
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-review-voltage-monitor">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'SGM809', '圣邦微')">
                                                    <div class="alternative-name">SGM809 <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - 3.3V基准，1%精度，SOT-23，-40~+125°C</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'HT7530', '合泰')">
                                                    <div class="alternative-name">HT7530 <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">3.0V基准，2%精度，SOT-23，工业级</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'FM809', '复旦微电')">
                                                    <div class="alternative-name">FM809 <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">3.3V基准，1.5%精度，SOT-23，宽温范围</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>U1</td>
                                    <td>电压检测芯片</td>
                                    <td>3.3V基准，1%精度，-40~+125°C</td>
                                    <td>SOT-23</td>
                                    <td>圣邦微</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('SGM809_datasheet.pdf'); return false;">查看规格说明书</a></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'review-mosfet')">
                                                NCE100N15
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-review-mosfet">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'NCE100N15', '新洁能')">
                                                    <div class="alternative-name">NCE100N15 <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - 150V/100A，Rds=7.5mΩ，TO-220</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'AO4468', '万国半导体')">
                                                    <div class="alternative-name">AO4468 <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">100V/85A，Rds=9mΩ，TO-220，性价比高</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'FHP840N', '华润微')">
                                                    <div class="alternative-name">FHP840N <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">150V/110A，Rds=6.8mΩ，TO-220</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Q1,Q2</td>
                                    <td>功率MOSFET</td>
                                    <td>150V/100A，Rds=7.5mΩ</td>
                                    <td>TO-220</td>
                                    <td>新洁能</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('NCE100N15_datasheet.pdf'); return false;">查看规格说明书</a></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'review-dcdc')">
                                                B2412LS-1WR3
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-review-dcdc">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'B2412LS-1WR3', '金升阳')">
                                                    <div class="alternative-name">B2412LS-1WR3 <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - 24V转12V/3W，效率85%，SIP</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'TD301D2412', '拓尔微')">
                                                    <div class="alternative-name">TD301D2412 <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">24V转12V/3W，效率83%，DIP封装</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'R-78E12-1.0', '睿能')">
                                                    <div class="alternative-name">R-78E12-1.0 <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">宽输入，12V/1A输出，TO-220封装</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>U2</td>
                                    <td>DC-DC转换器</td>
                                    <td>24V转12V/3W，85%效率</td>
                                    <td>SIP-4</td>
                                    <td>金升阳</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('B2412LS_datasheet.pdf'); return false;">查看规格说明书</a></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'review-mcu')">
                                                HC32F030C8TA
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-review-mcu">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'HC32F030C8TA', '华大半导体')">
                                                    <div class="alternative-name">HC32F030C8TA <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - Cortex-M0+，64KB Flash，LQFP48</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'GD32F130C8T6', '兆易创新')">
                                                    <div class="alternative-name">GD32F130C8T6 <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">Cortex-M3，64KB Flash，兼容STM32</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'MM32F031C8T6', '灵动微')">
                                                    <div class="alternative-name">MM32F031C8T6 <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">Cortex-M0，64KB Flash，LQFP48</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>U3</td>
                                    <td>控制MCU</td>
                                    <td>Cortex-M0+，64KB Flash</td>
                                    <td>LQFP48</td>
                                    <td>华大半导体</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('HC32F030_datasheet.pdf'); return false;">查看规格说明书</a></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'review-resistor')">
                                                LR2512-01R010FL
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-review-resistor">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'LR2512-01R010FL', '丽智')">
                                                    <div class="alternative-name">LR2512-01R010FL <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - 10mΩ/2W，±1%精度</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'RL2512FK-070R01L', '厚声')">
                                                    <div class="alternative-name">RL2512FK-070R01L <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">10mΩ/1W，±1%精度，厚膜工艺</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'WR25L010JTL', '旺诠')">
                                                    <div class="alternative-name">WR25L010JTL <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">10mΩ/3W，±1%精度，金属膜工艺</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>R1,R2</td>
                                    <td>电流检测电阻</td>
                                    <td>10mΩ/2W，±1%精度</td>
                                    <td>2512</td>
                                    <td>丽智</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('LR2512_datasheet.pdf'); return false;">查看规格说明书</a></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="component-select">
                                            <span class="component-name" onclick="showBomAlternatives(this, 'review-diode')">
                                                SS34
                                                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="6,9 12,15 18,9"/>
                                                </svg>
                                            </span>
                                            <div class="alternatives-dropdown" id="dropdown-review-diode">
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'SS34', '长电')">
                                                    <div class="alternative-name">SS34 <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">当前选择 - 40V/3A，Vf=0.45V</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'B340A', '佑风微')">
                                                    <div class="alternative-name">B340A <span class="alternative-tag tag-cost-effective">性价比高</span></div>
                                                    <div class="alternative-desc">40V/3A，Vf=0.5V，SMA封装</div>
                                                </div>
                                                <div class="alternative-option" onclick="selectBomAlternative(this, 'RS3M', '捷捷微')">
                                                    <div class="alternative-name">RS3M <span class="alternative-tag tag-high-compatible">高兼容</span></div>
                                                    <div class="alternative-desc">1000V/3A，超快恢复，SMA封装</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>D1,D2</td>
                                    <td>保护二极管</td>
                                    <td>40V/3A，Vf=0.45V</td>
                                    <td>SMA</td>
                                    <td>长电</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('SS34_datasheet.pdf'); return false;">查看规格说明书</a></td>
                                </tr>
                            </tbody>
                        </table>
                        
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

                    <div class="message-time">14:30</div>
                </div>
            </div>
        `;
        
        practicesMessagesContainer.appendChild(bomMessage);
        
        // 滚动到底部显示最新内容
        setTimeout(() => {
            if (practicesMessagesContainer) {
                practicesMessagesContainer.scrollTop = practicesMessagesContainer.scrollHeight;
            }
        }, 100);
        
        // 初始化BOM操作按钮事件（默认模式，可选择项目）
        initBomActions(bomMessage, null, null);
    }
    
    // 渲染BOM对话内容（第三个最佳实践 - 静态展示，需要用户点击确认按钮才执行，不自动执行）
    function renderBomChatMessages() {
        if (!practicesMessagesContainer) return;
        
        practicesMessagesContainer.innerHTML = `
            <!-- 用户消息 - 上传文档 -->
            <div class="message user">
                <div class="message-avatar">🚀</div>
                <div class="message-content">
                    <div class="message-bubble">
                        <div class="uploaded-file">
                            <div class="file-icon">DOC</div>
                            <span>电源切换模块需求说明书.docx</span>
                        </div>
                        <div class="message-time">14:25</div>
                    </div>
                </div>
            </div>

            <!-- 用户消息 - 文字需求 -->
            <div class="message user">
                <div class="message-avatar">🚀</div>
                <div class="message-content">
                    <div class="message-bubble">
                        <div class="message-text">基于这个需求文档，帮我生成完整的BOM</div>
                        <div class="message-time">14:25</div>
                    </div>
                </div>
            </div>

            <!-- 助手消息 - 第一轮回复 -->
            <div class="message assistant">
                <div class="message-avatar"></div>
                <div class="message-content">
                    <div class="message-bubble">
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

                        <div class="message-time">14:26</div>
                    </div>
                </div>
            </div>
        `;
        
        // 第三个最佳实践需要用户手动点击确认按钮才会执行，不自动执行
        // 为确认按钮添加点击事件
        const confirmBtn = practicesMessagesContainer.querySelector('#bomConfirmBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                startBomGeneration();
            });
        }
        
        // 确保第三个最佳实践不会自动执行 - 移除任何可能的自动执行逻辑
        // 注释：此处不添加任何 setTimeout 或自动执行逻辑
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
                if (practicesMessagesContainer) {
                    const lastMessage = practicesMessagesContainer.lastElementChild;
                    if (lastMessage) {
                        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                }
            }, 100);
        }, 500);
    }
    
    // 显示并行任务
    function showParallelTasks() {
        if (!practicesMessagesContainer) return;
        
        const assistantMessage = document.createElement('div');
        assistantMessage.className = 'message assistant';
        
        assistantMessage.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <div class="message-bubble">
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
                    
                    <div class="message-time">14:27</div>
                </div>
            </div>
        `;
        
        practicesMessagesContainer.appendChild(assistantMessage);
        
        // 滚动到最新消息
        setTimeout(() => {
            if (practicesMessagesContainer) {
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
    }
    
    // 显示BOM生成加载动画
    function showBomLoading() {
        if (!practicesMessagesContainer) return;
        
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message assistant';
        loadingMessage.id = 'bomLoadingMessage';
        
        loadingMessage.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <div class="message-bubble">
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
                    
                    <div class="message-time">14:28</div>
                </div>
            </div>
        `;
        
        practicesMessagesContainer.appendChild(loadingMessage);
        
        // 滚动到最新消息
        setTimeout(() => {
            if (practicesMessagesContainer) {
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
        if (!practicesMessagesContainer) return;
        
        const bomMessage = document.createElement('div');
        bomMessage.className = 'message assistant';
        
        bomMessage.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">
                        🎉 所有器件选型完成！基于需求分析和并行查询结果，我为您生成了初版BOM清单。您可以点击器件型号查看替代方案：
                    </div>
                    
                    <div class="bom-table-container">
                        <div class="bom-table-header">
                            📋 电源切换模块 BOM清单 v1.0
                        </div>
                        <table class="bom-table">
                            <thead>
                                <tr>
                                    <th>型号</th>
                                    <th>位号</th>
                                    <th>分类</th>
                                    <th>核心参数</th>
                                    <th>封装</th>
                                    <th>制造商</th>
                                    <th>规格书</th>
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
                                    <td>U1</td>
                                    <td>电压检测芯片</td>
                                    <td>3.3V基准，1%精度</td>
                                    <td>SOT-23</td>
                                    <td>Texas Instruments</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('TPS3813K33DBVR_datasheet.pdf'); return false;">查看规格说明书</a></td>
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
                                    <td>Q1,Q2</td>
                                    <td>功率MOSFET</td>
                                    <td>150V/104A，Rds=8.7mΩ</td>
                                    <td>TO-220</td>
                                    <td>Infineon</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('IRFB4115PBF_datasheet.pdf'); return false;">查看规格说明书</a></td>
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
                                    <td>U2</td>
                                    <td>DC-DC转换器</td>
                                    <td>24V转12V/3A，87%效率</td>
                                    <td>DIP24</td>
                                    <td>TRACO POWER</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('TMR3-2412WI_datasheet.pdf'); return false;">查看规格说明书</a></td>
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
                                    <td>U3</td>
                                    <td>控制MCU</td>
                                    <td>Cortex-M0，64KB Flash</td>
                                    <td>LQFP48</td>
                                    <td>STMicroelectronics</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('STM32F030C8T6_datasheet.pdf'); return false;">查看规格说明书</a></td>
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
                                    <td>R1,R2</td>
                                    <td>电流检测电阻</td>
                                    <td>10mΩ/2W，±1%精度</td>
                                    <td>2512</td>
                                    <td>Vishay</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('WSL2512R0100FEA_datasheet.pdf'); return false;">查看规格说明书</a></td>
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
                                    <td>D1,D2</td>
                                    <td>保护二极管</td>
                                    <td>40V/3A，Vf=0.45V</td>
                                    <td>SMA</td>
                                    <td>ON Semi</td>
                                    <td><a href="#" class="pdf-link" onclick="openBomPdf('MBRS340T3G_datasheet.pdf'); return false;">查看规格说明书</a></td>
                                </tr>
                            </tbody>
                        </table>
                        
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

                    <div class="message-time">14:30</div>
                </div>
            </div>
        `;
        
        practicesMessagesContainer.appendChild(bomMessage);
        
        // 滚动到底部显示最新内容
        setTimeout(() => {
            if (practicesMessagesContainer) {
                practicesMessagesContainer.scrollTop = practicesMessagesContainer.scrollHeight;
            }
        }, 100);
        
        // 初始化BOM操作按钮事件（BOM评审模式，直接保存到当前项目）
        initBomActions(bomMessage, 'bomreview', '双电源自动切换系统');
    }
    
    // 初始化BOM操作按钮
    function initBomActions(bomMessage, mode, projectName) {
        const downloadBtn = bomMessage.querySelector('.bom-btn-download');
        const saveBtn = bomMessage.querySelector('.bom-btn-save');
        const projectSelectDropdown = document.getElementById('projectSelectDropdown');
        
        // 下载按钮（仅展示，不触发下载）
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // 仅展示，不做任何操作
            });
        }
        
        // 保存BOM版本按钮
        if (saveBtn && projectSelectDropdown) {
            saveBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // 如果是BOM评审模式，直接保存到指定项目
                if (mode === 'bomreview' && projectName) {
                    selectProjectForBom(projectName);
                } else {
                    // 否则显示项目选择弹窗
                    showProjectSelectDropdown(saveBtn);
                }
            });
        }
    }
    
    // HTML转义函数
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 显示项目选择弹窗
    function showProjectSelectDropdown(triggerBtn) {
        const dropdown = document.getElementById('projectSelectDropdown');
        if (!dropdown) return;
        
        // 获取项目列表数据（从侧边栏的项目列表获取）
        const projectItems = document.querySelectorAll('.project-item-text');
        const projects = [];
        projectItems.forEach(item => {
            const projectText = item.textContent.trim();
            if (projectText) {
                projects.push({
                    name: projectText,
                    id: projects.length + 1
                });
            }
        });
        
        // 如果没有项目，显示空状态
        if (projects.length === 0) {
            dropdown.innerHTML = '<div class="project-select-empty">暂无项目</div>';
        } else {
            // 渲染项目列表
            dropdown.innerHTML = projects.map((project, index) => `
                <div class="project-select-item ${index === 0 ? 'selected' : ''}" data-project-id="${project.id}" data-project-name="${escapeHtml(project.name)}">
                    <span class="project-select-item-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M3 9h18M9 21V9"/>
                        </svg>
                    </span>
                    <span class="project-select-item-text">${escapeHtml(project.name)}</span>
                </div>
            `).join('');
            
            // 添加项目选择事件
            const items = dropdown.querySelectorAll('.project-select-item');
            let selectedIndex = 0;
            
            items.forEach((item, index) => {
                item.addEventListener('click', function() {
                    // 更新选中状态
                    items.forEach(i => i.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedIndex = index;
                    
                    // 选择项目
                    const projectName = this.dataset.projectName;
                    selectProjectForBom(projectName);
                    hideProjectSelectDropdown();
                });
                
                // 鼠标悬停高亮
                item.addEventListener('mouseenter', function() {
                    items.forEach(i => i.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });
            
            // 键盘导航支持
            dropdown.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                    updateSelectedItem();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, 0);
                    updateSelectedItem();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (items[selectedIndex]) {
                        items[selectedIndex].click();
                    }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    hideProjectSelectDropdown();
                }
            });
            
            function updateSelectedItem() {
                items.forEach((item, index) => {
                    item.classList.toggle('selected', index === selectedIndex);
                });
                if (items[selectedIndex]) {
                    items[selectedIndex].scrollIntoView({ block: 'nearest' });
                }
            }
        }
        
        // 显示弹窗
        dropdown.classList.add('show');
        
        // 计算位置（在按钮下方）
        const rect = triggerBtn.getBoundingClientRect();
        dropdown.style.left = (rect.right - 280) + 'px'; // 280是弹窗的最小宽度
        dropdown.style.top = (rect.bottom + 8) + 'px';
        
        // 确保弹窗在视口内
        const dropdownRect = dropdown.getBoundingClientRect();
        if (dropdownRect.right > window.innerWidth) {
            dropdown.style.left = (window.innerWidth - 280 - 16) + 'px';
        }
        if (dropdownRect.bottom > window.innerHeight) {
            dropdown.style.top = (rect.top - dropdownRect.height - 8) + 'px';
        }
        
        // 点击外部关闭
        setTimeout(() => {
            const clickHandler = function(e) {
                if (!dropdown.contains(e.target) && !triggerBtn.contains(e.target)) {
                    hideProjectSelectDropdown();
                    document.removeEventListener('click', clickHandler);
                }
            };
            document.addEventListener('click', clickHandler);
        }, 0);
        
        // 聚焦弹窗以便键盘导航（设置tabindex使其可聚焦）
        dropdown.setAttribute('tabindex', '-1');
        dropdown.focus();
    }
    
    // 隐藏项目选择弹窗
    function hideProjectSelectDropdown() {
        const dropdown = document.getElementById('projectSelectDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            dropdown.removeAttribute('tabindex');
        }
    }
    
    // 选择项目保存BOM
    function selectProjectForBom(projectName) {
        // 这里可以添加保存BOM的逻辑
        console.log('保存BOM到项目:', projectName);
        // TODO: 实际保存BOM的逻辑
    }
    
    // 全局函数：显示BOM版本详情弹窗
    window.showBomVersionDetail = function(version) {
        // 创建或获取弹窗覆盖层
        let overlay = document.getElementById('bomVersionOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'bomVersionOverlay';
            overlay.className = 'modal-overlay';
            document.body.appendChild(overlay);
        }
        
        // 创建或获取弹窗
        let modal = document.getElementById('bomVersionModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bomVersionModal';
            modal.className = 'bom-version-modal';
            overlay.appendChild(modal);
        }
        
        // 根据版本号设置内容
        const versionData = {
            'v1.0': {
                title: 'v1.0 (2024-01-15) - 初版设计',
                items: [
                    { refDes: 'U1', category: '电压检测芯片', value: '3.3V基准，1%精度', package: 'SOT-23', manufacturer: 'Texas Instruments', mpn: 'TPS3813K33DBVR' },
                    { refDes: 'Q1,Q2', category: '功率MOSFET', value: '150V/104A，Rds=8.7mΩ', package: 'TO-220', manufacturer: 'Infineon', mpn: 'IRFB4115PBF' },
                    { refDes: 'U2', category: 'DC-DC转换器', value: '24V转12V/3A，87%效率', package: 'DIP24', manufacturer: 'TRACO POWER', mpn: 'TMR 3-2412WI' },
                    { refDes: 'U3', category: '控制MCU', value: 'Cortex-M0，64KB Flash', package: 'LQFP48', manufacturer: 'STMicroelectronics', mpn: 'STM32F030C8T6' },
                    { refDes: 'R1,R2', category: '电流检测电阻', value: '10mΩ/2W，±1%精度', package: '2512', manufacturer: 'Vishay', mpn: 'WSL2512R0100FEA' },
                    { refDes: 'D1,D2', category: '保护二极管', value: '40V/3A，Vf=0.45V', package: 'SMA', manufacturer: 'ON Semi', mpn: 'MBRS340T3G' }
                ]
            },
            'v2.0': {
                title: 'v2.0 (2024-03-20) - 优化电源效率',
                items: [
                    { refDes: 'U1', category: '电压检测芯片', value: '3.3V基准，1%精度', package: 'SOT-23', manufacturer: 'Texas Instruments', mpn: 'TPS3813K33DBVR' },
                    { refDes: 'Q1,Q2', category: '功率MOSFET', value: '150V/104A，Rds=8.7mΩ', package: 'TO-220', manufacturer: 'Infineon', mpn: 'IRFB4115PBF' },
                    { refDes: 'U2', category: 'DC-DC转换器', value: '24V转12V/3A，87%效率', package: 'DIP24', manufacturer: 'TRACO POWER', mpn: 'TMR 3-2412WI' },
                    { refDes: 'U3', category: '控制MCU', value: 'Cortex-M0，64KB Flash', package: 'LQFP48', manufacturer: 'GigaDevice', mpn: 'GD32F130C8T6' },
                    { refDes: 'R1,R2', category: '电流检测电阻', value: '10mΩ/2W，±1%精度', package: '2512', manufacturer: 'Vishay', mpn: 'WSL2512R0100FEA' },
                    { refDes: 'D1,D2', category: '保护二极管', value: '40V/3A，Vf=0.45V', package: 'SMA', manufacturer: 'ON Semi', mpn: 'MBRS340T3G' }
                ]
            },
            'v2.1': {
                title: 'v2.1 (2024-05-10) - 降低成本',
                items: [
                    { refDes: 'U1', category: '电压检测芯片', value: '3.3V基准，1%精度', package: 'SOT-23', manufacturer: 'Texas Instruments', mpn: 'TPS3813K33DBVR' },
                    { refDes: 'Q1,Q2', category: '功率MOSFET', value: '150V/104A，Rds=8.7mΩ', package: 'TO-220', manufacturer: 'Infineon', mpn: 'IRFB4115PBF' },
                    { refDes: 'U2', category: 'DC-DC转换器', value: '24V转12V/3W，85%效率', package: 'SIP-4', manufacturer: '金升阳', mpn: 'B2412LS-1WR3' },
                    { refDes: 'U3', category: '控制MCU', value: 'Cortex-M0，64KB Flash', package: 'LQFP48', manufacturer: 'STMicroelectronics', mpn: 'STM32F030C8T6' },
                    { refDes: 'R1,R2', category: '电流检测电阻', value: '10mΩ/2W，±1%精度', package: '2512', manufacturer: '丽智', mpn: 'LR2512-01R010FL' },
                    { refDes: 'D1,D2', category: '保护二极管', value: '40V/3A，Vf=0.45V', package: 'SMA', manufacturer: 'ON Semi', mpn: 'MBRS340T3G' }
                ]
            }
        };
        
        const data = versionData[version];
        if (!data) return;
        
        // 生成表格HTML
        const tableRows = data.items.map(item => `
            <tr>
                <td>${item.refDes}</td>
                <td>${item.category}</td>
                <td>${item.value}</td>
                <td>${item.package}</td>
                <td>${item.manufacturer}</td>
                <td>${item.mpn}</td>
            </tr>
        `).join('');
        
        modal.innerHTML = `
            <button class="close-btn" onclick="closeBomVersionModal()">×</button>
            <div class="bom-version-header">
                <h2 class="bom-version-title">${data.title}</h2>
            </div>
            <div class="bom-version-body">
                <div class="bom-table-container">
                    <table class="bom-table">
                        <thead>
                            <tr>
                                <th>位号</th>
                                <th>分类</th>
                                <th>核心参数</th>
                                <th>封装</th>
                                <th>制造商</th>
                                <th>制造商料号</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // 显示弹窗
        overlay.classList.add('show');
        
        // 点击覆盖层关闭
        overlay.onclick = function(e) {
            if (e.target === overlay) {
                closeBomVersionModal();
            }
        };
        
        // 阻止弹窗内容点击事件冒泡
        modal.onclick = function(e) {
            e.stopPropagation();
        };
    };
    
    // 全局函数：关闭BOM版本详情弹窗
    window.closeBomVersionModal = function() {
        const overlay = document.getElementById('bomVersionOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    };
    
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
        }
    }
    
    // 打开BOM PDF
    function openBomPdf(filename) {
        openPdfDrawer(filename);
    }
    
    // 将函数暴露到全局
    window.showBomAlternatives = showBomAlternatives;
    window.selectBomAlternative = selectBomAlternative;
    window.openBomPdf = openBomPdf;
    
    // PDF抽屉功能
    function openPdfDrawer(filename) {
        const pdfDrawer = document.getElementById('pdfDrawer');
        const pdfDrawerOverlay = document.getElementById('pdfDrawerOverlay');
        const pdfDrawerTitle = document.getElementById('pdfDrawerTitle');
        const pdfViewerContent = document.getElementById('pdfViewerContent');
        
        if (!pdfDrawer || !pdfDrawerOverlay || !pdfDrawerTitle || !pdfViewerContent) return;
        
        // 设置标题
        pdfDrawerTitle.textContent = filename;
        
        // 模拟PDF内容加载
        setTimeout(() => {
            pdfViewerContent.innerHTML = `
                <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h2 style="color: #334155; margin-bottom: 8px;">GD25Q64ESIGR</h2>
                        <p style="color: #64748B; font-size: 14px;">64Mbit SPI NOR Flash 数据手册</p>
                    </div>
                    
                    <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                        <h3 style="color: #334155; margin-bottom: 12px; font-size: 16px;">📋 产品概述</h3>
                        <p style="color: #64748B; line-height: 1.6; font-size: 14px;">
                            GD25Q64ESIGR是兆易创新推出的一款64Mbit容量的SPI NOR Flash存储器。
                            该产品采用先进的工艺技术，具有高可靠性、低功耗的特点，广泛应用于各种嵌入式系统中。
                        </p>
                    </div>

                    <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                        <h3 style="color: #334155; margin-bottom: 12px; font-size: 16px;">⚡ 主要特性</h3>
                        <ul style="color: #64748B; line-height: 1.8; font-size: 14px; padding-left: 20px;">
                            <li>64Mbit (8MB) 存储容量</li>
                            <li>标准SPI接口，最高133MHz时钟频率</li>
                            <li>支持双线和四线SPI高速读取模式</li>
                            <li>2.7V-3.6V宽电压工作范围</li>
                            <li>-40°C到+85°C工业级温度范围</li>
                            <li>100,000次擦写循环寿命</li>
                            <li>20年数据保持能力</li>
                            <li>硬件和软件写保护功能</li>
                        </ul>
                    </div>

                    <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                        <h3 style="color: #334155; margin-bottom: 12px; font-size: 16px;">📐 封装信息</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                            <div><strong>封装类型:</strong> SOP8 (150mil)</div>
                            <div><strong>引脚数量:</strong> 8 pins</div>
                            <div><strong>封装尺寸:</strong> 5.28mm × 5.28mm</div>
                            <div><strong>厚度:</strong> 1.75mm</div>
                        </div>
                    </div>

                    <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px;">
                        <h3 style="color: #334155; margin-bottom: 12px; font-size: 16px;">🔧 应用领域</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; color: #64748B;">
                            <div>• 嵌入式系统固件存储</div>
                            <div>• 物联网设备</div>
                            <div>• 工业控制系统</div>
                            <div>• 消费电子产品</div>
                            <div>• 通信设备</div>
                            <div>• 汽车电子</div>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
                        <p style="color: #64748B; font-size: 12px;">
                            © 2024 兆易创新科技集团股份有限公司 版权所有
                        </p>
                    </div>
                </div>
            `;
        }, 800);
        
        // 显示抽屉
        pdfDrawerOverlay.classList.add('show');
        pdfDrawer.classList.add('open');
        
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
    }
    
    function closePdfDrawer() {
        const pdfDrawer = document.getElementById('pdfDrawer');
        const pdfDrawerOverlay = document.getElementById('pdfDrawerOverlay');
        
        if (!pdfDrawer || !pdfDrawerOverlay) return;
        
        // 隐藏抽屉
        pdfDrawerOverlay.classList.remove('show');
        pdfDrawer.classList.remove('open');
        
        // 恢复背景滚动
        document.body.style.overflow = '';
    }
    
    // 绑定PDF抽屉关闭事件
    const pdfDrawerClose = document.getElementById('pdfDrawerClose');
    const pdfDrawerOverlay = document.getElementById('pdfDrawerOverlay');
    
    if (pdfDrawerClose) {
        pdfDrawerClose.addEventListener('click', closePdfDrawer);
    }
    
    if (pdfDrawerOverlay) {
        pdfDrawerOverlay.addEventListener('click', closePdfDrawer);
    }
    
    // ESC键关闭抽屉
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePdfDrawer();
        }
    });
    
    // 将函数暴露到全局，供HTML中的onclick使用
    window.openPdfDrawer = openPdfDrawer;
    window.closePdfDrawer = closePdfDrawer;
}

window.addEventListener('load', () => {
    renderTutorialContent();
    initChatDemo();
    initTutorialVideoModal(); // 初始化视频弹窗
    updateTraces();
     renderTutorialFloor();
     renderPracticesFloor();
     // 初始化所有页面的视觉效果
     setTimeout(() => {
         initWorkbenchEffects();
         initTutorialEffects();
         initPracticesEffects();
     }, ANIMATION_CONFIG.initDelay); // 延迟确保SVG已渲染
 });
 window.addEventListener('resize', () => {
     updateTraces();
     renderTutorialFloor();
     renderPracticesFloor();
     // 重新初始化所有页面的视觉效果
     setTimeout(() => {
         initWorkbenchEffects();
         initTutorialEffects();
         initPracticesEffects();
     }, ANIMATION_CONFIG.resizeDelay);
 });
 
 // 防抖函数，用于优化性能
 function debounce(func, wait) {
     let timeout;
     return function executedFunction(...args) {
         const later = () => {
             clearTimeout(timeout);
             func(...args);
         };
         clearTimeout(timeout);
         timeout = setTimeout(later, wait);
     };
 }
 
 // 使用 requestAnimationFrame 优化的更新函数
 function updateTracesOptimized() {
     // 使用 requestAnimationFrame 确保在下一帧执行，与浏览器渲染同步
     requestAnimationFrame(() => {
         updateTraces();
     });
 }
 
 // 监听侧边栏折叠/展开事件，使用防抖和 requestAnimationFrame 优化性能
 // 使用较短的防抖时间（50ms），让响应更快，同时避免频繁调用
 const debouncedUpdateTraces = debounce(updateTracesOptimized, 50);
 window.addEventListener('sidebarToggle', () => {
     // 立即使用 requestAnimationFrame 开始准备，但实际更新会延迟
     // 这样可以在侧边栏动画进行时就开始准备，让过渡更流畅
     debouncedUpdateTraces();
 });
 
 // 页面交互逻辑
 const btnSend = document.querySelector('.btn-send');
 if (btnSend) {
     btnSend.addEventListener('click', function() {
         const textarea = document.getElementById('mainTextarea');
         // 如果是contenteditable div，需要获取文本内容
         let text = '';
         if (textarea.contentEditable === 'true') {
             const walker = document.createTreeWalker(
                 textarea,
                 NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
                 {
                     acceptNode: function(node) {
                         if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('mention-tag')) {
                             return NodeFilter.FILTER_ACCEPT;
                         }
                         if (node.nodeType === Node.TEXT_NODE) {
                             return NodeFilter.FILTER_ACCEPT;
                         }
                         return NodeFilter.FILTER_SKIP;
                     }
                 }
             );
             
             let node;
             while (node = walker.nextNode()) {
                 if (node.nodeType === Node.TEXT_NODE) {
                     text += node.textContent;
                 } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('mention-tag')) {
                     const bomName = node.dataset.bomName;
                     const version = node.dataset.version;
                     text += `@${bomName}(${version})`;
                 }
             }
         } else {
             text = textarea.value;
         }
         console.log('发送消息:', text);
     });
 }
 
// @提及功能（复用于主页与对话页）
const initMentionTextarea = (function() {
    const dropdown = document.getElementById('mentionDropdown');
    if (!dropdown) {
        return function() {};
    }

    // BOM档案数据（树形结构）
    const bomData = [
        {
            name: '电源切换模块BOM',
            versions: [
                { version: 'v1.0', date: '2024-01-15' },
                { version: 'v2.0', date: '2024-03-20' },
                { version: 'v2.1', date: '2024-05-10' }
            ]
        },
        {
            name: '新电源芯片mos选型',
            versions: [
                { version: 'v1.0', date: '2024-02-01' },
                { version: 'v1.5', date: '2024-04-12' }
            ]
        },
        {
            name: '60V参数的mos查询',
            versions: [
                { version: 'v1.0', date: '2024-01-20' },
                { version: 'v1.2', date: '2024-03-05' },
                { version: 'v2.0', date: '2024-06-18' }
            ]
        },
        {
            name: 'BOM更新需求分析',
            versions: [
                { version: 'v1.0', date: '2024-02-15' }
            ]
        },
        {
            name: 'BOM中mos替换分析',
            versions: [
                { version: 'v1.0', date: '2024-03-10' },
                { version: 'v1.1', date: '2024-04-25' }
            ]
        },
        {
            name: 'R26系列同规格产品推荐',
            versions: [
                { version: 'v1.0', date: '2024-04-01' },
                { version: 'v1.3', date: '2024-05-20' },
                { version: 'v2.0', date: '2024-07-01' }
            ]
        }
    ];

    function renderDropdown(selectMention) {
        dropdown.innerHTML = '';

        bomData.forEach((bom) => {
            // BOM名称组（可展开/折叠）
            const groupItem = document.createElement('div');
            groupItem.className = 'mention-item-group expanded';

            const groupIcon = document.createElement('span');
            groupIcon.className = 'mention-group-icon';
            groupIcon.innerHTML = '▶';

            const folderIcon = document.createElement('span');
            folderIcon.className = 'folder-icon';
            folderIcon.innerHTML = '📁';

            const groupText = document.createElement('span');
            groupText.textContent = bom.name;

            groupItem.appendChild(groupIcon);
            groupItem.appendChild(folderIcon);
            groupItem.appendChild(groupText);

            // 点击组标题展开/折叠
            groupItem.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('expanded');
            });

            dropdown.appendChild(groupItem);

            // 版本列表容器
            const itemList = document.createElement('div');
            itemList.className = 'mention-item-list';

            // 版本列表
            bom.versions.forEach((version) => {
                const item = document.createElement('div');
                item.className = 'mention-item';
                item.dataset.bomName = bom.name;
                item.dataset.version = version.version;

                const icon = document.createElement('span');
                icon.className = 'mention-item-icon';
                icon.innerHTML = '▶';

                const text = document.createElement('span');
                text.className = 'mention-item-text';
                text.textContent = version.version;

                item.appendChild(icon);
                item.appendChild(text);
                itemList.appendChild(item);

                // 点击选择
                item.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    selectMention(bom.name, version.version);
                });
            });

            dropdown.appendChild(itemList);
        });
    }

    return function init(textarea) {
        if (!textarea || textarea.dataset.mentionReady === 'true') {
            return;
        }
        textarea.dataset.mentionReady = 'true';

        const searchWrapper = textarea.closest('.search-wrapper');
        let selectedIndex = 0;
        let mentionStartNode = null;
        let mentionStartOffset = -1;
        let savedRange = null; // 保存当前的range

        function updateSelected() {
            const visibleItems = Array.from(dropdown.querySelectorAll('.mention-item')).filter(item => {
                return item.offsetParent !== null;
            });

            visibleItems.forEach((item, index) => {
                item.classList.toggle('selected', index === selectedIndex);
            });

            const selectedItem = visibleItems[selectedIndex];
            if (selectedItem) {
                selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }

        function getVisibleItems() {
            return Array.from(dropdown.querySelectorAll('.mention-item')).filter(item => {
                return item.offsetParent !== null;
            });
        }

        function hideDropdown() {
            dropdown.classList.remove('show');
            mentionStartNode = null;
            mentionStartOffset = -1;
            selectedIndex = 0;
            savedRange = null;
        }

        function selectMention(bomName, version) {
            const selection = window.getSelection();

            if (!mentionStartNode) {
                return;
            }

            let range;
            if (selection.rangeCount > 0) {
                range = selection.getRangeAt(0);
            } else if (savedRange) {
                range = savedRange;
                selection.addRange(savedRange.cloneRange());
            } else {
                return;
            }

            try {
                const mentionTag = document.createElement('span');
                mentionTag.className = 'mention-tag';
                mentionTag.contentEditable = 'false';
                mentionTag.dataset.bomName = bomName;
                mentionTag.dataset.version = version;

                const icon = document.createElement('span');
                icon.className = 'mention-tag-icon';
                icon.textContent = 'B';

                const text = document.createElement('span');
                text.className = 'mention-tag-text';
                text.textContent = `${bomName}(${version})`;

                mentionTag.appendChild(icon);
                mentionTag.appendChild(text);

                const deleteRange = document.createRange();

                if (!mentionStartNode.parentNode) {
                    hideDropdown();
                    return;
                }

                deleteRange.setStart(mentionStartNode, mentionStartOffset);
                deleteRange.setEnd(range.startContainer, range.startOffset);
                deleteRange.deleteContents();
                deleteRange.insertNode(mentionTag);

                const textNode = document.createTextNode(' ');
                const insertRange = document.createRange();
                insertRange.setStartAfter(mentionTag);
                insertRange.collapse(true);
                insertRange.insertNode(textNode);
                insertRange.setStartAfter(textNode);
                insertRange.collapse(true);

                selection.removeAllRanges();
                selection.addRange(insertRange);

                hideDropdown();
                textarea.focus();
            } catch (error) {
                hideDropdown();
            }
        }

        function showDropdown() {
            if (dropdown.parentNode !== document.body) {
                document.body.appendChild(dropdown);
            }

            dropdown.classList.add('show');
            selectedIndex = 0;
            updateSelected();

            const rect = textarea.getBoundingClientRect();
            dropdown.style.left = rect.left + 'px';
            dropdown.style.top = (rect.top - dropdown.offsetHeight - 8) + 'px';
            dropdown.style.width = Math.max(rect.width, 240) + 'px';
        }

        function checkMention() {
            const selection = window.getSelection();
            if (selection.rangeCount === 0) {
                hideDropdown();
                return;
            }

            const range = selection.getRangeAt(0);
            let textNode = range.startContainer;
            let cursorPos = range.startOffset;

            if (textNode.nodeType !== Node.TEXT_NODE) {
                if (textNode.nodeType === Node.ELEMENT_NODE && textNode.classList.contains('mention-tag')) {
                    hideDropdown();
                    return;
                }

                if (textNode.childNodes.length > 0 && cursorPos < textNode.childNodes.length) {
                    const childNode = textNode.childNodes[cursorPos];
                    if (childNode && childNode.nodeType === Node.TEXT_NODE) {
                        textNode = childNode;
                        cursorPos = 0;
                    } else {
                        hideDropdown();
                        return;
                    }
                } else {
                    hideDropdown();
                    return;
                }
            }

            const text = textNode.textContent;
            let startPos = cursorPos - 1;
            while (startPos >= 0 && text[startPos] !== '@' && text[startPos] !== ' ' && text[startPos] !== '\n') {
                startPos--;
            }

            if (startPos >= 0 && text[startPos] === '@') {
                const afterAt = text.substring(startPos + 1, cursorPos);
                if (afterAt.includes(' ') || afterAt.includes('\n') || afterAt.includes('(')) {
                    hideDropdown();
                    return;
                }

                mentionStartNode = textNode;
                mentionStartOffset = startPos;
                savedRange = range.cloneRange();
                showDropdown();
            } else {
                hideDropdown();
            }
        }

        function cleanupEmptyContent() {
            const text = textarea.textContent || textarea.innerText || '';
            if (!text || text.trim() === '') {
                textarea.innerHTML = '';
            }
        }

        textarea.addEventListener('input', function() {
            cleanupEmptyContent();
            checkMention();
        });
        textarea.addEventListener('keyup', function() {
            cleanupEmptyContent();
            checkMention();
        });

        textarea.addEventListener('keydown', function(e) {
            const selection = window.getSelection();
            if (selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const startNode = range.startContainer;

            if (startNode.parentElement && startNode.parentElement.classList.contains('mention-tag')) {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                    const tag = startNode.parentElement;
                    tag.remove();
                    cleanupEmptyContent();
                    const newRange = document.createRange();
                    if (textarea.firstChild) {
                        newRange.setStart(textarea.firstChild, 0);
                    } else {
                        newRange.setStart(textarea, 0);
                    }
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            }
        });

        textarea.addEventListener('keydown', function(e) {
            if (!dropdown.classList.contains('show')) return;

            const visibleItems = getVisibleItems();

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, visibleItems.length - 1);
                updateSelected();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                updateSelected();
            } else if (e.key === 'Enter' && visibleItems.length > 0) {
                e.preventDefault();
                const selectedItem = visibleItems[selectedIndex];
                if (selectedItem) {
                    selectMention(selectedItem.dataset.bomName, selectedItem.dataset.version);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                hideDropdown();
            }
        });

        document.addEventListener('click', function(e) {
            if (searchWrapper && !searchWrapper.contains(e.target) && !dropdown.contains(e.target)) {
                hideDropdown();
            }
        });

        renderDropdown(selectMention);
        updateSelected();
    };
})();

initMentionTextarea(document.getElementById('mainTextarea'));
 
 // 菜单项点击事件
 document.getElementById('newProject')?.addEventListener('click', function() {
     console.log('新建会话');
 });
 
 document.getElementById('bomArchive')?.addEventListener('click', function() {
     console.log('BOM档案');
 });
 
 document.getElementById('knowledgeBase')?.addEventListener('click', function() {
     console.log('知识库');
 });
 
 // 搜索框快捷键
 const searchInput = document.getElementById('searchInput');
 if (searchInput) {
     document.addEventListener('keydown', function(e) {
         // ⌘ + K 或 Ctrl + K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// 处理会话项的气泡菜单
document.addEventListener('DOMContentLoaded', function() {
    const projectItems = document.querySelectorAll('.project-item');
    let currentOpenMenu = null;
    
    // 计算并设置菜单位置
    function setMenuPosition(menu, item) {
        const itemRect = item.getBoundingClientRect();
        const menuWidth = 120; // 菜单宽度
        const menuHeight = 80; // 估算菜单高度
        
        // 计算位置：在项目项的右侧，垂直居中
        const left = itemRect.right - menuWidth - 8;
        const top = itemRect.top + (itemRect.height / 2) - (menuHeight / 2);
        
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
    }
    
    projectItems.forEach(function(item) {
        const moreBtn = item.querySelector('.project-item-more');
        const menu = item.querySelector('.project-item-menu');
        
        if (moreBtn && menu) {
            // 点击三个点按钮，显示/隐藏菜单
            moreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // 如果当前菜单已打开，则关闭它
                if (currentOpenMenu === menu) {
                    menu.classList.remove('show');
                    currentOpenMenu = null;
                } else {
                    // 关闭其他已打开的菜单
                    if (currentOpenMenu) {
                        currentOpenMenu.classList.remove('show');
                    }
                    // 计算并设置位置
                    setMenuPosition(menu, item);
                    // 打开当前菜单
                    menu.classList.add('show');
                    currentOpenMenu = menu;
                }
            });
        }
    });
    
    // 点击页面其他地方时关闭菜单
    document.addEventListener('click', function(e) {
        if (currentOpenMenu && !currentOpenMenu.contains(e.target)) {
            const moreBtn = currentOpenMenu.parentElement.querySelector('.project-item-more');
            if (moreBtn && !moreBtn.contains(e.target)) {
                currentOpenMenu.classList.remove('show');
                currentOpenMenu = null;
            }
        }
    });
    
    // 滚动时重新计算菜单位置
    const projectList = document.getElementById('projectList');
    if (projectList) {
        projectList.addEventListener('scroll', function() {
            if (currentOpenMenu) {
                const item = currentOpenMenu.parentElement;
                setMenuPosition(currentOpenMenu, item);
            }
        });
    }
});

// 研发偏好设置逻辑
(function() {
    const modeConfig = {
        balanced: { icon: '⚖️', text: '均衡模式', class: 'balanced' },
        efficiency: { icon: '⚡', text: '效率模式', class: 'efficiency' },
        inspiration: { icon: '💡', text: '启发模式', class: 'inspiration' }
    };

    const modeBadge = document.getElementById('indexModeBadge');
    const modeBadgeText = document.getElementById('indexModeBadgeText');

    if (!modeBadge) return; // 如果元素不存在，退出

    let selectedMode = 'balanced';

    function loadSettings() {
        const savedMode = localStorage.getItem('developmentMode');

        if (savedMode && modeConfig[savedMode]) {
            selectedMode = savedMode;
            updateModeBadge(savedMode);
        } else {
            // 如果没有保存的模式，使用默认值
            updateModeBadge(selectedMode);
        }
    }
    
    // 监听模式改变事件，当设置保存后自动更新
    window.addEventListener('developmentModeChanged', function(event) {
        const newMode = event.detail.mode;
        if (newMode && modeConfig[newMode]) {
            selectedMode = newMode;
            updateModeBadge(newMode);
        }
    });

    function updateModeBadge(mode) {
        const config = modeConfig[mode];
        modeBadge.className = `mode-badge ${config.class}`;
        const icon = modeBadge.querySelector('.mode-badge-icon');
        if (icon) icon.textContent = config.icon;
        if (modeBadgeText) modeBadgeText.textContent = config.text;
    }

    // 点击模式徽章时打开公共设置弹窗，并切换到研发偏好标签
    if (modeBadge) {
        modeBadge.addEventListener('click', function() {
            if (window.openSettingsModal) {
                window.openSettingsModal();
                // 等待弹窗创建后切换到研发偏好标签
                setTimeout(() => {
                    const preferencesMenuItem = document.querySelector('#settingsModal .menu-item[data-tab="preferences"]');
                    if (preferencesMenuItem) {
                        preferencesMenuItem.click();
                    }
                }, 100);
            }
        });
    }

    // 监听公共设置弹窗中的偏好标签点击
    document.addEventListener('click', function(e) {
        const preferenceTag = e.target.closest('#settingsModal .preference-tag');
        if (preferenceTag) {
            const mode = preferenceTag.getAttribute('data-mode');
            if (mode && modeConfig[mode]) {
                selectedMode = mode;
                updateModeBadge(mode);
                localStorage.setItem('developmentMode', mode);
            }
        }
    });

    // 监听公共设置弹窗中的选型偏好保存
    document.addEventListener('click', function(e) {
        if (e.target.id === 'settingsSaveBtn') {
            const selectionPreference = document.querySelector('#settingsModal #selectionPreference');
            if (selectionPreference) {
                localStorage.setItem('selectionPreference', selectionPreference.value);
            }
            
            // 保存研发风格
            const selectedPreferenceTag = document.querySelector('#settingsModal .preference-tag.selected');
            if (selectedPreferenceTag) {
                const mode = selectedPreferenceTag.getAttribute('data-mode');
                if (mode && modeConfig[mode]) {
                    selectedMode = mode;
                    updateModeBadge(mode);
                    localStorage.setItem('developmentMode', mode);
                }
            }
        }
    });

    // 加载保存的设置
    loadSettings();
})();

// ==================== 主对话框功能 ====================
(function() {
    const mainTextarea = document.getElementById('mainTextarea');
    const btnSend = document.querySelector('.btn-send');
    const btnAttach = document.querySelector('.btn-attach');
    const welcomeArea = document.getElementById('welcomeArea');
    const chatContainer = document.getElementById('chatContainer');
    let messagesContainer = document.getElementById('messagesContainer');
    const chatTitle = document.getElementById('chatTitle');
    const projectList = document.getElementById('projectList');
    const floorsContainer = document.getElementById('floorsContainer');
    const chipPackage = document.querySelector('.chip-package');
    const workbenchSvg = document.querySelector('.pcb-layer-svg--workbench');
    let chatPageSendBtn = null;
    let chatPageTextarea = null;
    let chatPageAttachBtn = null;
    
    // 当前对话标题（从用户第一条消息生成）
    let currentChatTitle = '';
    let isInChatMode = false;
    let isStreaming = false;
    let typingTimers = [];
    let currentTypingTimer = null;
    let loadingTimer = null;
    let chatPageTitleText = null;
    let currentAssistantElement = null;
    
    // 初始化：置灰上传附件按钮
    if (btnAttach) {
        btnAttach.style.opacity = '0.5';
        btnAttach.style.cursor = 'not-allowed';
        btnAttach.title = '功能开发中';
    }
    
    // 获取输入框文本内容（去除HTML标签和空格）
    function getTextContent(element) {
        if (!element) return '';
        const text = element.textContent || element.innerText || '';
        return text.trim();
    }
    
    // 检查输入框是否有有效内容
    function hasValidContent() {
        const text = getTextContent(mainTextarea);
        return text.length > 0;
    }
    
    // 更新发送按钮状态
    function updateSendButtonState() {
        if (!btnSend) return;
        const hasContent = hasValidContent();
        btnSend.disabled = !hasContent;
        if (hasContent) {
            btnSend.style.opacity = '1';
            btnSend.style.cursor = 'pointer';
        } else {
            btnSend.style.opacity = '0.5';
            btnSend.style.cursor = 'not-allowed';
        }
    }
    
    // 初始化按钮状态
    updateSendButtonState();

    function setMainInputValue(text) {
        if (!mainTextarea) return;
        mainTextarea.innerHTML = '';
        mainTextarea.textContent = text;
        const range = document.createRange();
        range.selectNodeContents(mainTextarea);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        updateSendButtonState();
        mainTextarea.focus();
    }

    window.setMainInputValue = setMainInputValue;

    function updateChatTitle(text) {
        if (!text) return;
        currentChatTitle = text;
        if (chatPageTitleText) {
            chatPageTitleText.textContent = text;
        }
        const activeItem = document.querySelector('.project-item.active .project-item-text');
        if (activeItem) {
            activeItem.textContent = text;
        }
    }

    function renderMarkdown(text) {
        if (window.marked && typeof window.marked.parse === 'function') {
            return window.marked.parse(text);
        }
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function setSendButtonState(button, hasContent) {
        if (!button) return;
        if (isStreaming) {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
            return;
        }
        button.disabled = !hasContent;
        button.style.opacity = hasContent ? '1' : '0.5';
        button.style.cursor = hasContent ? 'pointer' : 'not-allowed';
    }

    function setStreamingState(state) {
        isStreaming = state;
        if (chatPageSendBtn) {
            chatPageSendBtn.classList.toggle('is-streaming', state);
            chatPageSendBtn.setAttribute('aria-label', state ? '停止输出' : '发送');
        }
        const hasContent = chatPageTextarea ? chatPageTextarea.textContent.trim().length > 0 : false;
        setSendButtonState(chatPageSendBtn, hasContent);
    }

    function stopStreaming() {
        if (loadingTimer) {
            clearTimeout(loadingTimer);
            loadingTimer = null;
        }
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove();
        }
        if (currentTypingTimer) {
            clearTimeout(currentTypingTimer);
            currentTypingTimer = null;
        }
        if (currentAssistantElement) {
            const currentText = currentAssistantElement.dataset.partialMarkdown || currentAssistantElement.textContent || '';
            currentAssistantElement.innerHTML = renderMarkdown(currentText);
        }
        setStreamingState(false);
        currentAssistantElement = null;
    }
    
    // 监听输入框内容变化
    if (mainTextarea) {
        mainTextarea.addEventListener('input', function() {
            updateSendButtonState();
        });
        
        mainTextarea.addEventListener('paste', function() {
            setTimeout(() => {
                updateSendButtonState();
            }, 10);
        });
        
        // 回车键处理：Shift+回车换行，回车发送
        mainTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (hasValidContent() && !btnSend.disabled) {
                    sendMessage();
                }
            }
        });
    }
    
    // 切换到对话模式（发送消息后）
    function switchToChatMode(userMessage) {
        if (isInChatMode) return;
        
        isInChatMode = true;
        
        // 隐藏整个工作台区域
        const floorWorkbench = document.querySelector('.floor-workbench');
        if (floorWorkbench) {
            floorWorkbench.style.display = 'none';
        }
        
        // 创建新的对话页面容器（仿豆包）
        const mainViewport = document.querySelector('.main-viewport');
        if (!mainViewport) return;
        
        const chatPageContainer = document.createElement('div');
        chatPageContainer.className = 'chat-page-container';
        chatPageContainer.id = 'chatPageContainer';
        
        chatPageContainer.innerHTML = `
            <!-- 对话头部 -->
            <div class="chat-page-header">
                <div class="chat-page-title" id="chatPageTitle" aria-label="编辑标题">
                    <span class="chat-page-title-text">友好的对话</span>
                    <span class="chat-page-title-hint">点击编辑</span>
                </div>
            </div>

            <!-- 消息区域 -->
            <div class="chat-page-messages" id="chatPageMessages">
                <!-- 对话内容将通过JavaScript动态生成 -->
            </div>

            <!-- 输入区域 -->
            <div class="chat-page-input-container">
                <div class="search-wrapper">
                    <div class="input-editor" id="chatPageTextarea" contenteditable="true" data-placeholder="请描述需求，输入@可调用BOM档案"></div>
                    <div class="input-actions">
                        <div class="input-actions-left">
                            <div class="mode-badge balanced" id="chatPageModeBadge">
                                <span class="mode-badge-icon">⚖️</span>
                                <span id="chatPageModeBadgeText">均衡模式</span>
                            </div>
                        </div>
                        <div class="input-actions-right">
                            <button class="btn-attach" id="chatPageAttach" type="button" aria-label="上传文件">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                </svg>
                            </button>
                            <button class="btn-send" id="chatPageSend" type="button" aria-label="发送">
                                <svg class="icon-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                <svg class="icon-stop" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="7" y="7" width="10" height="10" rx="2"></rect>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        mainViewport.appendChild(chatPageContainer);
        
        // 更新对话容器引用
        messagesContainer = document.getElementById('chatPageMessages');
        const newTextarea = document.getElementById('chatPageTextarea');
        const newSendBtn = document.getElementById('chatPageSend');
        const newAttachBtn = document.getElementById('chatPageAttach');
        const chatPageTitle = document.getElementById('chatPageTitle');

        if (newAttachBtn) {
            newAttachBtn.disabled = true;
            newAttachBtn.style.opacity = '0.5';
            newAttachBtn.style.cursor = 'not-allowed';
            newAttachBtn.title = '功能开发中';
        }

        chatPageSendBtn = newSendBtn;
        chatPageTextarea = newTextarea;
        chatPageAttachBtn = newAttachBtn;

        if (typeof initMentionTextarea === 'function') {
            initMentionTextarea(chatPageTextarea);
        }

        if (chatPageTitle) {
            const titleTextEl = chatPageTitle.querySelector('.chat-page-title-text');
            const titleHintEl = chatPageTitle.querySelector('.chat-page-title-hint');
            let titleInput = null;
            chatPageTitleText = titleTextEl;

            function exitEdit(save) {
                if (!titleInput || !titleTextEl) return;
                const nextValue = titleInput.value.trim();
                if (save && nextValue) {
                    updateChatTitle(nextValue);
                }
                titleInput.remove();
                titleInput = null;
                titleTextEl.style.display = '';
                if (titleHintEl) {
                    titleHintEl.style.display = '';
                }
            }

            chatPageTitle.addEventListener('click', function(e) {
                e.stopPropagation();
                if (titleInput || !titleTextEl) return;
                const currentValue = titleTextEl.textContent.trim();
                titleInput = document.createElement('input');
                titleInput.className = 'chat-page-title-input';
                titleInput.type = 'text';
                titleInput.value = currentValue;
                titleTextEl.style.display = 'none';
                if (titleHintEl) {
                    titleHintEl.style.display = 'none';
                }
                chatPageTitle.appendChild(titleInput);
                titleInput.focus();
                titleInput.select();

                titleInput.addEventListener('keydown', function(evt) {
                    if (evt.key === 'Enter') {
                        evt.preventDefault();
                        exitEdit(true);
                    } else if (evt.key === 'Escape') {
                        evt.preventDefault();
                        exitEdit(false);
                    }
                });

                titleInput.addEventListener('click', function(evt) {
                    evt.stopPropagation();
                });

                titleInput.addEventListener('blur', function() {
                    exitEdit(true);
                });
            });

            document.addEventListener('click', function() {
                exitEdit(true);
            });
        }

        // 重新绑定输入框事件
        if (newTextarea) {
            newTextarea.addEventListener('input', function() {
                const hasContent = newTextarea.textContent.trim().length > 0;
                setSendButtonState(newSendBtn, hasContent);
            });
            
            newTextarea.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (isStreaming) {
                        return;
                    }
                    const text = newTextarea.textContent.trim();
                    if (text && !newSendBtn.disabled) {
                        newTextarea.textContent = '';
                        newTextarea.innerHTML = '';
                        setSendButtonState(newSendBtn, false);
                        addUserMessage(text);
                        setTimeout(() => addAssistantMessage(), 300);
                    }
                }
            });
        }
        
        if (newSendBtn) {
            newSendBtn.addEventListener('click', function() {
                if (isStreaming) {
                    stopStreaming();
                    return;
                }
                if (newTextarea && !newSendBtn.disabled) {
                    const text = newTextarea.textContent.trim();
                    if (text) {
                        newTextarea.textContent = '';
                        newTextarea.innerHTML = '';
                        setSendButtonState(newSendBtn, false);
                        addUserMessage(text);
                        setTimeout(() => addAssistantMessage(), 300);
                    }
                }
            });
        }

        setSendButtonState(newSendBtn, false);
        
        // 生成对话标题（取用户消息的前30个字符）
        currentChatTitle = userMessage.length > 30 
            ? userMessage.substring(0, 30) + '...' 
            : userMessage;
        
        // 在对话列表第一行添加当前对话
        const projectList = document.querySelector('.project-list');
        if (projectList) {
            // 创建新的对话项
            const newItem = document.createElement('div');
            newItem.className = 'project-item active';
            newItem.innerHTML = `
                <svg class="project-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="project-item-text">${currentChatTitle}</span>
            `;
            // 移除其他项目的active状态
            projectList.querySelectorAll('.project-item').forEach(item => {
                item.classList.remove('active');
            });
            // 插入到第一行
            projectList.insertBefore(newItem, projectList.firstChild);
        }
        
        updateChatTitle(currentChatTitle);
    }
    
    // 添加用户消息
    function addUserMessage(text) {
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-text">${escapeHtml(text)}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        
        // 滚动到底部
        setTimeout(() => {
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 50);
    }
    
    // 添加助手消息（带loading和流式输出）
    function addAssistantMessage() {
        if (!messagesContainer) return;

        setStreamingState(true);

        // 先显示loading
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message assistant';
        loadingDiv.id = 'loadingMessage';
        loadingDiv.innerHTML = `
            <div class="loading-status">
                <span class="loading-text">正在识别用户意图</span>
            </div>
        `;
        
        messagesContainer.appendChild(loadingDiv);
        
        // 滚动到底部
        setTimeout(() => {
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 50);
        
        // 2秒后移除loading，开始流式输出
        loadingTimer = setTimeout(() => {
            if (loadingDiv && loadingDiv.parentNode) {
                loadingDiv.remove();
            }
            
            // 创建助手消息
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message assistant';
            
            messageDiv.innerHTML = `
                <div class="message-text markdown" id="assistantMessageText"></div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            
            const textElement = messageDiv.querySelector('#assistantMessageText');
            const fixedText = `# 需求解析概览
基于你提供的场景，我先给出**关键要点**与**下一步动作**，确保选型和BOM生成高效推进。

## ✅ 已识别的核心信息
- 应用类型：电源/控制类板卡
- 关注重点：器件性能与可替代性
- 输出形式：BOM + 参数说明

---

## 核心器件建议（示例）
**1) 主控 MCU**
建议优先评估低功耗系列，满足\`GPIO ≥ 16\` 与 \`ADC ≥ 8\` 的需求。

**2) MOSFET**
- 关键指标：\`Vds ≥ 20V\`、\`Rds(on) ≤ 50mΩ\`
- 封装：TO-252
- 备选方案：英飞凌 / 安森美 / 国产 AOS

**3) DC-DC**
- 目标：24V → 12V，效率 ≥ 85%
- 推荐拓扑：同步降压

---

## 输出模板（BOM 结构）
| 类别 | 器件 | 关键参数 | 备注 |
| --- | --- | --- | --- |
| MCU | STM32G0 | 32KB / 16GPIO | 低功耗 |
| MOS | BSC010N04 | 40V / 6mΩ | 高兼容 |
| DCDC | MPQ4572 | 36V / 3A | 工业级 |

> 如果你愿意，我可以继续补齐每一行的**替代料**和**价格区间**。`;
            
            currentAssistantElement = textElement;
            // 流式输出
            typewriterEffect(textElement, fixedText, () => {
                if (currentAssistantElement) {
                    currentAssistantElement.innerHTML = renderMarkdown(fixedText);
                }
                scrollToBottom();
                setStreamingState(false);
                currentAssistantElement = null;
            });
        }, 2000);
    }
    
    // 打字机效果
    function typewriterEffect(element, text, callback) {
        if (!element) return;
        
        let index = 0;
        element.textContent = '';
        element.dataset.rawMarkdown = text;
        
        function typeChar() {
            if (!isStreaming) {
                return;
            }
            if (index >= text.length) {
                if (callback) callback();
                return;
            }
            
            const char = text[index];
            if (element.classList.contains('markdown')) {
                const partial = text.slice(0, index + 1);
                element.dataset.partialMarkdown = partial;
                if (index % 6 === 0 || char === '\n') {
                    element.innerHTML = renderMarkdown(partial);
                }
            } else {
                element.textContent += char;
            }
            index++;
            
            // 根据字符类型调整延迟
            let delay = 30;
            if (char === '。' || char === '，' || char === '：' || char === '、') {
                delay = 50;
            } else if (char === ' ') {
                delay = 10;
            }
            
            currentTypingTimer = setTimeout(typeChar, delay);
            typingTimers.push(currentTypingTimer);
            
            // 每输出几个字符就滚动一次
            if (index % 10 === 0) {
                scrollToBottom();
            }
        }
        
        typeChar();
    }
    
    // 滚动到底部
    function scrollToBottom() {
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }
    
    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 发送消息
    function sendMessage() {
        if (!mainTextarea) return;
        
        const text = getTextContent(mainTextarea);
        if (!text) return;
        
        // 清空输入框
        mainTextarea.textContent = '';
        mainTextarea.innerHTML = '';
        updateSendButtonState();
        
        // 如果是第一条消息，切换到对话模式
        if (!isInChatMode) {
            switchToChatMode(text);
        }
        
        // 添加用户消息
        addUserMessage(text);
        
        // 添加助手消息（带loading和流式输出）
        setTimeout(() => {
            addAssistantMessage();
        }, 300);
    }
    
    // 绑定发送按钮事件
    if (btnSend) {
        btnSend.addEventListener('click', function() {
            if (hasValidContent() && !btnSend.disabled) {
                sendMessage();
            }
        });
    }
    
    // 清理定时器
    window.addEventListener('beforeunload', function() {
        typingTimers.forEach(timer => clearTimeout(timer));
    });
})();
