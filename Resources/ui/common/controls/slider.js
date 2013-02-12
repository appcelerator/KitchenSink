function slider(_args) {
	var self = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'white'
	});
	
	var data = [
		{title:'Basic', hasChild:true, test:'ui/common/controls/slider_basic'},
		{title:'Change Min/Max', hasChild:true, test:'ui/common/controls/slider_min_max'}
	];
	
	if (Titanium.Platform.name == 'android') {
		data.push({title:'Min/Max Range', hasChild:true, test:'ui/handheld/android/controls/slider_range'});
	}
	
	if (Titanium.Platform.name === 'tizen') {
		data.push({ title: 'Min/Max Range', hasChild: true, test: 'ui/handheld/tizen/controls/slider_range' });
	}
	
	// create table view
	var tableview = Titanium.UI.createTableView({
		data:data
	});
	
	// create table view event listener
	tableview.addEventListener('click', function(e) {
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow(_args);
			_args.containingTab.open(win,{animated:true});
		}
	});
	
	// add table view to the window
	self.add(tableview);
	return self;
}

module.exports = slider;
