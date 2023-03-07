export class Vector {

    constructor(public x, public y){}

    public addVec (v: Vector){
        return new Vector(this.x + v.x, this.y + v.y)
    }sd

    public addConst (v: number){
        return new Vector(this.x + v, this.y + v);
    }

    public scale (v: number){
        return new Vector(this.x * v, this.y * v);
    }

    public magnitude () {
        return  Math.sqrt((this.x**2) + (this.y**2))
    }

    public normalize () {
        let size = this.magnitude();
        return new Vector(this.x / size, this.y / size);
    }

    public calcTile (v:number) {
        //the new X = Math.floor(this.x / 128)
    }

}