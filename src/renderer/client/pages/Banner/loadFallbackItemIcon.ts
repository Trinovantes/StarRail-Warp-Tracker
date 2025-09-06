import defaultIcon from '@img/default-item.png'

export function loadFallbackItemIcon(ev: Event) {
    if (!ev.target) {
        return
    }

    if (!(ev.target instanceof HTMLImageElement)) {
        return
    }

    ev.target.src = defaultIcon
}
