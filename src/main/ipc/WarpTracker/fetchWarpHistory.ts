import { APP_NAME } from '@/common/Constants'
import { Warp } from '@/main/db/models/Warp'
import { LogFunctions } from 'electron-log'
import { BannerId, ItemId, Rarity, UserId, GachaBannerType, WarpId, WarpItemType } from '@/common/StarRail'
import { Type, Static } from '@sinclair/typebox'
import { Value, ValueError } from '@sinclair/typebox/value'

// ----------------------------------------------------------------------------
// Response Validation
// ----------------------------------------------------------------------------

const tbWarpHistoryItem = Type.Object({
    id: Type.Unsafe<WarpId>(Type.String()),
    uid: Type.Unsafe<UserId>(Type.String()),

    gacha_id: Type.Unsafe<BannerId>(Type.String()),
    gacha_type: Type.Union(Object.values(GachaBannerType).map((v) => Type.Literal(v))),

    count: Type.String(),
    item_id: Type.Unsafe<ItemId>(Type.String()),
    item_type: Type.Union(Object.values(WarpItemType).map((v) => Type.Literal(v))),
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
// Export
// ----------------------------------------------------------------------------

export async function fetchWarpHistory(bannerType: GachaBannerType, authKey: string, endId?: string, logger?: LogFunctions): Promise<Array<Warp>> {
    const url = new URL('https://api-os-takumi.mihoyo.com/common/gacha_record/api/getGachaLog')
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
        const errMsg = '(-101) authKey has expired (check Warp Records in-game to refresh authKey)'
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }
    if (response.retcode !== 0) {
        const errMsg = `(${response.retcode}) Mihoyo server error (${response.retcode}) "${response.message}"`
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }
    if (!response.data) {
        const errMsg = 'Missing data in Mihoyo response'
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    const timeZone = `GMT${response.data.region_time_zone}`
    if (!/GMT[+-]\d{1,2}/.test(timeZone)) {
        const errMsg = 'Invalid timeZone in Mihoyo response'
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    return response.data.list.map((warp) => {
        const time = `${warp.time} ${timeZone}`

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
