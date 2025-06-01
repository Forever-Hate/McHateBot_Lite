//config檔
export interface Config {
    readonly ip: string,
    readonly port: number,
    readonly username: string,
    readonly version:string,
    readonly auth: string,
    readonly language: string
}
//setting檔
export interface Setting {
    readonly console_bot_command_prefix: string;
    // 自動重連設定
    readonly auto_reconnect: boolean;
    readonly reconnect_delay: number;
    readonly max_reconnect_attempts: number;
}
// 語言檔
export interface Language {
    [key: string]: string | string[];
    readonly LOADING_DONE: string;
    readonly WELCOME_BANNER: string[];
    readonly VERSION: string;
    readonly ABOUT: string[];
}