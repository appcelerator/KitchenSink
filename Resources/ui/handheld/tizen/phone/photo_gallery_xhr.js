function gallery_xhr() {
	// Test of Tizen-specific Titanium.Media.saveToPhotoGallery.
	//Kitchen Sink path:  Phone - Save to Gallery - From XHR
	//Save the image to photoGallery from web server http://static.appcelerator.com/images/header/appc_logo.png

	var win = Ti.UI.createWindow();
	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onload = function()
	{
		Titanium.Media.saveToPhotoGallery(this.responseData,{
			success: function(e) {
				Titanium.UI.createAlertDialog({
					title:'Photo Gallery',
					message:'Check your photo gallery for an appcelerator logo'
				}).show();		
			},
			error: function(e) {
				Titanium.UI.createAlertDialog({
					title:'Error saving',
					message:e.message
				}).show();
			}
		});
				
	};
	// open the client
	xhr.open('GET','http://static.appcelerator.com/images/header/appc_logo.png');
	//file
	xhr.file = 'appc_logo.png';
	// send the data
	xhr.send();
	return win;
};

module.exports = gallery_xhr;