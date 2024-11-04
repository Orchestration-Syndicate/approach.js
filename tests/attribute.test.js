import { describe, expect, test } from 'bun:test'
import { Attribute } from '../approach/Render/Attribute/Attribute';
import { Node } from '../approach/Render/Node/Node';

describe("Attribute Tests", () => {
    test("Check empty attribute", () => {
        let x = new Attribute();
        expect(x.render()).toBe("");
    })
    test("Check attribute with string", () => {
        let x = new Attribute("id", "cool");
        expect(x.render()).toBe("id=\"cool\" ");
    })
    test("Check attribute with Node", () => {
        let a = new Node("class");
        let b = new Node("container");
        let x = new Attribute(a, b);
        expect(x.render()).toBe("class=\"container\" ");
    })
    test("Check attribute with Node and string", () => {
        let a = new Node("class");
        let x = new Attribute(a, "container");
        expect(x.render()).toBe("class=\"container\" ");
    })
});
