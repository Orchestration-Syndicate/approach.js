import { Node } from "../Node/Node";

class XML extends Node {
    public nodes: XML[] = [];
    public attributes: { [key: string]: string | Node } = {};
    public tag: string;
    public selfContained: boolean;
    public suffix: string | null = null;
    public prefix: string | null = null;
    public before: string | null = null;
    public after: string | null = null;
    public _render_id = 0;
    public static _render_count = 0;

    constructor(tag: string = "", content: string | Node = "", attributes: { [key: string]: string | Node } = {}, selfContained: boolean = false) {
        super(content);
        this.set_render_id();

        //@ts-ignore
        globalThis.XML = XML;

        this.tag = tag;
        this.attributes = attributes;
        this.selfContained = selfContained;
    }

    set_render_id() {
        this._render_id = XML._render_count;
        XML._render_count++;
        this.name = this.constructor.name + "_" + this._render_id;
    }

    *RenderHead() {
        let attr = "";
        for (let key in this.attributes) {
            attr += ` ${key}="${this.attributes[key].toString()}"`;
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
