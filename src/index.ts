import { createCipheriv, createDecipheriv, createHash } from 'crypto';
import { validate, ValidationError } from 'class-validator';
import TradeDto from './dto/trade-init.dto';
import {
  ITrade,
  ITradeRequest,
  ITradeData,
  ITradeInfo,
  TParser,
} from './interface/trade.interface';

export class TradeModules {
  public trade: ITrade = {
    URL: '',
    MerchantID: '',
    HashKey: '',
    HashIV: '',
    PayGateWay: '',
    ReturnURL: '',
    NotifyURL: '',
    ClientBackURL: 'http://localhost:8080/orders',
  };

  /**
   * @description Set trade base config data
   * @public
   * @param {TradeDto} tradeDto
   * @returns {Promise<TradeDto | ValidationError[]>}
   */
  public setTrade(
    tradeDto: ITradeRequest,
  ): Promise<TradeDto | ValidationError[]> {
    const trade = new TradeDto();
    trade.URL = tradeDto.URL;
    trade.MerchantID = tradeDto.MerchantID;
    trade.HashKey = tradeDto.HashKey;
    trade.HashIV = tradeDto.HashIV;
    trade.PayGateWay = tradeDto.PayGateWay;
    trade.ReturnURL = `${trade.URL}/spgateway/callback?from=ReturnURL`;
    trade.NotifyURL = `${trade.URL}/spgateway/callback?from=NotifyURL`;
    trade.ClientBackURL = tradeDto.ClientBackURL;

    return validate(tradeDto).then(err => {
      if (err.length > 0) return err;
      return trade;
    });
  }

  /**
   * @description Chaining the ITradeData interface to string
   * @private
   * @param {ITradeData} TradeInfo
   * @returns {string}
   */
  private genDataChain(TradeInfo: ITradeData): string {
    const results = [];
    for (const kv of Object.entries(TradeInfo)) {
      results.push(`${kv[0]}=${kv[1]}`);
    }
    return results.join('&');
  }

  /**
   * @description Encrpyt chaining data
   * @private
   * @param {ITradeData} TradeInfo
   * @returns {string}
   */
  private createMpgAesEncrypt(TradeInfo: ITradeData): string {
    const encrypt = createCipheriv(
      'aes256',
      this.trade.HashKey,
      this.trade.HashIV,
    );
    const enc = encrypt.update(this.genDataChain(TradeInfo), 'utf8', 'hex');
    return enc + encrypt.final('hex');
  }

  /**
   * @description Parse data from newwebpay
   * @private
   * @param {string} str
   * @returns {TParser<ITradeData>}
   */
  private parser(str: string): TParser<ITradeData> {
    const arr = str.split('&');
    const result: TParser<ITradeData> = {
      MerchantID: '',
      RespondType: 'JSON',
      TimeStamp: 0,
      Version: 0,
      MerchantOrderNo: 0,
      LoginType: 0,
      OrderComment: 'OrderComment',
      Amt: 0,
      ItemDesc: '',
      Email: '',
      ReturnURL: '',
      NotifyURL: '',
      ClientBackURL: '',
    };
    arr.forEach((element: string) => {
      if (typeof element === 'string' && element.length > 0) {
        const items = element.split('=');
        result[items[0]] = items[1];
      }
    });
    return result;
  }

  /**
   * @description Decrypt and Parse data from newwebpay
   * @public
   * @param {string} TradeInfo
   * @returns {TParser<ITradeData>}
   */
  public createMpgAesDecrypt(TradeInfo: string): TParser<ITradeData> {
    const decrypt = createDecipheriv(
      'aes256',
      this.trade.HashKey,
      this.trade.HashIV,
    );
    decrypt.setAutoPadding(false);
    const text = decrypt.update(TradeInfo, 'hex', 'utf8');
    const plainText = text + decrypt.final('utf8');
    const result = plainText.replace(/[\x00-\x20]+/g, '');
    return this.parser(result);
  }

  /**
   * @description Sha encryption
   * @private
   * @param {string} TradeInfo
   * @returns {string}
   */
  private createMpgShaEncrypt(TradeInfo: string): string {
    const sha = createHash('sha256');
    const plainText = `HashKey=${this.trade.HashKey}&${TradeInfo}&HashIV=${this.trade.HashIV}`;

    return sha
      .update(plainText)
      .digest('hex')
      .toUpperCase();
  }

  /**
   * @description Get trade info
   * @public
   * @param {string} Amt
   * @param {string} Desc
   * @param {string} email
   * @returns {ITradeInfo}
   */
  public getTradeInfo(Amt: number, Desc: string, email: string): ITradeInfo {
    const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

    if (Amt < 0) throw new Error(`Input Amt cannot less than zero`);
    if (Desc.length < 1)
      throw new Error(`Input Desc: ${Desc} length cannot less than 1`);
    if (email.search(emailRule) === -1)
      throw new Error(`Input email content ${email} malware`);
    const data: ITradeData = {
      MerchantID: this.trade.MerchantID,
      RespondType: 'JSON',
      TimeStamp: Date.now(),
      Version: 1.5,
      MerchantOrderNo: Date.now(),
      LoginType: 0,
      OrderComment: 'OrderComment',
      Amt: Amt,
      ItemDesc: Desc,
      Email: email,
      ReturnURL: this.trade.ReturnURL,
      NotifyURL: this.trade.NotifyURL,
      ClientBackURL: this.trade.ClientBackURL,
    };
    const mpgAesEncrypt = this.createMpgAesEncrypt(data);
    const mpgShaEncrypt = this.createMpgShaEncrypt(mpgAesEncrypt);
    const tradeInfo: ITradeInfo = {
      MerchantID: this.trade.MerchantID,
      TradeInfo: mpgAesEncrypt,
      TradeSha: mpgShaEncrypt,
      Version: 1.5,
      PayGateWay: this.trade.PayGateWay,
      MerchantOrderNo: data.MerchantOrderNo,
    };
    return tradeInfo;
  }
}
