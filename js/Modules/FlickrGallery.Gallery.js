function initGalleryModule(context) {
	var FlickrGallery = context.FlickrGallery;

	/**
	* A Gallery object for the FlickrGallery
	* @constructor
	*/
	var Gallery = FlickrGallery.Gallery = function(aImages) {
		this.images = [];

		this.init = function (aImages){
			this.images = [];
			var images = aImages instanceof Array ? aImages : [];
			// initialize image objects
			for (var i = 0; i < images.length; i++) {
				this.images.push(new FlickrGallery.GalleryImage(images[i]));
			}
		};

		// initialize the gallery
		this.init(aImages);
	};

	/**
	* get a jQuery object which hold the jquery images
	*/
	Gallery.prototype.getDomImages = function(){
		var $imgs = $();
		for (var i = 0; i < this.images.length; i++) {
			$imgs = $imgs.add(this.images[i].getDomImage());
		}

		return $imgs;
	};

}