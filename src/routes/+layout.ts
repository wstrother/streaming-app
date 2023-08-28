export const ssr = false

export function load() {
    return {
        inOBS: Boolean(window?.obsstudio)
    }
}