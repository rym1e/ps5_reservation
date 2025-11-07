export function showToast(title, options = {}) {
  uni.showToast({
    title,
    icon: options.icon || 'none',
    duration: options.duration || 2000
  });
}

export function showError(message) {
  showToast(message || '发生未知错误', { icon: 'none' });
}

export function showSuccess(message) {
  showToast(message, { icon: 'success' });
}
