const fs = require('fs')
const monstercat = require('../lib/monstercat')

const syncCatalog = (dbg, args, done) => {
  console.log("-- 💌  Requesting Entire MonsterCat Catalog (This might take a minute).")
  monstercat.request('GET', '/api/catalog/track', (err, res, body)=> {
    if (err) return done(err)
    console.log("-- 📝  Syncing MonsterCat Catalog to FS.")
    fs.writeFile(monstercat.CATALOG_PATH, body, (err) => {
      if (err) return done(err)
      console.log("-- ✅  Finshed Syncing MonsterCat Catalog.")
      done()
    });
  })
}

module.exports = syncCatalog;
