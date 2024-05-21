export class Repository {
    public id: string;
    public name: string;
    public description: string;
    public status: number;

    constructor(id: string, name: string) {
        this.id = id
        this.name = name
    }

}
