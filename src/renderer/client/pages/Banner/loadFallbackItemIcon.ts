import defaultIcon from '@/renderer/client/assets/img/default-item.png'

export function loadFallbackItemIcon(ev: Event) {
    if (!ev.target) {
        return
    }

    if (!(ev.target instanceof HTMLImageElement)) {
        return
    }

    ev.target.src = defaultIcon
}
