const TikaServer = require("tika-server");
const rp = require('request-promise');
const cheerio = require('cheerio');

//liste de dictionnaire, avec 1 dico/ formation
var list = new Map();

//dico des valeurs des codes etc
var values = new Map();


// Lance le serveur Tika
// Doc : https://www.npmjs.com/package/tika-server
const ts = new TikaServer();

ts.on("debug", (msg) => {
  // console.log(`DEBUG: ${msg}`)
})

// Lance le serveur tika
ts.start().then(() => {
  // liste de mes urls de pdf
  const listeUrlPdfs = [
    'http://planete.insa-lyon.fr/scolpeda/f/ects?id=36736&_lang=fr'
  ]
  // Pour chaque url ...
  return Promise.all(listeUrlPdfs.map((url) => {
    // Extraction du texte.
    return getPdf(url).then((pdf) => {
      // console.log("pdf", pdf);
      if(pdf) {
        return ts.queryText(pdf).then((data) => {
           //console.log(data)
          let code = /CODE : ([^\n]*)/.exec(data)[1];
           console.log("Code :", code);
           values.set(code);
        });
        list.set(values);
        values={};
      }
    })
  }))
}).then(() => {
  return ts.stop()
}).catch((err) => {
  console.log(`TIKA ERROR: ${err}`)
})
