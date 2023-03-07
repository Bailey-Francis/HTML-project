import { frameTick } from "./keys";
import { Player } from "./player";
import { Map } from "./map";
import {HitboxTracker} from './Hitbox'


export const testMap:string[] = [
    'b','b','g','g','b','b','b',
    'b','g','g','g','g','b','b',
    'b','g','g1','g','g','b','b',
    'b','g','g','g','g','b','b',
    'b','b','b','b','b','b','b',
    'b','w','g','g','g','w','b',
    'b','w','g','w','g','w','b',
    'b','w','g','g','g','w','b',
    'b','w','g','g','g','w','b',
    'b','w','g','g','g','w','b',
    'b','w','g','g','g','w','b',
    'b','w','w','w','w','w','b',
    'b','b','b','b','b','b','b',
]

//Initialize Canvas
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d");
ctx.canvas.width=window.innerWidth-18
ctx.canvas.height=window.innerHeight-18

export const tileSize:number = 128

//Initialize Map
export let thisMap = new Map([], 7)
thisMap.tiles = thisMap.constructMap(testMap);

//Initialize Player
export const player = new Player()
player.initializePlayer()

//Initialize Hitboxes
export const tracker = new HitboxTracker();
tracker.addHitbox({
    id: player.id,
    x: player.position.x,
    y: player.position.y,
    w: player.size,
    h: player.size
});

tracker.addHitbox({
    id: 1,
    x: 400,
    y: 400,
    w: 100,
    h: 100
})
tracker.addHitbox({
    id: 2,
    x: 300,
    y: 300,
    w: 110,
    h: 110
})

//Game loop
function update() {
    player.updatePlayer()
    frameTick()
    draw()
}

//Drawing Screen
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    thisMap.drawMap()
    player.drawPlayer()
    tracker.drawHitbox(player.id)
    tracker.drawHitbox(1)
    tracker.drawHitbox(2)
}

//Listeners
//resize window
window.onresize = function(){ location.reload(); }

//FPS
setInterval(update, 18)