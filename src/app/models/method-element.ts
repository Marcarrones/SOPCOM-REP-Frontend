import { AbstractControlDirective } from "@angular/forms";

export class MethodElement {
    private id: string;
    private name: string;
    private abstract: boolean;
    private description: string;
    private figure: string;
    private type: number;
    private me_struct_rel: any[];
    private activity_rel: any[];
    private artefact_rel: any[];

    constructor(
        id: string, 
        name: string, 
        abstract: boolean,
        description: string, 
        figure: string, 
        type: number,
        me_struct_rel: any[],
        activity_rel: any[],
        artefact_rel: any[]
    ) {
        this.id = id
        this.name = name
        this.abstract = abstract
        this.description = description
        this.figure = figure
        this.type = type
        this.me_struct_rel = me_struct_rel
        this.activity_rel = activity_rel
        this.artefact_rel = artefact_rel
    }
}
