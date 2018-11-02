#!/usr/bin/env node

const path = require('path')
const nodecli = require('shelljs-nodecli')

const webEmuPath = `${path.join(__dirname, '..', 'dist')}/index.js`
const entryFileName = process.argv[process.argv.length - 1]
const entryFilePath = `${path.join(process.cwd(), entryFileName)}`
const nodemonPath = `${path.join(process.cwd(), 'node_modules', '.bin')}/nodemon`

nodecli.exec(nodemonPath, webEmuPath, entryFilePath)
