function tizen_filesystem() {

	function Directory(name) {
		this.dirName = name;
		this.copyTo = 'copyTo';
		this.moveTo = 'moveTo';
	}

	var self = Titanium.UI.createWindow({backgroundColor: '#FFFFFF'}),
		firstDir = new Directory('images'),
		secondDir = new Directory('documents'),
		staticText = 'Select a file to begin',
		titleStatus = Titanium.UI.createLabel({
			text: staticText,
			top: 10,
			left: 10,
			color: '#000000'
		}),
		table1 = Ti.UI.createTableView({
			headerTitle: firstDir.dirName,
			left: '2%',
			top: 40,
			width: '47%',
			borderWidth: 1,
			borderColor: '#cccccc'
		}),

		table2 = Ti.UI.createTableView({
			headerTitle: secondDir.dirName,
			right: '2%',
			top: 40,
			width: '47%',
			borderWidth: 1,
			borderColor: '#cccccc'
		});

	function copyTo(name, directory, isMove) {
		var driver1 = directory.dirName === firstDir.dirName ? secondDir : firstDir,
			action = isMove ? directory.moveTo : directory.copyTo;

		function success() {
			updateLists();
			Ti.API.info('was ' + action);
		}
        
		function error() {
			titleStatus.setText(staticText);
			Ti.UI.createAlertDialog({
				title: 'File already exists',
				ok: 'Ok'
			}).show();
		}
		try {
			titleStatus.setText(isMove ? 'moving... ' : 'coping... ');
			directory.virtualRoot[action](
				directory.virtualRoot.path + '/' + name,
				driver1.virtualRoot.path + '/' + name,
				false,
				success,
				error
			);
		} catch (exc) {
			Ti.API.info(exc.message);
		}
	}

	function deleteFile(name, directory) {
		function success() {
			Ti.API.info('was deleted');
			updateLists();
		}
		function error(e) {
			titleStatus.setText(staticText);
			Ti.API.info('Problem with deleting file ' + name);
			Ti.API.info(e.message);
		}
		try {
			titleStatus.setText('deleting...');
			directory.virtualRoot.deleteFile(
				directory.virtualRoot.path + '/' + name,
				success,
				error
			);
		} catch (exc) {
			Ti.API.info(exc.message);
		}
	}

	function onListOfFiles(directory) {
		titleStatus.setText(staticText);
		var tableData = [],
			i = 0,
			filesCount = directory.files.length;

		for(; i < filesCount; i++) {
			var row = Ti.UI.createTableViewRow({
				title: directory.files[i].name
			});

			row.addEventListener('click', function() {
				var name = this.title,
					popUp = Ti.UI.createAlertDialog({
						title: name,
						ok: 'Ok',
						buttonNames: ['Copy', 'Move', 'Delete', 'Cancel']
					});

				popUp.addEventListener('click', function(e) {
					switch(e.index) {
						case 0:
							copyTo(name, directory);
							break;
						case 1:
							copyTo(name, directory, true);
							break;
						case 2:
							deleteFile(name, directory);
							break;
						case 3:
							Ti.API.info('cancel');
					};
				});
				popUp.show();
			});

			tableData.push(row);
		}
		directory.table.setData(tableData);
	}

	function onErrorListOfFiles() {
		Ti.API.info('Problem with getting the list of files');
	}

	function onResolveSuccess(directory) {
		directory.virtualRoot.listFiles(function(files){
			directory.files = files;
			onListOfFiles(directory)
		},
		onErrorListOfFiles);
    }

	function onLoad(folderName, success) {
		function onResolveError(e) {
			Ti.API.info('tizen.filesystem.resolve() error: name ' + e.name);
			Ti.API.info(', message: ' + e.message);
		}
		try {
			tizen.filesystem.resolve(folderName, success, onResolveError, 'rw');
		} catch (exc) {
			Ti.API.info('tizen.filesystem.resolve() exception: ' + exc.message);
		}
	}

	function updateLists() {
		onLoad(firstDir.dirName, function(dir) {
			firstDir.table = table1;
			firstDir.virtualRoot = dir;
			onResolveSuccess(firstDir);
		});

		onLoad(secondDir.dirName, function(dir) {
			secondDir.table = table2;
			secondDir.virtualRoot = dir;
			onResolveSuccess(secondDir);
		});
	}

	self.addEventListener('postlayout', function() {
		updateLists();
	});

	self.add(table1);
	self.add(table2);
	self.add(titleStatus);
	return self;
}

module.exports = tizen_filesystem;