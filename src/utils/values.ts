import { environment } from "src/environments/environment.prod";

export class Values {
    // TODO: make env values run params
    
    //static SERVER_URL = "http://gessi3.essi.upc.edu"; //Crides SOPCO fan servir aquests
    static SERVER_URL = "http://localhost";
    
    //CRIDES SOPCOM_V3 fa servir aquesta variable
    static SERVER_PORT_V3 = ":1036";
    static CONT_PORT = ":1038";

    static ENTRY_FILE = "/index.php/";

    static RESOURCES = {
        REPOSITORY: 'repository',
        STATUS: "status",
        METHOD_CHUNK: 'method-chunk',
        METHOD_ELEMENT: 'method-element',
        CRITERION: 'criterion',
        GOAL: 'goal',
        STRATEGY: 'strategy',
        RELATIONS: 'relations',
        TYPES: 'types',
        VALUES: 'values',
        MAPS: 'maps',
    }

    
}