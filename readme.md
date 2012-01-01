![pictagger.js](demo/img/pictagger-logo-medium.png)

## About

**pictagger.js** is an **automated photo tagging framework** written in javascript. It uses existing and ad-hoc-created **photo metadata** ([exif](http://de.wikipedia.org/wiki/Exchangeable_Image_File_Format), [geotagging](http://en.wikipedia.org/wiki/Geotagging), [face detection](http://en.wikipedia.org/wiki/Face_detection)) as a source for generating **descriptive tags**. the goal is to free the user from **automatable tagging tasks** (e.g. assigning holiday or location names) and establish **tag consistency**.

pictagger.js will soon be hosted on [github](https://github.com/fbuchinger/pictagger.js), You can report bugs and discuss features on the [issues page](https://github.com/fbuchinger/pictagger.js/issues).

Watch the [slides of my vienna.js talk on pictagger.js](http://www.slideshare.net/picurl/pictagger) or try a demo:

 * [Generating Tags from local jpeg files](demo/index.html)
 * [Faceted Tag search using Simile Exhibit](experiments/faceted-search.html)
 
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

pictagger.js runs in the browser and makes it easy to put a [dynamic, facet-browseable photo catalog](experiments/faceted-search.html) on a web page.
The sources of this catalog can come from various origins (e.g. Flickr, Picasa, local file system), controls like the photo grid or a facet browser allow advanced views on the photo catalog. 

The core component of pictagger.js are taggers, self-contained plugins, that convert cryptic metadata into human readable tags. 

Below is a list of planned taggers to illustrate the power of pictagger.js, each tagger is accompaigned by a list of its emitted tags.


## Taggers


### Time-based

Time-based taggers evaluate the date and time when the photo was taken (usually captured by the Exif.DateTime tag).

#### DateTime

 * **year**: calendar year in which the photo was taken, e.g. `year2010`, `year2008`
 *  **season**: season in which the photo was taken, possible values: `winter`, `spring`, `summer`, `autumn`.
 * **month**: month in which the photo was taken, e.g. `january`, `december`.
 * **daytime**: daytime in which the photo was taken, possible values: `morning`, `noon`, `afternoon`, `evening`, `night`.
 * **calweek**: calendar week (calculated according to [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601#Week_dates)), e.g. `cw01`
 * **weekday**: weekday - `sunday`, `monday`, `tuesday`, `wednesday`,`friday`,`saturday`.
 * **monthday**: day of month - e.g. `monthday09` 

#### Holiday

 * **catholic holidays**: e.g. `good friday`, `christmas`
 * **federal**: e.g. `national holiday`, `new year's day`   

#### DayOfMyLife

  * `dayofmylife`

#### Twilight

  * `golden hour` - When the photo was taken in the [Golden hour](http://en.wikipedia.org/wiki/Golden_hour_%28photography%29), i.e. the first and last hour of sunlight in the day
  * `sunset` - When the photo was taken during the (astronomical) sunlight
  * `twilight` - When the photo was taken during the twilight
  * `blue hour` - When the photo was taken during the [Blue hour](http://en.wikipedia.org/wiki/Blue_hour), i.e. the first hour before sunrise / after sunset 

### Location-based

Location-based taggers evaluate position where the photo was taken (usually captured with a GPS Logger or via text/map input in photosharing services );

#### GeoCode

  * **country**: `USA`,`Austria`
  * **province/state**: `Upper Austria`,`California` 
  * **town**: `Vienna`, 
  * **Street**: `Margarethenstrasse`, 

#### GeoHash

  * **Geohash**: a [Geohash](http://en.wikipedia.org/wiki/Geohash) is a "poor man's spatial database" - it maps a WSG-84 coordinate pair into a single string. Shortening the string decreases the accuracy and can be used for proximity searches. Example output: `u2e94v9egx0b`

#### FromHome
  * **kmfromhome** the distance of the photo from a given home location, e.g. `kmfromhome00359` 
  * **homebearing** the direction of the photo relative to the home location e.g. `north`,`south`,`east`,`west` 

### Shooting/Device-based

Device-based taggers build upon the Manufacturer and Model information stored in the Exif metadata. Furthermore some other basic Exif attributes like Orientation, Flash and Exposure are evaluated. The Lens tagger used advanced info stored in proprietary makernotes and therefore works best with unmodified images from the digital camera.

#### Cam

  * **camtype**: type of used camera, possible values: `dslr`,`bridge`,`compact`,`smartphone`.
  * **make**: abbreviated manufacturer name of the camera, e.g. `canon`,`olympus`,`nikon`
  * **model**: abbreviated model name of the camera, e.g. `d70`,`e410`.

#### Printout tagger

generates a few printout-related tags, e.g. the photo orientation, the ratio between long and short side or 
the possible printout formats based on various resolutions.

 * **orientation**: `landscape` or `portrait`
 * **maxprintout**: the largest possible printout format for this photo
 * **sideratio**: longer side of the photo / shorter side of photo, (two decimals)
 * **printout formats**: collection of all possible printout formats

#### Exposure

  * Identifies photos as [long-exposure](http://en.wikipedia.org/wiki/Exposure_%28photography%29)

#### Flash

   * **flash fired?**: `flash` is assigned if the photo was fired with flash
   * **flash type**: `builtin` or `external`
   * **flash mode**: `red eye` etc.

#### Lens
   * **lens maker?**: `Canon` is assigned if the photo was fired with flash  
   * **lens model**: `EF 50-200mm f/3.5-4.5`
   * **lens type**: `aspherical` etc.

### Visual

Visual taggers don't use existing metadata, but analyze the image pixel data for certain perceptive properties.

   * **dominant colors** retrieve the dominant colors of a photo via the browser's canvas interface.
   * **contrast** retrieve the contrast rating of a photo via the browser's canvas interface.

### Post-Processing

This tagger family creates tags to identify software tools and their settings used for post-processing the photo.

#### Software

   * **software**: emit a normalized version of the software information that is stored in the [Exif](http://www.sno.phy.queensu.ca/~phil/exiftool/TagNames/EXIF.html) software tag, e.g. `photoshop`,`irfanview`
   * **software version**: version information of the software e.g. `cs3` for photoshop
   
#### JPEG

these tags are only emitted if the photo is in jpeg format, the tagger makes use of the DQT Databases provided by [ExifTool](http://search.cpan.org/~exiftool/Image-ExifTool-8.60/lib/Image/ExifTool/JPEGDigest.pm) and/or [JpegSnoop](http://www.impulseadventure.com/photo/jpeg-quantization.html)
	
   * **JPEG Quality**: determine the quality of the jpeg by using DQT signatures and emit it like `quality080`
   * **JPEG Library**: emit the Jpeg Library who was used to produce the jpeg, will yield values like `libjpeg`,`photoshop-save-for-web`,`photoshop`,...
   * **is modified**: use DQT tables to find out if the JPEG is coming directly from a camera or has been modified in a software ([will not work in all cases](http://www.impulseadventure.com/photo/jpeg-snoop-identify-edited-photos.html))
   

#### Panoramic Photos

   * **panoramic**: `panoramic` is emitted if we find e.g. a [Hugin](http://hugin.sourceforge.net/) signature in the Exif Software header.
   * **panosettings**: emit certain settings of a panorama that [Hugin exports as exif tags](https://bugs.launchpad.net/hugin/+bug/696636) ???

## Developers


### The innerds of pictagger.js

### How to write your own tagger

#### Standard (Synchronous) Taggers

If your tagger doesn't need to perform any asynchronous actions (i.e. AJAX calls to webservices, web workers), you can follow this model:

		PicTagger.addTagger({
			name: 'DateTagger'
			requires: ['Photo.Exif.DateTimeTaken'],
			desires: ['Photo.GPS.Location'],
			getSeason: function (date){
				//available in the complete tagger
			},
			getDaytime: function (date){
				//ditto
			},
			run: function (required, desired, options){
				//do your calculations here
				
				function zeropad (){
					//inner function, only available in run
				}
				
				return [
					{category: 'year', name: 'year' + date.getFullYear()},
					{category: 'season', name: this.getSeason(date)},
					{category: 'month', name: months[date.getMonth()]},
					{category: 'daytime', name: this.getDaytime(date)},
					{category: 'calweek', name:  'week' + zeropad(getWeekOfYear(date))},
					{category: 'weekday', name:  weekdays[date.getDay()]},
					{category: 'monthday', name:  'day' + zeropad(date.getDate())}
				] 
			}
		});

#### Asynchronous Taggers

If you must perform AJAX calls in your tagger (e.g. for a geocoding tagger), you should invoke it with a Javascript Deferred Object and then return the promise function.
PicTagger will automatically add the tags when the promise is resolved. Head over to the [jQuery Deferred Docs](http://api.jquery.com/category/deferred-object/) to learn more about this technique.
(TODO: explain more about caching strategies)
(Code sample coming soon)

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

