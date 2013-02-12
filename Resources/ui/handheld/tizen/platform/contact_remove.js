function remove_contact(args) {
	var wnd = Ti.UI.createWindow({
			title: args.title
		}),
		contactsTable = Ti.UI.createTableView();

	Ti.Contacts.Tizen.getAllPeople(function(persons) {
		var contactsCount = persons.length,
			i = 0,
			data = [];
		for (; i < contactsCount; i++) {
				var row = Ti.UI.createTableViewRow({
						height: 40,
						id: i
					}),
					contactLabel = Ti.UI.createLabel({
						top: 5,
						left: 5,
						width: 220,
						height: 30,
						text: persons[i].fullName
					}),
					delButton = Ti.UI.createButton({
						top: 5,
						left: 240,
						height: 30,
						width: 60,
						title: 'Delete'
					});
				row.add(contactLabel);
				row.add(delButton);

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
							contactsTable.data = data;
							break;
						}
						Ti.Contacts.removePerson(persons[index]);
						contactsTable.data = data;
						alert('Contact was removed successfully');
					});
				})(i);
				data.push(row);
		}
		contactsTable.data = data;
	}, function(err) {
		alert('Error occured: ' + err);
	});

	wnd.add(contactsTable);

	return wnd;
}
module.exports = remove_contact;