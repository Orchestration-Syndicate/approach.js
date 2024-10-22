import { Container } from "../Container/Container";

class Node extends Container {
    public prerender: boolean;
    public static _render_count = 0;
    public _render_id = 0;
    public nodes: Node[] = [];

    constructor(content = "", prerender = false) {
        super(content);
        this.prerender = prerender;
        this.set_render_id();

        return new Proxy(this, {
            get(target: Node, prop: string | symbol): any {
                if (typeof prop === "string" && !isNaN(Number(prop))) {
                    return target.nodes[Number(prop)];
                }
                return (target as any)[prop];
            },
            set(target: Node, prop: string | symbol, value: any): boolean {
                if (typeof prop === "string" && !isNaN(Number(prop)) && value instanceof Node) {
                    target.nodes[Number(prop)] = value;
                    return true;
                }
                (target as any)[prop] = value;
                return true;
            },
            has(target: Node, prop: string | symbol): boolean {
                if (typeof prop === "string" && !isNaN(Number(prop))) {
                    return Number(prop) < target.nodes.length;
                }
                return prop in target;
            }
        });
    }

    set_render_id() {
        this._render_id = Node._render_count++;
    }

    GetById(root: Node, render_id: number): Node | null {
        if (root._render_id == render_id) {
            return root;
        }
        for (let node of root.nodes) {
            let result = this.GetById(node, render_id);
            if (result) {
                return result;
            }
        }
        return null;
    }
}

class NodeArray extends Array<Node> {
    constructor(...elements: Node[]) {
        super(...elements);
    }
}

export { NodeArray, Node };
