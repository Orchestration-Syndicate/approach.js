export interface Streamability<T> {
    _labeled_nodes: Streamability<T>[];
    _node_labels: string[];

    render(): T;
    stream(): any;
    RenderHead(): any;
    RenderBody(): any;
    RenderTail(): any;
    toArray(): any[];
}
