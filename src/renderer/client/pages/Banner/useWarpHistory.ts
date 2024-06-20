import { useQuasar } from 'quasar'
import { notifyError } from '../../utils/notifyError'
import { notifySuccess } from '../../utils/notifySuccess'
import { useTrackerStore } from '../../store/Tracker/useTrackerStore'
import { GachaBannerType } from '@/common/StarRail'
import { Ref } from 'vue'

export function useWarpHistory(bannerType: Ref<GachaBannerType>) {
    const trackerStore = useTrackerStore()
    const $q = useQuasar()

    const fetchWarpHistory = async() => {
        try {
            $q.loading.show()
            await trackerStore.fetchWarpHistory(bannerType.value)
            notifySuccess('Fetched latest warp history')
        } catch (err) {
            const errMsg = (err instanceof Error) ? err.message : String(err)
            const stack = (err instanceof Error) ? err.stack : undefined

            if (errMsg.startsWith('(-101)')) {
                $q.dialog({
                    title: 'Authentication Key Expired',
                    message: 'Please check your in-game Warp Records to generate a new authentication key',
                    persistent: true,
                })
            } else {
                notifyError(errMsg, stack)
            }
        } finally {
            $q.loading.hide()
        }
    }

    const clearWarpHistory = () => {
        const clear = async() => {
            $q.loading.show()
            await trackerStore.clearWarpHistory(bannerType.value)
            $q.loading.hide()
            notifySuccess('Cleared local data')
        }

        $q.dialog({
            title: 'Confirm Clear Warp History',
            message: 'Are you sure you wish to clear your warp history for this banner?',
            cancel: true,
        }).onOk(() => {
            void clear()
        })
    }

    return {
        fetchWarpHistory,
        clearWarpHistory,
    }
}
