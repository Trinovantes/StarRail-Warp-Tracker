<script lang="ts" setup>
import MainLayoutFrameBar from './MainLayoutFrameBar.vue'
import MainLayoutSidebar from './MainLayoutSidebar.vue'
</script>

<template>
    <div class="app">
        <MainLayoutFrameBar />

        <main>
            <q-scroll-area>
                <MainLayoutSidebar />
            </q-scroll-area>

            <q-scroll-area>
                <router-view />
            </q-scroll-area>
        </main>
    </div>
</template>

<style lang="scss" scoped>
.app{
    height: 100vh;
    display: grid;
    grid-template-rows: $frame-bar-height 1fr;

    main{
        display: grid;
        grid-template-columns: 300px 1fr;

        > div{
            height: 100%;
        }
    }
}
</style>
