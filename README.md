# NewebPay Implementation

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

## CallIng API

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
  MerchantID: "your newebpay MerchantID <string>",
  TradeInfo: "aes256 encryption",
  TradeSha: "sha256 hashing",
  Version: "1.5",
  PayGateWay: "https://ccore.spgateway.com/MPG/mpg_gateway",
  MerchantOrderNo: "1581686501236"
}
```

- When you want encrypt Newebpay Feedback Information

```javascript
const tradeData = JSON.parse(trade.createMpgAesDecrypt(TradeInfo));
```

# ChangeLog

[ChangeLog](https://github.com/libterty/newebpay/blob/master/ChangeLog.md)


# CopyRight

Copyright © 2020, 11. Released under the [MIT License](https://github.com/libterty/newebpay/blob/master/LICENCE).