// Test for Tizen calendar functionality. Test of viewing and removing of call history entries
// (one by one, or all at once).
//
// Tizen only.

function manageHistory() {
	var win = Ti.UI.createWindow({
			title: 'All history'
		}),
		emptyHistoryLbl = Ti.UI.createLabel({
			text: 'History is empty. Add some call first.',
			top: 25,
			left: 5
		}),
		removeAllHistoryBtn = Ti.UI.createButton({
			title: 'Remove all history',
			top: 10,
			left: 5
		}),
		tableView = Ti.UI.createTableView({
			headerTitle: 'Call history list. Click to delete.',
			rowBackgroundColor: 'white',
			rowHeight: 25,
			top: 60
		}),
		delBtn = Ti.UI.createButton({
			title: 'Delete',
			right: 5,
			height: 10,
			width: 10
		}),
		Tizen = require('tizen'),
		filter = Tizen.createAttributeFilter({
			attributeName: 'type',
			matchFlag: Tizen.FILTER_MATCH_FLAG_EXACTLY,
			matchValue: 'TEL'
		}),
		sortMode = Tizen.createSortMode({
			attributeName: 'startTime', 
			order: Tizen.SORT_MODE_ORDER_DESC
		});

		Ti.API.info(Tizen);
		Ti.API.info(Tizen.CallHistory);

	// Call history event enumeration callback.
	function onSuccess(results) {
		var resultsCount = results.length,
			i = 0;
		Ti.API.info('Results length: ' + resultsCount);

		if (resultsCount > 0) {
			function removeRow(item) {
				if (item.rowData.title) {
					Ti.API.info('item.index: ' + item.index);

					try {
						Tizen.CallHistory.remove(results[item.index]);
						tableView.deleteRow(item.index);

						if (tableView.sections[0].rowCount === 0) {
							win.remove(tableView);
							win.remove(removeAllHistoryBtn);
							win.add(emptyHistoryLbl);
						}
					} catch (removeExc) {
						Ti.UI.createAlertDialog({
							message: removeExc.message,
							title: 'The following error occurred: ',
							ok: 'Ok'
						}).show();
					}
				}
			}

			function removeAll(e) {
				Tizen.CallHistory.removeAll(
					function() {
						Ti.API.info('All history removed.');

						win.remove(tableView);
						win.remove(removeAllHistoryBtn);
						win.add(emptyHistoryLbl);
					},
					function(error) {
						Ti.UI.createAlertDialog({
							message: removeExc.message,
							title: 'The following error occurred: ',
							ok: 'Ok'
						}).show();
					}
				);
			}

			tableView.addEventListener('click', removeRow);
			removeAllHistoryBtn.addEventListener('click', removeAll);

			// Populate the table containing call history entries.
			for (; i < resultsCount; i++) {
				tableView.appendRow({ title: results[i].remoteParties[0].remoteParty + ' (' + results[i].direction + ')' });
			}

			win.add(tableView);
			win.add(removeAllHistoryBtn);
		} else if (resultsCount === 0) {
			win.add(emptyHistoryLbl);
		}
	}

	function onError(error) {
		Ti.API.error('ERROR');
		Ti.UI.createAlertDialog({
			message: exep.message,
			title: 'The following error occurred: ',
			ok: 'Ok'
		}).show();
	}

	Tizen.CallHistory.find(onSuccess, onError, filter, sortMode);

	return win;
}

module.exports = manageHistory;