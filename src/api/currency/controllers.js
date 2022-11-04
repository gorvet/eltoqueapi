import cheerio from 'cheerio';
import rp from 'request-promise';
import { pushArraysToData } from '../../libs/pushArrayData.js';
let currency=[];
let price = [];
let oldCurrency = [];
// let change = [];
var currencyOut ; 
var salidaChange  = [];

export default {
    getLocalValue(req, res) { 
        return res.status(200).json(
            {
                Rates: currencyOut,
                Variations: salidaChange
            }
        ); // armo mi array con objs de salida
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
                    var moneda = $(this).text();
                    moneda = (moneda.replace('1 ', ''));
                    currency.push(moneda);
                }); // saco los span q tienen el texto de la moneda y lo limpio

                $('span.price-text','table.hmQVUs').each(function() {
                    var precio = $(this).text();
                    precio = (precio.replace(' CUP', ''));
                    price.push(precio);
                }); // saco los span q tienen el texto del valor respecto al cup  y lo limpio

                currencyOut = pushArraysToData(currency, price); // armo mi array de salida
                var currencyName = Object.keys(currencyOut);
                
                //compatibilizo los length del array
                    for (let i = 0; i < currencyName.length; i++) {
                        if(oldCurrency.hasOwnProperty(currencyName[i]))
                        {  console.log('existe ' + currencyName[i] + ' en oldcurrency');
                            if( currencyOut[currencyName[i]]!==oldCurrency[currencyName[i]]){ //solo si vario el precio en esta consulta respecto a la ultima consulta
                                console.log(currencyName[i] + ' vario de precio');
                                salidaChange[currencyName[i]]=currencyOut[currencyName[i]]-oldCurrency[currencyName[i]]; //encuentro la diferencia por tipo moneda
                                oldCurrency[currencyName[i]]=currencyOut[currencyName[i]]; //paso el nuevo valor al old para la nueva consulta
                            }
                            else { //solo de control pero igual guardo en el old
                                console.log(currencyName[i] + ' no vario de precio'); 
                                oldCurrency[currencyName[i]]=currencyOut[currencyName[i]]; //paso el nuevo valor al old para la nueva consulta
                            }
                        }
                        else {
                             console.log('no existe ' + currencyName[i] + ' en oldcurrency');
                            oldCurrency[currencyName[i]] = currencyOut[currencyName[i]]; //creo en old el valor del new para la proxima consulta
                            console.log(oldCurrency);
                        }
                    }

                    // q tal si aqui guardamos en db
                // return [
                    // { 
                        // Rates: currencyOut,
                        // Variations: salidaChange
                    // }
                //] // armo mi array con objs de salida
            }
        )
            .then(data => data);
    }
}

