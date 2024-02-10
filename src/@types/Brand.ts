// https://egghead.io/blog/using-branded-types-in-typescript
declare const brand: unique symbol

export type Brand<T, B> = T & {
    [brand]: B
}
