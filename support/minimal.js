import { XML } from '../approach/Render/XML/XML.ts';
import { Node } from '../approach/Render/Node/Node.ts';
import { Attribute } from '../approach/Render/Attribute/Attribute.ts';

export class minimal extends Node {
	tokens = {};

	constructor(tokens) {
		super();

		this.tokens = tokens;

		let Node_0_Content = ``;
		let Node_0_Prerender = false;

		let Node_0 = new Node(Node_0_Content, Node_0_Prerender);

			let XML_0_Tag = `div`;
			let XML_0_Content = ``;
			let XML_0_Attributes = {"class":"Hello"};
			let XML_0_SelfContained = false;

			let XML_0 = new XML(XML_0_Tag, XML_0_Content, XML_0_Attributes, XML_0_SelfContained);

				let XML_1_Tag = `p`;
				let XML_1_Content = this.tokens["A"];
				let XML_1_Attributes = {};
				let XML_1_SelfContained = false;

				let XML_1 = new XML(XML_1_Tag, XML_1_Content, XML_1_Attributes, XML_1_SelfContained);

				XML_0.nodes.push(XML_1);

			Node_0.nodes.push(XML_0);

			let XML_2_Tag = `p`;
			let XML_2_Content = `Hello World`;
			let XML_2_Attributes = new Attribute();
				XML_2_Attributes.nodes.push(new Attribute("class", this.tokens["B"]));
			let XML_2_SelfContained = false;

			let XML_2 = new XML(XML_2_Tag, XML_2_Content, XML_2_Attributes, XML_2_SelfContained);

			Node_0.nodes.push(XML_2);

			let Node_1_Content = `<a href='noobscience.in' class='hello'>NoobScience</a>`;
			let Node_1_Prerender = false;

			let Node_1 = new Node(Node_1_Content, Node_1_Prerender);

			Node_0.nodes.push(Node_1);

		this.nodes.push(Node_0);
	}
}
