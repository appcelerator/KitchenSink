function tizen_exit_hide_launch(_args) {
	var win = Ti.UI.createWindow(),
		CALC_APP_ID = 'org.tizen.calculator', 
		butttonHeightOffset = 10, 
		butttonHeight = 40, 
		butttonWidth = 200;

	// Create button for Exit
	var buttonExit = Titanium.UI.createButton({
		title: 'Exit Kitchen Sink',
		height: butttonHeight,
		width: butttonWidth,
		top: butttonHeightOffset
	});

	// Call tizen.application.exit when button has been pressed
	buttonExit.addEventListener('click', function() {
		try {
			tizen.application.exit();
		} catch (e) {
			_args.showErrorDialog(e, 'Could not Exit from KitchenSink');
		}
	});
	win.add(buttonExit);

	// Create button for Hide
	var buttonHide = Titanium.UI.createButton({
		title: 'Hide Kitchen Sink',
		height: butttonHeight,
		width: butttonWidth,
		top: butttonHeightOffset + butttonHeight + butttonHeightOffset
	});

	// Call tizen.application.exit when button has been pressed
	buttonHide.addEventListener('click', function() {
		try {
			tizen.application.hide();
		} catch (e) {
			_args.showErrorDialog(e, 'Could not Hide KitchenSink');
		}
	});
	win.add(buttonHide);

	// Create button for Launch
	var buttonLaunch = Titanium.UI.createButton({
		title: 'Launch Calculator',
		height: butttonHeight,
		width: butttonWidth,
		top: 3 * butttonHeightOffset + 2 * butttonHeight
	});
	// Call tizen.application.exit when button has been pressed
	buttonLaunch.addEventListener('click', function() {
		try {
			tizen.application.launch(CALC_APP_ID);
		} catch (e) {
			_args.showErrorDialog(e, 'Could not Launch Calculator');
		}
	});
	win.add(buttonLaunch);

	return win;
}
module.exports = tizen_exit_hide_launch;
