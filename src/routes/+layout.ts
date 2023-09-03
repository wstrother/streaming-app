export const ssr = false

export function load() {
    return {
        // @ts-ignore
        inOBS: Boolean(window?.obsstudio)
    }
}