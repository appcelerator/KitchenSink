function textfield_soft() {
	var win = Ti.UI.createWindow({
			backgroundColor: 'white'
		}),
		focused = null,
		label = Ti.UI.createLabel({
			top: 5, 
			left: 10, 
			right: 10, 
			height: 40,
			text: 'Use trackball or D/PAD to change focus.',
			color: 'black'
		}),
		tf1 = Ti.UI.createTextField({
			top: 50, 
			left: 10, 
			right: 10, 
			height:40
		}),
		tf2 = Ti.UI.createTextField({
			top: 95, 
			left: 10, 
			right: 10, 
			height: 40
		}),
		tf3 = Ti.UI.createTextField({
			top: 140, 
			left: 10, 
			right: 10, 
			height: 40
		}),
		btn = Ti.UI.createButton({
			title: 'Close',
			top: 185, 
			left: 10, 
			right: 10, 
			height: 40
		});

	win.add(label);

	tf1.addEventListener('focus', function() {
		focused = tf1;
	});
	win.add(tf1);

	tf2.addEventListener('focus', function() {
		focused = tf2;
		Ti.UI.createNotification({ message: 'focus' }).show(win);
	});
	win.add(tf2);

	tf3.addEventListener('focus', function() {
		focused = tf3;
		Ti.UI.createNotification({ message: 'focus 2' }).show(win);
	});
	win.add(tf3);


	btn.addEventListener('click', function(e) {
		if (focused) {
			focused.blur();	
		}
		win.close();
	});
	win.add(btn);

	return win;
}

module.exports = textfield_soft;