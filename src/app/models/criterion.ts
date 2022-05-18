export class Criterion {
    private id: number;
    private name: string;
    private values: string[];

    constructor(id: number, name: string, values: string[]) {
        this.id = id
        this.name = name
        this.values = values
    }

}
