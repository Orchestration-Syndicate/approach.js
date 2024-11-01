import { XML } from '../approach/Render/XML/XML.ts';
import { Node } from '../approach/Render/Node/Node.ts';

export class cool extends Node {
	tokens = {};

	constructor(tokens) {
		super();

		this.tokens = tokens;

		let Node_2_Content = ``;
		let Node_2_Prerender = false;

		let Node_2 = new Node(Node_2_Content, Node_2_Prerender);

			let Node_3_Content = `<p>Hello World</p>`;
			let Node_3_Prerender = false;

			let Node_3 = new Node(Node_3_Content, Node_3_Prerender);

			Node_2.nodes.push(Node_3);

			let XML_3_Tag = `div`;
			let XML_3_Content = ``;
			let XML_3_Attributes = {"class":"wow"};
			let XML_3_SelfContained = false;

			let XML_3 = new XML(XML_3_Tag, XML_3_Content, XML_3_Attributes, XML_3_SelfContained);

				let Node_4_Content = `<p>This is some important content</p>`;
				let Node_4_Prerender = false;

				let Node_4 = new Node(Node_4_Content, Node_4_Prerender);

				XML_3.nodes.push(Node_4);

				let Node_5_Content = `<div>
  <a href='https://github.com'>GitHub</a>
</div>`;
				let Node_5_Prerender = false;

				let Node_5 = new Node(Node_5_Content, Node_5_Prerender);

				XML_3.nodes.push(Node_5);

			Node_2.nodes.push(XML_3);

			let Node_6_Content = `<section>
  <p>This is a section</p>
</section>`;
			let Node_6_Prerender = false;

			let Node_6 = new Node(Node_6_Content, Node_6_Prerender);

			Node_2.nodes.push(Node_6);

		this.nodes.push(Node_2);
	}
}
