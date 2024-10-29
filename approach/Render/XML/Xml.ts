import { Node } from "../Node/Node";

class XML extends Node {
    public nodes: XML[] = [];
    public attributes: { [key: string]: string } = {};
    public tag: string;
    public selfContained: boolean;
    public suffix: string | null = null;
    public prefix: string | null = null;
    public before: string | null = null;
    public after: string | null = null;

    constructor(tag: string = "", content: string = "", attributes: { [key: string]: string } = {}, selfContained: boolean = false) {
        super(content);
        this.tag = tag;
        this.attributes = attributes;
        this.selfContained = selfContained;
    }

    *RenderHead() {
        let attr = "";
        for (let key in this.attributes) {
            attr += ` ${key}="${this.attributes[key]}"`;
        }

        if (this.selfContained) {
            yield `${this.before || ''}<${this.tag}${attr} />`;
        } else {
            yield `${this.before || ''}<${this.tag}${attr}>${this.prefix || ''}`;
        }
    }

    *RenderTail() {
        if (!this.selfContained) {
            yield `${this.suffix || ''}</${this.tag}>${this.after || ''}`;
        }
        yield '\n';
    }
}

export { XML };
