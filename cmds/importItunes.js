const _ = require('lodash')
const music = require('../lib/music')

const importIntoItues = (dbg, args, done)=> {
  music.readStdinJSON((err, tracks)=> {
    if (err) return done(err)
    var paths = _.map(tracks, (t)=> {
      var n = music.fileNameForTrack(t)
        .replace(/"/g, "\\\"")
        .replace(/\$/g,"\\$")
      return `"${n}"`
    })


   console.log(`open -a iTunes -g ${paths.join(' \\\n')}`)
  });
}

module.exports = importIntoItues;
