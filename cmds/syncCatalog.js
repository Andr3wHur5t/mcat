const fs = require('fs')
const _ = require('lodash')
const monstercat = require('../lib/monstercat')

const PAGE_SIZE = 750
const getPage = (pageNum, results, done)=> {
  if (typeof(results) == 'function') {
    done = results
    results = []
  }
  console.log(`-- 💌  Requesting MonsterCat Catalog (page ${pageNum}).`)
  monstercat.request('GET', `/api/catalog/track?limit=${PAGE_SIZE}&skip=${pageNum * PAGE_SIZE}`, (err, res, body)=> {
    if (err) return done(err, null, false)
    const parsedBody = JSON.parse(body)
    console.log(`-- ⬇️  Got ${parsedBody.results.length} tracks from MonsterCat Catalog (page ${pageNum}).`)

    // Concat; less re-allocation
    _.each(parsedBody.results, (e)=> results.push(e))

    // If parsed results has less that limit safe to assume more to sync.
    if (parsedBody.results.length == 0) return done(null, results)

    // Get next pages recursively; Catalog is small enough this is safe
    return getPage(pageNum + 1, results, done)
  })

}
const syncCatalog = (dbg, args, done) => {
  getPage(0, (err, results)=> {
    if (err) return done(err)
    console.log(`-- 📝  Syncing MonsterCat Catalog with ${results.length} entries to FS cache.`)
    fs.writeFile(monstercat.CATALOG_PATH, JSON.stringify(results), (err) => {
      if (err) return done(err)
      console.log("-- ✅  Finshed Syncing MonsterCat Catalog.")
      done()
    });
  });
}

module.exports = syncCatalog;
