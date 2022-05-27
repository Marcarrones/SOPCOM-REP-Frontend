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
    private tools: MethodElement[];
    private situation: MethodElement[];
    private productPart: MethodElement[];
    private roles: MethodElement[];
    private contextCriteria: Criterion[];


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
        roles: MethodElement[], 
        contextCriteria: Criterion[]
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
    }

}
