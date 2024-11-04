import { Attribute } from "../Attribute/Attribute";
import { Node } from "../Node/Node";

type XMLAttribute = { [key: string]: string | Node } | Attribute;

/** The XML class is a Node derived class that represents an XML element. */
class XML extends Node {
    public nodes: XML[] = [];
    public attributes: XMLAttribute = new Attribute();
    public tag: string;
    public selfContained: boolean;
    public suffix: string | null = null;
    public prefix: string | null = null;
    public before: string | null = null;
    public after: string | null = null;
    public _render_id = 0;
    public static _render_count = 0;

    /**
     *
     * This is the XML class, which is the base class for all Approach\Render objects.
     *
     * @param string tag - The tag of the XML element.
     * @param string | Node content - The content of the XML element.
     * @param XMLAttribute attributes - The attributes of the XML element.
     * @param boolean selfContained - Whether or not the XML element is self-contained.
     *
     * @returns XML
     * */
    constructor(
        tag: string = "",
        content: string | Node = "",
        attributes: XMLAttribute = {},
        selfContained: boolean = false,
    ) {
        super(content);
        this.set_render_id();

        //@ts-ignore
        globalThis.XML = XML;

        this.tag = tag;
        if (attributes instanceof Attribute && this.attributes instanceof Attribute) {
            this.attributes.nodes.push(attributes);
        } else {
            this.attributes = attributes;
        }
        this.selfContained = selfContained;
    }

    set_render_id() {
        this._render_id = XML._render_count;
        XML._render_count++;
        this.name = this.constructor.name + "_" + this._render_id;
    }

    *RenderHead() {
        let attr = "";
        if (this.attributes instanceof Attribute) {
            attr += " " + this.attributes.render();
        } else {
            for (let key in this.attributes) {
                attr += ` ${key}="${this.attributes[key].toString()}"`;
            }
        }

        if (this.selfContained) {
            yield `${this.before || ""}<${this.tag}${attr} />`;
        } else {
            yield `${this.before || ""}<${this.tag}${attr}>${this.prefix || ""}`;
        }
    }

    *RenderTail() {
        if (!this.selfContained) {
            yield `${this.suffix || ""}</${this.tag}>${this.after || ""}`;
        }
        yield "\n";
    }
}

export { XML };
