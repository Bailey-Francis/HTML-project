export class TileType {
    constructor(public id, public src, public frictionmod, public collide){}
}

export let tileTypes = {}
tileTypes['w'] = new TileType('water', './img/waterTile.png', 0.85, false)
tileTypes['g'] = new TileType('grass', './img/grassTile.png', 0.93, false)
tileTypes['g1'] = new TileType('grass', './img/grassTile1.png', 0.93, false)
tileTypes['b'] = new TileType('water', './img/waterTile.png', 0.85, true)