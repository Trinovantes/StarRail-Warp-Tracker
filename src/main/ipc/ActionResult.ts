export type ActionResult<T> = {
    success: true
    data: T
} | {
    success: false
    message: string
    stack?: string
}
