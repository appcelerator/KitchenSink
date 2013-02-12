function tizen_alarm() {
	var dictionary = [],
		win = Titanium.UI.createWindow(),
		button_bar = Ti.UI.createView({
			backgroundColor: '#555555',
			height: 65,
			bottom: 0,
			layout: 'horizontal',
			horizontalWrap: false
		}),
		newAbsolute = Ti.UI.createButton({
			top : 10,
			height: 45,
			left: 10,
			title: 'Absolute',
			color: '#555555',
		}),
		newRelative = Ti.UI.createButton({
			top : 10,
			height: 45,
			left: 10,
			title: 'Relative',
			color: '#555555',
		}),
		deleteAll = Ti.UI.createButton({
			top : 10,
			height: 45,
			left: 10,
			right: 10,
			title: 'Delete all ',
			color: '#555555',
		}),
		headView = Ti.UI.createView({
			backgroundColor:'#555555',
			height: 25,
			bottom: 0,
		}),
		headLabel = Ti.UI.createLabel({
			color: '#ffffff',
			text: 'Alarm'
		});

	headView.add(headLabel);

	var	tableViewOptions = {
			headerView: headView,
			backgroundColor: '#ffffff',
			rowBackgroundColor: '#555555',
			bottom: 85,
			data : dictionary
		},
		tabView = Ti.UI.createTableView(tableViewOptions);

	newAbsolute.addEventListener('click', function(){
		createAbsoluteAlarm();
	});

	newRelative.addEventListener('click', function(){
		createRelativeAlarm();
	});

	deleteAll.addEventListener('click', function(){
		tizen.alarm.removeAll();
		dictionary = [];
		tabView.setData(dictionary);
	});

	button_bar.add(newAbsolute);
	button_bar.add(newRelative);
	button_bar.add(deleteAll);

	win.add(tabView);
	win.add(button_bar);
	return win;

	function createAbsoluteAlarm(){
		var win = Ti.UI.createWindow({
			backgroundColor: '#555555'
		}),
		dateView = Ti.UI.createView({
			backgroundColor: '#ffffff',
			borderColor: '#333333',
			borderwidth: 1,
			height: 150,
			top: 60,
		}),
		dateLabel = Titanium.UI.createLabel({
			color: '#555555',
			text: 'Time',
			top: 10,
			left: 20
		}),
		dateTimePicker = createPicker({
			value: new Date()
		}),
		periodView = Ti.UI.createView({
			backgroundColor: '#ffffff',
			borderColor: '#333333',
			borderwidth: 1,
			height: 100,
			top: 260,
		}),
		slider = Titanium.UI.createSlider({
			top: 50,
			left: 10,
			right: 10,
			min: 0,
			max: 120,
			value: 0
		}),
		periodLabel = Titanium.UI.createLabel({
			color: '#555555',
			text: 'Repeat interval (sec): ' + slider.value,
			top: 10,
			left: 20
		}),
		winTitle = Ti.UI.createLabel({
			color: '#555555',
			text: 'Absolute Alarm Add',
			top: 20,
			left: 20
		}),
		notification_label = Ti.UI.createLabel({
			color: '#555555',
			text: 'When the time is up, the browser will be shown.',
			bottom : 85
		}),
		saveButton = Ti.UI.createButton({
			color: '#555555',
			bottom: 20,
			left: 20,
			height: 45,
			width : 100,
			title: 'Save'
		}),
		cancelButton = Ti.UI.createButton({
			color: '#555555',
			bottom: 20,
			right : 20,
			height: 45,
			width : 55,
			title: 'Back'
		});

		slider.addEventListener('change', function(e) {
			periodLabel.text = String.format('Repeat interval (sec): %3d', e.value);
		});

		saveButton.addEventListener('click', function(){
			addAbsoluteAlarm(dateTimePicker.value, slider.value);
			win.close();
		});

		cancelButton.addEventListener('click', function(){
			win.close();
		});

		dateView.add(dateTimePicker);
		dateView.add(dateLabel);

		periodView.add(slider);
		periodView.add(periodLabel);

		win.add(dateView);
		win.add(notification_label);
		win.add(winTitle);
		win.add(periodView);
		win.add(saveButton);
		win.add(cancelButton);

		win.open();
	}

	function createPicker(){
		var picker = Ti.UI.createPicker({
			type: Ti.UI.PICKER_TYPE_DATE_AND_TIME,
			selectionIndicator: true, // turn on the selection indicator (off by default)
			value: new Date()
		});

		return picker;
	}

	function addAbsoluteAlarm(time, period){
		var period = Math.floor(period),
			alarm = new tizen.AlarmAbsolute(time, period);
			dialog = Ti.UI.createAlertDialog({
				cancel: 1,
				buttonNames: ['Ok'],
				title: 'Alarm'
			});

		tizen.alarm.add(alarm, 'org.tizen.browser');
		dialog.message = 'Alarm has been successfuly added with id ' + alarm.id;
		dialog.show();
		addRow(alarm);
	}

	function createRelativeAlarm(){
		var win = Ti.UI.createWindow({
				backgroundColor: '#555555'
			}),
			delayView = Ti.UI.createView({
				backgroundColor: '#ffffff',
				borderColor: '#555555',
				borderwidth: 1,
				height: 100,
				top: 60,
			}),
			sliderDelay = Titanium.UI.createSlider({
				top: 50,
				left: 10,
				right: 10,
				min: 0,
				max: 120,
				value: 10
			}),
			delayLabel = Titanium.UI.createLabel({
				color: '#555555',
				text: 'Delay (sec)' + sliderDelay.value,
				top: 10,
				left: 20
			}),
			periodView = Ti.UI.createView({
				backgroundColor: '#ffffff',
				borderColor: '#555555',
				borderwidth: 1,
				height: 100,
				top: 210,
			}),
			slider = Titanium.UI.createSlider({
				top: 50,
				left: 10,
				right: 10,
				min: 0,
				max: 120,
				value: 0
			}),
			periodLabel = Titanium.UI.createLabel({
				color: '#555555',
				text: 'Repeat interval (sec): ' + slider.value,
				top: 10,
				left: 20
			}),
			winTitle = Ti.UI.createLabel({
				color: '#ffffff',
				text: 'Relative Alarm Add',
				top: 20,
				left: 20
			}),
			notificationLabel = Ti.UI.createLabel({
				color: '#ffffff',
				text: 'When the time is up, the clock app will be shown.',
				bottom : 85
			}),
			saveButton = Ti.UI.createButton({
				color: '#555555',
				bottom: 20,
				left: 20,
				height: 45,
				width : 100,
				title: 'Save'
			}),
			cancelButton = Ti.UI.createButton({
				color: '#555555',
				bottom: 20,
				right : 20,
				height: 45,
				width : 55,
				title: 'Back'
			});

		sliderDelay.addEventListener('change', function(e) {
			delayLabel.text = String.format('Delay (sec): %3d', e.value);
		});

		delayView.add(sliderDelay);
		delayView.add(delayLabel);

		slider.addEventListener('change', function(e) {
		    periodLabel.text = String.format('Repeat interval (sec): %3d', e.value);
		});

		periodView.add(slider);
		periodView.add(periodLabel);

		win.add(notificationLabel);
		win.add(winTitle);

		saveButton.addEventListener('click', function(){
			addRelativeAlarm(sliderDelay.value, slider.value);
			win.close();
		});

		cancelButton.addEventListener('click', function(){
			win.close();
		});

		win.add(delayView);
		win.add(periodView);
		win.add(saveButton);
		win.add(cancelButton);

		win.open();

	}

	function addRelativeAlarm(delay, period){
		period = Math.floor(period);
		delay = Math.floor(delay);

		var alarm = new tizen.AlarmRelative(delay, period),
			dialog = Ti.UI.createAlertDialog({
				cancel: 1,
				buttonNames: ['Ok'],
				message: 'Alarm has been successfuly added with id ' + alarm.id,
				title: 'Alarm'
			});

		tizen.alarm.add(alarm, 'org.tizen.clock');
		dialog.show();
		addRow(alarm);
	}

	function addRow(alarm){
		var row = createRow(alarm);
		dictionary.push(row);
		tabView.setData(dictionary);
	}

	function createRow(alarm){
		var text1, 
			text2, 
			remaining,
			view = Ti.UI.createView({
				layout: 'horizontal'
			}),
			childView = Ti.UI.createView({
				width: 220,
				layout: 'vertical'
			}),
			label1 = Ti.UI.createLabel({
				font: { fontSize:18 },
				color: '#555555'
			}),
			label2 = Ti.UI.createLabel({
				color: '#555555'
			}),
			button = Ti.UI.createButton({
				color: '#555555',
				title: 'Delete',
				right: 20
			}),
			row = Ti.UI.createTableViewRow({
				alarmId: alarm.id,
				touchEnabled: true,
				height: 50
			});

		if (alarm instanceof tizen.AlarmAbsolute) {
			remaining = alarm.getNextScheduledDate();
			text1 = remaining.toDateString();
			text2 = 'Absolute alarm (Period ' + alarm.period + ')';
		} else if (alarm instanceof tizen.AlarmRelative) {
			text1 = alarm.delay + ' sec';
			text2 = 'Relative alarm (Period ' + alarm.period + ')';
		}

		label2.text = text2;
		label1.text = text1;

		childView.add(label1);
		childView.add(label2);

		button.addEventListener('click', function(){
			var id = alarm.id,
				i = 0,
				len = dictionary.length;

			try{
				tizen.alarm.remove(alarm.id);
			} catch(e){

			}
			for(; i < len; i++){
				if(dictionary[i].alarmId === id){
					dictionary.splice(i, 1);
					tabView.setData(dictionary);
					break;
				}
			}
		});

		view.add(childView);
		view.add(button);

		row.add(view);
		return row;
	}
}

module.exports = tizen_alarm;