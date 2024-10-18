import { Container } from "./approach/Container/Container";
import { Node } from "./approach/Node/Node"

console.log("Hello via Bun!");

let node = new Node("Hello World!");
let node1 = new Node("Hello World 1!");
let node2 = new Node("Hello World 2!");
node.nodes.push(new Node("Hi!"));
node.nodes.push(new Node("Bye!"));

let res = node.render();
console.log(res);
