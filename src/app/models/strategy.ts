import { Edge, IdType, Node } from "vis-network/declarations/entry-esnext";

export class Strategy  {
    constructor (
        public id: string,
        public name: string,
        public x: number,
        public y: number,
        public goal_tgt: string,
        public goal_src: string,
    ) { }
    
    
    static fromJson(json: any): Strategy {
        return new Strategy (json.id, json.name, json.x, json.y, json.goal_tgt,  json.goal_src);
    }
    
    public asNode() : Node {
        return { id: `S_${this.id}`, label: this.name, x: this.x, y: this.y, 
            color: "white",  
            font: { color: 'black' },
            shape: 'box',
        };
    }

    // Strategy returns edges g_src -> s -> g_tgt
    public asEdge() : Edge[] {
        return [ this.buildEdge(`${this.goal_src}`, `S_${this.id}`), this.buildEdge(`S_${this.id}`, `${this.goal_tgt}`) ];
    }

    private buildEdge(src: string, tgt: string) : Edge {
        return { from: src, to: tgt, arrows: 'middle', color: "#2B7CE9", smooth: { enabled: true, type: 'cubicBezier', roundness: 0.5 } }
    }
    // Returns true if the id of a Node is the same as the strategy id
    public static findByIdType(strategy: Strategy, id: IdType) : boolean {
        return `S_${strategy.id}` === id; // S_ prefix is used in the vis-network graph
    }

    clone(id = this.id, name = this.name, x = this.x, y = this.y, goal_tgt = this.goal_tgt, goal_src = this.goal_src): Strategy {
        return new Strategy(id, name, x, y, goal_tgt, goal_src);
    }
}