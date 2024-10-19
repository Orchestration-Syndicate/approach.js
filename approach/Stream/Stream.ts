import { type Streamability } from "./Streamability";

class Stream<T> implements Streamability<T> {
    _labeled_nodes: any[];
    _node_labels: any[];

    constructor(){
        this._labeled_nodes = [];
        this._node_labels = [];
    }
    render(): T {
        throw new Error("Method not implemented.");
    }
    stream() {
        throw new Error("Method not implemented.");
    }
    RenderHead() {
        throw new Error("Method not implemented.");
    }
    RenderBody() {
        throw new Error("Method not implemented.");
    }
    RenderTail() {
        throw new Error("Method not implemented.");
    }
    toArray(): any[] {
        throw new Error("Method not implemented.");
    }

}

export { Stream };