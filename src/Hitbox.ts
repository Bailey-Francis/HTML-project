import { ctx } from "./app";
import { Vector } from "./vector";

interface NewHitbox {
    id: number;
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Hitbox {
    id: number;
    x: number;
    y: number;
    w: number;
    h: number;
    collideX: Set<number>;
    collideY: Set<number>;
}

interface HitBoxMarker {
    id: number;
    marker: 'low' | 'high';
    value: number;
}

export interface CollisionResult {
    id: number;
    collideX: number[]
    collideY: number[]
    collided: number[]
    collidedAny: boolean;
}

export class HitboxTracker {

    // Keep track of all hitboxes
    private hitboxes: { [id: number]: Hitbox } = {};

    // Will be using axis aligned bounding boxes
    // So we should track each axis separately
    public axisX: HitBoxMarker[] = [];
    private axisY: HitBoxMarker[] = [];

    constructor() {}

    // Add a hitbox to the tracker
    public addHitbox(hitbox: NewHitbox) {

        const newHitbox: Hitbox = {
            ...hitbox,
            collideX: new Set(),
            collideY: new Set()
        }

        this.hitboxes[newHitbox.id] = newHitbox;

        // This involves adding two markers to each axis
        // Since we are using axis aligned bounding boxes
        const xTouch = this.addToAxis(this.axisX, hitbox.x, hitbox.x + hitbox.w, hitbox.id);
        const yTouch = this.addToAxis(this.axisY, hitbox.y, hitbox.y + hitbox.h, hitbox.id);

        const _x = Array.from(xTouch);
        const _y = Array.from(yTouch);
        const _xy = _x.filter(x => _y.includes(x));

        const result : CollisionResult = {
            id: hitbox.id,
            collideX: _x,
            collideY: _y,
            collided: _xy,
            collidedAny: _xy.length > 0
        }

        newHitbox.collideX = new Set(_x);
        newHitbox.collideY = new Set(_y);

        newHitbox.collideX.forEach(id => {
            this.hitboxes[id].collideX.add(hitbox.id);
        });

        newHitbox.collideY.forEach(id => {
            this.hitboxes[id].collideY.add(hitbox.id);
        });

        return result

    }

    // Add a hitbox to the tracker for a specific axis
    public addToAxis(axis: HitBoxMarker[], low: number, high: number, id: number) {
        
        const lowMarker: HitBoxMarker = {
            id,
            marker: 'low',
            value: low
        };

        const highMarker: HitBoxMarker = {
            id,
            marker: 'high',
            value: high
        };

        let insideNow = false;
        let outsideNow = false;

        const insideOf = new Set<number>();
        let touches = new Set<number>();

        for (let i = 0; i < axis.length; i++) {

            if (!insideNow && axis[i].value > low) {
                insideNow = true
                touches = new Set(insideOf);
                axis.splice(i, 0, lowMarker);
                continue;
            }

            if (insideNow && axis[i].value > high) {
                axis.splice(i, 0, highMarker);
                outsideNow = true;
                break
            }
            

            if (axis[i].marker === 'low') {
                insideOf.add(axis[i].id);
            } else {
                insideOf.delete(axis[i].id);
            }

            if (insideNow && axis[i].marker === 'low') {
                touches.add(axis[i].id);
            }
    
        }

        if (!insideNow) {
            axis.push(lowMarker);
        }
        if (!outsideNow) {
            axis.push(highMarker);
        }

        return touches
    }

    public moveHitbox(id: number, change: Vector){
        //For the interacts, the first element is new collisions, the second is collisions to be removed
        const interactsOnX:number[][] = this.moveOnAxis(this.axisX, id, change.x)
        const interactsOnY:number[][] = this.moveOnAxis(this.axisY, id, change.y)
        //add to XCollision
        for(let i:number = 0; i<interactsOnX[0].length; i++){
            this.hitboxes[id].collideX.add(interactsOnX[0][i])
        }
        //add to YCollision
        for(let i:number = 0; i<interactsOnY[0].length; i++){
            this.hitboxes[id].collideY.add(interactsOnY[0][i])
        }
        //remove from XCollision
        for(let i:number = 0; i<interactsOnX[1].length; i++){
            this.hitboxes[id].collideX.delete(interactsOnX[1][i])
        }
        //remove from YCollision
        for(let i:number = 0; i<interactsOnY[1].length; i++){
            this.hitboxes[id].collideY.delete(interactsOnY[1][i])
        }
        
        //move hitbox
        this.hitboxes[id].x+=change.x
        this.hitboxes[id].y+=change.y

        const _x = Array.from(this.hitboxes[id].collideX);
        const _y = Array.from(this.hitboxes[id].collideY);
        const _xy = _x.filter(x => _y.includes(x));

        const result : CollisionResult = {
            id: id,
            collideX: _x,
            collideY: _y,
            collided: _xy,
            collidedAny: _xy.length > 0
        }
        return result
    }

    public moveOnAxis(axis: HitBoxMarker[], id: number, change: number){
        let close:'high' | 'low' = 'high'
        let open:'high' | 'low' = 'low'
        //Make lists of which side passed what, to then add to the arrays
        let Entered:number[] = []
        let Left:number[] = []
        //assigning directionality
        if(change>0){
            close='high'
            open='low'
        }
        if(change<0){
            close='low'
            open='high'
        }

        //Our two markers, regardless of direction
        const frontMarker: HitBoxMarker = axis.filter(e => e.id==id && e.marker==close)[0]
        const backMarker: HitBoxMarker = axis.filter(e => e.id==id && e.marker==open)[0]
        //Check if any hitboxes have a value between our old value
        if(close=='high'){
            //Front-side passes an Open marker, add to Entered
            axis.filter(e=> (e.marker == open && e.value>=frontMarker.value && e.value<=frontMarker.value+change))
                .forEach(e=> Entered.push(e.id))
            //Back-side passes a Closed marker, add to Left
            axis.filter(e=> (e.marker == close && e.value>=backMarker.value && e.value<=backMarker.value+change))
                .forEach(e=> Left.push(e.id))
        }
        if(close=='low'){
            axis.filter(e=> (e.marker == open && e.value<=frontMarker.value && e.value>=frontMarker.value+change))
                .forEach(e=> Entered.push(e.id))
            axis.filter(e=> (e.marker == close && e.value<=backMarker.value && e.value>=backMarker.value+change))
                .forEach(e=> Left.push(e.id))
        }
        //Move Markers
        axis.filter(e => e.id==id).forEach(f => {f.value+=change})

        //Entered and Left contain all of the elements we need to modify
        return [Entered, Left]

    }

    public drawHitbox(id:number){
        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.hitboxes[id].x, this.hitboxes[id].y,this.hitboxes[id].w, this.hitboxes[id].h)
    }

}
