import { Imprint } from './approach/Imprint/Imprint';
import { Token } from './approach/Render/Token/Token';
import { XML } from './approach/Render/XML/Xml';

let imp = new Imprint('hello.xml', '.');
imp.Prepare();
let node = new XML('h1', 'wow', { hello: 12 }, true);
let node2 = new Token('h2');
let node3 = new XML('h3');

console.log(imp.exportNode(node));
