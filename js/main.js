// TODO: use event model to show/hide loader?

// TODO: handle window resize (scroller does not hold position)

// TODO: Lazy loading with https://github.com/tuupola/jquery_lazyload (didn't work!) 

(function() {
	/**********************************************\
	|					Data Manager				|
	| the "main" - handles data, call GUI manager 	|
	\**********************************************/
	function DataManager() {
		this.dom = new DomManager();
		this.gallery = new Gallery();

		// get the data on first load
		this.getData();
	}

	// the URL used to retrieve the gallery data
	DataManager.prototype.publicGalleryURI = 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?'

	// call the Flickr API to get data.
	DataManager.prototype.getData = function(author_id){
		this.startGetData();
		var success = $.proxy(this.handleNewData, this);
		var fail = $.proxy(this.failedGetData, this);
		$.getJSON(this.publicGalleryURI, {format: 'json', id: author_id})
			.done(success)
			.fail(fail);
	}

	// update GUI that get data process is about to begin
	// TODO: use events/callbacks
	DataManager.prototype.startGetData = function() {
		this.dom.loadingGalleryStart();
	}

	// update GUI that get data process has completed
	// TODO: use events/callbacks
	DataManager.prototype.endGetData = function() {
		this.dom.loadingGalleryComplete();
	}

	// API call completed. handle data
	DataManager.prototype.handleNewData = function(data){
		if (!data || !data.items) {
			this.failedGetData();
			console.log('missing data!');
			return;
		}

		this.initGallery(data.items);
		this.dom.showGallery(this.gallery);
		this.endGetData();
	}

	// failed to get data from API. Show error
	DataManager.prototype.failedGetData = function(){
		this.dom.showError();
	}

	// initialize the gallery object with the gallery items
	DataManager.prototype.initGallery = function(items){
		this.gallery.init(items);
	}

	/**********************************************\
	|					DomManager 					|
	| Performs all DOM actions/manipulations		|
	\**********************************************/
	function DomManager() {
		this.$loader = $('.loading');
		this.$gallery = $('.gallery');
		this.$error = $('.error');
		$('.infobutton').tipsy({
			html: true
		});
		$('header').click($.proxy(this.reloadGallery,this));
		// init scroller
		this.$gallery.serialScroll({
			items: 'div.img',
			prev: '.scroll.left',
			next: '.scroll.right',
			lazy: true,
			cycle: true,
			duration: 300
		});
	}

	// hide the loading spinner
	DomManager.prototype.loadingGalleryStart = function() {
		this.clearGallery();
		this.$error.hide();
		this.$loader.show();
	}

	// hide the loading spinner
	DomManager.prototype.loadingGalleryComplete = function() {
		this.$gallery.trigger( 'goto', [ 0 ] ); // trigger scroller to begining
		this.$gallery.show();
		this.$loader.hide();
	}

	// show the image gallery (and hide the loader)
	DomManager.prototype.showGallery = function(oGallery) {
		if (!oGallery instanceof Gallery) {
			this.showError();
			console.log('required Gallery is of the wrong type, [' + JSON.stringify(oGallery) + ']');
			return;
		}

		var $images = oGallery.getDomImages()
		this.$gallery.append($images);
	}

	// remove all gallery images
	DomManager.prototype.clearGallery = function(){
		this.$gallery.find('.img').remove();
	}

	// trigger reloading of the gallery
	DomManager.prototype.reloadGallery = function() {
		manager.getData();
	}

	// show the error div (and hide any other currently visible divs)
	DomManager.prototype.showError = function() {
		this.$loader.hide();
		this.$gallery.hide();
		this.$error.show();
	}

	/**********************************************\
	|					Gallery 					|
	|				All gallery items 				|
	\**********************************************/
	function Gallery(jImages) {
		// instance array of images
		this.images = [];

		// init if received data
		if (jImages) this.init(jImages);
	}

	// Initialize the galleries images.
	// Store references to all images
	// TODO: store each image object on the dom using jQuery's $.data,
	//		 and not in a single array. 
	// 		 This way the image data can be access independently.
	Gallery.prototype.init = function(jImages){
		this.images = [];
		var images = jImages instanceof Array ? jImages : [];
		// initialize image objects
		for (var i = 0; i < images.length; i++) {
			this.images.push(new GalleryImage(images[i]))
		};	
	}

	// get a jQuery object which hold the jquery images
	Gallery.prototype.getDomImages = function(){
		var $imgs = $();
		for (var i = 0; i < this.images.length; i++) {
			$imgs = $imgs.add(this.images[i].getDomImage());
		};

		return $imgs;
	}

	/**********************************************\
	|				GalleryImage 					|
	|			A single gallery item 				|
	\**********************************************/
	function GalleryImage(jImage){
		this.jImage = jImage instanceof Object ? jImage : {
			title: undefined,
			link: undefined,
			media: {m: undefined},
			author: undefined,
			author_id: undefined,
			date_taken: undefined
		};
	}

	// base structure for all images
	GalleryImage.prototype.itemStructure = 
		'<div><a><img/></a></div> \
		<div class="details"> \
		<div class="title flickr-blue">Title:</div> \
		<div class="author flickr-pink">Author:</div> \
		<div class="taken flickr-pink">Taken:</div> \
		</div>';

	// Build the dom element for the image
	GalleryImage.prototype.getDomImage = function(){
		if (this.$img instanceof jQuery) return this.$img;

		var img = document.createElement("div");
		img.innerHTML = this.itemStructure;
		var $img = $(img);
		$img.addClass('img');
		// set the image source
		$img.find('img')
			.attr('src', this.jImage.media.m)
			.click($.proxy(this.getImage, this));

		// set the image details (title, author)
		// title
		$img.find('.title')
			.attr('title', this.jImage.title)
			.click($.proxy(this.showFullImage, this))
			.append(this.jImage.title);
		// author
		$img.find('.author')
			.attr(
				{
					title: this.jImage.author, 
					data_author: this.jImage.author_id
				})
			.append(this.jImage.author)
			.click(this.getAuthorImages);
		// data taken
		var date = new Date(this.jImage.date_taken);
		$img.find('.taken')
			.attr('title', date)
			.append(date.toString());

		// store and return value
		return this.$img = $img;
	}

	// Show full image in new window
	GalleryImage.prototype.showFullImage = function(){
		window.open(this.jImage.link, '_blank');
	}

	// load images for this user
	GalleryImage.prototype.getAuthorImages = function() {
		var author_id = $(this).attr('data_author');
		manager.getData(author_id);
	}

	// start the application
	this.manager = new DataManager();
})();