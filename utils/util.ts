import { logger } from "./logger"
import { Config, Setting } from "../models/files";

export let config:Config,Item:any,settings:Setting;

/**
 * 添加千分位標記
 * @param { number } number - 要轉換的數字
 * @returns { string } 添加後的結果
 */
export function formatThousandths(number: number): string 
{
    logger.i("進入formatThousandths，添加千分位")
    let comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
    return number.toString().replace(comma, ',');
}

/**
 * 格式化時間(天:小時:分:秒)
 * @param { number } totalTime - 秒數
 * @returns { string } 格式化後的時間
 */
export function formatTime(totalTime: number): string 
{
    logger.i("進入formatTime，格式化時間")
    const days:number = Math.floor(totalTime / 86400); 
    const hours:number = Math.floor((totalTime % 86400) / 3600);
    const minutes:number = Math.floor((totalTime % 3600) / 60);
    const seconds:number = totalTime % 60;
  
    let result:string = '';
  
    if (days > 0) 
    {
      result += `${days}天`;
    }
    if (hours > 0) 
    {
      result += `${hours}小時`;
    }
    if (minutes > 0) 
    {
      result += `${minutes}分`;
    }
    if (seconds > 0 || result === '') 
    {
      result += `${seconds}秒`;
    }
    logger.d(`回傳格式化時間結果: ${result}`)
    return result;
}

/**
 * 取得settings
 */
export function getSettings()
{
    delete require.cache[require.resolve(`${process.cwd()}/settings.json`)]; //清除暫存
    settings = require(`${process.cwd()}/settings.json`) //讀取設定檔案
}

/**
 * 取得config
 */
export function getConfig()
{
    delete require.cache[require.resolve(`${process.cwd()}/config.json`)]; //清除暫存
    config = require(`${process.cwd()}/config.json`)  //讀取config檔案
}

