import type { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@layouts/MainLayout.vue'),
        children: [
            {
                path: '/',
                component: () => import('@pages/Home/HomePage.vue'),
            },
            {
                path: '/banner/:bannerType',
                component: () => import('@pages/Banner/BannerPage.vue'),
                props: true,
            },
            {
                path: '/help',
                component: () => import('@pages/Help/HelpPage.vue'),
            },
            {
                path: '/settings',
                component: () => import('@pages/Settings/SettingsPage.vue'),
            },
            {
                path: '/:pathMatch(.*)*',
                component: () => import('@pages/Error/404Page.vue'),
            },
        ],
    },
]
