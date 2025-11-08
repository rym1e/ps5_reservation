export function notifySuccess(message) {
  window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'success', message } }));
}

export function notifyError(message) {
  window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message } }));
}
