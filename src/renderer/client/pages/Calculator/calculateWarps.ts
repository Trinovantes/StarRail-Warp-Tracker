import { GACHA_BANNER_TYPE_COLLAB_CHARACTER, GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE, GACHA_BANNER_TYPE_LIMITED_CHARACTER, GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE, get5StarRate, getCoinFlipChance, type GachaBannerType } from '../../../../common/StarRail.ts'
import type { BannerHistory } from '../../../../main/ipc/WarpTracker/parseWarps.ts'

export type WarpCalculatorOptions = {
    numWarps: number
    numSimulations: number
    bannerHistories: Partial<Record<GachaBannerType, BannerHistory | null>>
    desiredCopies: Partial<Record<GachaBannerType, number>>
}

export type WarpCalculatorResult = {
    probability: number
    opts: Pick<WarpCalculatorOptions, 'numWarps' | 'desiredCopies'>
}

export function calculateWarps(opts: WarpCalculatorOptions): WarpCalculatorResult {
    let numSuccess = 0

    for (let simulation = 0; simulation < opts.numSimulations; simulation++) {
        const isSuccess = calculateWarpsOnce(opts)
        if (isSuccess) {
            numSuccess += 1
        }
    }

    return {
        probability: numSuccess / opts.numSimulations,
        opts: {
            numWarps: opts.numWarps,
            desiredCopies: structuredClone(opts.desiredCopies),
        },
    }
}

function calculateWarpsOnce(opts: WarpCalculatorOptions): boolean {
    let numWarps = opts.numWarps

    const simulatedBannerTypes = [
        GACHA_BANNER_TYPE_LIMITED_CHARACTER,
        GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE,
        GACHA_BANNER_TYPE_COLLAB_CHARACTER,
        GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE,
    ]

    for (const bannerType of simulatedBannerTypes) {
        const coinFlipChance = getCoinFlipChance(bannerType)

        let curr5StarPity = opts.bannerHistories[bannerType]?.star5Pity ?? 0
        let next5StarIsCoinFlip = opts.bannerHistories[bannerType]?.nextIs5050 ?? true
        let copiesNeeded = opts.desiredCopies?.[bannerType] ?? 0

        while (numWarps > 0 && copiesNeeded > 0) {
            numWarps -= 1
            curr5StarPity += 1

            const currRate = get5StarRate(curr5StarPity, bannerType)
            const obtained5Star = Math.random() < currRate

            if (obtained5Star) {
                const isRateUp5Star = next5StarIsCoinFlip
                    ? Math.random() < coinFlipChance
                    : true

                if (isRateUp5Star) {
                    copiesNeeded -= 1
                    next5StarIsCoinFlip = true
                } else {
                    next5StarIsCoinFlip = false
                }

                curr5StarPity = 0
            }
        }

        if (copiesNeeded > 0) {
            return false
        }
    }

    return true
}
