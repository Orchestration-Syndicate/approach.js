import { Resource } from "./Resource";

abstract class discoverability {
    static aspect_metadata = {
        'field': [
            'label',
            'type',
            'default',
            'source_type',
            'source_default',
            'nullable',
            'description',
            'constraint',
            'accessor',
            'reference_to',
            'primary_accessor',
        ],
        'quality': [
            'label',
            'description',
            'keywords',
            'children',
            'related',
            'type',
            'state',
        ],
        'state': [
            'label',
            'description',
            'values',
            'initial',
            'final',
            'transitions',
            'transitions_from',
            'transitions_to',
        ],
        'quantity': [
            'label',
            'description',
            'values',
            'ranges',
            'units',
            'unit_labels',
            'min',
            'max',
            'step',
            'precision',
        ],
        'operation': [
            'method',
            'parameters',
            'accepts',
            'provides',
            'requires',
            'errors',
            'signature',
            'description',
            'is_create',
            'is_read',
            'is_update',
            'is_delete',
            'is_list',
            'is_search',
            'is_action',
            'is_function',
        ],
        'map': [
            'type',
            'label',
            'tag',
            'version',
            'last_modified',
            'description',
            'from',
            'to',
            'known_callers',
            'previous',
            'map',
        ],
        'authorization': [
            'label',
            'description',
            'realms',
            'roles',
            'permissions',
            'degree',
            'read',
            'write',
            'update',
            'delete',
            'create',
            'list',
            'search',
            'action',
            'admin',
            'browse',
        ]
    }

    discover(resource: string | null | Resource = null) {
        if (resource === null) {
            // TODO: Implement a way for the custom resource to take precedence
        }
        let aspects = {};

        //@ts-ignore
        for (let c in this.cases()) {
            let aspect = 'Resource_' + c;
            //@ts-ignore
            aspects[aspect] = globalThis[aspect].define();
        }

        return aspects;
    }

    static container = 0;
    static location = 1;
    static operation = 2;
    static field = 3;
    static quality = 4;
    static quantity = 5;
    static map = 6;
    static identity = 7;
    static access = 8;
    static state = 9;

    // FIXME: This is a placeholder for the actual implementation
    define_container(caller: any) { };
    define_operation(caller: any) { };
    define_field(caller: any) { };
    define_quality(caller: any) { };
    define_quantity(caller: any) { };
    define_map(caller: any) { };
    define_state(caller: any) { };
    define_access(caller: any) { };

    define(caller: any = null, which: number | null = null) {
        let config: any = {};

        switch (which) {
            case discoverability.container:
                config['container'] = this.define_container(caller);
                break
            case discoverability.operation:
                config['operation'] = this.define_operation(caller);
                break
            case discoverability.field:
                config['field'] = this.define_field(caller);
                break
            case discoverability.quality:
                config['quality'] = this.define_quality(caller);
                break
            case discoverability.quantity:
                config['quantity'] = this.define_quantity(caller);
                break
            case discoverability.map:
                config['map'] = this.define_map(caller);
                break
            case discoverability.state:
                config['state'] = this.define_state(caller);
                break
            case discoverability.access:
                config['access'] = this.define_access(caller);
                break
            case null:
                config['container'] = this.define_container(caller);
                config['operation'] = this.define_operation(caller);
                config['field'] = this.define_field(caller);
                config['quality'] = this.define_quality(caller);
                config['quantity'] = this.define_quantity(caller);
                config['map'] = this.define_map(caller);
                config['state'] = this.define_state(caller);
                config['access'] = this.define_access(caller);
                break
            default:
                break
        }

        for(let c in Object.keys(config)){
            let aspect = config[c];

            aspect['package'] = caller.get_aspect_package();
            aspect['which'] = c;
            aspect['filename'] = c + '.php';
            aspect['directory'] = caller.get_aspect_directory();

            //this.MintAspect(aspect);
        }
    }

    //for(let aspect in this.aspects){
    //
    //}
}

export { discoverability };
