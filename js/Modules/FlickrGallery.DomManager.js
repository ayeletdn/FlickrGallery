function initDomManagerModule(context) {
	var FlickrGallery = context.FlickrGallery;

	/**
	* The Dom manager for the FlickrGallery
	* @constructor
	*/
	var DomManager = FlickrGallery.DomManager = function(opt_config) {

		this.initDom = function() {
			this.$loader = $('.loading');
			this.$gallery = $('.gallery');
			this.$error = $('.error');
			$('.infobutton').tipsy({
				html: true
			});
			$('header').click(opt_config.reloadGallery);
			this.initScroll(this.$gallery);
		};

		this.initScroll = function($gallery){
			$gallery.serialScroll({
				items: 'div.img',
				prev: '.scroll.left',
				next: '.scroll.right',
				lazy: true,
				cycle: true,
				duration: 300
			});
		};

		this.initDom();
	};

		// show the error div (and hide any other currently visible divs)
	DomManager.prototype.showError = function() {
		this.$loader.hide();
		this.$gallery.hide();
		this.$error.show();
	};

	// show the loading spinner
	DomManager.prototype.loadingGalleryStart = function() {
		this.$gallery.find('.img').remove();
		this.$gallery.trigger( 'goto', [ 0 ] ); // trigger scroller to begining
		// need to hide $gallery? (size 0 because no images)
		this.$error.hide();
		this.$loader.show();
	};

	// hide the loading spinner
	DomManager.prototype.loadingGalleryComplete = function() {
		this.$gallery.show();
		this.$loader.hide();
	};

	// build the image gallery
	DomManager.prototype.showGallery = function(oGallery) {
		if (!oGallery instanceof FlickrGallery.Gallery) {
			this.showError();
			console.log('required Gallery is of the wrong type, [' + JSON.stringify(oGallery) + ']');
			return;
		}

		var $images = oGallery.getDomImages();
		this.$gallery.append($images);
		this.loadingGalleryComplete();
	};
}