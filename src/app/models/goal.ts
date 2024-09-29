import { Node } from "vis-network/declarations/entry-esnext";

export class Goal{
    constructor(
        public id: string,
        public name: string,
        public x: number,
        public y: number,
        public map: string,
    ) {}
    
    public static fromJson(json: any): Goal {
        return new Goal(json.id, json.name, json.x, json.y, json.map);
    }
    
    public asNode() : Node {
        return { id: `${this.id}`, label: this.name, x: this.x, y: this.y };
    }
    public clone(id = this.id, name = this.name, x= this.x,y = this.y): Goal {
        return new Goal(id, name, x, y, this.map);
    }
}