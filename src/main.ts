import { Direction, QApplication, QBoxLayout, QMainWindow, QPushButton, QWidget, QTime } from "@nodegui/nodegui"

main()

async function main() {
    const window: QMainWindow = global._window || new QMainWindow()
    const centralWidget = new QWidget(window)

    window.setWindowTitle('Hello world')
    window.setCentralWidget(centralWidget)
    window.move(2000, 200)
    window.resize(400, 400)
    window.setVisible(true)

    const button = new QPushButton()
    const layout = new QBoxLayout(Direction.TopToBottom, centralWidget)

    button.setText(`counter 0`)
    layout.addWidget(button)
    layout.addWidget(new QWidget())


    let counter = 0

    button.addEventListener('clicked', () => {
        button.setText(`counter ${++counter}`)
        setTimeout(() => {
            console.log('run cai 12345')
        })
    })
    
    console.log(process.pid)
    QApplication.instance().exec()
    // setInterval(QApplication.instance().processEvents.bind(QApplication.instance()), 1)
}

/**
    export function Counter(){
        const [count, setCount] = createSignal(0)
    
        return <window layout="row" title="Hello world">
            <button onClick={()=>setCount(count() + 1)}>count: { counter() }</button>
            <widget layout="row">
                <textfield placeHoder="please input name" value={}/>
            </widget>
        </window>    
    }
 */
