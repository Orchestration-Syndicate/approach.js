import { Stream } from "../Stream/Stream";

class Container extends Stream<string> {
    public nodes: Container[];
    public content: string;

    constructor(content = "") {
        super();
        this.content = content;
        this.nodes = [];
    }

    * RenderHead() {
        yield '';
    }

    * RenderBody(): any{
        yield this.content;

        for (let node of this.nodes) {
            yield node.stream();
        }
    }

    * RenderTail() {
        yield '';
    }

    *stream() {
        for(let r of this.RenderHead()){
            yield r;
        }
        for(let r of this.RenderBody()){
            yield r;
        }
        for(let r of this.RenderTail()){
            yield r;
        }
    }

    render() {
        let result = '';
        for(let r of this.stream()){
            result += r;
        }
        return result;
    }
}

export { Container };
