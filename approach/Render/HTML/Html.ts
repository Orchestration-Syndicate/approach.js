import { Attribute } from "../Attribute/Attribute";
import { XML } from "../XML/Xml";

class HTML extends XML {
    public nodes: HTML[] = [];
    public styles: { [key: string]: string } = {};
    public id: string | null = null;
    public classes: string[] = [];
    public _render_id = 0;
    public static _render_count = 0;

    /** HTML class constructor
     *
     * @param string tag - The tag of the HTML element.
     * @param string id - The id of the HTML element.
     * @param string[] classes - The classes of the HTML element.
     * @param attributes - The attributes of the HTML element.
     * @param string content - The content of the HTML element.
     * @param styles - The styles of the HTML element.
     * @param boolean selfContained - Whether or not the HTML element is self-contained.
     * @param boolean prerender - Whether or not to prerender the HTML element.
     * @returns HTML
     * */
    constructor(
        tag: string = "div",
        id: string | null = null,
        classes: string[] = [],
        attributes: { [key: string]: string } = {},
        content: string = "",
        styles: { [key: string]: string } = {},
        selfContained: boolean = false,
        prerender: boolean = false,
    ) {
        super(tag, content, attributes, selfContained);
        this.classes = classes;
        this.id = id;
        this.styles = styles;

        //@ts-ignore
        globalThis.HTML = HTML;

        if (this.classes.length > 0) {
            if (this.attributes instanceof Attribute) {
                this.attributes.nodes.push(
                    new Attribute("class", this.classes.join(" ")),
                );
            } else {
                this.attributes["class"] = this.classes.join(" ");
            }
        }
        if (this.id && this.id != "") {
            if (this.attributes instanceof Attribute) {
                this.attributes.nodes.push(new Attribute("id", this.id));
            } else {
                this.attributes["id"] = this.id;
            }
        }
        if (this.styles && Object.keys(this.styles).length > 0) {
            if (this.attributes instanceof Attribute) {
                this.attributes.nodes.push(
                    new Attribute(
                        "style",
                        Object.entries(this.styles)
                            .map(([key, value]) => `${key}:${value}`)
                            .join(";"),
                    ),
                );
            } else {
                this.attributes["style"] = Object.entries(this.styles)
                    .map(([key, value]) => `${key}:${value}`)
                    .join(";");
            }
        }

        this.set_render_id();
    }

    set_render_id() {
        this._render_id = HTML._render_count;
        XML._render_count++;
        this.name = this.constructor.name + "_" + this._render_id;
    }
}

export { HTML };
