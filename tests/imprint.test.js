import { beforeAll, describe, expect, test } from 'bun:test'
import { Imprint } from '../approach/Imprint/Imprint';
import { minimal } from '../support/minimal';
import { cool } from '../support/cool';

beforeAll(() => {
    globalThis.imp = new Imprint('./support/patterns/hello.xml', './support', '..');
    globalThis.imp.Prepare();
    globalThis.imp.Mint();
})


describe("Pattern Parsing", () => {
    test("Check patterns", () => {
        expect(globalThis.imp.pattern).toHaveProperty("minimal");
        expect(globalThis.imp.pattern).toHaveProperty("cool");
    });

    test("Check recurse", () => {
        expect(globalThis.imp.pattern['minimal'].nodes[0]['tag']).toBe("div");
    });

    test("Check minimal", () => {
        let x = new minimal({});
        expect(x).toHaveProperty("render");
    })

    test("Check cool", () => {
        let x = new cool({});
        expect(x).toHaveProperty("render");
    })

});
