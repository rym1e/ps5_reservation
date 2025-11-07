export function showError(message) {
  window.alert(message || '发生未知错误');
}

export function showSuccess(message) {
  if (message) {
    window.alert(message);
  }
}

export function showInfo(message) {
  if (message) {
    window.alert(message);
  }
}
