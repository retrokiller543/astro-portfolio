export interface ConfigRequest {
    get_default: boolean;
    get_base64: boolean;
}

export interface Config {
    alphabet: string;
    base64: boolean;
}

export interface ConfigResponse {
    config: Config;
}

export interface CaesarRequest {
    input: string;
    key: number;
    config: Config;
}

export interface CaesarResponse {
    output: string;
}