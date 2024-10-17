import { Container } from "./approach/Stream/Container";

console.log("Hello via Bun!");

let container = new Container("Hello World!");
console.log(container.render());
