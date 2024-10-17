export interface Streamability<T> {
    _labeled_nodes: any[];
    _node_labels: any[];

    render(): T;
    stream(): any;
    RenderHead(): any;
    RenderBody(): any;
    RenderTail(): any;
    toArray(): any[];
}
