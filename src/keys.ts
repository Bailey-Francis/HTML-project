import { player } from "./app"

const keyMap = {}

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase()
    if (!keyMap[key]){
        keyMap[key] = 1
    }
})

document.addEventListener('keyup', (event) => {
    keyMap[event.key.toLowerCase()] = undefined
})

export function frameTick () {
    Object.keys(keyMap).forEach(k => keyMap[k]+=1)
}

function isDown ( key: string ) {
    return (keyMap[key]) ? 1 : 0
}


function didJustPress( key: string ) {
    return keyMap[key] == 1
}

export function movingForwards () {
    return isDown('w')
}
export function movingLeft () {
    return isDown('a')
}
export function movingDown () {
    return isDown('s')
}
export function movingRight () {
    return isDown('d')
}

export function dashed () {
    return didJustPress('shift')
}