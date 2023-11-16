const fork = require('child_process').fork
const { spawn } = require('child_process')
const net = require('net')
const path = require('path')

const TASK_CLIENT_JS_PATH = path.join(__dirname, 'TaskClient.js')
const IS_DEBUG_MODE = true

class TaskInit {
    #initJSPath = ''

    #listTaskRunner = [new TaskRunner(), new TaskRunner()]
    #curTaskIndex = 0

    constructor(initJSPath, exePath) {
        this.#initJSPath = initJSPath
        this.#listTaskRunner.forEach(task => {
            task.setJSPath(initJSPath)
            task.setExePath(exePath)
        })
    }
    static async init(initJSPath, exePath) {
        const taskInit = new TaskInit(initJSPath, exePath)
        return taskInit
    }
    async runTask() {
        const [oldTask, newTask]
            = (this.#curTaskIndex === 0
                ? (this.#curTaskIndex = 1, [0, 1])
                : (this.#curTaskIndex = 0, [1, 0])
            ).map((index) => this.#listTaskRunner[index])

        oldTask.restart()
        newTask.start()
    }
}

class TaskRunner {
    #progress = null
    #env = { ...process.env }
    #exePath = process.execPath
    setJSPath(jsPath) {
        this.#env.JS_PATH = jsPath
    }
    setExePath(exePath) {
        if(exePath) this.#exePath = exePath
    }
    restart() {
        this.#killProgress()
        this.#startProgress()
    }
    start() {
        if (!this.#progress) this.#startProgress()
        this.#runTask()
        const progress = this.#progress
        progress.send('start')
    }
    #killProgress() {
        if (!this.#progress) return
        this.#progress.kill('SIGINT')
        this.#progress = null
    }
    #startProgress() {
        console.log(this.#exePath)
        const progress
            = this.#progress
            = fork(TASK_CLIENT_JS_PATH, {
                stdio: "inherit",
                env: this.#env,
                execPath: this.#exePath
            })
        progress.on('close', () => {
            if (this.#progress !== progress) return
            this.#progress = null
        })
    }
    #runTask() {
        if (!this.#progress) return
        this.#progress.emit('__START')
    }
}

module.exports = { TaskInit }