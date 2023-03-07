import { ctx } from "./app";

export class Tile {
    constructor(public position, public width, public height, public src, public frictionmod, public collide){}

    public drawTile(){
        ctx.drawImage(this.src,this.position.x*this.width, this.position.y*this.height)
    }

    
}
