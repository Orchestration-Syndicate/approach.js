import { Imprint } from "./approach/Imprint/Imprint";
import { Token } from "./approach/Render/Token/Token";

let imp = new Imprint("hello.xml", ".");
imp.Prepare();
imp.Mint("minimal");
