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
}

export { Resource };
