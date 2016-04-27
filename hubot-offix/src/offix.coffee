# Description:
#   A script that interfaces with offix.
#
# Configuration:
#   HUBOT_OFFIX_BASEURL - the base URL of the offix installation (which should
#     end with a trailing slash).
#   HUBOT_OFFIX_KEY - the API key.
#   HUBOT_OFFIX_LIMIT - the number of hours to show in the default view
#     (defaults to 2).
#
# Commands:
#   hubot offix list - show who is in the office
#
# Author:
#   anishathalye

http = require('http')
moment = require('moment')
table = require('text-table')

moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s ago",
        s:  "sec",
        m:  "1 min",
        mm: "%d min",
        h:  "1 hr",
        hh: "%d hrs",
        d:  "1 day",
        dd: "%d days",
        M:  "1 month",
        MM: "%d months",
        y:  "1 year",
        yy: "%d years"
    }
});

DEFAULT_LIMIT = 2 # Hours
DEFAULT_REFRESH = 15 # Seconds
DEFAULT_ROOM = 'general'

getHttp = (url, callback) ->
  try
    http.get url, (res) ->
      body = ''
      res.on 'data', (chunk) ->
        body += chunk
      res.on 'end', () ->
        obj = JSON.parse body
        callback(obj)
      res.on 'error', (err) ->
        callback(null, err)
    .on 'error', (err) ->
      callback(null, err)
  catch err
    callback(null, err)

# matches API, which returns [{username, realName, lastSeen}]
# limit in milliseconds
format = (data, limit) ->
  line = (elem) ->
    if elem.lastSeen?
      date = new Date(elem.lastSeen)
      date = moment(date).fromNow(true)
    else
      date = 'never'
    [elem.realName, date]
  recent = (elem) ->
    if limit?
      diff = new Date() - new Date(elem.lastSeen)
      return diff < limit
    else
      return true
  lines = (line(i) for i in data when recent(i))
  lines.unshift(['---------', '----'])
  lines.unshift(['real name', 'seen'])
  "```\n#{table(lines)}\n```"

# Returns list of users that have just been seen after not been seen in a while.
# prevUsers = a list of users [{username, realName, lastSeen}]
# nextUsers = a list of users [{username, realName, lastSeen}]
# limit = threshold for oldness (ms)
newUsers = (prevUsers, nextUsers, limit) ->

  if prevUsers.length is 0
    return []

  old = {}

  isNew = (u) ->
    if limit and u.lastSeen?
      diff = new Date() - new Date(u.lastSeen)
      return diff < limit

  putOld = (u) ->
    if u? and not isNew(u)
      old[u.username] = true

  putOld(user) for user in prevUsers

  recentNew = (u) ->
    return isNew(u) and old[u.username]

  return (user for user in nextUsers when recentNew(user))

module.exports = (robot) ->
  config = require('hubot-conf')('offix', robot)

  usersCache = []

  getLimit = ->
    return parseInt(config('limit', DEFAULT_LIMIT)) * 60 * 60 * 1000

  checkRecentNewUsers = (oldUsers, nextUsers) ->
    limit = getLimit()
    recent = newUsers(oldUsers, nextUsers, limit)
    if recent.length > 0
      room = config('room', DEFAULT_ROOM)
      for user in recent
        if user.shouldBroadcast
          robot.messageRoom room, user.realName + ' is in the office!'

  refreshUsersCache = ->
    baseUrl = config('baseurl')
    key = config('key')
    url = baseUrl + 'api/users' + '?key=' + key
    getHttp url, (data, err) ->
      if data?
        checkRecentNewUsers(usersCache, data)
        usersCache = data
      else
        return

  refreshUsersCache()
  setInterval(refreshUsersCache, config('refresh', DEFAULT_REFRESH) * 1000)

  robot.respond /offix list$/i, (res) ->
    limit = getLimit()
    res.send format(usersCache, limit)

  robot.respond /offix list all$/i, (res) ->
    res.send format(usersCache)
