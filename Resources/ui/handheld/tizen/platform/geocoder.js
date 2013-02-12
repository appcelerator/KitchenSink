function geocoder() {
	var address = 'Seoul, South Korea',
		latitude = 37.5665,
		longitude = 126.9779,
		win = Ti.UI.createWindow({
			title: 'Geocoder'
		}),
		startAddressLabel = Ti.UI.createLabel({
			text: 'Get coordinates of ' + address + '.',
			top: 20,
			left: 5
		}),
		positionLabel = Ti.UI.createLabel({
			text: 'Position: ',
			top: 40,
			left: 5
		}),
		geocodeButton = Ti.UI.createButton({
			title: 'Get geocode',
			top: 60,
			left: 5
		}),
		latitudeLabel = Ti.UI.createLabel({
			text: 'Get address by coordinates: ' + latitude + ', ' + longitude + '.',
			top: 140,
			left: 5
		}),
		addressLabel = Ti.UI.createLabel({
			text: 'Address: ',
			top: 180,
			left: 5
		}),
		reverseGeocodeButton = Ti.UI.createButton({
			title: 'Reverse geocode',
			top: 200,
			left: 5
		}),
		defaultProvider = tizen.lbs.geocoder.getDefaultProvider(); // Seoul, South Korea

	geocodeButton.addEventListener('click', function(e) {
		function positionErrorCB(error) {		
			positionLabel.text = 'Position: ' + error.message;
		}

		// Get the position
		function getPositionCB(results) {
			positionLabel.text = 'Position: longitude: ' + results[0].coordinates.longitude + ', latitude: ' + results[0].coordinates.latitude;
		}

		// This does not work on emulator, but work on Tizen simulator (https://bugs.tizen.org/jira/browse/TDIST-143)
		defaultProvider.geocode(address, getPositionCB, positionErrorCB);
	});

	reverseGeocodeButton.addEventListener('click', function(e) {
		var coordinates = new tizen.SimpleCoordinates(latitude, longitude), 
			options = {
				resultType: 'STRUCTURED'
			};

		// get address by coordinates
		function getAddressCB(results) {
			addressLabel.text = 'Address: ' + results[0].region;
		}

		function addressErrorCB(error) {
			addressLabel.text = 'Address: ' + error.message;
		}

		// This does not work on emulator, but work on Tizen simulator (https://bugs.tizen.org/jira/browse/TDIST-143)
		defaultProvider.reverseGeocode(coordinates, getAddressCB, addressErrorCB, options);
	});

	win.add(startAddressLabel);
	win.add(latitudeLabel);
	win.add(geocodeButton);
	win.add(reverseGeocodeButton);
	win.add(positionLabel);
	win.add(addressLabel);

	return win;
}

module.exports = geocoder;