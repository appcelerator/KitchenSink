function tizen_application(_args) {
	var self = Titanium.UI.createWindow(), 
		tableview = Ti.UI.createTableView({
			data : [
				{ title: 'Installed App Info', hasChild: true, test: 'ui/handheld/tizen/platform/application/appsinfo' }, 
				{ title: 'Running App Info', hasChild: true, test: 'ui/handheld/tizen/platform/application/appscontext' }, 
				{ title: 'Kill Running App', hasChild: true, test: 'ui/handheld/tizen/platform/application/apps_kill' }, 
				{ title: 'Exit / Hide / Launch', hasChild: true, test: 'ui/handheld/tizen/platform/application/exit_hide_launch' }
			]
		});

	tableview.addEventListener('click', function(e) {
		if (e.rowData.test) {
			var TizenApplication = require(e.rowData.test), 
				win = new TizenApplication({
					title : e.rowData.title,
					containingTab : _args.containingTab,
					showAppInfoById : _showAppInfoById,
					showErrorDialog : _showErrorDialog
				});

			_args.containingTab.open(win, {
				animated : true
			});
		}
	});

	// Function shows AlertDialog with app information
	// e.rowData.app_id - should contain application id
	// e.rowData.title - Should contain dialog title
	function _showAppInfoById(e) {
		if (e.rowData && e.rowData.app_id) {
			var appInfo;
			try {
				appInfo = tizen.application.getAppInfo(e.rowData.app_id);
			} catch (error) {
				_showErrorDialog(error, 'Could not call tizen.application.getAppInfo function');
				return;
			}

			Titanium.UI.createAlertDialog({
				title: e.rowData.title,
				message: '\n\n Id = ' + appInfo.id + 
				'\n\n Name = ' + appInfo.name +
					(appInfo.iconPath ? '\n\n IconPath = ' + appInfo.iconPath : ' ') +
					(appInfo.version ? '\n\n Version = ' + appInfo.version : ' ') + 
					(appInfo.show ? '\n\n Show = ' + appInfo.show : ' ') +
					(appInfo.installDate ? '\n\n InstallDate = ' + appInfo.installDate : '') +
					(appInfo.size ? '\n\n Size = ' + appInfo.size : '')
			}).show();
		}
	}

	// Function shows AlertDialog with error message
	// And logs this error
	function _showErrorDialog(logMessage, userMessage) {
		Ti.API.error(logMessage);
		Titanium.UI.createAlertDialog({
			title: 'Unexpected action',
			message: userMessage ? userMessage : logMessage
		}).show();
	}
	self.add(tableview);

	return self;
}
module.exports = tizen_application;
