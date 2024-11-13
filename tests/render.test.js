import { describe, expect, test } from "bun:test";
import { Stream } from "../approach/Render/Stream/Stream";
import { Node } from "../approach/Render/Node/Node";
import { HTML } from "../approach/Render/HTML/Html";

describe("Stream", () => {
    test("should all the needed functions", () => {
        let stream = new Stream();
        expect(stream).toHaveProperty("stream");
        expect(stream).toHaveProperty("render");
    });
});

describe("Node", () => {
    test("test create a Node", () => {
        let node = new Node({});
        expect(node).toBeInstanceOf(Node);
    });
    test("test child node rendering", () => {
        let node = new Node({ content: "Hello" });
        node[0] = new Node({ content: "World" });
        let result = node.render();

        expect(result).toBe("HelloWorld");
    });
    test("test labels", () => {
        let node = new Node({ content: "Hello " });
        node["world"] = new Node({ content: "World" });

        expect(node.render()).toBe("Hello World");
        expect(node._node_labels).toEqual(["world"]);
    });
});

describe("Html", () => {
    test("Html class Tests", () => {
        let tag = "div";
        let content = "Hello World";
        let attributes = {};
        let classes = ["class1", "class2"];
        let selfContained = false;
        let id = "test-id";
        let styles = { color: "red", "font-size": "16px" };

        let htmlElement = new HTML({
            tag,
            id,
            classes,
            attributes,
            content,
            styles,
            selfContained,
        });

        expect(htmlElement.tag).toBe(tag);
        expect(htmlElement.content).toBe(content);
        expect(htmlElement.attributes["class"]).toBe("class1 class2");
        expect(htmlElement.attributes["id"]).toBe(id);
        expect(htmlElement.attributes["style"]).toBe("color: red; font-size: 16px");
    });

    test("should render the Html elements correctly", () => {
        let tag = "div";
        let content = "Hello World";
        let attributes = {};
        let classes = ["class1", "class2"];
        let selfContained = false;
        let id = "test-id";
        let styles = { color: "red", "font-size": "16px" };

        let htmlElement = new HTML({
            tag,
            id,
            classes,
            attributes,
            content,
            styles,
            selfContained,
        });
        let expectedOutput =
            '<div class="class1 class2" id="test-id" style="color: red; font-size: 16px">Hello World</div>\n';

        expect(htmlElement.render()).toBe(expectedOutput);
    });
});
