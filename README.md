# McHateBot 通用特製版

![CC BY-NC-SA 4.0](https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png)

## 介紹
McHateBot 通用特製版是一款專為 Minecraft 伺服器自動化設計的輕量級機器人，支援自動重連、控制台指令、簡易經濟互動與自動丟棄物品等功能。適合需要穩定掛機、簡單自動化操作的玩家。

- 支援 Microsoft 帳號登入
- 控制台即時輸入指令與聊天
- 自動重連與最大重連次數限制
- 支援多語言（預設 zh-tw）

## 安裝與啟動

### 方式一：直接執行 EXE（推薦給一般使用者）
1. 前往 [Release 頁面](https://github.com/Forever-Hate/McHateBot_Lite/releases) 下載壓縮檔。
2. 將 `config.json` 與 `settings.json` 依需求編輯內容。
3. 直接執行 `mchatebot_lite.exe`。

### 方式二：專案原始碼執行（進階/開發者）
1. 下載本專案並安裝依賴：
   ```sh
   pnpm install
   ```
2. 編輯 `config-orginal.json` 與 `settings-orginal.json`，並分別改名為 `config.json` 與 `settings.json`，填入你的帳號、伺服器資訊與設定。
3. 將 TypeScript 編譯成 JavaScript：
   ```sh
   pnpm run build
   # 或直接執行 ts-node
   npx ts-node McHateBot.ts
   ```
4. 啟動 Bot：
   ```sh
   pnpm start
   # 或直接執行 node
   node out/McHateBot.js
   ```

## 主要指令
在控制台輸入（預設前綴為 "!"，可自行修改）：

```
!about               顯示 Bot 資訊橫幅
!coin/!money         查詢餘額(執行指令/money)
!debug               顯示詳細調試資訊
!exit/!stop          關閉 Bot
!help                顯示指令幫助
!pa/!partyaccept     接受隊伍邀請(執行指令/party accept)
!pd/!partydeny       拒絕隊伍邀請(執行指令/party deny)
!pay <玩家> <金額>   轉帳給指定玩家(執行指令/pay <玩家> <金額>)
!reconnect           手動重連伺服器
!throw               丟棄所有物品
!tp <玩家>           請求傳送到玩家(執行指令/tpa <玩家>)
!tpa/!tpaccept <玩家>  接受傳送請求(執行指令/tpaaccept <玩家>)
!tpd/!tpdeny <玩家>    拒絕傳送請求(執行指令/tpdeny <玩家>)
!version             查詢 Bot 版本

純文字輸入：直接發送聊天訊息
```

## 設定說明
- `config.json`：伺服器連線與帳號資訊
- `settings.json`：控制台指令前綴、自動重連、重連延遲、最大重連次數
- `language/zh-tw.json`：語言檔，可自訂橫幅與訊息

## 授權
本專案採用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh_TW) 授權。

---
本 Bot 基於 [McSngbot](https://github.com/SiongSng/McSngbot) 改作。
