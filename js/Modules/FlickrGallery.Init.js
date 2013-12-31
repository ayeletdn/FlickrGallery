/*global initLibraryCore initLibraryModule */
var initFlickrGallery = function (context) {

  initFlickrGalleryCore(context);
  initDataManagerModule(context);
  initDomManagerModule(context);
  initGalleryModule(context);
  initGalleryImageModule(context);

  return context.FlickrGallery;
};


if (typeof define === 'function' && define.amd) {
  // Expose Library as an AMD module if it's loaded with RequireJS or
  // similar.
  define(function () {
    return initFlickrGallery({});
  });
} else {
  // Load Library normally (creating a Library global) if not using an AMD
  // loader.
  initFlickrGallery(this);
}