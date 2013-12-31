function initFlickrGalleryCore(context) {
	/**
	* The core module of the Flickr Gallery
	* @constructor
	*/
	var FlickrGallery = context.FlickrGallery = function (opt_config) {
		opt_config = $.extend({reloadGallery: $.proxy(this.reloadGallery, this)}, opt_config);

		this.dom = new FlickrGallery.DomManager(opt_config);
		this.datamanager = new FlickrGallery.DataManager(opt_config);

		this.showGallery = function(data) {
			if (!data || !data.items) {
				this.dom.showError();
				return;
			}

			this.gallery = new FlickrGallery.Gallery(data.items);
			this.dom.showGallery(this.gallery);
		};

	};

	FlickrGallery.prototype.getData = function(author_id){
		this.dom.loadingGalleryStart();
		this.datamanager.getData($.proxy(this.showGallery, this), author_id);
	};

	FlickrGallery.prototype.reloadGallery = function(){
		this.getData();
	};
}