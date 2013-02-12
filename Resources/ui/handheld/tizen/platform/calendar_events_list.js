function events_list(args) {
	var self = Ti.UI.createWindow({
			title: args.title
		}),
		calendar = tizen.calendar.getDefaultCalendar('EVENT'),
		tableview = Ti.UI.createTableView();

	tableview.addEventListener('click', function(e) {
		var wnd = new (require('ui/handheld/tizen/platform/calendar_edit_event'))({
			title: args.title,
			containingTab: args.containingTab,
			id: e.rowData.eventId
		});
		args.containingTab.open(wnd, { animated: true });
	});

	calendar.find(function (events) {
		tableview.data = fillEventsTable(events);
	}, onError);

	self.add(tableview);

	//Update events table after editing single event
	Ti.App.addEventListener('UpdateEventsTable',  function(e) {
		calendar.find(function (events) {
			tableview.data = fillEventsTable(events);
		}, onError);
	});

	function fillEventsTable(events) {
		var data = [],
			eventsCount = events.length,
			i = 0;

		for (; i < eventsCount; i++) {
			var row = Ti.UI.createTableViewRow({
					height: 40,
					id: i,
					eventId: events[i].id
				}),
				label = Ti.UI.createLabel({
					top: 5,
					left: 5,
					width: 160,
					height: 30,
					text: events[i].summary	
				}),
				delButton = Ti.UI.createButton({
					top: 5,
					left: 220,
					height: 30,
					width: 60,
					title: 'Delete'	
				});

			(function(index) {
				delButton.addEventListener('click', function(e) {
					var rowsCount = data.length,
						i = 0,
						row;
					for (; i < rowsCount; i++) {
						row = data[i];
						if (row.id !== index) {
							continue;
						}
						data.splice(i, 1);
						tableview.data = data;
						break;
					}
					calendar.remove(events[index].id);
					tableview.data = data;
					alert('Event was removed successfully');
				});	
			})(i);

			row.add(label);
			row.add(delButton);

			data.push(row);
		}
		return data;
	}

	function onError(err) {
		alert('Error: ' + err.message);
	}

	return self;
}
module.exports = events_list;