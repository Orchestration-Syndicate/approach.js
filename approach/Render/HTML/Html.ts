import { XML } from '../XML/Xml';

class HTML extends XML {
    public nodes: HTML[] = [];
    public styles: { [key: string]: string } = {};
    public id: string | null = null;
    public classes: string[] = [];

    constructor(
        tag: string,
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
    }
}

export { HTML };
