import cheerio from 'cheerio';
import rp from 'request-promise';
import { pushArraysToData } from '../../libs/pushArrayData.js';

// inicializations
let currency = [];
let price = [];
let oldCurrency = [];
var currencyOut; 
var salidaChange  = [];

export default {
    getLocalValue(req, res) { 
        return res.status(200).json({
            rates: currencyOut,
            variations: salidaChange
        });
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

                currency = []; // limpio para q el push no me acumule
                price = []; // limpio para q el push no me acumule     

                $('span.currency','table.hmQVUs').each(function() {
                    currency.push($(this).text().replace('1 ', ''));
                }); // saco los span q tienen el texto de la moneda y lo limpio

                $('span.price-text','table.hmQVUs').each(function() {
                    price.push($(this).text().replace(' CUP', ''));
                }); // saco los span q tienen el texto del valor respecto al cup  y lo limpio

                currencyOut = pushArraysToData(currency, price); // armo mi array de salida
                var currencyName = Object.keys(currencyOut);
                
                // compatibilizo los length del array
                currencyName.map((name, index) => {
                    if(oldCurrency.hasOwnProperty(name[index])){
                        if(currencyOut[name[index] !== oldCurrency[name[index]]]){ // solo si vario el precio en esta consulta respecto a la ultima consulta
                            salidaChange[name[index]] = currencyOut[name[index]] - oldCurrency[name[index]]; // encuentro la diferencia por tipo moneda
                            oldCurrency[name[index]] = currencyOut[name[index]]; // paso el nuevo valor al old para la nueva consulta
                        }else { 
                            oldCurrency[currencyName[index]] = currencyOut[currencyName[index]]; // paso el nuevo valor al old para la nueva consulta
                        } // solo de control pero igual guardo en el old
                    }
                });
            }
        )
            .then(data => data);
    }
}

