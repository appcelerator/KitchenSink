function image_view_encode() {
	var win = Ti.UI.createWindow();
	
	// this is a remote URL with a UTF-8 character encoded. We should be able
	// to fetch this image OK
	
	var test_img = Titanium.UI.createImageView({
			image: 'http://' + encodeURIComponent('цемент.рф') + '/images/cement_logo.gif'
	
	}); 
	
	win.add(test_img);

	return win;
};

module.exports = image_view_encode;