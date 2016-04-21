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

module.exports = (robot) ->
  config = require('hubot-conf')('offix', robot)
  group = new Group robot

  robot.respond /offix list/i, (res) ->
    baseUrl = config('baseurl')
    key = config('key')
    url = baseUrl + 'api/users' + '?key=' + key
    res.send 'not implemented yet'
