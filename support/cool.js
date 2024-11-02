import { XML } from '../approach/Render/XML/XML.ts';
import { Node } from '../approach/Render/Node/Node.ts';
import { Attribute } from '../approach/Render/Attribute/Attribute.ts';

export class cool extends Node {
	tokens = {};

	constructor(tokens) {
		super();

		this.tokens = tokens;

		let Node_0_Content = ``;
		let Node_0_Prerender = false;

		let Node_0 = new Node(Node_0_Content, Node_0_Prerender);

			let Node_1_Content = `<p>Hello World</p>`;
			let Node_1_Prerender = false;

			let Node_1 = new Node(Node_1_Content, Node_1_Prerender);

			Node_0.nodes.push(Node_1);

			let XML_0_Tag = `div`;
			let XML_0_Content = ``;
			let XML_0_Attributes = new Attribute();
				XML_0_Attributes.nodes.push(new Attribute("class", this.tokens["wow"]));
			let XML_0_SelfContained = false;

			let XML_0 = new XML(XML_0_Tag, XML_0_Content, XML_0_Attributes, XML_0_SelfContained);

				let Node_2_Content = `<p>This is some important content</p>`;
				let Node_2_Prerender = false;

				let Node_2 = new Node(Node_2_Content, Node_2_Prerender);

				XML_0.nodes.push(Node_2);

				let Node_3_Content = `<div>
  <a href='https://github.com'>GitHub</a>
</div>`;
				let Node_3_Prerender = false;

				let Node_3 = new Node(Node_3_Content, Node_3_Prerender);

				XML_0.nodes.push(Node_3);

			Node_0.nodes.push(XML_0);

			let Node_4_Content = `<section>
  <p>This is a section</p>
</section>`;
			let Node_4_Prerender = false;

			let Node_4 = new Node(Node_4_Content, Node_4_Prerender);

			Node_0.nodes.push(Node_4);

		this.nodes.push(Node_0);
	}
}
