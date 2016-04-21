fs = require 'fs'
path = require 'path'

module.exports = (robot, scripts) ->
  scriptsPath = path.resolve(__dirname, 'src')
  if fs.existsSync scriptsPath
    for script in fs.readdirSync(scriptsPath).sort()
      if scripts? and '*' not in scripts
        robot.loadFile(scriptsPath, script) if script in scripts
      else
        robot.loadFile(scriptsPath, script)
