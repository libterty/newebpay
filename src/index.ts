import { createCipheriv, createDecipheriv, createHash } from 'crypto';
import { IsNotEmpty } from 'class-validator';

export class TradeModules {
  @IsNotEmpty()
  URL: string;
  @IsNotEmpty()
  MerchantID: string;
  @IsNotEmpty()
  HashKey: string;
  @IsNotEmpty()
  HashIV: string;
  @IsNotEmpty()
  PayGateWay: string;
  @IsNotEmpty()
  ReturnURL: string;
  @IsNotEmpty()
  NotifyURL: string;
  @IsNotEmpty()
  ClientBackURL: string;

  constructor(
    url: string,
    merchantId: string,
    hashKey: string,
    hashIV: string,
    payGateWay: string,
    clientBackURL: string
  ) {
    this.URL = url;
    this.MerchantID = merchantId;
    this.HashKey = hashKey;
    this.HashIV = hashIV;
    this.PayGateWay = payGateWay;
    this.ReturnURL = this.URL + '/spgateway/callback?from=ReturnURL';
    this.NotifyURL = this.URL + '/spgateway/callback?from=NotifyURL';
    this.ClientBackURL = clientBackURL || 'http://localhost:8080/orders';
  }

  genDataChain(TradeInfo: object): string {
    const results = [];
    for (const kv of Object.entries(TradeInfo)) {
      results.push(`${kv[0]}=${kv[1]}`);
    }
    return results.join('&');
  }

  createMpgAesEncrypt(TradeInfo: object): string {
    const encrypt = createCipheriv('aes256', this.HashKey, this.HashIV);
    const enc = encrypt.update(this.genDataChain(TradeInfo), 'utf8', 'hex');
    return enc + encrypt.final('hex');
  }

  createMpgAesDecrypt(TradeInfo: string): string {
    const decrypt = createDecipheriv('aes256', this.HashKey, this.HashIV);
    decrypt.setAutoPadding(false);
    const text = decrypt.update(TradeInfo, 'hex', 'utf8');
    const plainText = text + decrypt.final('utf8');
    const result = plainText.replace(/[\x00-\x20]+/g, '');
    return result;
  }

  createMpgShaEncrypt(TradeInfo: string): string {
    const sha = createHash('sha256');
    const plainText = `HashKey=${this.HashKey}&${TradeInfo}&HashIV=${this.HashIV}`;

    return sha
      .update(plainText)
      .digest('hex')
      .toUpperCase();
  }

  getTradeInfo(Amt: number, Desc: string, email: string): object {
    if (typeof Amt !== 'number') throw new Error(`Input Amt type ${Amt} Error`);
    if (Desc.length < 1) throw new Error(`Input Desc Length ${Desc} Error`);
    const isEmail = validator.isEmail(email);
    console.log('isEmail', isEmail);

    const data = {
      MerchantID: this.MerchantID,
      RespondType: 'JSON',
      TimeStamp: Date.now(),
      Version: 1.5,
      MerchantOrderNo: Date.now(),
      LoginType: 0,
      OrderComment: 'OrderComment',
      Amt: Amt,
      ItemDesc: Desc,
      Email: email,
      ReturnURL: this.ReturnURL,
      NotifyURL: this.NotifyURL,
      ClientBackURL: this.ClientBackURL,
    };
    const mpgAesEncrypt = this.createMpgAesEncrypt(data);
    const mpgShaEncrypt = this.createMpgShaEncrypt(mpgAesEncrypt);
    const tradeInfo = {
      MerchantID: this.MerchantID,
      TradeInfo: mpgAesEncrypt,
      TradeSha: mpgShaEncrypt,
      Version: 1.5,
      PayGateWay: this.PayGateWay,
      MerchantOrderNo: data.MerchantOrderNo,
    };
    return tradeInfo;
  }
}
