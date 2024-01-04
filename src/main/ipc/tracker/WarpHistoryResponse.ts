import { WarpBannerType, WarpItemType } from '@/common/StarRail'
import { Type, Static } from '@sinclair/typebox'
import { Value, ValueError } from '@sinclair/typebox/value'

const tbWarpHistoryItem = Type.Object({
    id: Type.String(),
    uid: Type.String(),

    gacha_id: Type.String(),
    gacha_type: Type.Union(Object.values(WarpBannerType).map((v) => Type.Literal(v))),

    count: Type.String(),
    item_id: Type.String(),
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

export type WarpHistoryResponse = Static<typeof tbWarpHistoryResponse>

export function isWarpHistoryResponse(obj: unknown): obj is WarpHistoryResponse {
    return Value.Check(tbWarpHistoryResponse, obj)
}

export function getWarpHistoryResponseValidationErrors(obj: unknown): Array<ValueError> {
    return [...Value.Errors(tbWarpHistoryResponse, obj)]
}
