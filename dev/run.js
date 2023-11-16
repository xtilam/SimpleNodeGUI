const path = require('path')

module.exports = {
    init() {
        const { QMainWindow, WidgetAttribute } = require('@nodegui/nodegui')
        const window = new QMainWindow()
        window.setAttribute(WidgetAttribute.WA_ShowWithoutActivating, true)
        window.setVisible(true)
        window.resize(10, 10)
        window.move(-100, -100)
        global._window = window 
    },
    run() {
        const DIST_DIR = path.join(__dirname, '../dist')
        const MAIN_JS_PATH = path.join(DIST_DIR, 'main.js')
        require(MAIN_JS_PATH)
    }
}