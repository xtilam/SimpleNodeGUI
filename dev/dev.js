const path = require('path')
const fs = require('fs')
const nodemon = require('nodemon')
const { spawn } = require('child_process')
const { TaskInit } = require('./TaskInit')

const DIST_DIR = path.join(__dirname, '../dist')
const DEV_DIR = path.join(__dirname)

const MAIN_JS_PATH = path.join(DIST_DIR, 'main.js')
const NODE_GUI_INIT_JS_PATH = path.join(DEV_DIR, 'run.js')

main()

async function main() {
    const taskInit = await TaskInit.init(NODE_GUI_INIT_JS_PATH, require('@nodegui/qode').qodePath)

    const mon = nodemon({
        exec: ' ',
        watch: MAIN_JS_PATH,
    })

    const runApp = taskInit.runTask.bind(taskInit)

    mon.on('restart', runApp)

    runApp()
}


function delay(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
}
