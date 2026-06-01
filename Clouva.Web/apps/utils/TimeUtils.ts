export function formatRelativeTime(dateStr: string, locale: string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

	const rtf = new Intl.RelativeTimeFormat(locale.startsWith('ru') ? 'ru' : 'en', { numeric: 'auto' });

	if (diffSec < 60) return rtf.format(-diffSec, 'second');

	const diffMin = Math.floor(diffSec / 60);
	if (diffMin < 60) return rtf.format(-diffMin, 'minute');

	const diffHour = Math.floor(diffMin / 60);
	if (diffHour < 24) return rtf.format(-diffHour, 'hour');

	const diffDay = Math.floor(diffHour / 24);
	return rtf.format(-diffDay, 'day');
}
