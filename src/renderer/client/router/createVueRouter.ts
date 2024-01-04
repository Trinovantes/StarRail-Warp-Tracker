import { createRouter, createWebHashHistory, Router } from 'vue-router'
import { routes } from './routes'

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

export function createVueRouter(): Router {
    const router = createRouter({
        history: createWebHashHistory(),
        routes,
    })

    return router
}
