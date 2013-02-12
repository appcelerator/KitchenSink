// For this test: Base UI -> Views -> Element Screenshot

function blobImageView() {
	var win = Titanium.UI.createWindow(),
		imageView = Titanium.UI.createImageView({
			height: 200,
			top: 20,
			width: 300,
			backgroundColor: '#999'
		}),
		btn  = Titanium.UI.createButton({
			title: 'Show this button as image',
			bottom: 20
		}),
		blobCB = function(blob) {
			imageView.image = blob;
		};
	
	win.add(imageView);
	win.add(btn);
	
	btn.addEventListener('click', function() {
		this.toImage(blobCB);
	});
	
	return win;
};

module.exports = blobImageView;
