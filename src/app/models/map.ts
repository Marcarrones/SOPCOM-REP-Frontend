import { Goal } from "./goal";
import { Strategy } from "./strategy";

export class Map {
    constructor(
        public id: string,
        public name: string,
        public repository: string,
        public strategies: Strategy[],
        public goals: Goal[],
        public start: Goal,
        public stop: Goal,
    ) { }

    public static fromJson(data: any): Map {
        return new Map(
            data.id, 
            data.name,
            data.repository,
            JSON.parse(data.strategies).map(Strategy.fromJson),
            JSON.parse(data.goals).map(Goal.fromJson), Goal.fromJson(data.start),
            Goal.fromJson(data.stop)
        );
    }

    public clone(name: string = this.name, strategies: Strategy[] = this.strategies, goals: Goal[] = this.goals, start:Goal = this.start, stop:Goal = this.stop) : Map {
        return new Map(
            this.id,
            name,
            this.repository,
            strategies ?? this.strategies.map(s => s.clone()), 
            goals ?? this.goals.map(g => g.clone()), 
            start ?? this.start.clone(), 
            stop ?? this.stop.clone()
        );
    }
}