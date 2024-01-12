export function isSafeUrl(urlString: string): boolean {
    const url = new URL(urlString)
    if (url.hostname === 'localhost') {
        return true
    }

    return false
}
