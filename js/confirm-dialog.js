/**
 * 自定义确认对话框
 */
(function() {
    let confirmDialog = null;

    function createConfirmDialog() {
        if (confirmDialog) return confirmDialog;

        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog-overlay';
        dialog.id = 'confirmDialog';
        dialog.innerHTML = `
            <div class="confirm-dialog">
                <div class="confirm-dialog-header">
                    <h3 class="confirm-dialog-title">确认操作</h3>
                </div>
                <div class="confirm-dialog-content">
                    <p class="confirm-dialog-message"></p>
                </div>
                <div class="confirm-dialog-footer">
                    <button class="confirm-dialog-btn confirm-dialog-btn-cancel">取消</button>
                    <button class="confirm-dialog-btn confirm-dialog-btn-confirm">确认</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        confirmDialog = dialog;
        return dialog;
    }

    function showConfirm(message, onConfirm, onCancel) {
        const dialog = createConfirmDialog();
        const messageEl = dialog.querySelector('.confirm-dialog-message');
        const cancelBtn = dialog.querySelector('.confirm-dialog-btn-cancel');
        const confirmBtn = dialog.querySelector('.confirm-dialog-btn-confirm');

        messageEl.textContent = message;
        dialog.classList.add('show');

        // 移除之前的事件监听器
        const newCancelBtn = cancelBtn.cloneNode(true);
        const newConfirmBtn = confirmBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        // 确认按钮
        newConfirmBtn.addEventListener('click', function() {
            dialog.classList.remove('show');
            if (onConfirm) onConfirm();
        });

        // 取消按钮
        newCancelBtn.addEventListener('click', function() {
            dialog.classList.remove('show');
            if (onCancel) onCancel();
        });

        // 点击遮罩层关闭
        dialog.addEventListener('click', function(e) {
            if (e.target === dialog) {
                dialog.classList.remove('show');
                if (onCancel) onCancel();
            }
        });

        // ESC键关闭
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                dialog.classList.remove('show');
                document.removeEventListener('keydown', escHandler);
                if (onCancel) onCancel();
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // 暴露全局函数
    window.showConfirm = showConfirm;
})();

