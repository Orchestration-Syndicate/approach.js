import { XML } from '../XML/Xml';

class HTML extends XML {
    public nodes: HTML[] = [];
    public styles: { [key: string]: string } = {};
    public id: string | null = null;
    public classes: string[] = [];
    public _render_id = 0;
    public static _render_count = 0;

    constructor(
        tag: string = 'div',
        id: string | null = null,
        classes: string[] = [],
        attributes: { [key: string]: string } = {},
        content: string = '',
        styles: { [key: string]: string } = {},
        selfContained: boolean = false,
        prerender: boolean = false
    ) {
        super(tag, content, attributes, selfContained);
        this.classes = classes;
        this.id = id;
        this.styles = styles;

        //@ts-ignore
        globalThis.HTML = HTML;

        if (this.classes.length > 0) {
            this.attributes['class'] = this.classes.join(' ');
        }
        if (this.id && this.id != '') {
            this.attributes['id'] = this.id;
        }
        if (this.styles && Object.keys(this.styles).length > 0) {
            this.attributes['style'] = Object.keys(this.styles)
                .map((key) => `${key}: ${this.styles[key]}`)
                .join('; ');
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
