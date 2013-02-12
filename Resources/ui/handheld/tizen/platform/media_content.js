function tizen_media_content(args) {
	var self = Titanium.UI.createWindow(),
		data = [
			{ title: 'Files', hasChild: true, test: 'ui/handheld/tizen/platform/media_content_files' },
			{ title: 'Folders', hasChild: true, test: 'ui/handheld/tizen/platform/media_content_directories' }
		],
		tableview = Ti.UI.createTableView({
			data: data
		});

	tableview.addEventListener('click', function(e){
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow({ title: e.rowData.title, containingTab: args.containingTab });

			args.containingTab.open(win, { animated: true });
		}
	});

	self.add(tableview);

	return self;
};

module.exports = tizen_media_content;