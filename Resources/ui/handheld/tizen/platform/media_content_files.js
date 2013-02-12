function tizen_media_content_files(args) {
	var self = Titanium.UI.createWindow({
			backgroundColor: '#FFFFFF', 
			layout: 'vertical'
		}),
		filesList = Ti.UI.createTableView({
			headerTitle: 'List of files',
			left: '2%',
			top: 4,
			width: '96%',
			borderWidth: 1,
			borderColor: '#cccccc'
		}),
		viewFiles = Titanium.UI.createView({
			layout: 'horizontal',
			width: '96%',
			left: '2%',
			height: 110,
			top: 10
		}),
		filesLabel = Titanium.UI.createLabel({
			text: 'Select a file type',
			color: '#000000',
			width: '48%'
		}),
		pickerFiles = Ti.UI.createPicker({
			left: '2%',
			width: '50%',
			height: '105'
		}),
		dataFiles = [],
		fileType,
		propertiesList = Ti.UI.createTableView({
			width: '100%',
			height: '100%',
			top: 0,
			left: 0,
			zIndex: 4
		}),
		itemsArray;

	dataFiles.push(Ti.UI.createPickerRow({ title: 'IMAGE', value: 'IMAGE' }));
	dataFiles.push(Ti.UI.createPickerRow({ title: 'VIDEO', value: 'VIDEO' }));
	dataFiles.push(Ti.UI.createPickerRow({ title: 'AUDIO', value: 'AUDIO' }));

	//Get a media content files Begin
	function getSelectedItemsList() {
		var source,
			filter = new tizen.AttributeFilter ('type', 'EXACTLY', fileType);

		function onError(e) {
			Ti.API.error(e.message);
		}

		try {
			source = tizen.mediacontent.getLocalMediaSource();
		} catch (exc) {
			Ti.API.error('tizen.mediacontent.getLocalMediaSource() exception:' + exc.message);
			return;
		}

		try {
			source.findItems(onMediaItemArraySuccess, onError, null, filter);
		} catch (exc) {
			Ti.API.error('tizen.mediacontent.getLocalMediaSource() exception:' + exc.message);
			return;
		}
	}

	function onMediaItemArraySuccess(items) {
		var tableData = [],
			i = 0,
			itemsCount = items.length;
			
		itemsArray = items;

		for (; i < itemsCount; i++) {
			var item = items[i],
				row = Ti.UI.createTableViewRow({
					title: item.title,
					hasChild: true,
					itemIdOwn: i
				});
            
			tableData.push(row);
		}
		filesList.setData(tableData);
	}
	filesList.addEventListener('click', function(e) {
		var index = e.rowData.itemIdOwn,
			propArray = [
				{ title: 'Item name: ' + itemsArray[index].title },
				{ title: 'Item URI: ' + itemsArray[index].itemURI },
				{ title: 'Item type: ' + itemsArray[index].type },
				{ title: 'Item identifier: ' + itemsArray[index].id },
				{ title: 'Item mimeType: ' + itemsArray[index].mimeType },
				{ title: 'Item releaseDate: ' + itemsArray[index].releaseDate },
				{ title: 'Item modifiedDate: ' + itemsArray[index].modifiedDate },
				{ title: 'Item description: ' + itemsArray[index].description },
				{ title: 'Item rating: ' + itemsArray[index].rating }
		];

		switch (itemsArray[index].type) {
			case 'IMAGE':
				inspectImage(itemsArray[index], propArray);
				break;
			case 'VIDEO':
				inspectVideo(itemsArray[index], propArray);
				break;
			case 'AUDIO':
				inspectAudio(itemsArray[index], propArray);
		}

		var propertiesWin = Titanium.UI.createWindow({ backgroundColor: '#FFFFFF' });

		propertiesList.setData(propArray);
		propertiesWin.add(propertiesList);
		args.containingTab.open(propertiesWin, { animated: true });
	});

	function inspectImage(item, arr) {
		try {
			arr.push({ title: 'Item width: ' + item.width });
			arr.push({ title: 'Item height: ' + item.height });
			item.geolocation && arr.push({ title: 'Item location, latitude: ' + item.geolocation.latitude });
			item.geolocation && arr.push({ title: 'Item location, longitude: ' + item.geolocation.longitude });
		} catch (e) {
			Ti.API.error(e);
		}
	}

	function inspectVideo(item, arr) {
		var i = 0,
			artists = item.artists
			itemsCount = artists.length;
		try {
			arr.push({ title: 'Item album: ' + item.album });
			for (; i < itemsCount; i++) {
				arr.push({ title: 'Item artist: ' + artists[i] });
			}
			arr.push({ title: 'Item duration: ' + item.duration });
			arr.push({ title: 'Item width: ' + item.width });
			arr.push({ title: 'Item height: ' + item.height });
			arr.push({ title: 'Item playedTime: ' + item.playedTime });
			arr.push({ title: 'Item playCount: ' + item.playCount });
		} catch (e) {
			Ti.API.error(e);
		}
	}

	function inspectAudio(item, arr) {
		var i = 0,
			artists = item.artists,
			artistsCount = artists.length,
			composers = item.composers,
			conposersCount = composers.length,
			genres = item.genres,
			genresCount = genres.length;

		try {
			arr.push({ title: 'Item album: ' + item.album });

			for (; i < artistsCount; i++) {
				arr.push({ title: 'Item artist: ' + artists[i] });
			}

			for (i = 0; i < conposersCount; i++) {
				arr.push({ title: 'Item composer: ' + composers[i] });
			}

			for (i = 0; i < genresCount; i++) {
				arr.push({title: 'Item genre: ' + genres[i]});
			}

			item.lyrics && arr.push({ title: 'Item lyrics type: ' + item.lyrics.type });
			item.lyrics && arr.push({ title: 'Item lyrics timestamps: ' + item.lyrics.timestamps });
			item.lyrics && arr.push({ title: 'Item lyrics texts: ' + item.lyrics.texts });

			arr.push({ title: 'Item copyright: ' + item.copyright });
			arr.push({ title: 'Item bitrate: ' + item.bitrate });

			arr.push({ title: 'Item trackNumber: ' + item.trackNumber });
			arr.push({ title: 'Item duration: ' + item.duration });
			arr.push({ title: 'Item size: ' + item.size });
			arr.push({ title: 'Item playedTime: ' + item.playedTime });
			arr.push({ title: 'Item playCount: ' + item.playCount });

		} catch (e) {
			Ti.API.error(e);
		}
	}

	pickerFiles.addEventListener('change', function(e) {
		fileType = e.row.value;
		getSelectedItemsList();
	});
	//Get a media content files End

	pickerFiles.add(dataFiles);

	viewFiles.add(filesLabel);
	viewFiles.add(pickerFiles);
	self.add(viewFiles);

	self.add(filesList);
	return self;
}

module.exports = tizen_media_content_files;