#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const nodecli = require('shelljs-nodecli')

if (process.argv.length >= 3) {
  const nodemonPath = path.join(process.cwd(), 'node_modules', '.bin', 'nodemon')
  const webEmuPath = path.join(process.cwd(), 'node_modules', 'sense-hat-web-emu', 'dist', 'index.js')
  
  const entryFileName = process.argv[process.argv.length - 1]
  const entryFilePath = `${path.join(process.cwd(), entryFileName)}`

  console.log('--------------')
  console.log(`Entry file: ${entryFilePath}`)

  fs.stat(nodemonPath, (err, _) => {
    if (err) {
      nodecli.exec('node', webEmuPath, entryFilePath)
    } else {
      nodecli.exec(nodemonPath, webEmuPath, entryFilePath)
    }
  })
} else {
  console.error('Missing entry file!')
}
