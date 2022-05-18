import { environment } from "src/environments/environment.prod";

export class Values {

    static SERVER_URL = "http://127.0.0.1";
    static SERVER_URL_PROD = "";

    static SERVER_PORT = ":3000";
    static SERVER_PORT_PROD = "";

    static ENTRY_FILE = "/index.php/";

    static RESOURCES = {
        METHOD_CHUNK: 'method-chunk',
        METHOD_ELEMENT: 'method_element',
        CRITERION: 'criterion',
        GOAL: 'goal',
        RELATIONS: 'relations',
        TYPES: 'types',
    }
}