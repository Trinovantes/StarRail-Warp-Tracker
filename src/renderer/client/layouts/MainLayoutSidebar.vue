<script lang="ts" setup>
import { ALL_GACHA_BANNERS } from '@/common/StarRail'
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
            v-for="gachaBanner of ALL_GACHA_BANNERS"
            :key="gachaBanner.type"
            v-ripple
            :to="`/banner/${gachaBanner.type}`"
            clickable
        >
            <q-item-section avatar>
                <q-avatar>
                    <q-icon :name="gachaBanner.icon" />
                </q-avatar>
            </q-item-section>

            <q-item-section>
                <q-item-label>
                    {{ gachaBanner.label }}
                </q-item-label>

                <q-item-label caption>
                    {{ gachaBanner.caption }}
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
