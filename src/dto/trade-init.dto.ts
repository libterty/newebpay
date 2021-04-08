import { IsString, IsUrl } from 'class-validator';

export default class TradeDto {
  @IsUrl()
  URL: string;

  @IsString()
  MerchantID: string;

  @IsString()
  HashKey: string;

  @IsString()
  HashIV: string;

  @IsUrl()
  PayGateWay: string;

  @IsUrl()
  ReturnURL: string;

  @IsUrl()
  NotifyURL: string;

  @IsUrl()
  ClientBackURL: string;
}
