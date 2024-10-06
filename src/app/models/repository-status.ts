export class RepositoryStatus {
    public id: string;
    public name: string;
    
    constructor(id: string, name: string) {
        this.id = id
        this.name = name
    }
    
    static fromJson(status: any): RepositoryStatus {
        return new RepositoryStatus(status.id, status.name);
    }
}
