export class Criterion {
    private id: number | null;
    private name: string;
    private values: any[];

    constructor(id: number | null, name: string, values: any[]) {
        this.id = id
        this.name = name
        this.values = values
    }

}
