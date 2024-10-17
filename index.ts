import { Container } from "./approach/Container/Container";

console.log("Hello via Bun!");

let container = new Container("Hello World!");
console.log(container.render());
