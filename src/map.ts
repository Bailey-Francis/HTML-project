import { Tile } from "./tiles";
import { TileType, tileTypes } from "./tiletype";
import { Vector } from "./vector";
import { tileSize } from "./app";

export class Map {
    constructor(public tiles, public width){}

    public constructMap (m: string[]) {
        let tilesArray:Tile[] = []
        for(let i:number =0; i< m.length; i++){
            tilesArray[i] = this.genTile(m[i], i)
        }
        return tilesArray
    }

    public genTile (t: string, i: number){
        let tiletype:TileType = tileTypes[t]
        let tileImage = new Image(128)
        tileImage.src = tiletype.src
        return new Tile(new Vector((i % this.width), Math.floor(i/this.width)), tileSize, tileSize, tileImage, tiletype.frictionmod, tiletype.collide)
    }

    public onTiles(pos: Vector){
        let returnTiles:Tile[] = []
        //TL,TR,BR,BL
        returnTiles.push(this.tiles[(Math.floor(pos.y/128) * this.width + Math.floor(pos.x/128))])
        returnTiles.push(this.tiles[(Math.floor(pos.y/128) * this.width + Math.floor((pos.x+60)/128))])
        returnTiles.push(this.tiles[(Math.floor((pos.y+60)/128) * this.width + Math.floor((pos.x+60)/128))])
        returnTiles.push(this.tiles[(Math.floor((pos.y+60)/128) * this.width + Math.floor(pos.x/128))])
        
        
        return returnTiles
    }

    public drawMap(){
        this.tiles.forEach(e => {
            e.drawTile()
        });
    }
}