import { minimal } from "./support/minimal";

let x = new minimal({ "A": "Hello World", "B": "container" });
console.log(x.render());
