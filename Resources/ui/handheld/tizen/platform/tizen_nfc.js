function tizenNFC(title) {
	var nfcDetectionLabel,
		ndefRecordLabel,
		nfcSwitch,
		picker,
		nfcAdapter,
		nfcTag;

	// converts byte array to HEX string
	function byteArrayToString(byteArray) {
		var bytesCount = byteArray.length,
			stringData = [bytesCount],
			i = 0;

		for (; i < bytesCount; i++) {
			stringData[i] = ('0' + byteArray[i].toString(16)).slice(-2);
		}
		return stringData.join(' ');
	}

	// Converts NFC record type to human readable presentation.
	function NfcRecordTypeToString(tnfType) {
		switch (tnfType) {
			case tizen.nfc.NFC_RECORD_TNF_EMPTY:
				return 'EMPTY';
			case tizen.nfc.NFC_RECORD_TNF_WELL_KNOWN:
				return 'WELL KNOWN';
			case tizen.nfc.NFC_RECORD_TNF_MIME_MEDIA:
				return 'MIME MEDIA';
			case tizen.nfc.NFC_RECORD_TNF_URI:
				return 'URI';
			case tizen.nfc.NFC_RECORD_TNF_EXTERNAL_RTD:
				return 'EXTERNAL RTD';
			case tizen.nfc.NFC_RECORD_TNF_UNKNOWN:
				return 'UNKNOWN';
			default:
				return 'incorrect value';
		}
	}

	//Formats property and value into html code
	function propertyToLine(propertyName, propertyValue) {
		return '<b>' + propertyName + ': </b> ' + propertyValue + '<br />';
	}

	//returns HTML formatted string with nfc record
	function formatRecordInfo(record) {
		try {
			var result = propertyToLine('NFC', NfcRecordTypeToString(record.tnf));
			result += propertyToLine('id', byteArrayToString(record.id));
			result += propertyToLine('Payload', byteArrayToString(record.payload));

			if (record instanceof tizen.NDEFRecordText) {
				result += propertyToLine('text', record.text);
				result += propertyToLine('langCode', record.languageCode);
				result += propertyToLine('encodeType', (record.encoding === 'UTF8' ? 'UTF-8' : 'UTF-16'));
			} else if (record instanceof tizen.NDEFRecordURI) {
				result += propertyToLine('URI', record.uri);
			} else if (record instanceof tizen.NDEFRecordMedia) {
				result += propertyToLine('mimeType', record.mimeType);
			}
			result += propertyToLine('Raw byte data', byteArrayToString(record.toByte()));

		} catch (e) {
			result = 'NFC message parse error. \n' + e.name + ' : ' + e.message;
		}
		return result;
	}

	// deletes all items form picker control
	function clearPicker() {
		try{
			if(picker.columns[0]) {
				var col = picker.columns[0],
					x = col.rowCount - 1;

				for(; x >= 0; x-- ) {
					var row = col.rows[x];
					col.removeRow(row);
				}
				picker.reloadColumn(col);
			}
		} catch (e) {
			Titanium.API.info(e.name + ' : ' + e.message);
		}
	}

	// fills pickers with items from received message
	function fillPicker(message) {
		clearPicker();

		var messagesCount = message.recordCount,
			data = [messagesCount],
			i = 0;

		for (; i < messagesCount; i++) {
			data[i] = Ti.UI.createPickerRow({ title: 'record #' + i, recordsOriginalData: message.records[i] });
		}

		picker.add(data);
		picker.setSelectedRow(0, 0, false);
		picker.show();
	}

	// reads incoming message abnd fills UI with received data
	function readMessage(message) {
		Ti.API.info('NDEF successfully received.');

		Ti.API.info(JSON.stringify(message));
		if (message.recordCount > 0) {
			if (message.recordCount == 1) {
				ndefRecordLabel.text = formatRecordInfo(message.records[0]);
				picker.hide();
			} else {
				fillPicker(message);
			}
		} else {
			ndefRecordLabel.text = 'There are no records in NDEF.';
		}
	}

	// On FNC is powered on start listening of incoming NFC messages (Tags)
	function setTagDetect() {
		// reports to UI about message read error
		function readMessageErr(e) {
			ndefRecordLabel.text = 'NDEF read error.  \n' + e.name + ' : ' + e.message;
		}

		var onSuccess = {
			onattach: function(tag) {
				nfcTag = tag;
				var isNDEF = nfcTag.isSupportedNDEF;
				nfcDetectionLabel.text = 'Tag found:' + nfcTag.type;

				if (isNDEF) {
					nfcTag.readNDEF(readMessage, readMessageErr);
				} else {
					Ti.API.info('This Tag doesn\'t support NDEF');
				}
			},
			ondetach: function() {
				//updates UI when NFC is detached
				nfcTag = null;
				picker.hide();
				nfcDetectionLabel.text = 'Tag successfully detached. \n Searching for new NFC tags around...';
				ndefRecordLabel.text = '';
			}
		};

		function onError(e) {
			Ti.API.warn('Tag Listen Error: ' + e.message);
		}

		try {
			nfcAdapter.setTagListener(onSuccess, onError);
		} catch (e) {
			Ti.API.warn(e.name + ' : ' + e.message);
		}
	}

	//Called on NFC is turned off
	function unsetTagDetect() {
		try {
			nfcAdapter.unsetTagListener();
			clearPicker()
			picker.hide();
			nfcTag = null;
			nfcDetectionLabel.text = 'Tag listener is turned off';
			ndefRecordLabel.text = '';
		} catch (e) {
			nfcDetectionLabel.text = 'Failed to turn off listener  ' + e.name + ' : ' + e.message;
		}
	}

	function switchNfc(turnOn){
		if (turnOn) {
			nfcDetectionLabel.text = 'Searching for new NFC tags around...';

			function onPowerOnFails(e) {
				nfcSwitch.value = false;
				nfcDetectionLabel.text = 'Failed to power on NFC: ' + e.message;
			}
			try {
				nfcAdapter = tizen.nfc.getDefaultAdapter();
				nfcAdapter.setPowered(true, setTagDetect, onPowerOnFails);
			} catch (e) {
				onPowerOnFails(e);
				nfcAdapter = null;
			}
		} else {
			if (nfcAdapter) {
				unsetTagDetect();
			} else {
				nfcDetectionLabel.text = 'NFC is powered off.';
			}
		}
	}

	var win = Ti.UI.createWindow({ backgroundColor: '#fff' });
	
	nfcSwitch = Ti.UI.createSwitch({
		value: false,
		top: 20,
		titleOff: 'NFC listening is turned off',
		titleOn: 'Now NFC listening is turned on'
	});
	nfcDetectionLabel = Ti.UI.createLabel({
		text: 'Press the button to start listening.',
		color: '#000',
		autoLink: false,
		textAlign: 'left',
		font: { fontSize: 12, fontWeight: 'bold' },
		top: 90,
		height: 'auto',
		width: '95%'
	});
	ndefRecordLabel = Ti.UI.createLabel({
		text: '',
		autoLink: false,
		color: '#000',
		textAlign: 'left',
		font: { fontSize: 12 },
		top: 150,
		height: 'auto',
		width: '95%'
	});

	picker = Ti.UI.createPicker({
		top: 65,
		right:10,
		height: 110,
		width: 120,
		selectionIndicator: true
	});

	win.add(picker);
	win.add(nfcSwitch);
	win.add(nfcDetectionLabel);
	win.add(ndefRecordLabel);

	nfcSwitch.addEventListener('change', function(e) { switchNfc(e.value); });
	picker.addEventListener('change', function(e) { ndefRecordLabel.text = formatRecordInfo(e.row.recordsOriginalData); });
	picker.hide();

	return win;
};

module.exports = tizenNFC;