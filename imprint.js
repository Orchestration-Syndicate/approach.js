import { Imprint } from './approach/Imprint/Imprint';
import { HTML } from './approach/Render/HTML/Html';
import { Node } from './approach/Render/Node/Node';
import { Token } from './approach/Render/Token/Token';
import { XML } from './approach/Render/XML/Xml';

let imp = new Imprint('hello.xml', '.');
imp.Prepare();

let node = new XML('h1', 'wow', { hello: 12 }, true);
let node2 = new Token('h2');
let node3 = new XML('h3');
let node4 = new HTML('h4');

let n = 'HTML';

const instance = eval(`new ${n}`);

console.log(instance)

console.log(imp.exportNode(node4));

//imp.Mint('minimal');
