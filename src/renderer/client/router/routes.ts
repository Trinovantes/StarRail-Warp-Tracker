import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/renderer/client/layouts/MainLayout.vue'),
        children: [
            {
                path: '/',
                component: () => import('@/renderer/client/pages/Home/HomePage.vue'),
            },
            {
                path: '/banner/:bannerType',
                component: () => import('@/renderer/client/pages/Banner/BannerPage.vue'),
                props: true,
            },
            {
                path: '/help',
                component: () => import('@/renderer/client/pages/Help/HelpPage.vue'),
            },
            {
                path: '/settings',
                component: () => import('@/renderer/client/pages/Settings/SettingsPage.vue'),
            },
            {
                path: '/:pathMatch(.*)*',
                component: () => import('@/renderer/client/pages/Error/404Page.vue'),
            },
        ],
    },
]
