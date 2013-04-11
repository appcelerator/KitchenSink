// A client-server sample application to test Tizen Bluetooth functionality.
// This is the client part. The server part is in the adjacent Kitchen Sink test.
// To execute the test, run both parts simultaneously on two Tizen devices.

function btClient() {
	var addressOfServer,
        btAdapter = require('tizen').Bluetooth.getDefaultAdapter(),
        // Simple bluetooth client
        client = {
            SERVICE_UUID: '5BCE9431-6C75-32AB-AFE0-2EC108A30860',
            numberOfClients: 0,
            connection: false,

            bond: function(address) {
                print('bond to address:'+address);
                btAdapter.createBonding(address, client._bondSuccess, client._bondError);
            },
            
            sendMsg: function(text) {
                var sendTextMsg, messageObj, msgObjToStr, i, len;
                sendTextMsg = [];
                messageObj = { text: text };
                msgObjToStr = JSON.stringify(messageObj);
                len = msgObjToStr.length;
                
                for (i = 0; i < len; i++) {
                    sendTextMsg[i] = msgObjToStr.charCodeAt(i);
                }
                try {
                    
                    if (client.socket !== null && client.socket.state === "OPEN") {
                        client.socket.writeData(sendTextMsg);
                        print('sent: ' + messageObj.text);
                    }
                } catch (error) {
                    print('failed msg sending: ' + error.message);
                }
            },
                         
            _bondSuccess: function(device) {
                client.serverDevice = device;
                try {
                    print('bonded, connecting');
                    device.connectToServiceByUUID(client.SERVICE_UUID, client._socketConnected, client._socketError);
                } catch (e) {
                    print('connectToServiceByUUID: ' + e.message);
                }
            },

            _bondError: function(error) {
                print('Bonding problem with selected device. Try again. ' + error.message);
            },
            
            _socketConnected: function(socket) {
                var data, recvMsg, i, len, msgObj;

                client.socket = socket;
                
                // callbacks of socket
                socket.addEventListener('socketmessagereceived', function() {
                    data = socket.readData();
                    len = data.length;
                    recvMsg = '';
                    for (i = 0; i < len; i += 1) {
                        recvMsg += String.fromCharCode(data[i]);
                    }
                    msgObj = JSON.parse(recvMsg);
                    
                    print('message received:' + msgObj.text);
                });
                
                socket.addEventListener('socketclosed', function() {
                    print('Server socket has been closed');
                    sendButton.enabled = client.connection = false;
                    client.socket = null;
                });
                
                socket.addEventListener('socketerror', function(e) {
                    print('Server socket error:' + e.message);
                    client.socket.close();
                });
                
                print('The client has connected to server');
                
                sendButton.enabled = client.connection = true;
            },

            _socketError: function(error) {
                print('Server rejected the connection. Try again. ' + error.message);
            },
        },
        
        // UI
        win = Ti.UI.createWindow({backgroundColor:'#fff'}),
        // Bluetooth On/Off
        btSwitch = Ti.UI.createSwitch({
            top : 10,
            titleOn : 'Bluetooth enabled',
            titleOff : 'Bluetooth disabled',
            value : btAdapter.powered
        }),
    	// available devices
        devicesView = Ti.UI.createTableView({
			headerTitle: 'Select a server to connect',
			left: '2%',
			top: 60,
			width: '96%',
            height: 180,
			borderWidth: 2,
			borderColor: '#cccccc'
		}),
        // Load view of devices
        discoverDevices = function() {
            devicesView.show();
            btAdapter.discoverDevices();
            btAdapter.removeEventListener('discoveryfinished');
            btAdapter.addEventListener('discoveryfinished', function(devices) {
                var row, title,
                    tableData = [],
                    addrs = {};
                    i = 0, 
                    length = devices.length;
                
                for (; i < length; i++) {
                    if (addrs[ devices[i].address ]) {
                        continue;
                    }
                    // create new row
                    title = devices[i].name + '('+devices[i].address+')';
                    addrs[ devices[i].address ] = title;
                    row = Ti.UI.createTableViewRow({
                        title: (addrs[ devices[i].address ] = title),
                        address: devices[i].address,
                        hasChild: false,
                        itemIdOwn: i
                    });
                    tableData.push(row);
                }
                // clear devicesView
                devicesView.removeEventListener('click');
                devicesView.setData([]);
                    
                // Set new data and listener
                devicesView.setData(tableData);
                devicesView.addEventListener('click', function(e) {
                    addressOfServer = e.rowData.address;
                    devicesView.hide();
                    connectButton.enabled = true;
                    print('Try to connect to ' + e.rowData.title);
                });
            });
            
            btAdapter.removeEventListener('discoveryerror');
            btAdapter.addEventListener('discoveryerror', function(e) {
                print('Failed to search devices: ' + e.message + '(' + e.name + ')');
                connectButton.enabled = false;
            });
        },
        //Search server button
    	connectButton = Ti.UI.createButton({
    		top: 280,
            height: 50,
            width: '95%',
    		enabled: false,
    		title: 'Connect'
    	}),
        //Send msg button
    	sendButton = Ti.UI.createButton({
    		top: 350,
            height: 50,
            width: '95%',
    		enabled: false,
    		title: 'Send msg to server'
    	}),
        // Status label
        statusLabel = Titanium.UI.createLabel({
            top: 450,
			text: '',
			color: '#000000',
			width: '95%'
		}),
        //Print status and log
        print = function(msg) {
            Ti.API.info(msg);
            statusLabel.text = msg;
        };
        
    	
    // Bluetooth ON/OFF click
    btSwitch.addEventListener('change', function() {
        if (btAdapter.powered != btSwitch.value) {
            btAdapter.setPowered(btSwitch.value,
                // Success
                function() {
                    print('Bluetooth has been powered ' + (btSwitch.value ? 'on' : 'off'));
                    btAdapter.powered ? discoverDevices() :  (function() {
                        // stop working
                        devicesView.setData([]);
                        connectButton.enabled = sendButton.enabled = false;
                    })()
                },
                // Error
                function(e) {
                    print('setPowered: ' + e.message);
                    connectButton.enabled = false;
                }
            );
        }
    });
    
	// Bond server
	connectButton.addEventListener('click', function() {
		client.bond(addressOfServer);
	});
    
    // Send msg
	sendButton.addEventListener('click', function() {
        var currentdate = new Date(),
            strTime = "Time: " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
		client.sendMsg(strTime);
	});
               
   	win.add(btSwitch);
    win.add(devicesView);
   	win.add(connectButton);
    win.add(statusLabel);
    win.add(sendButton);
    
    btAdapter.powered && discoverDevices();
    	
   	return win;   
};

module.exports = btClient;