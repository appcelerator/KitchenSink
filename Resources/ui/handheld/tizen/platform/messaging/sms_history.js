function smsHistory(args) {
	var win = Ti.UI.createWindow({
			title: 'sms history'
		}),
		serviceType = 'messaging.sms';

	function serviceListCB(services) {
		Ti.API.info(services.length + ' service(s) found.');

		// SuccessCallback funciton for findMessages
		function messagesListCB(messagesList) {
			var INBOX = 1,
				OUTBOX = 2,
				DRAFTS = 3,
				SENTBOX = 4;

			var tableView = Ti.UI.createTableView({
					headerTitle: 'Click to delete.',
					rowHeight: 25
				}),
				i = 0,
				messageCount = messagesList.length,
				emptyHistoryLbl = Ti.UI.createLabel({
					text: 'History is empty. Add some messages first.',
					top: 25,
					left: 5
				});

			Ti.API.info(messageCount + ' message(s) found.');

			function removeMessage(item) {
				Ti.API.info('Start to remove sms.');

				// Success callback function for removeMessages
				function messagesRemovedCB() {
					Ti.API.info('Message successfully removed.');

					// delete message from tableview (from list)
					tableView.deleteRow(item.index);
					messagesList.splice(item.index, 1);

					if (messageCount === 0) {
						win.remove(tableView);
						win.add(emptyHistoryLbl);
					}
				}

				if (item.rowData.title) {
					// Remove array of messages
					try {
						smsService.messageStorage.removeMessages([messagesList[item.index]], messagesRemovedCB, errorCB);
					} catch (exc) {
						Ti.API.info('Exception has been thrown.');
						errorCB(exc);
					}
				}
			}

			if (messageCount > 0) {
				var box = ['INBOX', 'OUTBOX', 'DRAFTS', 'SENTBOX'];

				win.add(tableView);
				tableView.addEventListener('click', removeMessage);

				for (; i < messageCount; i++) {
					var row = Ti.UI.createTableViewRow(),
						inFolder = 'In ' + box[messagesList[i].folderId - 1];

					if (messagesList[i].folderId === INBOX) {
						row.title = messagesList[i].from + '  (' + inFolder + ')';
					} else {
						row.title = messagesList[i].to[0] + '  (' + inFolder + ')';
					}

					// Add message to tableview 
					tableView.appendRow(row);
				}
			} else {
				win.add(emptyHistoryLbl);
			}
		}

		if (services.length > 0) {
			var smsService = services[0];

			// Search for messages by filter
			smsService.messageStorage.findMessages(new tizen.AttributeFilter('type', 'EXACTLY', serviceType), messagesListCB, errorCB);
		} else {
			Ti.API.info('Exception has been thrown.');

			errorCB({message: 'Services list is empty.'});
		}
	}

	// Callback function for errors
	function errorCB(error) {
		Ti.API.info('The following error occurred: ' + error.message);
		Ti.UI.createAlertDialog({
			message: error.message,
			title: 'The following error occurred: ',
			ok: 'Ok'
		}).show();
	}

	tizen.messaging.getMessageServices(serviceType, serviceListCB, errorCB);

	return win;
}

module.exports = smsHistory;