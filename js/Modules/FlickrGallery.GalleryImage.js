function initGalleryImageModule(context) {
	var FlickrGallery = context.FlickrGallery;

	/**
	* A single gallery image object for the FlickrGallery
	* @constructor
	*/
	var GalleryImage = FlickrGallery.GalleryImage = function(jImage) {
		this.jImage = jImage instanceof Object ? jImage : {
			title: undefined,
			link: undefined,
			media: {m: undefined},
			author: undefined,
			author_id: undefined,
			date_taken: undefined
		};

		this.itemStructure =
		/*jshint multistr: true */
			'<div><a><img/></a></div> \
			<div class="details"> \
			<div class="title flickr-blue">Title:</div> \
			<div class="author flickr-pink">Author:</div> \
			<div class="taken flickr-pink">Taken:</div> \
			</div>';

		// Show full image in new window
		this.showFullImage = function(){
			window.open(this.jImage.link, '_blank');
		};

		// load images for this user
		this.getAuthorImages = function() {
			var author_id = $(this).attr('data_author');
			FlickrGallery.getData(author_id);
		};

	};

	/**
	* Build the dom element for the image
	*/
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
		this.$img = $img;
		return $img;
	};
}