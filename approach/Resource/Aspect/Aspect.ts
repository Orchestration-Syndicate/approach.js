import { Container } from "../../Render/Container/Container";
import type { Stream } from "../../Render/Stream/Stream";

class Aspect extends Container {
    static container: number = 0;
    static location: number = 1;
    static operation: number = 2;
    static field: number = 3;
    static quality: number = 4;
    static quantity: number = 5;
    static map: number = 6;
    static identity: number = 7;
    static roles: number = 8;
    static state: number = 9;
    static access: number = 10;

    public parent: Stream<string> | null = null;
    public ancestor: Stream<string> | null = null;

    static _index_map = {
        'container': Aspect.container,
        'location': Aspect.location,
        'operation': Aspect.operation,
        'field': Aspect.field,
        'quality': Aspect.quality,
        'quantity': Aspect.quantity,
        'map': Aspect.map,
        'identity': Aspect.identity,
        'roles': Aspect.roles,
        'state': Aspect.state,
    };

    // TODO: Figure out a way to make this sync up to the static constants
    static _case_map = ['container', 'location', 'operation', 'field', 'quality', 'quantity', 'map', 'identity', 'roles', 'state'];

    public static type: number | null = Aspect.container;

    constructor(
        type: string | number = Aspect.container,
        content: string | null = null,
        parent: Container | null = null,
        ancestor: Container | null = null
    ) {
        super(content ?? "");

        if (parent === null) {
            parent = new Container();
        }
        if (ancestor === null) {
            ancestor = new Container();
        }

        this.parent = parent;
        this.ancestor = ancestor;
        // this.type = Aspect._index_map[type];
    }

    cases() {
        return Aspect._case_map;
    }

    indices() {
        return Aspect._index_map;
    }
}

export { Aspect };
