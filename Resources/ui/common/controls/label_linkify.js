function label_linkify() {
	var win = Ti.UI.createWindow({
			backgroundColor: 'white'
		}),
		l = Ti.UI.createLabel({
			autoLink: Ti.UI.LINKIFY_ALL,
			left: 5, 
			top: 5, 
			right: 5, 
			height: 100,
			backgroundColor: '#222',
			text: 'Contact\n test@test.com\n 817-555-5555\n http://bit.ly\n 444 Castro Street, Mountain View, CA'
		}),
		btnAll = Ti.UI.createButton({
			title: 'All', 
			width: 150, 
			height: 40,
			top: 110
		}),
		btnEmail = Ti.UI.createButton({
			title: 'Email Addresses', 
			width: 150, 
			height: 40,
			top: 200
		}),
		btnMap = Ti.UI.createButton({
			title: 'Map Addresses', 
			width: 150, 
			height: 40,
			top: 200
		}),
		btnNONE = Ti.UI.createButton({
			title: 'None', 
			width: 150, 
			height: 40,
			top: 155
		}),
		btnPhone = Ti.UI.createButton({
			title: 'Phone Numbers', 
			width: 150, 
			height: 40,
			top: 245
		}),
		btnWeb = Ti.UI.createButton({
			title: 'Web URLs', 
			width: 150, 
			height: 40,
			top: 290
		}),
		ta = Ti.UI.createTextArea({
			left: 5, 
			top: 335, 
			right: 5, 
			bottom: 5 
		});

	btnAll.addEventListener('click', function(e) {
		l.autoLink = Ti.UI.LINKIFY_ALL;
	});
	btnEmail.addEventListener('click', function(e) {
		l.autoLink = Ti.UI.LINKIFY_EMAIL_ADDRESSES;
	});
	btnNONE.addEventListener('click', function(){
		l.autoLink = Ti.UI.LINKIFY_NONE;
	});
	btnPhone.addEventListener('click', function(e) {
		l.autoLink = Ti.UI.LINKIFY_PHONE_NUMBERS;
	});
	btnWeb.addEventListener('click', function(e) {
		l.autoLink = Ti.UI.LINKIFY_WEB_URLS;
	});
	ta.addEventListener('return', function(e) {
		l.text = e.value;
	});	

	win.add(l);
	win.add(btnAll);
	win.add(btnEmail);
	win.add(btnNONE);
	win.add(btnPhone);
	win.add(btnWeb);
	win.add(ta);

	return win;
}

module.exports = label_linkify;
