const _ = require('lodash')
const monstercat = require('../lib/monstercat')

const not = (fn)=> {
  return (e) => { return !fn(e) }
}
const isRemix = ({remixers, title})=> (remixers || []).length != 0 || /remix/i.test(title)
const isColab = ({artists})=> (artists || []).length > 1
const isFeaturing = ({featuring, title})=> (featuring || []).length != 0 || /feat/i.test(title)

const PODCAST_MIN_LENGTH = 60 * 20
const isLongMix = ({duration, title})=> duration > PODCAST_MIN_LENGTH || /Podcast|Album Mix/i.test(title)

const isAfter = (dateStr)=> {
  var time = new Date(dateStr).getTime()
  return ({created}) => {
    return new Date(created).getTime() > time
  }
}
const isBefore = (dateStr)=> {
  var time = new Date(dateStr).getTime()
  return ({created}) => {
    return new Date(created).getTime() < time
  }
}

const select = (dbg, args, done) => {
  const catalog = require(monstercat.CATALOG_PATH);
  var res = catalog
  var flags = [
    ['--count', 'Only outputs the count of matched entries.'],
    ['--schema', 'Only outputs the first element to help with filter development.'],
    ['--help', 'Prints this text.'],
    ['--all', 'Select every entry'],
    ['--uniq-track', 'Selects only unique tracks.']
  ]

  const runFilterIf = (flag, filterFn, info)=> {
    flags.push([flag, info])
    if (!_.includes(args, flag)) return;
    res = _.filter(res, filterFn)
  }

  const runFilterWithArg = (flag, filterFn, info)=> {
    flags.push([flag, info])
    if (!_.includes(args, flag)) return;
    var nextArg = args[args.indexOf(flag) + 1]
    res = _.filter(res, filterFn(nextArg))
  }

  runFilterIf('--remix', isRemix, 'Selects only remixes.')
  runFilterIf('--no-remix', not(isRemix), 'Excludes remixes')

  runFilterIf('--long-mix', isLongMix, 'Selects only long mixes.')
  runFilterIf('--no-long-mix', not(isLongMix), 'Excludes long mixes.')

  runFilterIf('--colab', isColab, 'Selects only songs that have two or more artists.')
  runFilterIf('--no-colab', not(isColab), 'Selects songs with only one artist.')

  runFilterIf('--featuring', isFeaturing, 'Selects only songs which feature an artist.')

  runFilterIf('--downloadable', {downloadable: true}, 'Selects only downloadable songs.')
  runFilterIf('--early-access', {inEarlyAccess: true}, 'Selects songs only avalible for early access.')

  runFilterWithArg('--after', isAfter, 'Selects songs created after the specified date.')
  runFilterWithArg('--before', isBefore, 'Selects songs created before the specified date.')

  if (_.includes(args, '--uniq-track')) res = _.values(_.fromPairs(_.map(res, (t) => [t._id, t])))

  if (_.includes(args, 'help') || _.includes(args, '--help') || args.length == 1) {
    lines = [
      "Filters songs from the cached MonsterCat Catalog.",
      "",
      "Options:",
      "",
    ]
    targetCharCount = _.max(_.map(flags, "0.length"))
    _.each(flags, ([name, info])=> {
      deltaSpaces = new Array((targetCharCount - name.length) + 1 + 3).join(' ')
      lines.push(`  ${name}${deltaSpaces} - ${info}`)
    });
    console.log(lines.join('\n'))
    return done()
  }

  if (_.includes(args, '--count')) {
    console.log(`-- 🔦  Matched ${res.length} of ${catalog.length} entries.`)
    return done()
  }

  if (_.includes(args, '--schema')) {
    console.log(catalog[0])
    return done()
  }

  console.log(JSON.stringify(res))
  return done()
}

module.exports = select;
