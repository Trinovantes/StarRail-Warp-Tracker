export function logBanner(...args: Array<unknown>) {
    console.info()
    console.info('-'.repeat(80))
    console.info(...args)
    console.info('-'.repeat(80))
    console.info()
}
