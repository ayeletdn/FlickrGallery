function initDataManagerModule(context){
	
	var FlickrGallery = context.FlickrGallery;

	/**
	* The Data manager for the FlickrGallery
	* @constructor
	*/
	var DataManager = FlickrGallery.DataManager = function(opt_config) {

		// the URL used to retrieve the gallery data
		this.publicGalleryURI = 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';

		// API call completed. handle data
		this.handleNewData = function(onComplete, data){
			if (!data || !data.items) {
				this.failedGetData();
				console.log('missing data!');
				return;
			}

			if (typeof onComplete == "function")
				onComplete(data);
		};

		// failed to get data from API. Show error
		this.failedGetData = function(onComplete){
			if (typeof onComplete == "function")
				onComplete(data);
		};
	};


	// call the Flickr API to get data.
	DataManager.prototype.getData = function(onComplete, author_id){
		var success = $.proxy(this.handleNewData, this, onComplete);
		var fail = $.proxy(this.failedGetData, this, onComplete);
		$.getJSON(this.publicGalleryURI, {format: 'json', id: author_id})
			.done(success)
			.fail(fail);
	};
}