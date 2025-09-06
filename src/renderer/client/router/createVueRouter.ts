import { createRouter, createWebHashHistory, type Router } from 'vue-router'
import { routes } from './routes.ts'

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
