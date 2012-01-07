![pictagger.js](http://picurl.org/pictagger.js/repo/demo/img/pictagger-logo-medium.png)

## About

**pictagger.js** is an **automated photo tagging framework** written in coffeescript/javascript. It uses existing and ad-hoc-created **photo metadata** ([exif](http://de.wikipedia.org/wiki/Exchangeable_Image_File_Format), [geotagging](http://en.wikipedia.org/wiki/Geotagging), [face detection](http://en.wikipedia.org/wiki/Face_detection)) as a source for generating **descriptive tags**. the goal is to free the user from **automatable tagging tasks** (e.g. assigning holiday or location names) and establish **tag consistency**.

pictagger.js is hosted on [github](https://github.com/fbuchinger/pictagger.js-coffee), You can report bugs and discuss features on the [issues page](https://github.com/fbuchinger/pictagger.js/issues).

Watch the [slides of my vienna.js talk on pictagger.js](http://www.slideshare.net/picurl/pictagger) or try a demo:

 * [Generating Tags from local jpeg files](http://picurl.org/pictagger.js/repo/demo/index.html)
 * [Faceted Tag search using Simile Exhibit](http://picurl.org/pictagger.js/repo/experiments/faceted-search.html) (currently broken due to undocumented Picasa Feed Changes)
 
### Example

<a href="http://www.flickr.com/photos/ilja/506955414/" title="sport von Ilja bei Flickr"><img src="http://farm1.static.flickr.com/194/506955414_2d3acc6ee3_m.jpg" width="186" height="240" alt="sport"></a>

This example image from flickr.com was analyized by pictagger and produced the following output: `2007`,`spring`,`may`,`day20`,`afternoon`,`dslr`,`sportsmode`,`nikon`,`d80`,`ireland`,`donabate`,`europe`

### The Problem

Everybody likes taking photos, but nobody likes to order and categorize them with keywords. To prove this theory, I retrieved the keyword data of 3000 randomly chosen flickr.com photos. I was quite astonished that I received a void result in 99.5% of all cases, only 63 photos had keywords assigned.

Missing keyword information can become a huge problem: as your photo collection grows, you sooner or later need [drilldown techniques](http://en.wikipedia.org/wiki/Drill_down) for rapid access to your desired images (e.g. *show me all images of aunt Orieta from Spring 2007*). Without previously assigned keywords, this search becomes much harder.

### The Solution

The tagging facilities in Google Picasa, Photoshop et al. are all really convenient, but come with one drawback: they force the user to do all the hard work.
pictagger.js takes another approach: it looks at the existing photo metadata (e.g. [Exif](http://en.wikipedia.org/wiki/Exchangeable_image_file_format)), analyzes it and derives keyword data from it. 

If you look at [Flickr's most popular tags](http://www.flickr.com/photos/tags/), you will notice that about 80% of the assigned tag names can be automatically derived from photo metadata: holidays like `Christmas`,`Easter`,`Thanksgiving` can be created by matching the Exif DateTime property against a list of holidays, the same goes for month and season names. Location tags such as `New York`, `Argentina` can be derived by [reverse geocoding](http://en.wikipedia.org/wiki/GIS#Reverse_geocoding) the GPS information stored in the photo, analyzing the color data of the emit lets you emit descriptive tags like `blackandwhite`,`pale` or `colorful`.

### Philosophy/Goals

  * **Automatize 80% of the tagging work** An automation tool that only masters 50% of the use cases is worthless. The goal of pictagger.js is to become THE tagging framework for all kinds of photography (e.g. sport/landscape/architecture/family) by providing flexible import sources for metadata and a tagger plugin API.
  * **Ensure aspect and term consistency**: Lacking aspect and term consistency is a common problem of manually assigned tags. Aspect consistency means that all photos with a certain aspect should be assigned with a corresponding tag, e.g. all photos taken in South America should receive the tag `South America`. When assigning tags manually, aspects are sometimes omitted, either due to laziness or a lack of conventions. Term consisteny deals with the problem of synonyms (e.g. `Latin America` instead of `South America`). Lacking Aspect and Term consistency leads to "hollow" tags (e.g. a click on the tag `South America` only shows a tiny selection of all photos you actually took in South America). 
  * **100% pure Javascript, no server-side dependencies**: Javascript is the language of the future, both on the client and server side. By choosing Javascript, we not only develop in the most actively improved programming language, but also with a very strong developer community.
  * **TIMTOW (There is more than one workflow)**: pictagger.js adapts to your known and perfected workflow and doesn't interfere with it. We don't require you to use a specific software or online service for photo editing just to enjoy the benefits of pictagger.js. Pictagger.js aims to be as flexible and embeddable as possible and can be used with almost any web image processing software. In short, pictagger.js should become for photo tagging what [OpenLayers](http://openlayers.org/) is for web cartography: a swiss-knife of information processing with no dependencies outside of Javascript. 
  * **Let the browser/javascript interpreter do as much work as possible** Browsers are strong workhorses nowadays. So just deliver the a compiled version of all required metadata to the browser and let it do the rest.


## How pictagger.js works

pictagger.js runs in the browser and makes it easy to put a [dynamic, facet-browseable photo catalog](http://picurl.org/pictagger.js/repo/experiments/faceted-search.html) on a web page.
The sources of this catalog can come from various origins (e.g. Flickr, Picasa, local file system), controls like the photo grid or a facet browser allow advanced views on the photo catalog. 

The core component of pictagger.js are taggers, self-contained plugins, that convert cryptic metadata into human readable tags. 

Below is a list of planned taggers to illustrate the power of pictagger.js, each tagger is accompaigned by a list of its emitted tags.

## Catalog

A Catalog is the overall container of a pictagger.js photo repository.

Catalog structure:


## Sources

A source provides metadata about the photos contained in a catalog. It converts information produced by other software or services into metadata units (facts) that are useable by PicTagger. Examples of such metadata can be a link to a thumbnail image of a photo, the date the photo was taken etc.

### ExifTool

### Picasa.ini

### Face.com

## Facts

A Fact is a discrete metadata chunk that is provided by a Pictagger.Source. Facts have two purposes:

* normalize the metadata provided by various sources by using a common naming scheme
* convert the "raw value" of the source metadata into the approbriate Javascript data type (e.g. "2012-01-01 14:25:11" --> Javascript Date object) for easier processing in taggers.

### Fact Table

    #### FilePath:
        type: 'string'
        the relative path to the original photo file
    #### DatetimeTaken:
        type: 'string'
        Date and time at which the photo was taken
    #### ProcessingSoftware:
        type: 'string'
        The name and version of the software used to post-process the picture
    #### Orientation:
        type: 'integer'
        rotation of the image in degrees clockwise
    #### CamMake:
        type: 'string'
        name of the camera manufacturer
    #### CamModel:
        type: 'string'
        name of the camera model
    #### LensID:
        type: 'string'
        The name and properties of the used lens
    #### FlashUsed:
        type: 'boolean'
        Tells weather flash was used or not
    #### FlashModel:
        type: 'string'
        The Model of the flash device if available
    #### FaceBox:
        type: 'object'
        contains percentual top/left/bottom/right coordinates of the detected face
    #### Edited:
        type: 'boolean'
        if the photo was edited or not
    #### ThumbnailURL:
        type: 'string'
        relative url to the thumbnail of the image

## Taggers

See [taggers page in the pictagger wiki](https://github.com/fbuchinger/pictagger.js-coffee/wiki/Taggers) for a list of planned and implemented taggers.

## Findings

Findings are the conclusions taggers draw based on the given photo facts and their own "knowledge". From the fact 'DateTimeTaken' -> "2012-01-01 14:25:11" the holiday tagger could infer that the photo was taken `new year's day` and emit the approbriate finding.

## Developers

The [PicTagger API Page](https://github.com/fbuchinger/pictagger.js-coffee/wiki/PicTagger-API) offers ressources for developers.

## FAQ


####Why Javascript?

Javascript is the language of the future, both on the client and server side. By choosing Javascript, we not only develop in the most actively improved programming language, but also with a very strong developer community.

####What is the maximum number of photos in a catalog? 

to be answered soon...

## Acknowledgements


* Tom Kraetschmer for providing hosting space and good feedback
* Jeremy Askenash for creating Backbone.js/underscore.js etc.
* Gabriela Lucano for designing the wonderful pictagger.js logo

<div><small>Pictagger.js &copy 2010-2011 by <a href="mailto: fbuchinger (at) gmail (dot) com">Franz Buchinger</a> </small></div>

