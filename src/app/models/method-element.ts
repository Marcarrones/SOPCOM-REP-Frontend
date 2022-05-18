export class MethodElement {
    private id: string;
    private name: string;
    private description: string;
    private figure: string;
    private type: number;

    constructor(
        id: string, 
        name: string, 
        description: string, 
        figure: string, 
        type: number
    ) {
        this.id = id
        this.name = name
        this.description = description
        this.figure = figure
        this.type = type
    }
}
