import { RouteRecordRaw } from 'vue-router'

export enum RouteName {
    Home = 'Home',
    Error404 = 'Error404',
}

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/renderer/client/layouts/MainLayout.vue'),
        children: [
            {
                name: RouteName.Home,
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
                name: RouteName.Error404,
                path: '/:pathMatch(.*)*',
                component: () => import('@/renderer/client/pages/Error/404Page.vue'),
            },
        ],
    },
]
