import { Node } from "../Node/Node";

class Token extends Node {
    constructor(content: string) {
        super();
        this.content = content;
    }
}

export { Token };
