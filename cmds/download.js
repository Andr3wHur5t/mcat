const _ = require('lodash')
const path = require('path')

const readStdinJSON = (done)=> {
  var input = ''
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk)=> { input += chunk;});
  process.stdin.on('end', ()=> {
    done(null, JSON.parse(input))
  })
}

const DOWNLOAD_QUALITY = 'mp3_320'
const trackToDownloadURL = (track) => {
  return `https://connect.monstercat.com/api/release/${track.release._id}/download?method=download&type=${DOWNLOAD_QUALITY}&track=${track._id}`
}

const MUSIC_DIR = path.join(process.env.HOME, '/Music')
const fileNameForTrack = (track)=> path.join(MUSIC_DIR, `/${track.artistsTitle}/${track.release.title}/${track.title}.mp3`)
const fileNameForAlbumArt = (track)=> path.join(MUSIC_DIR, `/${track.artistsTitle}/${track.release.title}/folder.jpg`)

const download = (dbg, args, done) => {
  readStdinJSON((err, tracks)=> {
    if (err) return done(err)
    console.log(`-- 💡  Got ${tracks.length} tracks...`)
    var tasks = []
    _.each(tracks, (t)=> {
      tasks.push({ type: 'music', uri: trackToDownloadURL(t), fs: fileNameForTrack(t) })
      tasks.push({ type: 'image', uri: t.release.coverUrl, fs: fileNameForAlbumArt(t) })
    })

    console.log(tasks[99])

    // TODO: Reduce redundant work
    // TODO: Report stats
    // TODO: Task distribution.
    // TODO: Record already downloaded tracks
  });
}

module.exports = download;
