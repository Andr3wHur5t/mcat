const _ = require("lodash")
const read = require("read");
const async = require("async")
const monstercat = require('../lib/monstercat')

const auth = (dbg, args, done) => {
  console.log("Please enter your Monstercat Connect credentials...")
  async.series({
    email: (next)=> { read({ prompt: 'Email:' }, next); },
    password: (next)=> { read({ prompt: 'Password:', silent: true, replace: '*' }, next); },
  }, (err, credentials)=> {
    if (err) return done(err)
    const body = _.mapValues(credentials, "0")

    console.log("-- 🔐  Sending Authentication Request to Monstercat...")
    monstercat.request('POST', '/signin', { body, json: true }, (err, res, body)=> {
      if (err) return done(err)
      console.log("-- ✅  Authenticated with Monstercat Connect!")

      // The cookie file system store is not sync, wait long enough for it to write
      setTimeout(done,  2000)
    });
  })
}

module.exports = auth;
