export function isContent(): boolean {
	return !chrome.hasOwnProperty('tabs');
}

export function isPopup(): boolean {
	return (typeof window === 'object') && (window.location.href === `extension://${chrome.runtime.id}/popup.html`);
}

export function isOptions(): boolean {
	return (typeof window === 'object') && (window.location.href === `extension://${chrome.runtime.id}/options.html`);
}

export function isBackground(): boolean {
	return !(isContent() || isPopup() || isOptions());
}