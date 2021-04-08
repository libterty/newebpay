type TRespondType = 'JSON';
type TOrderComment = 'OrderComment';

export interface ITradeRequest {
  URL: string;
  MerchantID: string;
  HashKey: string;
  HashIV: string;
  PayGateWay: string;
  ClientBackURL: string;
}

export interface ITrade {
  URL: string;
  MerchantID: string;
  HashKey: string;
  HashIV: string;
  PayGateWay: string;
  ReturnURL: string;
  NotifyURL: string;
  ClientBackURL: string;
}

export interface ITradeData {
  MerchantID: string;
  RespondType: TRespondType;
  TimeStamp: number;
  Version: number;
  MerchantOrderNo: number;
  LoginType: number;
  OrderComment: TOrderComment;
  Amt: number;
  ItemDesc: string;
  Email: string;
  ReturnURL: string;
  NotifyURL: string;
  ClientBackURL: string;
}

export interface ITradeInfo {
  MerchantID: string;
  TradeInfo: string;
  TradeSha: string;
  Version: number;
  PayGateWay: string;
  MerchantOrderNo: number;
}

export type TParser<T> = {
  [P in keyof T]-?: T[P];
};
