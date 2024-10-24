import * as fs from 'fs';
import type { Node } from '../Render/Node/Node';
import { XMLParser } from 'fast-xml-parser';
import { file } from 'bun';

const TOKEN_SYMBOL_START = '[@ ';
const TOKEN_SYMBOL_END = ' @]';

class Imprint {
    public tokens: string[];
    public pattern: { [key: string]: string };
    public imprint: string;
    public imprint_dir: string;
    public static export_depth = 0;

    constructor(imprint = "", imprint_dir = "", pattern = {}) {
        this.pattern = pattern;
        this.imprint = imprint;
        this.imprint_dir = imprint_dir;
        this.tokens = [];
    }

    exportNode(node: Node | string, parent: Node | null = null, export_symbol: string | null = null) {
        let tab = "\t".repeat(Imprint.export_depth);
        Imprint.export_depth++;

    }

    print(pattern = "") {
        let tree = this.pattern[pattern];
        if (tree == undefined) {
            throw new Error("Pattern not found: " + pattern);
        }
        let lines = this.exportNode(tree);

        return "Hello World";
    }

    /** Gets the directory where the imprints are stored @returns string */
    getImprintFileDir() { return this.imprint_dir }

    Prepare() {
        let file_content = fs.readFileSync(this.imprint, 'utf8');
        const parser = new XMLParser({
            ignoreAttributes: false, // Keep XML attributes
            allowBooleanAttributes: true, // Allow boolean attributes
        });
        let json = parser.parse(file_content);

        function findPatterns(obj: any, patterns: any[] = []) {
            for (const key in obj) {
                if (key === 'Imprint:Pattern') {
                    patterns.push(obj[key]);
                } else if (typeof obj[key] === 'object') {
                    findPatterns(obj[key], patterns);
                }
            }
            return patterns;
        }

        const tree = findPatterns(json);

        console.log(tree);
    }

    preparePattern(pattern: any) {
        let name = pattern['@_name'];
        let type = pattern['@_type'];
    }

    /** Mints the imprint file @param pattern string */
    Mint(pattern = "") {
        if (pattern == "") {
            for (let pattern of Object.keys(this.pattern)) {
                this.Mint(pattern);
            }
        } else {
            let content = this.print(pattern);
            let imprint_dir = this.getImprintFileDir();
            let pattern_path = imprint_dir + "/" + pattern + ".js";
            console.log("Minting: " + pattern_path);

            // if imprint_dir does not exist, create it
            if (!fs.existsSync(imprint_dir)) {
                fs.mkdirSync(imprint_dir, { recursive: true });
            }

            // write the content to the file
            fs.writeFileSync(pattern_path, content);
        }
    }
}

export { Imprint };
