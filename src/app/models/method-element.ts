import { AbstractControlDirective } from "@angular/forms";

export class MethodElement {
    private id: string;
    private name: string;
    private abstract: boolean;
    private description: string;
    private figure: string;
    private type: number;
    private me_struct_rel_to: any[] = [];
    private me_struct_rel_from: any[] = [];
    private activity_rel_to: any[] = [];
    private activity_rel_from: any[] = [];
    private artefact_rel_to: any[] = [];
    private artefact_rel_from: any[] = [];

    constructor(
        id: string, 
        name: string, 
        abstract: boolean,
        description: string, 
        figure: string, 
        type: number,
        me_struct_rel_to = [],
        me_struct_rel_from = [],
        activity_rel_to = [],
        activity_rel_from = [],
        artefact_rel_to = [],
        artefact_rel_from = [],
    ) {
        this.id = id
        this.name = name
        this.abstract = abstract
        this.description = description
        this.figure = figure
        this.type = type
        this.me_struct_rel_to = me_struct_rel_to
        this.me_struct_rel_from = me_struct_rel_from
        this.activity_rel_to = activity_rel_to
        this.activity_rel_from = activity_rel_from
        this.artefact_rel_to = artefact_rel_to
        this.artefact_rel_from = artefact_rel_from
    }
}
