function cam_ar(_args) {
	container  = {};
	container.win = Titanium.UI.createWindow({
		title:_args.title
	});
	
	container.button = Titanium.UI.createButton({
		color:'#fff',
		backgroundImage:'/images/BUTT_grn_on.png',
		backgroundSelectedImage:'/images/BUTT_grn_off.png',
		backgroundDisabledImage: '/images/BUTT_gry_on.png',
		bottom:10,
		width:301,
		height:57,
		font:{fontSize:20,fontWeight:'bold',fontFamily:'Helvetica Neue'},
		title:'Cancel'
	});
	
	container.button.addEventListener('click',function()
	{
		alert("Camera closed.");
		Ti.Media.hideCamera();
		container.close();
	});
	
	container.messageView = Titanium.UI.createView({
		height:60,
		width:250,
		top:10
	});
	
	container.indView = Titanium.UI.createView({
		height:60,
		width:270,
		backgroundColor:'#000',
		borderRadius:10,
		opacity:0.7
	});
	container.messageView.add(container.indView);
	
	// message
	container.message = Titanium.UI.createLabel({
		text:'Calculating...',
		color:'#fff',
		font:{fontSize:14,fontWeight:'bold',fontFamily:'Helvetica Neue'},
		textAlign:'center',
		width:270,
		height:'auto'
	});
	container.messageView.add(container.message);
	
	container.overlay = Titanium.UI.createView();
	container.overlay.add(container.button);
	container.overlay.add(container.messageView);
	
	container.heading;
	container.gps='...';
	container.address='calculating address';
	
	container.refreshLabel = function ()
	{
		var text = "Heading: "+Math.round(container.heading)+"°, Location: "+container.gps;
		if (container.address)
		{
			text+="\n"+container.address;
		}
		container.message.text = text;
	}
	
	Ti.include("/etc/version.js");
	if (isIPhone3_2_Plus())
	{
		Titanium.Geolocation.purpose = "AR Demo";
	}
	
	container.locationUpdate = function(e)
	{
		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		container.gps = Math.round(longitude)+' x '+Math.round(latitude);
		Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt)
		{
			var places = evt.places[0];
			container.address = places.street ? places.street : places.address;
			container.refreshLabel();
		});
		container.refreshLabel();
	};

	
	container.updateHeadingLabel = function(e)
	{
		if (e.error)
		{
			container.updatedHeading.text = 'error: ' + e.error;
			return;
		}
	
		container.heading = e.heading.magneticHeading;
		container.refreshLabel();
	};

	
	
	Titanium.Media.showCamera({
	
		success:function(event)
		{
		},
		cancel:function()
		{
		},
		error:function(error)
		{
			var a = Titanium.UI.createAlertDialog({title:'Camera'});
			if (error.code == Titanium.Media.NO_CAMERA)
			{
				a.setMessage('Please run this test on device');
			}
			else
			{
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		overlay:container.overlay,
		showControls:false,	// don't show system controls
		mediaTypes:Ti.Media.MEDIA_TYPE_PHOTO,
		autohide:false	// tell the system not to auto-hide and we'll do it ourself
	});
		
	container.win.addEventListener('open',function(){
		Titanium.Geolocation.addEventListener('location',container.locationUpdate);
		Titanium.Geolocation.addEventListener('heading',container.updateHeadingLabel);

	});
	container.open = function(){
		container.win.open();
	};

	container.close = function(){
		Titanium.Geolocation.removeEventListener('heading',container.updateHeadingLabel);
		Titanium.Geolocation.removeEventListener('location',container.locationUpdate);
		container.win.close();
	}

	return container.win;
};

module.exports = cam_ar;