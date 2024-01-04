<script lang="ts" setup>
import { WarpBannerType } from '@/common/StarRail'

type AppRoute = {
    label: string
    caption?: string
    thumbnail: string
    route: string
}

const routes: Array<AppRoute> = [
    {
        label: 'Character',
        caption: 'Limited banner',
        thumbnail: 'person',
        route: `/banner/${WarpBannerType.EventCharacter}`,
    },
    {
        label: 'Light Cone',
        caption: 'Limited banner',
        thumbnail: 'smartphone',
        route: `/banner/${WarpBannerType.EventLightCone}`,
    },
    {
        label: 'Departure Warp',
        caption: 'Beginner 50-pull banner',
        thumbnail: 'play_circle',
        route: `/banner/${WarpBannerType.Departure}`,
    },
    {
        label: 'Stellar Warp',
        caption: 'Permanent banner',
        thumbnail: 'confirmation_number',
        route: `/banner/${WarpBannerType.StellarWarp}`,
    },
]
</script>

<template>
    <q-list>
        <q-item
            v-ripple
            to="/"
            exact
            clickable
        >
            <q-item-section avatar>
                <q-avatar>
                    <q-icon
                        name="home"
                    />
                </q-avatar>
            </q-item-section>

            <q-item-section>
                Overview
            </q-item-section>
        </q-item>

        <q-item
            v-for="route of routes"
            :key="route.route"
            v-ripple
            :to="route.route"
            clickable
        >
            <q-item-section avatar>
                <q-avatar>
                    <img
                        v-if="route.thumbnail.startsWith('http')"
                        :src="route.thumbnail"
                    >
                    <q-icon
                        v-else
                        :name="route.thumbnail"
                    />
                </q-avatar>
            </q-item-section>

            <q-item-section>
                <q-item-label>
                    {{ route.label }}
                </q-item-label>

                <q-item-label
                    v-if="route.caption"
                    caption
                >
                    {{ route.caption }}
                </q-item-label>
            </q-item-section>
        </q-item>

        <div class="flex-1" />

        <q-item
            v-ripple
            to="/help"
            clickable
        >
            <q-item-section avatar>
                <q-avatar>
                    <q-icon
                        name="question_mark"
                    />
                </q-avatar>
            </q-item-section>

            <q-item-section>
                Help
            </q-item-section>
        </q-item>

        <q-item
            v-ripple
            to="/settings"
            clickable
        >
            <q-item-section avatar>
                <q-avatar>
                    <q-icon
                        name="settings"
                    />
                </q-avatar>
            </q-item-section>

            <q-item-section>
                Settings
            </q-item-section>
        </q-item>
    </q-list>
</template>

<style lang="scss" scoped>
.q-list{
    background: $dark;
    display: flex;
    flex-direction: column;
    height: calc(100vh - $frame-bar-height);
    min-height: 300px;

    .q-avatar{
        img{
            background: #111;
        }
    }
}
</style>
