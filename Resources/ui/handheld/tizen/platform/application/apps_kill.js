function tizen_apps_kill(_args) {
	var self = Titanium.UI.createWindow(), 
		tableview = Ti.UI.createTableView();

	// Return information available about a running application.
	function onRunningAppsContext(contexts) {
		var data = [],
			i = 0,
			contexstsCount = contexts.length;

		Ti.API.info(contexts.length + ' application(s) found.');

		for (; i < contexstsCount; i++) {
			data.push({
				// AlertDialog title
				title: contexts[i].appId + '\n' + '<font size="1">' + contexts[i].id + '</font>',
				// app_id contains application id used in showAppInfoById
				// Do not remove it
				app_id: contexts[i].appId,
				id: contexts[i].id
			});
		}

		tableview.data = data;
	}

	// Function kills application by its id
	function _killAppInfoById(app) {
		if (app.rowData && app.rowData.app_id) {
			try {
				appInfo = tizen.application.getAppInfo(app.rowData.app_id);
			} catch (error) {
				_args.showErrorDialog(error, 'Could not call tizen.application.getAppInfo function');
				return;
			}

			Ti.API.info('appInfo.id: ' + appInfo.id);

			var checkedAppId = app.rowData.id,
				optionsDialogOpts = {
					options: ['Ok', 'Cancel'],
					destructive: 1,
					cancel: 1,
					title: 'Do you want to kill this application? \n\n Id = ' + checkedAppId + '\n\n Name = ' + appInfo.name + (appInfo.version ? '\n\n Version = ' + appInfo.version : ' ')
				},
				dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

			dialog.addEventListener('click', function(e) {
				// Press OK button
				if (e.index === 0) {
					Ti.API.info('Start to kill application with id = ' + checkedAppId);

					tizen.application.kill(checkedAppId, function() {
							// Succes callback
							Ti.API.info('Application with ID = ' + checkedAppId + ' has been killed.');

							tableview.deleteRow(app.index);
						}, function(error) {
							// Error callback. Error should be instance of WebAPIError
							_args.showErrorDialog(error.name, error.message);
						}
					);
				}
			});

			dialog.show();
		}
	}

	tizen.application.getAppsContext(onRunningAppsContext, _args.showErrorDialog);

	tableview.addEventListener('click', _killAppInfoById);
	self.add(tableview);

	return self;

}
module.exports = tizen_apps_kill;
