import { environment } from "src/environments/environment.prod";

export class Values {

    static SERVER_URL = "http://127.0.0.1";

    static SERVER_PORT = ":1026";

    static ENTRY_FILE = "/index.php/";

    static RESOURCES = {
        METHOD_CHUNK: 'method-chunk',
        METHOD_ELEMENT: 'method-element',
        CRITERION: 'criterion',
        GOAL: 'goal',
        RELATIONS: 'relations',
        TYPES: 'types',
    }
}