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
        m:  "a min",
        mm: "%d min",
        h:  "an hour",
        hh: "%d hrs",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});

DEFAULT_LIMIT = 2

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

module.exports = (robot) ->
  config = require('hubot-conf')('offix', robot)

  robot.respond /offix list$/i, (res) ->
    baseUrl = config('baseurl')
    key = config('key')
    url = baseUrl + 'api/users' + '?key=' + key
    getHttp url, (data, err) ->
      if data?
        limit = parseInt(config('limit', DEFAULT_LIMIT)) * 60 * 60 * 1000
        res.send format(data, limit)
      else
        res.send 'http error: ' + err

  robot.respond /offix list all$/i, (res) ->
    baseUrl = config('baseurl')
    key = config('key')
    url = baseUrl + 'api/users' + '?key=' + key
    getHttp url, (data, err) ->
      if data?
        res.send format(data)
      else
        res.send 'http error: ' + err
