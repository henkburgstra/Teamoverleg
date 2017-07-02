var data = {
	items: [
		{
			type: 'chapter',
			code: '',
			title: 'Huidige situatie: activiteiten/participatieniveau',
			items: [
				{
					type: 'chapter',
					code: 'd1',
					title: 'Leren en toepassen van kennis',
					items: [
						{
							type: 'item',
							code: 'd110-d129',
							title: 'Doelbewust gebruiken van zintuigen',
							values: [
								{
									id: "4647dd3f-afa3-4edb-9eda-8bf191b98191",
									user: 'ugur',
									date: "30-03-2013",
									value: 'Geen idee wat hier hoort'
								},
								{
									id: "a25f8167-b1dc-4c7e-a0b2-68a83cca0bf7",
									user: 'adriaan',
									date: "31-03-2013",
									value: 'Hier heb ik niets aan toe te voegen. Bla die bla die bla die bla die bla die bla die bla'
								}
							]
						},
						{
							type: 'item',
							code: 'd130-d159',
							title: 'Basaal leren'
						},
						{
							type: 'item',
							code: 'd160-d179',
							title: 'Toepassen van kennis'
						}
					]
				},
				{
					type: 'chapter',
					code: 'd2',
					title: 'Algemene taken en eisen',
					items: [
						{
							type: 'item',
							code: 'd210-d230',
							title: 'Ondernemen van enkelvoudige taak / meervoudige / dagelijkse routinehandeling'
						},
						{
							type: 'item',
							code: 'd240-d250',
							title: 'd240-250 Omgaan met stress en andere mentale eisen en eigen gedrag'
						}
					]
				}
			]
		},
		{
			type: 'chapter',
			code: '',
			title: 'Huidige situatie: functies en anatomisiche eigenschappen',
			items: [
				{
					type: 'chapter',
					code: 'b/s1',
					title: 'Mentale functies',
					items: [
						{
							type: 'item',
							code: 'b/s110-139',
							title: 'Algemene mentale functies'
						},
						{
							type: 'item',
							code: 'b/s140-189',
							title: 'Specifieke mentale functies'
						}
					]
				}
			]
		}
	]
};
var user = "henk";

enyo.kind({
	name: "RapItemElement",
	kind: "enyo.Control",
	classes: "rap-item-element",
	published: {
		"user": "user",
		"date": "",
		"value": ""
	},
	events: {
		onItemChanged: ""
	},
	components: [
		{
			name: "input",
			kind: "onyx.TextArea",
			classes: "rap-item-input",
			onchange: "itemChanged"
		}
	],
	create: function() {
		this.inherited(arguments);
	},
	isCompleted: function() {
		return (this.$.input.getValue() !== "");
	},
	itemChanged: function(inSender, inEvent) {
		this.doItemChanged({control: inSender, value: this.$.input.getValue()});
	}
});
enyo.kind({
	name: "RapItemElementReadOnly",
	kind: "enyo.Control",
	classes: "rap-item-element-readonly",
	published: {
		"user": "user",
		"date": "",
		"value": ""
	},
	components: [
		{
			name: "user",
			tag: "span",
			classes: "rap-item-user"
		},
		{
			name: "date",
			tag: "span",
			classes: "rap-item-date"
		},
		{
			name: "value",
			classes: "rap-item-value"
		}
	],
	create: function() {
		this.inherited(arguments);
		this.$.user.content = this.user;
		this.$.date.content = this.date;
		this.$.value.content = this.value;
	}
});
enyo.kind({
	name: "RapItem",
	kind: "enyo.Control",
	classes: "rap-item",
	published: {
		code: "code",
		title: "item"
	},
	handlers: {
		onItemChanged: "itemChanged"
	},

	components: [
		{
			name: "data",
			tag: "div",
			components: [
				{
					name: "code",
					tag: "div",
					classes: "rap-item-code"
				},
				{
					name: "title",
					tag: "div",
					classes: "rap-item-title"
				},
				{
					name: "edits",
					tag: "div",
					classes: "rap-item-edits"
				}
			]
		}
	],
	create: function() {
		this.inherited(arguments);
		this.$.code.content = this.code;
		this.$.title.content = this.title;
	},
	appendValue: function(data) {
		var kind = "";
		if (data.user == user) {
			kind = "RapItemElement";
		}
		else {
			kind = "RapItemElementReadOnly";
		}
		return this.$.edits.createComponent({
			id: data.id,
			kind: kind,
			user: data.user,
			date: data.date,
			value: data.value
		});
	},
	isCompleted: function() {
		for (var i = 0; i < this.$.edits.controls.length; i++) {
			var control = this.$.edits.controls[i];
			if (control.kind == "RapItemElement") {
				return control.isCompleted();
			}
		}
	},
	itemChanged: function(inSender, inEvent) {
		alert(inEvent.value);
		return true;
	}
});
enyo.kind({
	name: "Collapsible",
	kind: "enyo.Control",
	classes: "collapsible",

	published: {
		title: "Header"
	},

	components: [
		{
			kind: "Signals",
			onExpand: "expand"
		},
		{
			name: "header",
			content: "Header",
			classes: "collapsible-header",
			ontap: "toggleState"
		},
		{
			name: "drawer",
			kind: "onyx.Drawer"
		}
	],
	create: function() {
		this.inherited(arguments);
		this.hasInput = false;
		this.$.header.content = this.title;
	},
	addToDrawer: function(data) {
		var component = this.$.drawer.createComponent(data);
		if (component.kind == "RapItem") {
			this.hasInput = true;
		}
		return component;
	},
	toggleState: function(inSender, inEvent) {
		var open = this.$.drawer.open;
		inSender.addRemoveClass("collapsible-header-expanded", !open);
		this.$.drawer.setOpen(!open);
	},
	expand: function(inSender, mode) {
		var open;
		var completed;
		if (mode == "none") {
			open = false;
		}
		else if (mode == "all") {
			open = true;
		}
		else if (mode == "completed") {
			completed = this.isCompleted();
			if (completed === true) {
				open = true;
			}
			else if (completed === false){
				open = false;
			}
		}
		else if (mode == "not-completed") {
			completed = this.isCompleted();
			if (completed === true) {
				open = false;
			}
			else if (completed === false) {
				open = true;
			}
		}
		if (open !== undefined) {
			this.$.drawer.setOpen(open);
			this.$.header.addRemoveClass("collapsible-header-expanded", open);
			if (open === true) {
				if (this.owner.kind == "onyx.Drawer") {
					this.owner.owner.expand(this, "all");
				}
			}
		}
	},
	isCompleted: function() {
		if (this.hasInput) {
			for (var i = 0; i < this.$.drawer.controls.length; i++) {
				var control = this.$.drawer.controls[i];
				if (control.kind == "RapItem") {
					if (!control.isCompleted()) {
						return false;
					}
				}
			}
			return true;
		}
		return undefined;
	}
});
enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	components:[
		{
			kind: "onyx.Toolbar",
			content: "Teamoverleg"
		},
		{
			kind: "enyo.Scroller",
			name: "scroller",
			fit: true
		},
		{
			kind: "onyx.Toolbar",
			components: [
				{
					kind: "onyx.Button",
					content: "Alles inklappen",
					ontap: "collapseAll"
				},
				{
					kind: "onyx.Button",
					content: "Alles uitklappen",
					ontap: "expandAll"
				},
				{
					kind: "onyx.Button",
					content: "Niet gereed uitklappen",
					ontap: "expandNotCompleted"
				},
				{
					kind: "onyx.Button",
					content: "Gereed uitklappen",
					ontap: "expandCompleted"
				}
			]
		}
	],
	buildChapters: function(parent, items) {
		var data;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.type == 'chapter') {
				data = {
					kind: "Collapsible",
					code: item.code,
					title: item.title
				};
				var collapsible;
				if (parent.kind == "Collapsible") {
					collapsible = parent.addToDrawer(data);
				}
				else {
					collapsible = parent.createComponent(data);
				}
				collapsible.$.drawer.setOpen(false);
				this.buildChapters(collapsible, item.items);
			}
			else if (item.type == 'item') {
				data = {
					kind: "RapItem",
					code: item.code,
					title: item.title
				};
				var rapItem;
				if (parent.kind == "Collapsible") {
					rapItem = parent.addToDrawer(data);
				}
				else {
					rapItem = parent.createComponent(data);
				}
				if (item.values !== undefined) {
					for (var v = 0; v < item.values.length; v++) {
						rapItem.appendValue(item.values[v]);
					}
				}
				rapItem.appendValue(
					{
						user: "henk",
						date: "31-03-2013",
						value: ""
					}
				);
			}
		}
		// Object.keys(data).forEach(function(key) {

		// });
	},
	create: function() {
		this.inherited(arguments);
		this.buildChapters(this.$.scroller, data.items);
	},
	expand: function(mode) {
		if (this.$.scroller.controls) {
			var controls = this.$.scroller.controls;
			for (var i = 0; i < controls.length; i++) {
				var control = controls[i];
				if (control.kind == "Collapsible") {
					control.expand(mode);
				}
			}
		}
	},
	collapseAll: function(inSender, inEvent) {
		enyo.Signals.send("onExpand", "none");
	},
	expandAll: function(inSender, inEvent) {
		enyo.Signals.send("onExpand", "all");
	},
	expandCompleted: function(inSender, inEvent) {
		enyo.Signals.send("onExpand", "none");
		enyo.Signals.send("onExpand", "completed");
	},
	expandNotCompleted: function(inSender, inEvent) {
		enyo.Signals.send("onExpand", "none");
		enyo.Signals.send("onExpand", "not-completed");
	}
});
