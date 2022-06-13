import { Criterion } from "./criterion";
import { Goal } from "./goal";
import { MethodElement } from "./method-element";

export class MethodChunk {
    private id: string;
    private name: string;
    private description: string;
    private abstract: boolean | null;
    private intention: Goal | null;
    private processPart: MethodElement | null;
    private tools: any[];
    private situation: any[];
    private productPart: any[];
    private roles: any[];
    private contextCriteria: any[];
    private me_struct_rel_to: any[];
    private me_struct_rel_from: any[];
    private activity_rel_to: any[];
    private activity_rel_from: any[];


    constructor(
        id: string, 
        name: string, 
        description: string, 
        abstract: boolean | null, 
        intention: Goal | null, 
        processPart: MethodElement | null, 
        tools: MethodElement[], 
        situation: MethodElement[], 
        productPart: MethodElement[], 
        roles: any[], 
        contextCriteria: Criterion[],
        me_struct_rel_to: any[],
        me_struct_rel_from: any[],
        activity_rel_to: any[],
        activity_rel_from: any[]
    ) {
        this.id = id
        this.name = name
        this.description = description
        this.abstract = abstract
        this.intention = intention
        this.processPart = processPart
        this.tools = tools
        this.situation = situation
        this.productPart = productPart
        this.roles = roles
        this.contextCriteria = contextCriteria
        this.me_struct_rel_to = me_struct_rel_to
        this.me_struct_rel_from = me_struct_rel_from
        this.activity_rel_to = activity_rel_to
        this.activity_rel_from = activity_rel_from
    }

}
