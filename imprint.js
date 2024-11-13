import { Imprint } from "./approach/Imprint/Imprint";
import { XML } from "./approach/Render/XML/Xml";

let x = new XML({});

let imp = new Imprint({
    imprint: "./support/patterns/hello.xml",
    imprint_dir: "./support",
    approach_dir: "..",
});
imp.Prepare();

console.log(imp.getConstructorParams(x.constructor.toString()));

 imp.Mint("minimal");
