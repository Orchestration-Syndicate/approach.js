import { Node } from "../Node/Node";

class Attribute extends Node {
    name: string;
    value: string;

    constructor(name: Node | string, value: Node | string) {
        super();
        if (typeof name === "string") {
            this.name = name;
        } else {
            this.name = name.render();
        }
        if (typeof value === "string") {
            this.value = value;
        } else {
            this.value = value.render();
        }
    }

    *RenderHead() {
        yield this.name;
        yield "=\"";
        yield this.value;
        yield "\"";
    }
}

export { Attribute }
