import { writable } from 'svelte/store'

export const switchToLogin = writable(true)
export const isAuthorized = writable(false)