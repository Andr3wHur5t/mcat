const fs = require('fs')
const monstercat = require('../lib/monstercat')

const logout = (dbg, args, done) => {
  fs.existsSync(monstercat.COOKIE_JAR_PATH) && fs.unlinkSync(monstercat.COOKIE_JAR_PATH)
  console.log("-- 🔥 🗑 🔥  Destroyed MonsterCat session...")
}

module.exports = logout;
