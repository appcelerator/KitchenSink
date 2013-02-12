function history(args) {
	var self = Ti.UI.createWindow({
			title: 'Call history'
		}),
		tableview = Ti.UI.createTableView({
			data: [
				{ title: 'Manage history', test: 'ui/handheld/tizen/platform/call/manage_history' },
				{ title: 'Listeners', test: 'ui/handheld/tizen/platform/call/listeners' },
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

module.exports = history;