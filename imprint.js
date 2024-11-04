import { Imprint } from './approach/Imprint/Imprint';
import { Container } from './approach/Render/Container/Container';
import { HTML } from './approach/Render/HTML/Html';

let x = new HTML();
let y = new Container();
let imp = new Imprint('./support/patterns/hello.xml', './support', '..');
// imp.Prepare();

// imp.Mint('cool');

let instance = new globalThis['HTML']();
let filteredArgs = imp.filterConstructorParams(instance, [{tag: 'div', content: 'Hello joshi', id: 'id2'}])
console.log(imp.getConstructorParams(instance.constructor.toString()))
console.log(filteredArgs);