'use strict';
import path from 'path'
import { appendFile, readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url';

import yargs from 'yargs'
import chalk from 'chalk'

let optionsYargs = yargs(process.argv.slice(2))
  .usage('Uso: $0 [options]')
 
  .option("s", { alias: "segmento", describe: "tipo de segmento", type: "string", demandOption: true })
  .option("f", { alias: "from", describe: "posição inicial de pesquisa da linha do Cnab", type: "number", demandOption: true })
  .option("t", { alias: "to", describe: "posição final de pesquisa da linha do Cnab", type: "number", demandOption: true })
  .array('companyName')
  .option("n", {alias: "companyName", describe: "pesquisa pelo nome da empresa", type: "string", demandOption: false})
  .option("p", { alias: "filePath", describe: "caminho do arquivo", type: "string", demandOption: false })
  .example('$0 -f 21 -t 34 -s p -p /cnabExample.rem -n BRASIL COMERCIO E SERVICOS DE TECNOLAVENIDA DOUTOR CHUCRI ZAIDAN', 'lista a linha e campo que from e to do cnab')
  .argv;

const { from, to, segmento, filePath, companyName } = optionsYargs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.resolve(`${__dirname}/${filePath ? filePath : "cnabExample.rem"}`)


const sliceArrayPosition = (arr, ...positions) => [...arr].slice(...positions)

const messageLog = (segmento, segmentoType, from, to) => 
`
----- Cnab linha ${segmentoType} -----

posição from: ${chalk.inverse.bgBlack(from)}

posição to: ${chalk.inverse.bgBlack(to)}

item isolado: ${chalk.inverse.bgBlack(segmento.substring(from - 1, to))}

item dentro da linha ${segmentoType}: 
  ${segmento.substring(0, from)}${chalk.inverse.bgBlack(segmento.substring(from - 1, to))}${segmento.substring(to)}

----- FIM ------
`

const log = console.log

console.time('leitura Async')

readFile(file, 'utf8')
  .then(file => {
    const cnabArray = file.split('\n')
    const array = sliceArrayPosition(cnabArray, 2, -2);

    if (companyName) {
      const companyNameString = companyNameArrayToString(companyName)

      const result = array.find(item => {
        if (item.includes(companyNameString) && (segmento ? item.includes(`${segmento.toUpperCase()} `) : true)) {
          return item;
        }
      });

      if (result) {
        segmento === 'q' ? createJson({result, companyNameString}) : null
        log(messageLog(result, segmento.toUpperCase(), from, to))
        return

      } else {
        throw new Error(`Don't have this company name (${companyNameString}) on this segment (${segmento}).`)
      }

    } else {
      const [cnabBodySegmentoP, cnabBodySegmentoQ, cnabBodySegmentoR] = sliceArrayPosition(cnabArray)

      if (segmento === 'p') {
        log(messageLog(cnabBodySegmentoP, 'P', from, to))
        return
      }
  
      if (segmento === 'q') {
        log(messageLog(cnabBodySegmentoQ, 'Q', from, to))
        return
      }
  
      if (segmento === 'r') {
        log(messageLog(cnabBodySegmentoR, 'R', from, to))
        return
      }
    }

  })
  .catch(error => {
    console.log("🚀 ~ file: cnabRows.js ~ line 76 ~ error", error)
  })
console.timeEnd('leitura Async')

function companyNameArrayToString(companyName) {
  return companyName.toString().replace(/,/g, " ")
}

function getCompanyAdress(object) {
  const addressArray = object.split(/(AVENIDA|RUA|AV|QD)/)
  let address = `${addressArray[1]} ${addressArray[2]}`
  return address
}

function createJson(response) {
  const { companyNameString, ...rest } = response
  const address = getCompanyAdress(rest.result)
  readFile('cnab.JSON', 'utf-8')
    .then((file => {
      const arr = JSON.parse(file)
      arr.push({companyName: companyNameString, address: address})
      writeFile('cnab.JSON', `${JSON.stringify(arr)}`)
    }))
  .catch(() => appendFile('cnab.JSON', `[\n {\n   "companyName": "${companyNameString}",\n   "adress": "${address}"\n }\n]`))
}