import { Container } from "../Container/Container";

class Node extends Container {
    public prerender: boolean;
    public static _render_count = 0;
    public _render_id = 0;
    public nodes: Node[] = [];
    public name = "";

    /**
     *
     * This is the Node class, which is the base class for all Approach\Render objects.
     *
     * @param string | Node content - The content of the Node.
     * @param boolean prerender - Whether or not to prerender the Node.
     *
     * @returns Node
     */
    constructor(content: string | Node = "", prerender = false) {
        super(content);
        //@ts-ignore
        globalThis.Node = Node;
        this.prerender = prerender;
        this.set_render_id();
    }

    set_render_id() {
        this._render_id = Node._render_count++;
        this.name = this.constructor.name + "_" + this._render_id;
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
