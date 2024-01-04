import { RouteLocationNormalized } from 'vue-router'
import { parseRouteArg } from './parseRouteArg'

export function parsePageQuery(route: RouteLocationNormalized): number {
    const pageString = parseRouteArg(route, 'query', 'page')
    if (!pageString) {
        return 1
    }

    const page = parseInt(pageString)
    if (isNaN(page)) {
        return 1
    }

    return page
}
