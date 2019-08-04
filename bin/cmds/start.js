const fs = require('fs')
const path = require('path')
const nodecli = require('shelljs-nodecli')

exports = {
  command: 'start',
  desc: 'Start the web emulator',
  builder: {
    file: {
      describe: 'Path to the file you want the web emulator to run',
      type: 'string'
    },
    launch: {
      describe: 'Start web emulator and launches the browser',
      type: 'boolean',
      default: false
    },
    port: {
      describe: 'Specify the port where the web emulator will start',
      type: 'string',
      default: '3000'
    },
    watch: {
      describe: 'Start web emulator in watch mode (requires nodemon)',
      type: 'boolean',
      default: false
    }
  },
  handler: ({ file, launch, port, watch }) => {
    try {
      if (!file) {
        throw new Error('Missing entry file!')
      }

      const nodemonPath = path.join(process.cwd(), 'node_modules', '.bin', 'nodemon')
      const webEmuPath = path.join(process.cwd(), 'node_modules', 'sense-hat-web-emu', 'dist', 'index.js')
      
      const entryFilePath = `${path.join(process.cwd(), file)}`
      console.log(`Entry file: ${entryFilePath}`)

      fs.stat(nodemonPath, err => {
        const launcher = !watch || err ? 'node' : nodemonPath

        nodecli.exec(
          launcher,
          webEmuPath,
          `--file ${entryFilePath}`,
          `--port ${port}`,
          launch ? '--launch' : ''
        )
      })
    }
    catch (error) {
      console.error(error)
    }
  }
}
