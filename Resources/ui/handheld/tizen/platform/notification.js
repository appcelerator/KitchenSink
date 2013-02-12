function tizen_alarm() {
	var win = Titanium.UI.createWindow(),
	    label_notification = Titanium.UI.createLabel({
			top: 15,
			text: 'enter message'
		}),
		titleInput = Ti.UI.createTextField({
			top: 45,
			left: 10,
			width: '60%',
			height: 30,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
		}),
		postButton = Ti.UI.createButton({
			top: 45,
			left: '70%',
			width: '25%',
			height: 30,
			title: 'post'
		}),
		removeButton = Ti.UI.createButton({
			left: 10,
			width: '60%',
			top: 95,
			title: 'Remove all notifications'
		});

	removeButton.addEventListener('click', function() {
		tizen.notification.removeAll();
	});

	postButton.addEventListener('click', createNotification);

	function createNotification() {
		var appService = new tizen.ApplicationService('http://tizen.org/appcontrol/operation/default', null),
			//create notification`s parameters
			notificationDict = {
				content: titleInput.value,
				vibration: true, 
				service: appService
			},
			//create and post notification                 
			notification = new tizen.StatusNotification('SIMPLE', 'Simple notification', notificationDict);

		tizen.notification.post(notification);
		titleInput.value = '';
	}

	win.add(removeButton);
	win.add(label_notification);
	win.add(titleInput);
	win.add(postButton);

	return win;
}

module.exports = tizen_alarm;