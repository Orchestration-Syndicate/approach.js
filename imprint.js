import { Imprint } from './approach/Imprint/Imprint';

let imp = new Imprint('./support/patterns/hello.xml', './support', '..');
imp.Prepare();

imp.Mint('cool');
