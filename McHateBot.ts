import * as dotenv from 'dotenv';
import * as readline from 'readline';

import login, { bot } from './commands/main/bot';
import setLocalization, { localizer } from './utils/localization';
import setLogger, { logger } from './utils/logger';
import setDiscardItemer, { discardItemer } from './utils/discarditem';
import { getConfig, getSettings, settings } from './utils/util';

// 全域變數
let reconnectAttempts = 0;
let isReconnecting = false; // 防止重複重連
const sd = require('silly-datetime');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

/**
 * 顯示歡迎旗幟在 console
 */
function showWelcomeBanner(): void {
    (localizer.format("WELCOME_BANNER", new Map().set("version", process.env.VERSION!)) as string[])
        .forEach((value) => {
            logger.l(value);
        });
}

/**
 * 處理 Bot 命令
 */
async function handleBotCommand(input: string, prefix: string): Promise<void> {
    const command = input.slice(prefix.length).trim();
    const args = command.split(/\s+/);
    
    console.log(`[控制台] 執行 bot 命令: ${command}`);
    
    switch (args[0]) {
        case "money":
        case "coin":
            bot.chat(`/money`);
            break;
            
        case "pay":
            if (args.length < 3) {
                console.log(`[控制台] 用法: ${prefix}pay <玩家ID> <金額>`);
                return;
            }
            const recipientId = args[1];
            const amount = parseInt(args[2], 10);
            if (isNaN(amount) || amount <= 0) {
                console.log(`[控制台] 金額必須是大於0的數字`);
                return;
            }
            bot.chat(`/pay ${recipientId} ${amount}`);
            console.log(`[控制台] 已轉帳 ${amount} 給 ${recipientId}`);
            break;
            
        case "throw":
            await discardItemer.discardAllItems();
            console.log(`[控制台] 已丟棄所有物品`);
            break;
            
        case "tpaccept":
        case "tpa":
            if (args.length < 2) {
                console.log(`[控制台] 用法: ${prefix}tpaccept <玩家ID>`);
                return;
            }
            bot.chat(`/tpaccept ${args[1]}`);
            console.log(`[控制台] 已接受來自 ${args[1]} 的傳送請求`);
            break;
            
        case "tpdeny":
        case "tpd":
            if (args.length < 2) {
                console.log(`[控制台] 用法: ${prefix}tpdeny <玩家ID>`);
                return;
            }
            bot.chat(`/tpdeny ${args[1]}`);
            console.log(`[控制台] 已拒絕來自 ${args[1]} 的傳送請求`);
            break;
            
        case "tp":
            if (args.length < 2) {
                console.log(`[控制台] 用法: ${prefix}tp <玩家ID>`);
                return;
            }
            bot.chat(`/tpa ${args[1]}`);
            console.log(`[控制台] 已發送傳送請求到 ${args[1]}`);
            break;
            
        case "partyaccept":
        case "pa":
            bot.chat(`/party accept`);
            console.log(`[控制台] 已接受隊伍邀請`);
            break;
            
        case "partydeny":
        case "pd":
            bot.chat(`/party deny`);
            console.log(`[控制台] 已拒絕隊伍邀請`);
            break;
            
        case "help":
            showBotHelp(prefix);
            break;

        case "version":
            console.log(`[控制台] Bot 版本: ${process.env.VERSION}`);
            console.log(`[控制台] 伺服器版本: ${bot?.version || '未知'}`);
            break;

        case "about":
            console.log("================== Bot 資訊 ==================");
            console.log(" Bot 名稱   : [McHateBot] 通用特製版機器人");
            console.log(` 作者名稱   : 創世`);
            console.log(` 作者Discord: I-love-minecraft#2437`);
            console.log(` 作者ID     : Forever_Hate`);
            console.log(" 有任何問題或回饋歡迎私訊我");
            console.log("==============================================");
            break;

        case "debug":
            console.log(`[調試] bot 物件存在: ${!!bot}`);
            console.log(`[調試] bot.username: ${bot?.username || 'undefined'}`);
            console.log(`[調試] bot 連線狀態: ${bot ? 'bot 物件存在' : 'bot 物件不存在'}`);
            if (bot) {
                console.log(`[調試] Bot 可用狀態: 已連線`);
            } else {
                console.log(`[調試] Bot 可用狀態: 未連線`);
            }
            break;
        case "stop":
        case "exit":
            console.log(`[控制台] Bot 將在 5 秒後關閉`);
            setTimeout(() => process.exit(0), 5000);
            break;
            
        case "reconnect":
            console.log(`[控制台] 手動重連中...`);
            bot.end();
            break;
            
        default:
            console.log(`[控制台] 未知的命令: ${args[0]}`);
            console.log(`[控制台] 輸入 ${prefix}help 查看可用命令`);
    }
}

/**
 * 顯示 Bot 幫助
 */
function showBotHelp(prefix: string): void {
    console.log(`=========== 控制台指令幫助 ===========`);
    console.log(`${prefix}about : 關於此 Bot`);
    console.log(`${prefix}coin/money : 查詢餘額`);
    console.log(`${prefix}debug : 顯示詳細調試資訊`);
    console.log(`${prefix}exit/stop : 關閉 Bot`);
    console.log(`${prefix}help : 顯示此幫助`);
    console.log(`${prefix}pa/partyaccept : 接受隊伍邀請`);
    console.log(`${prefix}pd/partydeny : 拒絕隊伍邀請`);
    console.log(`${prefix}pay <玩家> <金額> : 轉帳給指定玩家`);
    console.log(`${prefix}reconnect : 手動重連伺服器`);
    console.log(`${prefix}throw : 丟棄所有物品`);
    console.log(`${prefix}tp <玩家> : 請求傳送到玩家`);
    console.log(`${prefix}tpa/tpaccept <玩家> : 接受傳送請求`);
    console.log(`${prefix}tpd/tpdeny <玩家> : 拒絕傳送請求`);
    console.log(`${prefix}version : 查詢 Bot 版本`);
    console.log(`======================================`);
    console.log(`純文字: 發送聊天訊息`);
}

/**
 * 處理聊天訊息
 */
function handleChatMessage(input: string): void {
    console.log(`[控制台] 發送聊天訊息: ${input}`);
    bot.chat(input);
}

function setupConsoleInput(): void {
    // 移除現有的監聽器以避免重複
    rl.removeAllListeners('line');
    console.log(`[系統] 控制台輸入監聽器已設置，可以開始輸入命令`);
    rl.on('line', async (line: string) => {
        const input = line.trim();
        
        if (input.length === 0) return;
        
        const botCommandPrefix = settings.console_bot_command_prefix || '!';
        
        if (input.startsWith(botCommandPrefix)) {
            await handleBotCommand(input, botCommandPrefix);
        } else {
            handleChatMessage(input);
        }
    });
}

/**
 * 設置 Bot 事件監聽器
 */
function setupBotEventListeners(): void {
    console.log(`[調試] 正在設置 Bot 事件監聽器...`);
    console.log(`[調試] bot 物件狀態: ${!!bot}`);
    
    bot.once('spawn', () => {
        logger.i(`${localizer.format("LOADING_DONE")}`);
        showWelcomeBanner();
        console.log(`[調試] Bot 已成功 spawn 到伺服器`);
        console.log(`[調試] bot.username: ${bot.username}`);
        reconnectAttempts = 0; // 重置重連計數
        isReconnecting = false; // 重置重連旗標
        setupConsoleInput();
    });

    bot.on('resourcePack', (url: string, hash?: string) => {
        console.log(`伺服器請求下載資源包: URL: ${url}, Hash: ${hash || 'N/A'}`);
        bot.acceptResourcePack();
        console.log('已接受資源包請求。');
    });

    bot.on("message", (jsonMsg: any, position: string) => {
        if (position === 'game_info') return;
        console.log(`[伺服器訊息] ${jsonMsg.toAnsi()}`);
    });

    bot.once('kicked', (reason: any) => {
        const time = sd.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
        console.log(`[資訊] 客戶端被伺服器踢出 @${time}\n原因: ${reason.toString()}`);
        handleDisconnection('kicked', reason);
    });

    bot.once('end', (reason: any) => {
        const time = sd.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
        console.log(`[資訊] 客戶端與伺服器斷線 @${time}\n理由: ${reason?.toString() || '未知'}`);
        handleDisconnection('end', reason);
    });

    bot.on('error', (err: Error) => {
        console.error(`[錯誤] Bot 錯誤: ${err.message}`);
        logger.d(`Bot 錯誤: ${err.message}`);
    });
}

/**
 * 處理斷線情況
 */
function handleDisconnection(type: string, reason: any): void {
    if (isReconnecting) return;
    
    isReconnecting = true;
    if (!settings.auto_reconnect) {
        console.log(`[資訊] 自動重連已停用，Bot 將退出`);
        process.exit(1);
    }
    const maxAttempts = settings.max_reconnect_attempts;
    if (maxAttempts > 0 && reconnectAttempts >= maxAttempts) {
        console.log(`[錯誤] 已達到最大重連次數 (${maxAttempts})，Bot 將退出`);
        process.exit(1);
    }
    reconnectAttempts++;
    const delay = settings.reconnect_delay * 1000;
    console.log(`[資訊] 第 ${reconnectAttempts} 次重連嘗試，${settings.reconnect_delay} 秒後重新連線...`);
    setTimeout(() => {
        connect();
    }, delay);
}

/**
 * 主要連線函數
 */
function connect(): void {
    logger.i("開始連線到伺服器");
    
    // 重置重連旗標，允許下次重連
    isReconnecting = false;
    
    try {
        login();
        setupBotEventListeners();
    } catch (error) {
        console.error(`[錯誤] 連線失敗: ${error}`);
        handleDisconnection('connection_error', error);
    }
}

/**
 * 初始化應用程式
 */
function initialize(): void {
    try {
        // 載入設定
        dotenv.config();
        getConfig();
        getSettings();
        // 設置服務
        setLogger();
        setLocalization();
        setDiscardItemer();

        console.log(`[系統] McHateBot 啟動中...`);
        console.log(`[系統] 自動重連: ${settings.auto_reconnect ? '啟用' : '停用'}`);
        if (settings.auto_reconnect) {
            console.log(`[系統] 重連延遲: ${settings.reconnect_delay} 秒`);
            console.log(`[系統] 最大重連次數: ${settings.max_reconnect_attempts === -1 ? '無限制' : settings.max_reconnect_attempts}`);
        }
        
        console.log(`[系統] 正在連線到伺服器，請等待 Bot spawn 後再輸入命令...`);
        
        connect();
        
    } catch (err) {
        console.error(`[致命錯誤] 初始化失敗:`, err);
        console.log('程式將在 10 秒後退出...');
        setTimeout(() => {
            logger.writeErrorLog(err);
            process.exit(1);
        }, 10000);
    }
}

// 優雅關閉處理
process.on('SIGINT', () => {
    console.log('\n[系統] 接收到中斷信號，正在關閉 Bot...');
    if (bot && bot.end) {
        bot.end();
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n[系統] 接收到終止信號，正在關閉 Bot...');
    if (bot && bot.end) {
        bot.end();
    }
    process.exit(0);
});

// 啟動應用程式
initialize();
