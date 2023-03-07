import {ctx, thisMap, tracker} from './app'
import { movingRight, movingLeft, movingDown, movingForwards, dashed } from './keys'
import { Vector } from './vector'

export class Player{
    public id: number
    public position:Vector
    public velocity:Vector
    public img: HTMLImageElement
    public size = 60
    public accel: number = 1.7;
    public friction: number = 0.83;
    public dashSpeed: number = 20;

    public initializePlayer(){
        this.id = 0
        this.velocity = new Vector(0,0)
        this.position = new Vector(150,150)
        this.img = new Image(60)
        this.img.src = './img/DemonPlayer.png'
    }

    public updatePlayer(){
        this.movePlayer()
    }

    public movePlayer(){
        let inputAcceleration = new Vector(
            movingRight() - movingLeft(),
            movingDown() - movingForwards()
        ).scale(this.accel)
        
        this.velocity = this.velocity
            .addVec(inputAcceleration)
        thisMap.onTiles(this.position).forEach(e=> this.velocity = this.velocity.scale(e.frictionmod))
    
        if (dashed()){
            this.velocity = this.velocity
                .normalize()
                .scale(this.dashSpeed)
        }
        this.position = this.position   
            .addVec(this.velocity);

        let results = tracker.moveHitbox(this.id, this.velocity)
        if(results.collidedAny){
            console.log("1")
        }
    }


    public drawPlayer(){
        ctx.drawImage(this.img, this.position.x, this.position.y)
    }
}
