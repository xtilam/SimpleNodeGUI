connect()

async function connect() {
    const { JS_PATH } = process.env

    let isStarted = false
    const { init, run } = require(JS_PATH)

    try { 
        await init()
        process.on('message', (message) => {  
            if (message !== 'start' || isStarted) return
            isStarted = true
            try {
                run()   
            } catch (error) {
                console.error(error)
                process.exit(0)
            }
        })
    } catch (error) {
        console.error(error)
        process.exit(0)
    }
}