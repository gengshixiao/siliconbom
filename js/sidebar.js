/**
 * 侧边栏折叠/展开功能
 */
(function() {
    const sidebarUnit = document.getElementById('sidebarUnit');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (sidebarToggle && sidebarUnit) {
        // 从localStorage读取折叠状态
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebarUnit.classList.add('collapsed');
        }
        
        // 更新按钮图标方向
        function updateToggleIcon(collapsed) {
            const iconPath = sidebarToggle.querySelector('#toggleIconPath');
            if (iconPath) {
                if (collapsed) {
                    iconPath.setAttribute('d', 'M15 18l-6-6 6-6');
                } else {
                    iconPath.setAttribute('d', 'M9 18l6-6-6-6');
                }
            }
        }
        
        // 切换折叠状态
        sidebarToggle.addEventListener('click', function() {
            sidebarUnit.classList.toggle('collapsed');
            const collapsed = sidebarUnit.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', collapsed);
            updateToggleIcon(collapsed);
            
            // 触发自定义事件，通知其他模块侧边栏状态已改变
            const event = new CustomEvent('sidebarToggle', {
                detail: { collapsed: collapsed }
            });
            window.dispatchEvent(event);
        });
        
        // 初始化按钮图标方向
        updateToggleIcon(isCollapsed);
    }
})();

