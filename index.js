import { Attribute } from "./approach/Render/HTML/Attribute";
import { HTML } from "./approach/Render/HTML/Html";

let xml = new HTML("html", "", [], { lang: "en" });
let head = new HTML("head");
let body = new HTML("body", "", ["body"]);
let title = new HTML("title", "", [], {}, "Hello, World!");
let h1 = new HTML("h1");
h1.content = "Hello, World!";

xml[0] = head;
xml[1] = body;
head[0] = title;
body[0] = h1;

let x = new Attribute("class", "container");

let result = xml.render();
console.log(result);
console.log(x.render());
