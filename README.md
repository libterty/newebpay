# NewebPay Implementation

[![CircleCI](https://circleci.com/gh/libterty/newebpay/tree/master.svg?style=svg)](https://circleci.com/gh/libterty/newebpay/tree/master)

- Referencing NewebPay API Document to perform API calling and bundle it into a module

## How to install
```
npm install newebpay
```

## How to use

- Declare for the module globally
```javascript
const { TradeModules } = require('newebpay');
```

#### Before version 0.0.11

- Initialize module
```javascript
const trade = new TradeModules(
 'your domain information <string>',
 'your newebpay MerchantID <string>',
 'your newebpay HashKey <string>',
 'your newebpay HashIV <string>',
 'newebpay PayGateWay <string>',
 'your newebpay ClientBackURL <string>'
);
```

#### After version 0.0.11

- Initialize module
```javascript
const trade = new TradeModules();
```

## CallIng API

### Before version 0.0.11

- When you want to return tradeInfo then calling Newebpay Authorization
```javascript
const tradeInfo = trade.getTradeInfo(
  Amt: number,
  DESC: string,
  email: string
);
```

- Expecting `tradeInfo` output example
```json
{
  "MerchantID": "your newebpay MerchantID <string>",
  "TradeInfo": "aes256 encryption",
  "TradeSha": "sha256 hashing",
  "Version": "1.5",
  "PayGateWay": "https://ccore.spgateway.com/MPG/mpg_gateway",
  "MerchantOrderNo": "1581686501236"
}
```

- When you want Decrypt Newebpay Feedback Information
```javascript
const tradeData = JSON.parse(trade.createMpgAesDecrypt(TradeInfo));
```

### After version 0.0.11

- Set the trade config
```javascript
const trade = await tradeModules.setTrade({
  URL: 'your domain information <string>',
  MerchantID: 'your newebpay MerchantID <string>',
  HashKey: 'your newebpay HashKey <string>',
  HashIV: 'your newebpay HashIV <string>',
  PayGateWay: 'newebpay PayGateWay <string>',
  ClientBackURL: 'your newebpay ClientBackURL <string>',
});
```

- When you want to return tradeInfo then calling Newebpay Authorization
```javascript
const tradeInfo = trade.getTradeInfo(
  Amt: number,
  DESC: string,
  email: string
);
```

- Expecting `tradeInfo` output example
```json
{
  "MerchantID": "your newebpay MerchantID <string>",
  "TradeInfo": "aes256 encryption",
  "TradeSha": "sha256 hashing",
  "Version": "1.5",
  "PayGateWay": "https://ccore.spgateway.com/MPG/mpg_gateway",
  "MerchantOrderNo": "1581686501236"
}
```

- When you want Decrypt Newebpay Feedback Information
```javascript
const tradeData = trade.createMpgAesDecrypt(TradeInfo);
```

- Expecting `tradeData` output example
```json
{
  "MerchantID": "test1test1",
  "RespondType": "JSON",
  "TimeStamp": "1581755183872",
  "Version": "1.5",
  "MerchantOrderNo": "1581755183872",
  "LoginType": "0",
  "OrderComment": "OrderComment",
  "Amt": "3700",
  "ItemDesc": "1",
  "Email": "test1@example.com",
  "ReturnURL": "http://localhost:3000/ReturnURL",
  "NotifyURL": "http://localhost:3000/NotifyURL",
  "ClientBackURL": "http://localhost:3000/ClientBackURL"
}
```


# ChangeLog

[ChangeLog](https://github.com/libterty/newebpay/blob/master/ChangeLog.md)


# CopyRight

Copyright © 2020, 11. Released under the [MIT License](https://github.com/libterty/newebpay/blob/master/LICENCE).