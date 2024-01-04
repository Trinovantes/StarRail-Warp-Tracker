<script lang="ts" setup>
import { IpcWindowAction } from '@/main/ipc/window/IpcWindowAction'

const openGitHub = () => {
    void window.api[IpcWindowAction.OPEN_GITHUB]()
}
</script>

<template>
    <article>
        <h1>
            Help
        </h1>

        <section>
            <h2>
                Instructions
            </h2>

            <ol>
                <li>
                    Open Honkai StarRail on PC and open your in-game Warp Records
                </li>
                <li>
                    Go to the banner category in the sidebar and click the refresh button
                </li>
            </ol>

            <h2>
                Source Code
            </h2>

            <div class="flex-hspace">
                <q-btn
                    label="GitHub"
                    unelevated
                    color="info"
                    no-caps
                    icon="open_in_new"
                    @click="openGitHub"
                />
            </div>
        </section>
    </article>
</template>
