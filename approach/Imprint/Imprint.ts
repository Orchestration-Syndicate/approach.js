import * as fs from 'fs';
import { Node } from '../Render/Node/Node';
import { XmlDocument, XmlElement, type XmlNode } from 'xmldoc';
import { Token } from '../Render/Token/Token';
import { XML } from '../Render/XML/Xml';

const TOKEN_SYMBOL_START = '[@ ';
const TOKEN_SYMBOL_END = ' @]';

class Imprint {
    public tokens: { [key: string]: Token };
    public pattern: { [key: string]: Node };
    public imprint: string;
    public approach_dir: string;
    public imprint_dir: string;
    public static export_depth = 0;
    public generation_count: { [key: string]: number } = {};
    public _bound: { [key: string]: string } = {};
    public resolved_symbols: { [key: string]: string } = {};
    public found_tokens: { [key: string]: string } = {};
    public node_types: string[] = [];

    constructor(imprint = '', imprint_dir = '', approach_dir = './', pattern = {}) {
        this.pattern = pattern;
        this.approach_dir = approach_dir;
        this.imprint = imprint;
        this.imprint_dir = imprint_dir;
        this.tokens = {};
    }

    getNodeType(node: Node) {
        return node.constructor.name;
    }

    /**
     * Returns a unique identifier for a given node.
     *
     * @param Node $node The node to get the identifier for.
     * @return int|string The identifier for the node.
     */
    getNodeID(node: Node) {
        let id: string = String(node._render_id);
        let type = this.getNodeType(node);
        if (type == 'Token') {
            id = 't-' + id;
        }
        return id;
    }

    /**
     * Algorithm to elect a symbol for a node
     * Note: Only element nodes are sent to exportNodeSymbol(), parameter and token nodes have their own exports
     *
     * @param Node node
     * @return string
     */
    exportNodeSymbol(node: Node) {
        let type = this.getNodeType(node);
        let id = this.getNodeID(node);

        if (this.generation_count[type] == undefined) {
            this.generation_count[type] = 0;
        }

        if (type === 'Token') {
            this._bound[id] = 'this.tokens[' + node.name + ']';
            this.found_tokens[node.name] = id;
        }

        this.resolved_symbols[id] = type + '_' + this.generation_count[type];
        this.generation_count[type]++;

        node.name = this.resolved_symbols[id];

        return this.resolved_symbols[id];
    }

    getConstructorParams(cls: string) {
        const constructorRegex = /constructor\s*\(([^)]*)\)/;
        const match = cls.match(constructorRegex);
        let res: string[] = [];

        if (match && match[1]) {
            res = match[1].split(',').map((arg: string) => arg.trim());
        }

        // Split it into key value pairs
        let pairs: { [key: string]: any } = {};
        res.forEach((pair) => {
            let [key, value] = pair.split('=');
            if (value == undefined) {
                pairs[key] = null;
            } else {
                if (value.includes('"')) {
                    pairs[key] = value.replace(/"/g, '');
                } else if (value.includes('!')) {
                    if (value.includes('1')) {
                        pairs[key] = false;
                    } else {
                        pairs[key] = true;
                    }
                } else if (!isNaN(Number(value))) {
                    pairs[key] = Number(value);
                } else if (value.includes('null')) {
                    pairs[key] = null;
                } else if (value.includes('[')) {
                    pairs[key] = value.split('[').join('').split(']').join('').split(',');
                } else if (value.includes('{')) {
                    pairs[key] = value.split('{').join('').split('}').join('').split(',');
                } else {
                    pairs[key] = value;
                }
            }
        });

        return pairs;
    }

    filterConstructorParams(instance: any, args: { [key: string]: any }) {
        const constructorParams = this.getConstructorParams(instance.constructor.toString());
        let filteredArgs: { [key: string]: any } = {};
        for (let param in Object.keys(constructorParams)) {
            if(param in args){
                filteredArgs[param] = args[param];
            }
        }
        return filteredArgs;
    }

    exportParameterBlocks(
        node: Node,
        parameters: { [key: string]: any },
        symbol = '',
        depth = 1
    ) {
        let block = '';
        let names = [];
        for (let key of Object.keys(parameters)) {
            key = key.trim().replace(' ', '');
            //@ts-ignore
            let value = node[key] !== undefined ? node[key] : parameters[key];
            let name = symbol + '_' + key.charAt(0).toUpperCase() + key.slice(1);
            let statement = 'let ' + name + ' = ';
            names.push(name);
            if (value instanceof Token) {
                statement += 'this.tokens["' + value.content + '"];\n';
            } else {
                if (value == null || value == undefined) {
                    statement += 'null\n';
                } else if (typeof value === 'string') {
                    value = value.replace(/"/g, "'");
                    statement += '`' + value + '`;\n';
                } else if (typeof value === 'number') {
                    statement += value + ';\n';
                } else if (typeof value === 'boolean') {
                    statement += value + ';\n';
                } else if (Array.isArray(value)) {
                    statement += '[' + value.join(',') + '];\n';
                } else if (typeof value === 'object') {
                    let hasToken = false;
                    for (let val of Object.values(value)) {
                        if (val instanceof Token) {
                            hasToken = true;
                            break;
                        }
                    }
                    if (!hasToken) {
                        statement += JSON.stringify(value) + ';\n';
                    } else {
                        this.node_types.push('Attribute');
                        statement += 'new Attribute();\n';
                        for (let key of Object.keys(value)) {
                            statement += '\t'.repeat(depth + 1) + name + '.nodes.push(new Attribute("' + key + '", ';
                            if (value[key] instanceof Token) {
                                statement += 'this.tokens["' + value[key].content + '"]));\n';
                            } else {
                                statement += value[key] + ');\n';
                            }
                        }
                    }
                } else {
                    statement += value + '\n';
                }
            }

            block += '\t'.repeat(depth) + statement;
        }

        return [block, names];
    }

    exportNodeConstructor(node: Node, type = '', symbol = '', depth = 1) {
        let statement = '';

        //@ts-ignore
        let instance = new globalThis[type](...Object.values(args));
        let parameters = this.getConstructorParams(instance.constructor.toString());
        let paramBlocks = this.exportParameterBlocks(node, parameters, symbol, depth);

        statement += paramBlocks[0];

        return [statement, paramBlocks[1]];
    }

    exportNode(
        node: Node,
        parent: Node | null = null,
        export_symbol: string | null = null,
        depth = 0
    ) {
        let symbol = export_symbol || this.exportNodeSymbol(node);

        let type = this.getNodeType(node);
        let tab = '\t'.repeat(depth);

        let statement = '';
        let res = this.exportNodeConstructor(node, type, symbol, depth);
        statement += res[0] + '\n';

        let names = res[1] as string[];
        statement += tab +
            'let ' + symbol + ' = new ' + type + '(' + names.join(', ') + ');\n\n';

        for (let child of node.nodes) {
            statement += this.exportNode(child, node, null, depth + 1);
        }

        if (parent != null) {
            statement += tab + parent.name + '.nodes.push(' + symbol + ');\n\n';
        }

        return statement;
    }

    patternSetup(pattern: string) {
        let block = "";

        // Export the import statements
        for (let type of this.node_types) {
            block += `import { ${type} } from '${this.approach_dir}/approach/Render/${type}/${type}.ts';\n`;
        }

        block += '\n';

        block += 'export class ' + pattern + ' extends Node {\n';
        block += '\ttokens = {};\n\n';
        block += '\tconstructor(tokens) {\n';
        block += '\t\tsuper();\n\n';
        block += '\t\tthis.tokens = tokens;\n\n';

        return block;
    }

    print(pattern = '') {
        let tree = this.pattern[pattern];
        if (tree == undefined) {
            throw new Error('Pattern not found: ' + pattern);
        }
        let prelines = this.exportNode(tree, null, null, 2);
        let lines = this.patternSetup(pattern);
        lines += prelines;

        lines += '\t\tthis.nodes.push(' + tree.name + ');\n';
        lines += '\t}\n';
        lines += '}\n';

        return lines;
    }

    /** Gets the directory where the imprints are stored @returns string */
    getImprintFileDir() {
        return this.imprint_dir;
    }

    Prepare() {
        let file_content = fs.readFileSync(this.imprint, 'utf8');
        file_content = file_content.replace(/\s+/g, ' ').replace(/>\s+</g, '><');

        let xml = new XmlDocument(file_content);
        let tree = xml.childrenNamed('Imprint:Pattern');

        for (let pattern of tree) {
            this.preparePattern(pattern);
        }
    }

    recurse(pattern: XmlNode) {
        let nodes: Node[] = [];
        let xml = pattern.toString();

        if (pattern.type == 'element') {
            let has_token = xml.includes('[@');
            let has_work = xml.includes('<node');
            let has_render = xml.includes('<Render');
            let has_imprint = xml.includes('<Imprint');
            let has_resource = xml.includes('<Resource');
            let has_component = xml.includes('<Component');
            let has_composition = xml.includes('<Composition');
            let has_service = xml.includes('<Service');
            let has_instrument = xml.includes('<Instrument');
            let has_ensemble = xml.includes('<Ensemble');
            let has_orchestra = xml.includes('<Orchestra');

            let has_imprint_concept =
                has_token ||
                has_work ||
                has_render ||
                has_imprint ||
                has_resource ||
                has_component ||
                has_composition ||
                has_service ||
                has_instrument ||
                has_ensemble ||
                has_orchestra;

            if (!has_imprint_concept) {
                if (this.node_types.indexOf('Node') == -1) {
                    this.node_types.push('Node');
                }
                return [new Node(xml)];
            } else {
                for (let child of pattern.children) {
                    nodes.push(...this.recurse(child));
                }

                let args: { [key: string]: string | Node } = {};

                for (let arg of Object.keys(pattern.attr)) {
                    let token = this.getToken(pattern.attr[arg]);
                    if (token != null) {
                        args[arg] = new Token(token);
                        this.tokens[token] = new Token(token);
                    } else {
                        args[arg] = pattern.attr[arg];
                    }
                }

                let content: string | Token = pattern.val;
                let token = this.getToken(content);
                if (token != null) {
                    content = new Token(token);
                    this.tokens[token] = new Token(token);
                }

                let type = pattern.attr.type;
                // @ts-ignore
                let instance = new globalThis[type]();
                let filteredArgs = this.filterConstructorParams(instance, args);
                // @ts-ignore
                instance = new globalThis[type](...Object.values(filteredArgs));
                // TODO: Make this dynamic based on render:type
                if (this.node_types.indexOf('XML') == -1) {
                    this.node_types.push('XML');
                }
                let res = new XML(pattern.name, content, args);
                res.nodes = nodes as XML[];
                return [res];
            }
        }

        return [];
    }

    getToken(xml: string) {
        let start = xml.indexOf(TOKEN_SYMBOL_START);
        let end = xml.indexOf(TOKEN_SYMBOL_END);

        if (start == -1 || end == -1) {
            return null;
        }

        let token = xml.substring(start + TOKEN_SYMBOL_START.length, end);
        return token;
    }

    preparePattern(pattern: XmlElement) {
        // TODO: Implement dynamic stuff using type.
        // For now, all of them default to HTML for all xml and Node for attributes

        let name = pattern.attr.name;

        // Empty pattern to start the tree
        this.pattern[name] = new Node();

        for (let child of pattern.children) {
            this.pattern[name].nodes.push(...this.recurse(child));
        }
    }

    /** Mints the imprint file @param pattern string */
    Mint(pattern = '') {
        if (pattern == '') {
            for (let pattern of Object.keys(this.pattern)) {
                this.Mint(pattern);
            }
        } else {
            let content = this.print(pattern);
            let imprint_dir = this.getImprintFileDir();
            let pattern_path = imprint_dir + '/' + pattern + '.js';
            console.log('Minting: ' + pattern_path);
            if (!fs.existsSync(imprint_dir)) {
                fs.mkdirSync(imprint_dir, { recursive: true });
            }
            fs.writeFileSync(pattern_path, content);
        }
    }
}

export { Imprint };
