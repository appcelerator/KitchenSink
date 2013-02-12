function call(args) {
	var self = Ti.UI.createWindow({
			title: 'Call'
		}),
		tableview = Ti.UI.createTableView({
			data: [
				{ title: 'Call in progress', hasChild: true, test: 'ui/handheld/tizen/platform/call/call_in_progress' },
				{ title: 'Call history', hasChild: true, test: 'ui/handheld/tizen/platform/call/history' }
			]
		});

	tableview.addEventListener('click', function(e) {
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow({ title: e.rowData.title, containingTab: args.containingTab });

			args.containingTab.open(win, { animated: true });
		}
	});

	self.add(tableview);

	return self;
}

module.exports = call;