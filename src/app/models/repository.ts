import { RepositoryStatus } from "./repository-status";

export class Repository {
    public id: string;
    public name: string;
    public description: string;
    public status: RepositoryStatus;
    public inUse: boolean = false;
    
    constructor(id: string, name: string, description: string, status: RepositoryStatus, inUse: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.inUse = inUse;
    }
    
    static fromJson(data: any): Repository {
      return new Repository(
        data.id, 
        data.name, 
        data.description,
        RepositoryStatus.fromJson(JSON.parse(data.status)), 
        data.inUse);
    }
}
