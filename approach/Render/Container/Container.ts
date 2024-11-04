import { Stream } from "../Stream/Stream";

/**
 * 
 * This is the Container class, which is the base class for all Approach\Render objects.
 * 
 * */
class Container extends Stream<string> {
    public nodes: Container[];
    public content: string | Container;

    /** Container class constructor
    *
    * @param string | Container content - The content of the Container.
    * @returns Container
    * */
    constructor(content: string | Container = "") {
        super();
        this.content = content;
        this.nodes = [];

        //@ts-ignore
        globalThis.Container = Container;

        return new Proxy(this, {
            get(target: Container, prop: string | symbol): any {
                if (prop in target) {
                    return (target as any)[prop];
                }
                console.log(target._node_labels);
                if (target._node_labels.includes(prop as string)) {
                    let index = target._node_labels.indexOf(prop as string);
                    return target._labeled_nodes[index];
                } else if (!isNaN(Number(prop))) {
                    return target._labeled_nodes[Number(prop)];
                } else {
                    return undefined;
                }
            },
            set(target: Container, prop: string | symbol, value: any): boolean {
                if (typeof prop === "string" && value instanceof Container) {
                    if (isNaN(Number(prop))) {
                        target._node_labels.push(prop);
                        target._labeled_nodes[target._node_labels.indexOf(prop)] = value;
                    } else {
                        target._labeled_nodes[prop as any] = value;
                    }
                    target.nodes.push(value);
                    return true;
                }
                (target as any)[prop] = value;
                return true;
            },
            // HACK: I am not sure if this would actuall work 
            has(target: Container, prop: string | symbol): boolean {
                if (isNaN(Number(prop))) {
                    return prop in target || target._node_labels.includes(prop as string);
                }
                return prop in target || prop in target._labeled_nodes;
            }
        });

    }

    * RenderHead() {
        yield '';
    }

    * RenderBody(): any {
        if (this.content instanceof Container) {
            yield this.content.render();
        } else {
            yield this.content;
        }

        for (let node of this.nodes) {
            for (let r of node.stream()) {
                yield r;
            }
        }
    }

    * RenderTail() {
        yield '';
    }

    *stream() {
        for (let r of this.RenderHead()) {
            yield r;
        }
        for (let r of this.RenderBody()) {
            yield r;
        }
        for (let r of this.RenderTail()) {
            yield r;
        }
    }

    render() {
        let result = '';
        for (let r of this.stream()) {
            result += r;
        }
        return result;
    }
}

export { Container };
