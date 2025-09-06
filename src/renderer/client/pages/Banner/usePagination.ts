import { type Ref, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { parsePageQuery } from '../../router/parsePageQuery.ts'

type Exports = {
    currentPage: Ref<number>
    onPaginationChange: (newPage: number) => Promise<void>

    maxPages: Ref<number>
    updateMaxPage: (numResults: number) => void
}

export function usePagination(queryLimit: number): Exports {
    const router = useRouter()
    const initPage = router.currentRoute.value.path
    const isOnSamePage = computed(() => router.currentRoute.value.path === initPage)

    const currentPage = ref(1) // Source of truth
    const maxPages = ref(0) // Source of truth
    const updateMaxPage = (numResults: number) => {
        maxPages.value = Math.ceil(numResults / queryLimit)
    }

    const onPaginationChange = async (newPage: number) => {
        if (!isOnSamePage.value) {
            return
        }

        const query = {
            ...router.currentRoute.value.query,
            page: newPage,
        }

        console.info(`usePagination:${String(initPage)} exporting`, currentPage.value, JSON.stringify(query))
        await router.push({ query })
        window.scroll(0, 0)
    }

    const currentQuery = computed(() => router.currentRoute.value.query)
    watch(currentQuery, () => {
        if (!isOnSamePage.value) {
            return
        }

        const currentPageQuery = parsePageQuery(router.currentRoute.value)
        if (currentPageQuery === currentPage.value) {
            return
        }

        console.info(`usePagination:${String(initPage)} importing`, currentPageQuery)
        currentPage.value = currentPageQuery
    }, {
        immediate: true,
    })

    return {
        currentPage,
        onPaginationChange,

        maxPages,
        updateMaxPage,
    }
}
