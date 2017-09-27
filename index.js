process.env.DEBUG = process.env.DEBUG || "mcat:*,-mcat:help"
const _ = require('lodash')
const async = require('async')
const _debug = require('debug')
const request = require('request')

const printHelp = (args, done)=> {
  let lines = []
  var indentTxt = ""
  const indent = (level)=> { indentTxt = new Array(level).join("  ") }
  const addLine = (text)=> { i
    lines.push(text ? indentTxt + text: "")
  }

  indent(0)
  addLine('CLI tool to interface with the monstercat connect API.')
  indent(1)
  addLine("This tool is best used for syncing a target group of tracks with your local machiene.")
  addLine()
  indent(0)
  he


  console.log join
  done()
}

const authenticate = (args, done)=> {

}

const findTracks = (args, done)=> {

}

const downloadTracks = (args, done)=> {

}

const COMMANDS = {
  help: {
    info: 'Prints information about avalable commands.',
    cmd: printHelp,
  },
  auth: {
    info: 'Create a session with the monstercat connnect service.',
    cmd: authenticate,
  },
  findTracks: {
    info: 'Finds tracks and outputs the search results into a file.',
    cmd: findTracks,
  },
  downloadTracks: {
    info: 'Downloads the tracks the specified file.',
    cmd: downloadTracks,
  },
}


// Map `lowercase:fullMapName`
const INSENSITIVE_MAP = _.fromPairs(_.map(_.keys(COMMANDS), (k)=> [k.toLowerCase(), k] ))
const runCommand = (name, args, done)=> {
  let realName = INSENSITIVE_MAP[name.toLowerCase()] || "help"
  let cmdFn = COMMANDS[realName].cmd
  let dbg = _debug(`mcat:${realName}`)
  dbg("Starting!")
  cmdFn(dbg, args, (err, exitCode)=> {
    if (!!err) {
      dbg(`ERROR! $err`)
      return done(err, exitCode)
    }
    dbg("Finished!")
    return done(null)
  })
}


const main = (done)=> {
  runCommand(
    process.argv[2],
    process.argv.slice(2),
    done
  )
}

main((err, exitCode)=>{
  console.error(err)
  process.exit(exitCode ||  Number(!!err))
})
