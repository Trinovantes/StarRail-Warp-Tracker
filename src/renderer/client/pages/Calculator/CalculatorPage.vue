<script lang="ts" setup>
import { computed, ref } from 'vue'
import { calculateWarps } from './calculateWarps.ts'
import { GACHA_BANNER_TYPE_COLLAB_CHARACTER, GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE, GACHA_BANNER_TYPE_LIMITED_CHARACTER, GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE } from '../../../../common/StarRail.ts'
import { useTrackerStore } from '../../store/Tracker/useTrackerStore.ts'

const numWarps = ref(0)
const numSimulations = ref(10000)

const numCharacters = ref(0)
const numLightCones = ref(0)
const numCollabCharacters = ref(0)
const numCollabLightCones = ref(0)

const isValidInput = computed(() => numWarps.value > 0 && (numCharacters.value + numLightCones.value + numCollabCharacters.value + numCollabLightCones.value) > 0)

const trackerStore = useTrackerStore()
const calculationResult = ref<number | null>(null)
const calculate = () => {
    const probability = calculateWarps({
        numWarps: numWarps.value,
        numSimulations: numSimulations.value,
        bannerHistories: trackerStore.bannerHistories,
        desiredCopies: {
            [GACHA_BANNER_TYPE_LIMITED_CHARACTER]: numCharacters.value,
            [GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE]: numLightCones.value,
            [GACHA_BANNER_TYPE_COLLAB_CHARACTER]: numCollabCharacters.value,
            [GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE]: numCollabLightCones.value,
        },
    })

    calculationResult.value = probability
}
</script>

<template>
    <article>
        <h1>
            Warp Calculator
        </h1>

        <section>
            <q-form
                @submit="calculate"
                class="flex-vgap"
            >
                <q-input
                    v-model.number="numWarps"
                    label="Warps"
                    hint="Number of warps to spend"
                    class="flex-1"
                    filled
                    square
                    lazy-rules
                    hide-bottom-space
                    :rules="[ val => !isNaN(val) && val > 0 || 'Invalid number of warps']"
                />

                <q-input
                    v-model.number="numSimulations"
                    label="Simulations"
                    hint="Number of simulations to run"
                    class="flex-1"
                    filled
                    square
                    lazy-rules
                    hide-bottom-space
                    :rules="[ val => !isNaN(val) && val > 0 || 'Invalid number of simulations']"
                />

                <div class="flex-hgap">
                    <q-input
                        v-model.number="numCharacters"
                        label="Limited Characters"
                        hint="Number of limited characters desired"
                        class="flex-1"
                        filled
                        square
                        lazy-rules
                        hide-bottom-space
                    />
                    <q-input
                        v-model.number="numLightCones"
                        label="Limited Light Cones"
                        hint="Number of limited light cones desired"
                        class="flex-1"
                        filled
                        square
                        lazy-rules
                        hide-bottom-space
                    />
                </div>

                <div class="flex-hgap">
                    <q-input
                        v-model.number="numCollabCharacters"
                        label="Collab Characters"
                        hint="Number of collab characters desired"
                        class="flex-1"
                        filled
                        square
                        lazy-rules
                        hide-bottom-space
                    />
                    <q-input
                        v-model.number="numCollabLightCones"
                        label="Collab Light Cones"
                        hint="Number of collab light cones desired"
                        class="flex-1"
                        filled
                        square
                        lazy-rules
                        hide-bottom-space
                    />
                </div>

                <div>
                    <q-btn
                        type="submit"
                        label="Run"
                        color="positive"
                        :disable="!isValidInput"
                        unelevated
                    />
                </div>
            </q-form>

            <div
                v-if="calculationResult !== null"
                class="result"
            >
                <p>
                    This is the probability of obtaining
                    <strong>{{ numCharacters }}</strong> limited characters,
                    <strong>{{ numLightCones }}</strong> limited light cones,
                    <strong>{{ numCollabCharacters }}</strong> collab characters,
                    and
                    <strong>{{ numCollabLightCones }}</strong> collab light cones
                    within
                    <strong>{{ numWarps }}</strong> pulls
                </p>

                <div class="probability">
                    {{ calculationResult.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }) }}
                </div>
            </div>
        </section>
    </article>
</template>

<style lang="scss" scoped>
.result{
    p{
        color: #ccc;

        strong{
            color: white;
        }
    }

    .probability{
        border-radius: 8px;
        background-color: $positive;
        color: white;
        font-size: 3rem;
        font-weight: bold;
        padding: $padding * 4;
        text-align: center;
    }
}
</style>
