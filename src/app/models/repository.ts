import { RepositoryStatus } from "./repository-status";

export class Repository {
    public id: string;
    public name: string;
    public description: string;
    public status: RepositoryStatus;

    constructor(id: string, name: string) {
        this.id = id
        this.name = name
    }

}
