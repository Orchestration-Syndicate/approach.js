import { Node } from "../Node/Node";

class Attribute extends Node {
    attribute: string;
    value: string;

    constructor(name: Node | string = "", value: Node | string = "") {
        super();
        if (name instanceof Node) {
            this.attribute = name.render();
        } else {
            this.attribute = name;
        }
        if (value instanceof Node) {
            this.value = value.render();
        } else {
            this.value = value;
        }
    }

    *RenderHead() {
        if (this.attribute === "") {
            return;
        }
        yield `${this.attribute}="${this.value}" `;
    }
}

export { Attribute };
