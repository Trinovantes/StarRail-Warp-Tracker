import { format, formatDistanceToNow } from 'date-fns'

export function formatDateTime(date?: Date | string | null): string {
    if (date === null || date === undefined) {
        return ''
    }
    if (typeof date === 'string') {
        date = new Date(date)
    }

    return `${format(date, 'E LLL d yyyy hh:mm aa')} (${formatDistanceToNow(date, { addSuffix: true })})`
}
