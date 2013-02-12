function callInProgress() {
	var win = Ti.UI.createWindow({
			title: 'Call in progress'
		}),
		infoLbl = Ti.UI.createLabel({
			text: 'Make a call to see it\'s status.',
			top: 20,
			left: 10
		}),
		callStatusLbl = Ti.UI.createLabel({
			text: 'Current call status: ',
			top: 60,
			left: 10
		}),
		callStatusTextLbl = Ti.UI.createLabel({
			top: 60,
			left: 150
		}),
		checkCallStatusBtn = Ti.UI.createButton({
			title: 'Check status',
			top: 90,
			left: 10
		});

	checkCallStatusBtn.addEventListener('click', function(e) {
		try {
			var status = tizen.call.isCallInProgress() ? 'Call in progress' : 'No call';
			
			callStatusTextLbl.text = status;
			
			Ti.API.info('Current call status: ' + status);
		} catch (exc) {	
			Ti.UI.createAlertDialog({
				message: exc.message,
				title: 'Exception has been thrown',
				ok: 'Ok'
			}).show();

			Ti.API.error('error: ' + exc.message);
		}
	});

	win.add(infoLbl);
	win.add(callStatusLbl);
	win.add(callStatusTextLbl);
	win.add(checkCallStatusBtn);

	return win;
}

module.exports = callInProgress;