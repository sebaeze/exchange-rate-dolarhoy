# Retreieve the exchange rate  from [Dolarhoy](https://www.dolarhoy.com)

The default rate is USD to ARS but you can specify others currencies:

* USD_BRZ ==> Real ( BRZ )
* USD_CLP ==> Peso Chile ( CLP )
* USD_UYU ==> Peso Uruguay ( UYU )

## Installation

#### npm
```bash
npm install --save  exchange-rate-dolarhoy
```
## Usage

1- Import the component into your project


```js
import { exchangeRate }     from "exchange-rate-dolarhoy" ;

```

2- Call the widget ( Default is USD to ARS )

```js
exchangeRate.getRateDolarHoy({conversion:'USD_ARS'})
    .then((rate)=>{
        console.log('...rate: ',rate) ;
    })
    .catch((err)=>{
        console.log('...error: ',err);
    }) ;
```

Result:
```json
{
    "date": "YYYY-MM-DD",
    "rate": 9999.999
}
```
