import type { RouteLocationNormalized } from 'vue-router'

export function parseRouteArg(route: RouteLocationNormalized, component: 'params' | 'query', key: string): string | null {
    const val = route[component][key]
    const valString = Array.isArray(val)
        ? val[0]
        : val

    return valString ?? null
}
