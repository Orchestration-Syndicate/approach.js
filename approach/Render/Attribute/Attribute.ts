import { Node } from "../Node/Node";

class Attribute extends Node {
    attribute: string | Node;
    value: string | Node;

    constructor(name: Node | string = "", value: Node | string = "") {
        super();
        this.attribute = name;
        this.value = value;
    }

    *RenderHead() {
        if (this.attribute === "") {
            return;
        }

        if (this.attribute instanceof Node) {
            yield this.attribute.render();
        } else {
            yield this.attribute;
        }
        yield "=\"";
        if (this.value instanceof Node) {
            yield this.value.render();
        } else {
            yield this.value;
        }
        yield "\" ";
    }
}

export { Attribute }
