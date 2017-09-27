const _ = require('lodash')
const _debug = require('debug')

// Help Is In main to get access to commands object to auto populate help text.
const printHelp = (log, args, done)=> {
  let lines = []
  var indentTxt = ""
  const indent = (level)=> { indentTxt = new Array(level + 1).join("  ") }
  const addLine = (text)=> { lines.push(text ? indentTxt + text : '') }

  // Header
  indent(0)
  addLine('CLI tool to interface with the MonsterCat Connect API.')
  addLine()
  addLine("This tool is best used for syncing a target group of tracks with your local machiene.")
  addLine()

  // Examples Block:

  // Commands Block
  addLine("Commands:")
  addLine()
  indent(1)

  targetCharCount = _.max(_.map(_.keys(COMMANDS), "length"))
  _.each(COMMANDS, ({info}, name)=> {
    deltaSpaces = new Array((targetCharCount - name.length) + 1 + 3).join(' ')
    addLine(`${name}${deltaSpaces} - ${info}`)
  });

  console.log(lines.join("\n"))
  done()
}

const COMMANDS = {
  auth: {
    info: 'Create a session with the monstercat connnect service.',
    cmd: require('./cmds/auth'),
  },
  session: {
    info: "Check the status of the current session.",
    cmd: require('./cmds/session'),
  },
  find: {
    info: 'Finds tracks and outputs the search results into a file.',
    cmd: require('./cmds/find'),
  },
  download: {
    info: 'Downloads the tracks the specified file.',
    cmd: require('./cmds/download'),
  },
  logOut: {
    info: 'Destroys the current session.',
    cmd: require('./cmds/logout'),
  },
  help: {
    info: 'Prints information about avalable commands.',
    cmd: printHelp,
  },
}


// Map `lowercase:fullMapName`
const INSENSITIVE_MAP = _.fromPairs(_.map(_.keys(COMMANDS), (k)=> [k.toLowerCase(), k] ))
const runCommand = (name, args, done)=> {
  let realName = INSENSITIVE_MAP[(name || "").toLowerCase()] || "help"
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
  err && console.error(err)
  process.exit(exitCode ||  Number(!!err))
})
