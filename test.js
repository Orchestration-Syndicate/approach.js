import { minimal } from "./support/minimal";
import { cool } from "./support/cool";

let x = new minimal({ "A": "Hello World", "B": "container" });
console.log(x.render());
