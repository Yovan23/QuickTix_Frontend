/**
 * Date formatting utilities for show grouping
 */

export function formatDateHeader(dateStr) {
    if (!dateStr) return 'Unknown Date';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Unknown Date';

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        if (isToday) return 'Today';
        if (isTomorrow) return 'Tomorrow';

        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
        return 'Unknown Date';
    }
}

export function formatShowTime(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
        return 'N/A';
    }
}

export function getDateKey(dateStr) {
    if (!dateStr) return 'unknown';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
}

export function groupShowsByDate(shows) {
    if (!Array.isArray(shows) || shows.length === 0) return {};

    const grouped = {};
    shows.forEach(show => {
        const dateKey = getDateKey(show.startTime);
        if (!grouped[dateKey]) {
            grouped[dateKey] = {
                dateKey,
                dateLabel: formatDateHeader(show.startTime),
                shows: []
            };
        }
        grouped[dateKey].shows.push(show);
    });

    // Sort by date key (chronological)
    const sortedKeys = Object.keys(grouped).sort();
    const sortedGrouped = {};
    sortedKeys.forEach(key => {
        sortedGrouped[key] = grouped[key];
        // Sort shows within each day by start time
        sortedGrouped[key].shows.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    });

    return sortedGrouped;
}
