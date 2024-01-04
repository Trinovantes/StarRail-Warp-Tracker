import { Notify } from 'quasar'

export function notifyError(errorName: string, callStack?: string): void {
    let message = `<h6 class="no-margin">${errorName}</h6>`
    if (callStack) {
        message += `<pre class="q-mt-sm q-mb-none gt-sm">${callStack}</pre>`
    }

    const dismiss = Notify.create({
        type: 'negative',
        textColor: 'white',
        icon: 'error',
        timeout: 0,
        html: true,
        message,
        actions: [
            {
                icon: 'close',
                round: true,
                textColor: 'white',
                handler: () => {
                    dismiss()
                },
            },
        ],
    })
}
