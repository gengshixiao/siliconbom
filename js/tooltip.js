/**
 * Tooltip功能 - 侧边栏折叠时显示菜单项提示
 */
(function() {
    const sidebarUnit = document.getElementById('sidebarUnit');
    let tooltip = null;
    
    function createTooltip() {
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'menu-item-tooltip';
            document.body.appendChild(tooltip);
        }
        return tooltip;
    }
    
    function showTooltip(element, text) {
        if (!sidebarUnit || !sidebarUnit.classList.contains('collapsed')) {
            return;
        }
        
        const tooltipEl = createTooltip();
        tooltipEl.textContent = text;
        
        const rect = element.getBoundingClientRect();
        const sidebarRect = sidebarUnit.getBoundingClientRect();
        
        tooltipEl.style.left = (sidebarRect.right + 8) + 'px';
        tooltipEl.style.top = (rect.top + rect.height / 2) + 'px';
        tooltipEl.style.transform = 'translateY(-50%)';
        
        tooltipEl.classList.add('show');
    }
    
    function hideTooltip() {
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }
    
    // 为所有带data-tooltip的菜单项添加事件监听
    function initTooltips() {
        const menuItems = document.querySelectorAll('.menu-item[data-tooltip]');
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                showTooltip(this, tooltipText);
            });
            
            item.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        });
    }
    
    // 当侧边栏展开时隐藏tooltip
    if (sidebarUnit) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (!sidebarUnit.classList.contains('collapsed')) {
                        hideTooltip();
                    }
                }
            });
        });
        
        observer.observe(sidebarUnit, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    // 初始化tooltip
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTooltips);
    } else {
        initTooltips();
    }
})();

