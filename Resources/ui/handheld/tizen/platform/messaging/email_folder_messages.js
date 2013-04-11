// Test of the Tizen messaging (email) functionality. Test operations with messages in email folders
// (message search, message enumeration, message removal). This test is part of the
// "email_folders" test.
//
// Tizen only.

function emailFolderMessages(args) {
	var Tizen = require('tizen'),
		folderName = args.folderName,
		emailService = args.emailService,	// Tizen email service object, required for messaging
		folderId = args.folderId.toString(),
		win = Ti.UI.createWindow({
			title: folderName
		});

	// Error callback
	function errorCB(error) {
		Ti.API.info('The following error occurred: ' + error.message);

		Ti.UI.createAlertDialog({
			message: error.message,
			title: 'The following error occurred: ',
			ok: 'Ok'
		}).show();
	}

	// Load list of messages
	function messagesFoundCB(messages) {
		var tableView = Ti.UI.createTableView(),
			emptyListLbl = Ti.UI.createLabel({
				text: args.folderName + ' folder is empty.',
				top: 20,
				left: 5
			}),
			messagesCount = messages.length,
			i = 0;

		Ti.API.info(messagesCount + ' message(s) found.');

		if (messagesCount === 0) {
			win.add(emptyListLbl);
			return;
		}

		// "Body successfully loaded" callback.
		function messageBodyLoaded(message) {
			Ti.API.info('Body for message: ' + message.subject + ' from: ' + message.from + 'loaded.');
		}

		// "Error while loading body" callback.
		function loadBodyErrorCB(error) {
			Ti.API.info('Can not load message body: ' + error.message);
		}

		// Populate the list of messages in the folder.
		for (; i < messagesCount; i++) {
			var message = messages[i];

			if (!message.body.loaded) {
				try {
					Ti.API.info('Start to load message body for message wiht index '+ i);

					emailService.loadMessageBody(message, messageBodyLoaded, loadBodyErrorCB);	
				} catch (exc) {
					Ti.API.info('Exception throws for loadMessageBody: ' + exc.message);
				}
			}

			var row = Ti.UI.createTableViewRow(),
				titleLbl = Ti.UI.createLabel({
					width: '75%',
					text: messages[i].from + ' (Subject: ' + messages[i].subject.substr(0, 20) + '...)',
					left: 5
				});
				delBtn = Ti.UI.createButton({
					top: 10,
					title: 'Delete',
					bubbleParent: false,
					width: '20%',
					borderRadius: 2,
					height: 28,
					right: 5
				});

			// Message removal.
			(function(index) {
				delBtn.addEventListener('click', function() {
					// Success remove of message
					function removedSuccessCB() {
						Ti.API.info('Message removed successfully.');

						tableView.deleteRow(index);
						messages.splice(index, 1);

						if (messages.length == 0) {
							win.remove(tableView);
							win.add(emptyListLbl);
						}
					}

					try {
						// Remove selected message
						emailService.messageStorage.removeMessages([messages[index]], removedSuccessCB, errorCB);
					} catch (exc) {
						Ti.API.info('Exception has been thrown when call removeMessages function.');

						errorCB(exc);
					}
				});
			}(i));

			row.add(titleLbl);
			row.add(delBtn);
			tableView.appendRow(row);
		}

		win.add(tableView);

		tableView.addEventListener('click', function(item) {
			var ExampleWindow = require('ui/handheld/tizen/platform/messaging/email_show_message');

			// Show message detail
			args.containingTab.open(new ExampleWindow({emailService: args.emailService, message: messages[item.index]}));
		});
	}

	// Request Tizen message search.
	try {
		Ti.API.info('Start to find messages in ' + folderName + ' folder.');

		var attributeFilter = Tizen.createAttributeFilter({
			attributeName: 'folderId', 
			matchFlag: 'EXACTLY',
			matchValue: folderId
		});
		
		// Remove selected message
		emailService.messageStorage.findMessages(attributeFilter, messagesFoundCB, errorCB);
	} catch (exc) {
		Ti.API.info('Exception has been thrown when call findMessages function.');

		errorCB(exc);
	}

	return win;
}

module.exports = emailFolderMessages;