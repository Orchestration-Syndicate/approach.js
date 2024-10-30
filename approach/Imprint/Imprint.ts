import * as fs from "fs";
import { Node } from "../Render/Node/Node";
import { XmlDocument, XmlElement, type XmlNode } from "xmldoc";
import { Token } from "../Render/Token/Token";
import { XML } from "../Render/XML/Xml";

const TOKEN_SYMBOL_START = "[@ ";
const TOKEN_SYMBOL_END = " @]";

class Imprint {
    public tokens: string[];
    public pattern: { [key: string]: Node };
    public imprint: string;
    public imprint_dir: string;
    public static export_depth = 0;
    public generation_count: { [key: string]: number } = {};
    public _bound: { [key: string]: string } = {};
    public resolved_symbols: { [key: string]: string } = {};
    public found_tokens: { [key: string]: string } = {};

    constructor(imprint = "", imprint_dir = "", pattern = {}) {
        this.pattern = pattern;
        this.imprint = imprint;
        this.imprint_dir = imprint_dir;
        this.tokens = [];
    }

    getNodeType(node: Node) {
        return node.constructor.name;
    }

    /**
     * getNodeID
     *
     * Returns a unique identifier for a given node.
     *
     * @param Node $node The node to get the identifier for.
     * @return int|string The identifier for the node.
     */
    getNodeID(node: Node) {
        let id: string = String(node._render_id);
        let type = this.getNodeType(node);
        if (type == "Token") {
            id = "t-" + id;
        }
        return id;
    }

    /**
     * exportNodeSymbol
     *
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

        if (type === "Token") {
            this._bound[id] = "this.tokens[" + node.name + "]";
            this.found_tokens[node.name] = id;
        }

        this.resolved_symbols[id] = type + "_" + this.generation_count[type];
        this.generation_count[type]++;

        return this.resolved_symbols[id];
    }

    getConstructorParams(cls: string) {
        const constructorRegex = /constructor\s*\(([^)]*)\)/;
        const match = cls.match(constructorRegex);
        let res: string[] = [];

        if (match && match[1]) {
            res = match[1].split(",").map((arg: string) => arg.trim());
        }

        // Split it into key value pairs
        let pairs: { [key: string]: any } = {};
        res.forEach((pair) => {
            let [key, value] = pair.split("=");
            if (value == undefined) {
                pairs[key] = null;
            } else {

                if (value.includes('"')) {
                    pairs[key] = value.replace(/"/g, "");
                } else if (value.includes("!")) {
                    if (value.includes("1")) {
                        pairs[key] = false;
                    } else {
                        pairs[key] = true;
                    }
                } else if (!isNaN(Number(value))) {
                    pairs[key] = Number(value);
                } else if (value.includes("null")) {
                    pairs[key] = null;
                } else if (value.includes("[")) {
                    pairs[key] = value.split("[").join("").split("]").join("").split(",");
                } else if (value.includes("{")) {
                    pairs[key] = value.split("{").join("").split("}").join("").split(",");
                } else {
                    pairs[key] = value;
                }
            }
        });

        return pairs;
    }

    exportParameterBlocks(node: Node, parameters: { [key: string]: any }, name: string = "") {
        let block = "";
        for (let key of Object.keys(parameters)) {
            key = key.trim().replace(" ", "");
            //@ts-ignore
            let value = node[key] !== undefined ? node[key] : parameters[key];
            if (value == null || value == undefined) {
                block += name + "." + key + " = null;\n";
            } else if (typeof value == "string") {
                value = value.replace(/"/g, "'");
                block += name + "." + key + ' = "' + value + '";\n';
            } else if (typeof value == "number") {
                block += name + "." + key + " = " + value + ";\n";
            } else if (typeof value == "boolean") {
                block += name + "." + key + " = " + value + ";\n";
            } else if (Array.isArray(value)) {
                block += name + "." + key + " = [" + value.join(", ") + "];\n";
            } else if (typeof value == "object") {
                block += name + "." + key + " = {";
                for (let k of Object.keys(value)) {
                    block += "'" + k + "': '" + value[k] + "', ";
                }
                block += "};\n";
            } else {
                value = value.replace(/"/g, "'");
                block += name + "." + key + " = " + value + ";\n";
            }
        }

        return block;
    }


    exportNodeConstructor(node: Node, name: string, tab = "") {
        let prepend = "";
        let type = this.getNodeType(node);

        let statement = tab;

        const instance = eval(`new ${type}()`);
        let parameters = this.getConstructorParams(instance.constructor.toString());
        let paramBlock = this.exportParameterBlocks(node, parameters, name);

        statement += paramBlock

        return statement;
    }

    exportNode(
        node: Node,
        parent: Node | null = null,
        export_symbol: string | null = null,
    ) {
        console.log("Exporting node: ", node);
        let symbol = this.exportNodeSymbol(node);

        let id = this.getNodeID(node);
        let type = this.getNodeType(node);

        let statement = "let " + symbol + " = new " + type + "();\n";
        statement += this.exportNodeConstructor(node, symbol, "");

        if (parent != null) {
            statement += parent.name + ".nodes.push(" + symbol + ");\n\n";
        }

        for (let child of node.nodes) {
            statement += this.exportNode(child, node);
        }

        return statement;
    }

    print(pattern = "") {
        let tree = this.pattern[pattern];
        if (tree == undefined) {
            throw new Error("Pattern not found: " + pattern);
        }
        let lines = this.exportNode(tree);

        return lines;
    }

    /** Gets the directory where the imprints are stored @returns string */
    getImprintFileDir() {
        return this.imprint_dir;
    }

    Prepare() {
        let file_content = fs.readFileSync(this.imprint, "utf8");
        file_content = file_content
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><');

        let xml = new XmlDocument(file_content);
        let tree = xml.childrenNamed("Imprint:Pattern");

        for (let pattern of tree) {
            this.preparePattern(pattern);
        }
    }

    recurse(pattern: XmlNode) {
        let nodes: Node[] = [];
        let xml = pattern.toString();

        if (pattern.type == "text") {
            nodes.push(new Node(pattern.text));
            return nodes;
        }

        if (pattern.type == "element") {
            let has_token = xml.includes("[@");
            let has_work = xml.includes("<node");
            let has_render = xml.includes("<Render");
            let has_imprint = xml.includes("<Imprint");
            let has_resource = xml.includes("<Resource");
            let has_component = xml.includes("<Component");
            let has_composition = xml.includes("<Composition");
            let has_service = xml.includes("<Service");
            let has_instrument = xml.includes("<Instrument");
            let has_ensemble = xml.includes("<Ensemble");
            let has_orchestra = xml.includes("<Orchestra");

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
                return [new Node(xml)];
            } else {
                for (let child of pattern.children) {
                    nodes.push(...this.recurse(child));
                }

                let args: { [key: string]: string } = {};

                for (let arg of Object.keys(pattern.attr)) {
                    let token = this.getToken(pattern.attr[arg]);
                    if (token != null) {
                        args[arg] = new Token(token).render();
                    } else {
                        args[arg] = pattern.attr[arg];
                    }
                }
                let res = new XML(pattern.name, "", args);
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

        let token = xml.slice(start, end + TOKEN_SYMBOL_END.length);
        return token;
    }

    preparePattern(pattern: XmlElement) {
        //
        // TODO: Implement dynamic stuff using type.
        // For now, all of them default to HTML for all xml and Node for attributes

        let name = pattern.attr.name;
        let type = pattern.attr.type;

        this.pattern[name] = new Node();

        for (let child of pattern.children) {
            this.pattern[name].nodes.push(...this.recurse(child));
        }
    }

    /** Mints the imprint file @param pattern string */
    Mint(pattern = "") {
        if (pattern == "") {
            for (let pattern of Object.keys(this.pattern)) {
                this.Mint(pattern);
            }
        } else {
            let content = this.print(pattern);
            console.log(content);
            let imprint_dir = this.getImprintFileDir();
            let pattern_path = imprint_dir + "/" + pattern + ".js";
            console.log("Minting: " + pattern_path);
            if (!fs.existsSync(imprint_dir)) {
                fs.mkdirSync(imprint_dir, { recursive: true });
            }
            fs.writeFileSync(pattern_path, content);
        }
    }
}

export { Imprint };
