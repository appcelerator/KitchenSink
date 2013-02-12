function listeners() {
	var win = Ti.UI.createWindow({
			title: 'Call history listeners'
		}),
		addListenerBtn = Ti.UI.createButton({
			title: 'Add listeners',
			top: 20,
			left: 5
		}),
		removeListenerBtn = Ti.UI.createButton({
			title: 'Remove listeners',
			top: 60,
			left: 5
		}),
		tableView = Ti.UI.createTableView({
			headerTitle: 'Call list (make a call)',
			backgroundColor: 'transparent',
			rowBackgroundColor: 'white',
			rowHeight: 20,
			top: 110
		}),
		onListenerCB = {
			onadded: function(newItems) {
				var i = 0,
					itemsCount = newItems.length;
				Ti.API.info('New Items have been added');

				for (; i < itemsCount; i++) {
					Ti.API.info(newItems[i].remoteParties[0].remoteParty + ': ' + newItems[i].startTime);

					tableView.appendRow({ title: newItems[i].remoteParties[0].remoteParty + ': ' + newItems[i].startTime });
				}
			},
			onchanged: function(changedItems) {
				var i = 0,
					itemsCount = changedItems.length;
		    	
				Ti.API.info('Items changed');

				for (; i < itemsCount; i++) {
					Ti.API.info(changedItems[i].remoteParties[0].remoteParty + ': ' + changedItems[i].direction);

					tableView.appendRow({ title: changedItems[i].remoteParties[0].remoteParty + ': ' + changedItems[i].direction });
				}
			}
		};

		addListenerBtn.addEventListener('click', function(e) {
			var alertDialog = Ti.UI.createAlertDialog({
					ok: 'Ok'
				});

			try {
				// register a call history callback
				var handle = tizen.call.history.addListener(onListenerCB);

				addListenerBtn.enabled = false;

				alertDialog.message = 'Listener added';
				alertDialog.show();
				
				removeListenerBtn.addEventListener('click', function(e) {
					try {
						// unregister a previously registered listener
						tizen.call.history.removeListener(handle);
						win.remove(removeListenerBtn);
						
						alertDialog.message = 'Listener removed';
						alertDialog.show();
					} catch (removeExc) {
						alertDialog.title = 'The following error occurred: ';
						alertDialog.message = 'Exception - code: ' + removeExc.name + ' message: ' + removeExc.message;
						alertDialog.show();
					}
					addListenerBtn.enabled = true;
					removeListenerBtn.removeEventListener('click');
				});

				win.add(tableView);
				win.add(removeListenerBtn);
			} catch (error) {
				alertDialog.title = 'The following error occurred: ';
				alertDialog.message = 'Exception - code: ' + error.name + ' message: ' + error.message;
				alertDialog.show();
				
				Ti.API.info('Exception - code: ' + error.name + ' message: ' + error.message);
			}
		});

	win.add(addListenerBtn);

	return win;
}

module.exports = listeners;