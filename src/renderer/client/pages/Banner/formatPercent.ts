export function formatPercent(num: number, total: number) {
    const percent = total === 0
        ? 0.0
        : num / total

    return percent.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 1 })
}
