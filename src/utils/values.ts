import { environment } from "src/environments/environment.prod";

export class Values {

    //static SERVER_URL = "http://gessi3.essi.upc.edu"; //Crides SOPCO fan servir aquests
    static SERVER_URL = "http://localhost";
    
    //CRIDES V2SOPCOM fa servir aquesta variable
    //static URL_V2 = "http://localhost:1031/index.php/"; //localhost
    //static URL_V2 = "http://gessi3.essi.upc.edu:1031/index.php/"; //servidor

    //static SERVER_PORT = ":1026";
    //static SERVER_PORT2 = ":1031";
    static SERVER_PORT_V3 = ":1036";

    static ENTRY_FILE = "/index.php/";

    static RESOURCES = {
        REPOSITORY: 'repository',
        METHOD_CHUNK: 'method-chunk',
        METHOD_ELEMENT: 'method-element',
        CRITERION: 'criterion',
        GOAL: 'goals',
        STRATEGY: 'strategy',
        RELATIONS: 'relations',
        TYPES: 'types',
        VALUES: 'values',
        MAPS: 'maps',
    }

    
}