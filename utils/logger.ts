import fs from "fs"; //讀取fs模塊
const sd = require('silly-datetime'); //讀取silly-datetime模塊

export let logger:Log

export class Log 
{

  /**
   * 寫入錯誤log
   * @param { any } e - 錯誤
   */
  writeErrorLog(e:any):void
  {
    this.i("進入writeErrorLog，撰寫ErrorLog");
    const time = sd.format(new Date(), 'YYYY-MM-DD-HH-mm-ss');
    if (!fs.existsSync(`./logs/${time}.txt`))
    {
      fs.writeFileSync(`./logs/${time}.txt`, e.toString());
    } 
  }

  e(msg: any):void
  {
    if(process.env.DEBUG! === "true")
    {
      console.error(msg);
    }
  }

  d(msg: any):void
  {
    if(process.env.DEBUG! === "true")
    {
      console.debug(msg)
    }
  }

  i(msg: any):void
  {
    if(process.env.DEBUG! === "true")
    {
      console.info(msg)
    }
  }

  l(msg: any):void
  {
    console.log(msg);
  }

  constructor()
  {
    this.i("建立Log物件")
    //建立資料夾
    fs.mkdir('./logs', { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

}

export default function setLogger()
{
  logger = new Log();
  logger.i("進入setLogger，建立一個新的Log物件")
}

