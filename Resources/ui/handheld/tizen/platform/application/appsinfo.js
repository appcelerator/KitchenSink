function tizen_appsinfo(_args) {
	var self = Ti.UI.createWindow(),
		Tizen = require('tizen'),
		helper = new (require('ui/handheld/tizen/platform/application/helper'));

	// Get the list of applications installed on the device.
	Tizen.Apps.getAppsInfo(function(applications) {
		var data = [],
			i = 0,
			applicationsCount = applications.length,
			tableview = Ti.UI.createTableView({});

		// Generate app info to show in the table view
		for (; i < applicationsCount; i++) {
			data.push({
				// AlertDialog title
				title: applications[i].name + '\n<b>' + applications[i].id + '</b>',
				app_id: applications[i].id,
				app_name: applications[i].name
			});
		}

		tableview.data = data;
		
		// Show dialog with Application context information on click
		tableview.addEventListener('click', helper.showAppInfoById);
		self.add(tableview);

	}, helper.showErrorDialog);

	return self;
}

module.exports = tizen_appsinfo;
