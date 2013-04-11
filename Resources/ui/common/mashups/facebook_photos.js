function fb_photos(_args) {
	/*globals Titanium, Ti, alert, require, setTimeout, setInterval, JSON*/
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
	facebook.appid = "495338853813822";
	facebook.permissions = ['publish_stream', 'read_stream'];
	
	var B1_TITLE = "Upload Photo from Gallery with Graph API";
	var B2_TITLE = "Upload Photo from file with REST API";
	
	var b1 = Ti.UI.createButton({
		title:B1_TITLE,
		left: 10, right: 10, top: 0, height: 40
	});
	
	var b2 = Ti.UI.createButton({
		title: B2_TITLE,
		left: 10, right: 10, top: 50, height: 40
	});
	
	function showRequestResult(e) {
		var s = '';
		if (e.success) {
			s = "SUCCESS";
			if (e.result) {
				s += "; " + e.result;
			}
		} else {
			s = "FAIL";
			if (e.error) {
				s += "; " + e.error;
			}
		}
		b1.title = B1_TITLE;
		b2.title = B2_TITLE;
		alert(s);
	}
	
	var login = facebook.createLoginButton({
		top: 10
	});
	login.style = facebook.BUTTON_STYLE_WIDE;
	win.add(login);
	
	var actionsView = Ti.UI.createView({
		top: 55, left: 0, right: 0, visible: facebook.loggedIn, height: 'auto'
	});
	actionsView.add(b1);
	actionsView.add(b2);
	
	facebook.addEventListener('login', function(e) {
		if (e.success) {
			actionsView.show();
		}
		if (e.error) {
			alert(e.error);
		}
	});
	
	facebook.addEventListener('logout', function(e){
		Ti.API.info('logout event');
		actionsView.hide();
	});
	
	b1.addEventListener('click', function() {
		Titanium.Media.openPhotoGallery({
			success:function(event)
			{
				b1.title = 'Uploading Photo...';
				var data = {picture: event.media};
				facebook.requestWithGraphPath('me/photos', data, "POST", showRequestResult);
			},
			cancel:function()
			{
			},
			error:function(error)
			{
			},
			allowEditing:true
		});
	});
	
	b2.addEventListener('click', function() {
		b2.title = 'Uploading Photo...';
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images', 'flower.jpg');
		var blob = f.read();
		var data = {
			caption: 'behold, a flower',
			picture: blob
		};
		facebook.request('photos.upload', data, showRequestResult);
	});
	
	win.add(actionsView);
	return win;
};

module.exports = fb_photos;
