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
    }

    set_render_id(){
        this._render_id = Node._render_count++;
    }

    GetById(root: Node, render_id: number): Node|null{
        if(root._render_id == render_id){
            return root;
        }
        for(let node of root.nodes){
            let result = this.GetById(node, render_id);
            if(result){
                return result;
            }
        }
        return null;
    }
}
