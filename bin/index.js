#!/usr/bin/env node

const path = require('path')
const nodeCLI = require('shelljs-nodecli')

const webEmuPath = `${path.join(__dirname, '..', 'dist')}/index.js`
const entryFileName = process.argv[process.argv.length - 1]
const entryFilePath = `${path.join(process.cwd(), entryFileName)}`

nodeCLI.exec('node', webEmuPath, entryFilePath)
