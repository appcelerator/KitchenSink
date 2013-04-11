// Test of the Tizen messaging (email) functionality. Test operations with email folders:
// enumerate existing folders and initiate per-folder tests.
//
// Tizen only.

function emailFolders(args) {
	var win = Ti.UI.createWindow({
			title: 'Email folders'
		}),
		tableView = Ti.UI.createTableView({
			rowHeight: 35
		}),
		serviceType = 'messaging.email',
		Tizen = require('tizen'),
		emailService;

	// Initialize email service (Tizen object which allows email functionality).
	function initEmailService(callBack) {
		function servicesListCB(services) {
			var servicesCount = services.length;

			Ti.API.info(servicesCount + ' service(s) found.');

			if (servicesCount === 0) {
				Ti.API.info('The following error occurred: Services list is empty.');
				Ti.UI.createAlertDialog({
					message: 'Services not found!',
					title: 'The following error occurred: ',
					ok: 'Ok'
				}).show();
				return;
			}

			services[0] && (emailService = services[0]);
			callBack && callBack();
		}

		Tizen.Messaging.getMessageServices(serviceType, servicesListCB, errorCB);
	}

	// Called when something's wrong.
	function errorCB(error) {
		Ti.API.info('The following error occurred: ' + error.message);
		Ti.UI.createAlertDialog({
			message: error.message,
			title: 'The following error occurred: ',
			ok: 'Ok'
		}).show();
	}

	// Return list of folders of the email account
	function findFolders() {
		Ti.API.info('Start to find folders');

		function foldersListCB(folders) {
			var foldersCount = folders.length,
				i = 0;

			Ti.API.info(foldersCount + ' folder(s) found.');

			// Called when folder synced
			function syncFolder(item) {
				function folderSynced() {
					Ti.API.info('Folder ' + folders[item.index].name + ' synced.');

					var emailFolderMessages = require('ui/handheld/tizen/platform/messaging/email_folder_messages');

					// Open selected folder
					args.containingTab.open(new emailFolderMessages({
						emailService: emailService, 
						folderName: item.rowData.title, 
						folderId: folders[item.index].id, 
						containingTab: args.containingTab}
					));
				}

				try {
					Ti.API.info('Start to sync ' + item.rowData.title + ' folder.');

					// Sync selected folder
					emailService.syncFolder(folders[item.index], folderSynced, errorCB, 30);
				} catch (exc) {
					Ti.API.info('Exception has been thrown.');
					errorCB(exc); 
				}
			}

			if (foldersCount === 0) {
				errorCB({ message: 'Folders not found.' });
				return;
			}

			// Add found folders to tableview
			for (; i < foldersCount; i++) {
				tableView.appendRow({ title: folders[i].name });
			}

			tableView.addEventListener('click', syncFolder);
			win.add(tableView);
		}

		// Search for email folders
		try {
			Ti.API.info('Start to search list of folders from email account.');

			var attributeFilter = Tizen.createAttributeFilter({
				attributeName: 'serviceId',
				matchFlag: 'EXACTLY',
				matchValue: emailService.id
			});

			emailService.messageStorage.findFolders(attributeFilter, foldersListCB, errorCB);
		} catch(exc) {
			Ti.API.info('Exception has been thrown.');

			errorCB(exc);
		}
	}

	initEmailService(findFolders);

	return win;
}

module.exports = emailFolders;