function tizen_appscontext(_args) {
	var self = Titanium.UI.createWindow();

	//Return information available about a running application.
	tizen.application.getAppsContext(function(contexts) {
		var data = [],
			i = 0,
			contextsCount = contexts.length,
			tableview = Ti.UI.createTableView({});

		for (; i < contextsCount; i++) {
			data.push({
				//AlertDialog title
				title: contexts[i].appId + '\n<font size="1">' + contexts[i].id + '</font>',
				//app_id consist application id used in showAppInfoById
				//Do not remove it
				app_id: contexts[i].appId,
				id: contexts[i].id
			});
		}
		tableview.data = data;

		//Show dialog with Application information
		tableview.addEventListener('click', _args.showAppInfoById);
		self.add(tableview);

	}, _args.showErrorDialog);

	return self;

}
module.exports = tizen_appscontext;
