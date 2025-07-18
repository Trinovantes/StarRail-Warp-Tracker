import { APP_NAME, FETCH_DELAY } from '@/common/Constants'
import { existsWarp, insertWarp, Warp } from '@/common/db/models/Warp'
import { BannerId, ItemId, Rarity, UserId, GachaBannerType, WarpId, ALL_GACHA_BANNERS, ALL_GACHA_ITEM_TYPES, GACHA_BANNER_TYPE_COLLAB_CHARACTER, GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE } from '@/common/StarRail'
import { Type, Static } from '@sinclair/typebox'
import { Value, ValueError } from '@sinclair/typebox/value'
import { ExpiredAuthKeyError } from '@/common/node/ExpectedError'
import { DbLogger, DrizzleClient } from '@/common/db/createDb'
import { selectSetting } from '@/common/db/models/Setting'
import { getAuthKey } from './getAuthKey'
import { sleep } from '@/common/utils/sleep'

// ----------------------------------------------------------------------------
// Response Validation
// ----------------------------------------------------------------------------

const tbWarpHistoryItem = Type.Object({
    id: Type.Unsafe<WarpId>(Type.String()),
    uid: Type.Unsafe<UserId>(Type.String()),

    gacha_id: Type.Unsafe<BannerId>(Type.String()),
    gacha_type: Type.Union(ALL_GACHA_BANNERS.map((banner) => Type.Literal(banner.type))),

    count: Type.String(),
    item_id: Type.Unsafe<ItemId>(Type.String()),
    item_type: Type.Union(ALL_GACHA_ITEM_TYPES.map((warpType) => Type.Literal(warpType))),
    rank_type: Type.String(),
    name: Type.String(),
    lang: Type.String(),

    time: Type.String(),
})

const tbWarpHistoryResponse = Type.Object({
    data: Type.Union([
        Type.Null(),
        Type.Object({
            page: Type.String(),
            size: Type.String(),
            list: Type.Array(tbWarpHistoryItem),
            region: Type.String(),
            region_time_zone: Type.Number(),
        }),
    ]),
    message: Type.String(),
    retcode: Type.Number(),
}, {
    additionalProperties: false,
})

type WarpHistoryResponse = Static<typeof tbWarpHistoryResponse>

function isWarpHistoryResponse(obj: unknown): obj is WarpHistoryResponse {
    return Value.Check(tbWarpHistoryResponse, obj)
}

function getWarpHistoryResponseValidationErrors(obj: unknown): Array<ValueError> {
    return [...Value.Errors(tbWarpHistoryResponse, obj)]
}

// ----------------------------------------------------------------------------
// Fetch
// ----------------------------------------------------------------------------

export async function fetchWarpHistory(db: DrizzleClient, bannerType: GachaBannerType, logger?: DbLogger) {
    const gameDir = selectSetting(db, 'GAME_INSTALL_DIR')
    if (!gameDir) {
        const errMsg = 'Missing game install directory setting'
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    const isWsl = Boolean(process.env.WSL_DISTRO_NAME)
    const authKey = getAuthKey(gameDir, isWsl, logger)

    let endId: WarpId | null = null
    while (true) {
        const warps = await fetchWarps(bannerType, authKey, endId, logger)

        // If last id already exists in db, then we can stop fetching
        endId = warps.at(-1)?.id ?? null
        const lastWarpAlreadySaved = existsWarp(db, endId)
        logger?.info(`Fetched ${warps.length} Warp Records endId:${endId} lastWarpAlreadySaved:${lastWarpAlreadySaved}`)

        // Always save results (ignores conflicts)
        for (const warp of warps) {
            insertWarp(db, warp)
        }

        if (warps.length === 0) {
            break
        }
        if (lastWarpAlreadySaved) {
            break
        }

        await sleep(FETCH_DELAY)
    }
}

async function fetchWarps(bannerType: GachaBannerType, authKey: string, endId: WarpId | null, logger?: DbLogger): Promise<Array<Warp>> {
    const url = new URL(getGachaLogUrl(bannerType))
    url.searchParams.append('size', '20')
    url.searchParams.append('game_biz', 'hkrpg_global')
    url.searchParams.append('lang', 'en')
    url.searchParams.append('gacha_type', bannerType.toString())
    url.searchParams.append('authkey', authKey)
    url.searchParams.append('authkey_ver', '1')

    if (endId) {
        url.searchParams.append('end_id', endId)
    }

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'User-Agent': APP_NAME,
        },
    })
    if (res.status !== 200) {
        const errMsg = `Failed to fetch warp history (${res.status})`
        logger?.warn(errMsg)
        logger?.warn(await res.text())
        throw new Error(errMsg)
    }

    const response = await res.json() as unknown
    if (!isWarpHistoryResponse(response)) {
        const errMsg = 'Invalid response from Mihoyo servers'
        logger?.warn(errMsg)
        logger?.warn(getWarpHistoryResponseValidationErrors(response))
        throw new Error(errMsg)
    }
    if (response.retcode === -101) {
        const errMsg = `(${response.retcode}) authKey has expired`
        logger?.warn(errMsg)
        throw new ExpiredAuthKeyError()
    }
    if (response.retcode !== 0) {
        const errMsg = `(${response.retcode}) Mihoyo server error "${response.message}"`
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }
    if (!response.data) {
        const errMsg = 'Missing data in Mihoyo response'
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    const timeZone = response.data.region_time_zone
    const timeZoneGmt = timeZone < 0
        ? `GMT-${Math.abs(timeZone)}`
        : `GMT+${timeZone}`

    if (!/GMT[+-]\d{1,2}/.test(timeZoneGmt)) {
        const errMsg = `Invalid timeZone "${timeZone}" in Mihoyo response`
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    return response.data.list.map((warp) => {
        const time = `${warp.time} ${timeZoneGmt}`

        const rarity = parseInt(warp.rank_type)
        if (isNaN(rarity) || !(rarity === 3 || rarity === 4 || rarity === 5)) {
            const errMsg = `Failed to parse rarity "${warp.rank_type}"`
            logger?.warn(errMsg)
            throw new Error(errMsg)
        }

        return {
            id: warp.id,
            uid: warp.uid,

            bannerId: warp.gacha_id,
            bannerType: warp.gacha_type,

            itemId: warp.item_id,
            itemType: warp.item_type,
            itemName: warp.name,
            rarity: rarity as Rarity,

            pulledAt: time,
        }
    })
}

function getGachaLogUrl(bannerType: GachaBannerType): string {
    switch (bannerType) {
        case GACHA_BANNER_TYPE_COLLAB_CHARACTER:
        case GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE:
            return 'https://public-operation-hkrpg-sg.hoyoverse.com/common/gacha_record/api/getLdGachaLog'

        default:
            return 'https://public-operation-hkrpg-sg.hoyoverse.com/common/gacha_record/api/getGachaLog'
    }
}
