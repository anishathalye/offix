# Description:
#   A script that interfaces with offix.
#
# Configuration:
#   HUBOT_OFFIX_BASEURL - the base URL of the offix installation (which should
#     end with a trailing slash).
#   HUBOT_OFFIX_KEY - the API key.
#
# Commands:
#   hubot offix list - show who is in the office
#
# Author:
#   anishathalye

http = require('http')
moment = require('moment')

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
format = (data) ->
  line = (elem) ->
    if elem.lastSeen?
      date = new Date(elem.lastSeen)
      date = moment().to(date)
    else
      date = 'never'
    "#{elem.username} | #{elem.realName} | #{date}"
  lines = (line(i) for i in data)
  lines.unshift("*username* | *real name* | *last seen*")
  lines.join('\n')

module.exports = (robot) ->
  config = require('hubot-conf')('offix', robot)

  robot.respond /offix list/i, (res) ->
    baseUrl = config('baseurl')
    key = config('key')
    url = baseUrl + 'api/users' + '?key=' + key
    getHttp url, (data, err) ->
      if data?
        res.send format(data)
      else
        res.send 'http error: ' + err
