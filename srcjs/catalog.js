(function() {

  PicTagger.Catalog = (function() {

    _Class.fromJSON = function(jsonConfig) {
      return "should return a new pictagger catalog from a json config";
    };

    function _Class(options) {
      var source, sourceInst, sources, taggerInst, taggers, _i, _j, _len, _len2;
      this.options = options;
      sources = this.options.sources || [];
      taggers = this.options.taggers || [];
      this.taggers = [];
      this.sources = [];
      this.keywordTags = [];
      this.photos = new PicTagger.Photos;
      for (_i = 0, _len = taggers.length; _i < _len; _i++) {
        taggerInst = taggers[_i];
        this.taggers.push(taggerInst);
      }
      for (_j = 0, _len2 = sources.length; _j < _len2; _j++) {
        source = sources[_j];
        if (PicTagger.Sources[source]) {
          sourceInst = new PicTagger.Sources[source](options);
        } else {
          sourceInst = source;
        }
        this.sources.push(sourceInst);
      }
      this.readSources();
    }

    /*
            merge the data collected from different sources
            using the specified id key (which must be present in all sourcetags)
            returns a backbone collection of all sources as a result
    */

    _Class.prototype.mergeSources = function(sources, idTagKey) {
      var mergedSources, photo, photoId, sTag, source, _i, _j, _k, _len, _len2, _len3, _ref;
      sources = sources.sort(function(a, b) {
        return b.length - a.length;
      });
      mergedSources = {};
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        _ref = source.getPhotos();
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          photo = _ref[_j];
          for (_k = 0, _len3 = photo.length; _k < _len3; _k++) {
            sTag = photo[_k];
            if (sTag.id === idTagKey) photoId = sTag.value;
          }
          console.log(photoId);
          if (mergedSources[photoId] == null) mergedSources[photoId] = [];
          mergedSources[photoId] = mergedSources[photoId].concat(photo);
        }
      }
      return mergedSources;
    };

    _Class.prototype.readSources = function() {
      var asyncReadTasks, source, _i, _len, _ref,
        _this = this;
      asyncReadTasks = [];
      _ref = this.sources;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source = _ref[_i];
        asyncReadTasks.push(source.read());
      }
      return $.when.apply($, asyncReadTasks).then(function() {
        var mergedSources, photoId, photoSourceTags;
        mergedSources = _this.mergeSources(_this.sources, 'FilePath');
        for (photoId in mergedSources) {
          photoSourceTags = mergedSources[photoId];
          _this.photos.add({
            id: photoId,
            sourceTags: photoSourceTags
          });
        }
        _this.launchTaggers();
        return console.log("all reading done");
      });
    };

    _Class.prototype.launchTaggers = function() {
      var _this = this;
      return this.photos.each(function(photo) {
        var kwTags, tagger, _i, _len, _ref;
        _ref = _this.taggers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tagger = _ref[_i];
          kwTags = tagger.launch(photo);
          photo.addKeywordTags(kwTags);
        }
        return photo.view.render();
      });
    };

    return _Class;

  })();

}).call(this);
