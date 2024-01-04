import { Notify } from 'quasar'

export function notifySuccess(msg: string) {
    const dismiss = Notify.create({
        message: msg,
        type: 'positive',
        position: 'bottom',
        group: false,
        actions: [
            {
                icon: 'close',
                color: 'white',
                round: true,
                handler: () => {
                    dismiss()
                },
            },
        ],
    })
}
