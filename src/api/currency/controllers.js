import cheerio from 'cheerio';
import rp from 'request-promise';
import { pushArraysToData } from '../../libs/pushArrayData.js';
let currency=[];
let price = [];
let oldPrice = [];
let change = [];
var salidaCurrency ; 
var salidaChange  ; 

export default {
    getLocalValue(req, res) { 
        return res.status(200).json([
            {
                Rates: salidaCurrency,
                Variations: salidaChange
            }
        ])
        // armo mi array con objs de salida
    },

    getValue: async (req, res) => {
        const options = {
            uri: 'https://eltoque.com',
            transform: (body) => {
                return cheerio.load(body);
            }
        };

        await rp(options)
            .then((body) => {
                const $ = body;

                currency=[]; //limpio para q el push no me acumule

                $('span.currency','table.hmQVUs').each(function() {
                    var moneda = $(this).text();
                    moneda = (moneda.replace('1 ', ''));
                    currency.push(moneda);
                }); // saco los span q tienen el texto de la moneda y lo limpio

                price=[]; //limpio para q el push no me acumule     

                $('span.price-text','table.hmQVUs').each(function() {
                    var precio = $(this).text();
                    precio = (precio.replace(' CUP', ''));
                    price.push(precio);
                }); // saco los span q tienen el texto del valor respecto al cup  y lo limpio

                if(price.length === oldPrice.length){ //compatibilizo los length del array
                    for (let i = 0; i < price.length; i++) {
                        if(price[i]!==oldPrice[i]){ //solo si vario el precio en esta consulta respecto a la ultima consulta
                            change[i]=price[i]-oldPrice[i];
                            oldPrice[i]=price[i];   
                        }
                        else if(change[i] == ''|| change[i] == null){
                            change[i]=0;
                        }
                    }
                }
                  else{
                    oldPrice=price;
                }

                salidaCurrency= pushArraysToData(currency, price); // armo mi array de salida
                salidaChange= pushArraysToData(currency, change); // armo mi array de salida

                return [
                    { 
                        Rates: salidaCurrency,
                        Variations: salidaChange
                    }
                ] // armo mi array con objs de salida
            }
        )
            .then(data => res.status(200).json(data));
    }
}