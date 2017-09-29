const path = require('path')
const _ = require('lodash')
const fs = require('fs')

const MUSIC_DIR = path.join(process.env.HOME, '/Music')
const fileNameForTrack = (track)=> path.join(MUSIC_DIR, `/${track.artistsTitle}/${track.release.title}/${track.title}.mp3`)
const fileNameForAlbumArt = (track)=> path.join(MUSIC_DIR, `/${track.artistsTitle}/${track.release.title}/folder.jpg`)

const readStdinJSON = (done)=> {
  var input = ''
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk)=> { input += chunk;});
  process.stdin.on('end', ()=> {
    done(null, JSON.parse(input))
  })
}

const ensureDir = (dirPath, mode) => {
  if (fs.existsSync(dirPath)) return
  var current = dirPath;
  var toCreate = []
  var foundBase = false
  while (!foundBase) {
    foundBase = fs.existsSync(current)
    foundBase || toCreate.push(current)
    current = path.dirname(current)
  }
  for (var curr of _.reverse(toCreate)) fs.mkdirSync(curr, mode)
};

module.exports = {
  MUSIC_DIR,
  fileNameForTrack,
  fileNameForAlbumArt,
  readStdinJSON,
  ensureDir,
}
