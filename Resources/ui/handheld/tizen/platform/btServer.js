// A client-server sample application to test Tizen Bluetooth functionality.
// This is the server part. The client part is in the adjacent Kitchen Sink test.
// To execute the test, run both parts simultaneously on two Tizen devices.

function btServer() {

	var btAdapter = require('tizen').Bluetooth.getDefaultAdapter(),
	
        // Simple bluetooth server
        server = {
        SERVICE_UUID: '5BCE9431-6C75-32AB-AFE0-2EC108A30860',
        numberOfClients: 0,
        connection: false,
        
        // Register server
        setServerVisible: function() {
            
            try {
                if (!btAdapter.visible) {
                    print('Set your bluetooth as visible.');
                } else {
                    server._registerServer();
                }
            } catch (error) {
                print(error.message);
            }
        },
        
        // Unregister service
        unregisterService: function() {
            
            try {
                if (server.serviceHandler !== null) {
                    server.serviceHandler.unregister(server._unregisterSuccess, server._unregisterError);
                } else {
                    print('server.serviceHandler');
                }
            } catch (error) {
                server._unregisterError();
            }
        },
        
        _unregisterSuccess: function() {
            
            server.serviceHandler = null;
            server.numberOfClients = 0;
        },

        _unregisterError: function(e) {
            print(e.message);
        },

        _registerSuccess: function(handler) {
            server.serviceHandler = handler;
            
            print('The RFCOMMService has been registered');
            
            handler.addEventListener('remotedeviceconnected', function(socket) {
                server.numberOfClients += 1;
                server.socket = socket;
                
                print('The remote device has been connected');
                
                // callbacks of socket
                socket.addEventListener('socketmessagereceived', function() {
                    var data = socket.readData(), 
                        recvMsg = '',
                        i = 0,
                        len = data.length;
                        
                    for (; i < len; i++) {
                        recvMsg += String.fromCharCode(data[i]);
                    }
                    
                    var messageObj = JSON.parse(recvMsg);
                    print('msg: ' + messageObj.text);
                });
                
                socket.addEventListener('socketclosed', function() {
                    server.socket = null;
                    server.connection = false;
                    server.numberOfClients = 0;
                    print('The server socket has been closed');
                });
                
                socket.addEventListener('socketerror', function(e) {
                    print('Server socket error:' + e.message);
                    server.socket.close();
                });
            });
        },

        _registerError: function(error) {
            print(error.message);
        },

        _registerServer: function() {
            print('Server is visible');
            if (server.numberOfClients == 0) {
                try {
                    btAdapter.registerRFCOMMServiceByUUID(server.SERVICE_UUID, 'Chat service', server._registerSuccess, server._registerError);
                } catch (error) {
                    print(error.message);
                }
            }
        }
        
    },
    
    // Window
    win = Ti.UI.createWindow({backgroundColor:'#fff'}),
    
    // Bluetooth On/Off
    btSwitch = Ti.UI.createSwitch({
		top: 70,
		titleOn: 'Bluetooth enabled',
		titleOff: 'Bluetooth disabled',
		value: btAdapter.powered
	}),
	
	// Start server button
	startButton = Ti.UI.createButton({
		top: 220,
		enabled: btAdapter.powered,
		title: 'Start server'
	}),
	
    // Status label
    statusLabel = Titanium.UI.createLabel({
        top: 400,
        text: 'Start bluetooth server',
        color: '#000000',
        width: '95%'
    }),
    
    // Print status and log
    print = function(msg) {
        Ti.API.info(msg);
        statusLabel.text = msg;
    };
	
	// Power ON click
	btSwitch.addEventListener('change', function() {
        if (btAdapter.powered != btSwitch.value) {
            btAdapter.setPowered(btSwitch.value,
                // Success
                function() {
                    print('The bluetooth has been powered ' + (btSwitch.value ? 'on' : 'off'));
                    startButton.enabled = btAdapter.powered;
                    server.numberOfClients = 0;
                },
                // Error
                function(e) {
                    print('setPowered: ' + e.message);
                    startButton.enabled = false;
                }
            );
        }
	});
	
	// Start server
	startButton.addEventListener('click', function() {
		server.setServerVisible();
	});
    
    win.addEventListener('close', function() {
        server.unregisterService();
	});
    	
	win.add(btSwitch);
	win.add(startButton);
    win.add(statusLabel);
	
	return win;
};

module.exports = btServer;