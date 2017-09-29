const fs = require('fs')
const _ = require('lodash')
const async = require('async')
const path = require('path')
const monstercat = require('../lib/monstercat')

const music = require('../lib/music')
const MUSIC_DIR = music.MUSIC_DIR
const fileNameForTrack = music.fileNameForTrack
const fileNameForAlbumArt = music.fileNameForAlbumArt
const readStdinJSON = music.readStdinJSON
const ensureDir = music.ensureDir

const DOWNLOAD_QUALITY = 'mp3_320'
const trackToDownloadURL = (track) => {
  return `https://connect.monstercat.com/api/release/${track.release._id}/download?method=download&type=${DOWNLOAD_QUALITY}&track=${track._id}`
}

const taskId = (task)=> task.type + task.uri + task.fs
const performTask = ({type, uri, fsPath, title}, next)=> {
  if (fs.existsSync(fsPath) || process.env.MC_DRY) {
    console.log(`-- ⚠️  Skiping download of '${title}' file already exists at destination!`)
    return next()
  }

  ensureDir(path.dirname(fsPath))
  console.log(`-- 💌  Starting download of '${title}'`)
  monstercat.download(uri, fsPath, (err)=> {
    if (err) return next(err)
    console.log(`-- ✅ 🔥 Finished download of '${title}'`)
    next()
  })
}

const download = (dbg, args, done) => {
  readStdinJSON((err, tracks)=> {
    if (err) return done(err)
    console.log(`-- 💡  Got ${tracks.length} tracks...`)
    var tasks = {}
    addTask = (t, {artistsTitle, title})=> {
      t.title = `${artistsTitle} - ${title}`
      if (t.type == 'image') t.title += ' (Album Art)'
      tasks[t.fsPath] = t
    }
    _.each(tracks, (t)=> {
      addTask({ type: 'music', uri: trackToDownloadURL(t), fsPath: fileNameForTrack(t) }, t)
      addTask({ type: 'image', uri: t.release.coverUrl, fsPath: fileNameForAlbumArt(t) }, t)
    })


    var endTasks = _.values(tasks),
      typeStats = {};
    tally = (obj, type)=> { obj[type] = (obj[type] || 0) + 1 }
    _.each(endTasks, ({type})=> { tally(typeStats, type)
    });
    console.log(`-- 🔥 🔥  Starting Download of ${typeStats.music} songs for ${typeStats.image} albums.`)
    async.eachLimit(endTasks, 32, performTask, (err)=> {
      if (err) return done(err)
      console.log(`-- ✅ 🔥 Finished downloading all ${typeStats.music} songs and ${typeStats.image} images; avalible at '${MUSIC_DIR}'`)
      done()
    })
  });
}

module.exports = download;
