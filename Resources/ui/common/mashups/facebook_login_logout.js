function fb_login_logout(_args) {
	/*globals Titanium, Ti, alert, JSON */
	var platformName = Titanium.Platform.osname;
	var facebook;
	if (platformName == 'android' || platformName == 'iphone' || platformName == 'ipad') {
		facebook = require('facebook');
	} else {
		facebook = Titanium.Facebook;
	}

	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#fff'
	});

	facebook.appid = '495338853813822';
	facebook.permissions = ['publish_stream', 'read_stream'];

	//
	// Login Status
	//
	var label = Ti.UI.createLabel({
		text:'Logged In = ' + facebook.loggedIn,
		font:{fontSize:14},
		height:'auto',
		top:10,
		textAlign:'center'
	});
	win.add(label);
	
	var forceButton = Ti.UI.createButton({
		title:'Force dialog: '+ facebook.forceDialogAuth,
		top:50,
		width:160,
		height:40
	});
	forceButton.addEventListener('click', function() {
		facebook.forceDialogAuth = !facebook.forceDialogAuth;
		forceButton.title = "Force dialog: "+facebook.forceDialogAuth;
	});
	win.add(forceButton);
	
	function updateLoginStatus() {
		label.text = 'Logged In = ' + facebook.loggedIn;
	}
	
	// capture
	facebook.addEventListener('login', updateLoginStatus);
	facebook.addEventListener('logout', updateLoginStatus);
	
	//
	// Login Button
	//
	win.add(facebook.createLoginButton({
		style : facebook.BUTTON_STYLE_WIDE,
		bottom : 30
	}));
	
	return win;
};

module.exports = fb_login_logout;
