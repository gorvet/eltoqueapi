import cheerio from 'cheerio';
import rp from 'request-promise';
import { pushArraysToData } from '../../libs/pushArrayData.js';
let currency=[];
let price = [];
let oldCurrency = [];
let change = [];
var salidaCurrency ; 
var salidaChange  = [];

export default {
    getLocalValue(req, res) { 
        return res.status(200).json(
        [// armo mi array con objs de salida
            {
                Rates: salidaCurrency,
                Variations: salidaChange
            }
        ])
        
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

                salidaCurrency= pushArraysToData(currency, price); // armo mi array de salida
                var nameMoneda= Object.keys(salidaCurrency);
                
                //compatibilizo los length del array
                    for (let i = 0; i < nameMoneda.length; i++) {
                       
                        if(oldCurrency.hasOwnProperty(nameMoneda[i]))
                        {  console.log('existe ' + nameMoneda[i] + ' en oldcurrency');
                            if( salidaCurrency[nameMoneda[i]]!==oldCurrency[nameMoneda[i]]){ //solo si vario el precio en esta consulta respecto a la ultima consulta
                                console.log(nameMoneda[i] + ' vario de precio');
                                salidaChange[nameMoneda[i]]=salidaCurrency[nameMoneda[i]]-oldCurrency[nameMoneda[i]];//encuentro la diferencia por tipo moneda
                                oldCurrency[nameMoneda[i]]=salidaChange[nameMoneda[i]];//paso el nuevo valor al old para la nueva consulta
                            }
                            else { //solo de control pero igual guardo en el old
                                console.log(nameMoneda[i] + ' no vario de precio');
                                oldCurrency[nameMoneda[i]]=salidaChange[nameMoneda[i]];//paso el nuevo valor al old para la nueva consulta

                            }
                        
                        }
                        else {
                             console.log('no existe ' + nameMoneda[i] + ' en oldcurrency');
                            oldCurrency[nameMoneda[i]] = salidaCurrency[nameMoneda[i]]; //creo en old el valor del new para la proxima consulta
                            console.log(oldCurrency);
                        }
                        
                       
                       
                    }
                
                

               
                //console.log("Ha pasado 20s");
                return [// q tal si aqui guardamos en db
                    { 
                        Rates: salidaCurrency,
                        Variations: salidaChange
                    }
                ] // armo mi array con objs de salida
            }
        )
            //.then(data => res.status(200).json(data));
    }
}

