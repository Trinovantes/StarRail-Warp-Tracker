<script lang="ts" setup>
import { WINDOW_IPC_ACTION } from '../../../../main/ipc/Window/WindowIpcAction.ts'

const openGitHub = () => {
    void window.api[WINDOW_IPC_ACTION.OPEN_GITHUB]()
}

const openLogsDir = () => {
    void window.api[WINDOW_IPC_ACTION.OPEN_LOGS_DIR]()
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
                Application Logs
            </h2>

            <div class="flex-hspace">
                <q-btn
                    label="Open Logs Directory"
                    unelevated
                    color="info"
                    no-caps
                    icon="open_in_new"
                    @click="openLogsDir"
                />
            </div>

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
