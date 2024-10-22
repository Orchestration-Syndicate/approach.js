import { describe, expect, test } from 'bun:test'
import { Stream } from '../approach/Render/Stream/Stream';
import { Node } from '../approach/Render/Node/Node';

describe("Stream", () => {
    test("should all the needed functions", () => {
        let stream = new Stream();
        expect(stream).toHaveProperty("stream");
        expect(stream).toHaveProperty("render");
    })
})

describe("Node", () => {
    test("test create a Node", () => {
        let node = new Node();
        expect(node).toBeInstanceOf(Node);
    })
    test("test child node rendering", () => {
        let node = new Node("Hello");
        node[0] = new Node("World");
        let result = node.render();

        expect(result).toBe("HelloWorld");
    })
    test("test labels", () => {
        let node = new Node("Hello ");
        node["world"] = new Node("World");

        expect(node.render()).toBe("Hello World");
        expect(node._node_labels).toEqual(["world"]);
    })
})
