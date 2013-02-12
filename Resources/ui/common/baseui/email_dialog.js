/*
function openEmail() {
	var emailDialog = Titanium.UI.createEmailDialog();
	if (Ti.Platform.osname !== 'mobileweb' && !emailDialog.isSupported()) {
		Ti.UI.createAlertDialog({
			title:'Error',
			message:'Email not available'
		}).show();
		return;
	}
	emailDialog.setSubject('Hello from Titanium!');
	emailDialog.setToRecipients(['foo@yahoo.com']);
	emailDialog.setCcRecipients(['bar@yahoo.com']);
	emailDialog.setBccRecipients(['blah@yahoo.com']);
	
	if (Ti.Platform.name == 'iPhone OS') {
		emailDialog.setMessageBody('<b>Appcelerator Titanium Rocks!</b>å');
		emailDialog.setHtml(true);
		emailDialog.setBarColor('#336699');
	} else {
		emailDialog.setMessageBody('Appcelerator Titanium Rocks!');
	}

	// attach a file
	if (Ti.Platform.osname !== 'mobileweb')  {
		var f = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, '/images/cricket.wav');
		emailDialog.addAttachment(f);
	}
	
	emailDialog.addEventListener('complete',function(e)
	{
		if (e.result == emailDialog.SENT)
		{
			if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
				alert("message was sent");
			}
		}
		else
		{
			alert("message was not sent. result = " + e.result);
		}
	});
	
	try {
		emailDialog.open();
	} catch (e) {
		alert('email not available');	
	}		
}
*/

function email_dialog() {
	var isTizen = Ti.Platform.osname === 'tizen',
		isAndroid = Ti.Platform.osname === 'android',
		win = Ti.UI.createWindow();
	
	// initialize to all modes
	win.orientationModes = [
		Titanium.UI.PORTRAIT,
		Titanium.UI.LANDSCAPE_LEFT,
		Titanium.UI.LANDSCAPE_RIGHT
	];
	
	win.addEventListener('open', function() {
		Titanium.Media.openPhotoGallery({
			allowEditing:true,
		
			success: function(event)
			{
				var emailDialog = Titanium.UI.createEmailDialog();
				if (!emailDialog.isSupported()) {
					Ti.UI.createAlertDialog({
						title:'Error',
						message:'Email not available'
					}).show();
					return;
				}
				emailDialog.setSubject('Hello from Titanium!');
				emailDialog.setToRecipients(['foo@yahoo.com']);
				emailDialog.setCcRecipients(['bar@yahoo.com']);
				emailDialog.setBccRecipients(['blah@yahoo.com']);
				
				if (Ti.Platform.name == 'iPhone OS') {
					emailDialog.setMessageBody('<b>Appcelerator Titanium Rocks!</b>å');
					emailDialog.setHtml(true);
					emailDialog.setBarColor('#336699');
				} else {
					emailDialog.setMessageBody('Appcelerator Titanium Rocks!');
				}
				// File attachments are not supported by the Tizen OS yet
				if(!isTizen) {
					// attach a blob
					emailDialog.addAttachment(event.media);
					
					// attach a file
					var f = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'etc/cricket.wav');
					emailDialog.addAttachment(f);
				}
				// "complete" event is not supported on MobileWeb-based platforms
				emailDialog.addEventListener('complete',function(e)
				{
					if (e.result == emailDialog.SENT)
					{
						if ( !(isAndroid || isTizen) ) {
							// android doesn't give us useful result codes.
							// it anyway shows a toast.
							alert("message was sent");
						}
					}
					else
					{
						alert("message was not sent. result = " + e.result);
					}
				});
				emailDialog.open();
			},
		
			error: function(error)
			{
		
			},
		
			cancel: function()
			{
		
			}
		});
	});
	
	return win;
};

module.exports = email_dialog;