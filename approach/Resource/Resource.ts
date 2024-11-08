import { Node } from "../Render/Node/Node";

const locate = 0;
const pick = 1;
const sort = 2;
const weigh = 3;
const sift = 4;
const divide = 5;
const filter = 6;

const field = 0;
const feature = 1;
const operate = 2;
const quality = 3;
const quantity = 4;
const mode = 5;

class Resource extends Node {
    private __approach_resource_context: any = null;

    constructor(
        _where = '/',
        _pick = null,
        _sort = null,
        _weigh = null,
        _sift = null,
        _divide = null,
        _filter = null
    ) {
        super();
        this.__approach_resource_context = [];
        this.__approach_resource_context[locate] = _where ?? new Node('/');
        this.__approach_resource_context[pick] = [];
        this.__approach_resource_context[sort] = [];
        this.__approach_resource_context[weigh] = [];
        this.__approach_resource_context[sift] = [];
        this.__approach_resource_context[divide] = [];
        this.__approach_resource_context[filter] = [];
    }

    static find(
        where = '/',
        sort = null,
        weigh = null,
        pick = null,
        sift = null,
        divide = null,
        what = null,
        filter = null,
        as = null
    ): Resource | null {
        return null;
    }

    static parseURI(uri: string): Resource | null {
        let primary = URL.parse(uri);
        if (primary === null) {
            return null;
        }

        let res: any = {};
        res['scheme'] = primary.protocol;
        res['host'] = primary.hostname;
        res['port'] = primary.port;
        res['queries'] = primary.searchParams;
        res['paths'] = [];

        let context = [];
        context[pick] = [];
        context[sift] = [];

        let url = '';

        let pathname = decodeURI(primary.pathname);
        let parts = pathname.split('/');

        for (let part of parts) {
            if (part === '') {
                continue;
            }
            if (part.includes('[')) {
                // get all the indices of the opening brackets and close brackets
                let indices = [];
                let curr = [];
                for (let i = 0; i < part.length; i++) {
                    if (part[i] === '[') {
                        curr.push(i);
                    } else if (part[i] === ']') {
                        curr.push(i);
                        indices.push(curr);
                        curr = [];
                    }
                }

                // get all the part before the first opening bracket
                let first = indices[0][0];
                let field_name = part.slice(0, first);

                let result: any[] = [field_name, []];
                for (let bracket of indices) {
                    let content = part.slice(bracket[0] + 1, bracket[1]);
                    let splitters = ['AND', 'OR', 'HAS'];
                    let ops = ['le', 'gt', 'lt', 'ge', 'eq', 'ne'];
                    let split = [];
                    let to = []
                    let current = '';

                    // split the content by the splitters
                    for (let i = 0; i < content.length; i++) {
                        if (splitters.includes(content.slice(i, i + 3))) {
                            split.push(current);
                            current = '';
                            i += 2;
                        } else {
                            current += content[i];
                        }
                    }

                    split.push(current);

                    for (let s of split) {
                        let fields = s.split(',');
                        let r = [];
                        for (let f of fields) {
                            if (f.includes(':')) {
                                let [key, value] = f.split(':');
                                r.push([key, value]);
                            } else {
                                let is_op = false;
                                for (let op of ops) {
                                    if (f.includes(op)) {
                                        let [key, value] = f.split(op);
                                        r.push([key, op, value]);
                                        is_op = true;
                                    }
                                }

                                if (!is_op) {
                                    r.push([f]);
                                }
                            }
                        }
                        to.push(r);
                    }

                    result[1].push(to);
                }

                // check if there is anything else after the last closing bracket
                let last = indices[indices.length - 1][1];
                if (last < part.length - 1 && part[last + 1] === '.') {
                    let function_name = part.slice(last + 2);
                    result.push(function_name);
                }
                res['paths'].push(result);
                //console.log(indices);
            } else {
                res['paths'].push([part]);
            }
        }

        return res
    }
}

export { Resource };
