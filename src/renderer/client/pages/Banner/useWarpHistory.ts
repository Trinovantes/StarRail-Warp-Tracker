import { useQuasar } from 'quasar'
import { notifySuccess } from '../../utils/notifySuccess'
import { useTrackerStore } from '../../store/Tracker/useTrackerStore'
import { GachaBannerType } from '@/common/StarRail'
import { Ref } from 'vue'
import { notifyError } from '../../utils/notifyError'
import type { IpcActionResult } from '@/main/ipc/registerIpcActionHandlers'

export function useWarpHistory(bannerType: Ref<GachaBannerType>) {
    const trackerStore = useTrackerStore()
    const $q = useQuasar()
    const handleRes = (res: IpcActionResult, successMsg: string) => {
        if (res.success) {
            notifySuccess(successMsg)
        } else if (!res.errMsg) {
            notifyError(res.errTitle, res.errStack)
        } else {
            $q.dialog({
                title: res.errTitle,
                message: res.errMsg,
                persistent: true,
            })
        }
    }

    const refreshHistory = () => {
        const run = async() => {
            $q.loading.show()
            const res = await trackerStore.refreshWarpHistory(bannerType.value)
            $q.loading.hide()
            handleRes(res, 'Fetched latest warp history')
        }

        void run()
    }

    const clearHistory = () => {
        const run = async() => {
            $q.loading.show()
            const res = await trackerStore.clearWarpHistory(bannerType.value)
            $q.loading.hide()
            handleRes(res, 'Cleared local data')
        }

        $q.dialog({
            title: 'Confirm Clear Warp History',
            message: 'Are you sure you wish to clear your warp history for this banner?',
            cancel: true,
        }).onOk(() => {
            void run()
        })
    }

    return {
        refreshHistory,
        clearHistory,
    }
}
