export interface Config {
    alphabet: string
    base64: boolean
}

export const ALPHABET = "abcdefghijklmnopqrstuvwxyzåäö0123456789 .,!?';:\"()-"
export const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

export function get_default_config(): Config {
    return {
        alphabet: ALPHABET,
        base64: false,
    }
}