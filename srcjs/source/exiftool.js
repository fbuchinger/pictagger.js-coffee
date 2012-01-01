(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  PicTagger.Sources.ExifTool = (function(_super) {
    var extractorMap;

    __extends(ExifTool, _super);

    function ExifTool() {
      ExifTool.__super__.constructor.apply(this, arguments);
    }

    ExifTool.prototype.providedTags = ['DatetimeTaken', 'CamMake', 'CamModel', 'FlashUsed', 'FilePath'];

    ExifTool.prototype.id = 'ExifToolSource';

    extractorMap = {
      'FilePath': {
        'extract': function(etJson) {
          var fnParts;
          fnParts = etJson['FileName'].split('/');
          return _.last(fnParts);
        }
      },
      'ThumbnailURL': {
        'extract': function(etJson) {
          var fExt, fName, fnParts, _ref;
          fnParts = etJson['FileName'].split('/');
          _ref = _.last(fnParts).split('.'), fName = _ref[0], fExt = _ref[1];
          return 'testcatalog/' + fName + '_thumb.jpg';
        },
        'template': '<img src=" <%= value %>" />'
      },
      'Orientation': {
        'extract': function(etJson) {
          return etJson['Orientation'];
        },
        'convert': function(exValue) {
          exValue.match(/[0-9]+/g);
          if (_.isArray(exValue)) {
            return exValue[0];
          } else {
            return 0;
          }
        }
      },
      'DatetimeTaken': {
        'extract': function(etJson) {
          return etJson['DateTimeOriginal'] || etJson['DateTimeCreated'] || etJson['DateTimePublished'];
        },
        'convert': function(exValue) {
          var dateparts, day, hour, minute, month, seconds, year;
          dateparts = exValue.match(/[0-9a-zA-Z]+/g);
          year = dateparts[0], month = dateparts[1], day = dateparts[2], hour = dateparts[3], minute = dateparts[4], seconds = dateparts[5];
          return new Date(~~year, ~~month - 1, ~~day, ~~hour, ~~minute, ~~seconds);
        }
      },
      'CamMake': {
        'extract': function(etJson) {
          return etJson['Make'];
        }
      },
      'CamModel': {
        'extract': function(etJson) {
          return etJson['Model'];
        }
      },
      'FlashUsed': {
        'extract': function(etJson) {
          return etJson['Flash'];
        },
        'convert': function(exValue) {
          return __indexOf.call(exValue, 'Fired') >= 0;
        }
      }
    };

    ExifTool.prototype.request = function() {
      return $.get(this.options.url);
    };

    ExifTool.prototype.read = function() {
      var _this = this;
      return $.when(this.request()).done(function(metadata) {
        return _this.parse(metadata);
      });
    };

    ExifTool.prototype.parse = function(metadata) {
      var photo, _i, _len, _results;
      this.photos = [];
      _results = [];
      for (_i = 0, _len = metadata.length; _i < _len; _i++) {
        photo = metadata[_i];
        _results.push(this.photos.push(this.parsePhoto(photo)));
      }
      return _results;
    };

    ExifTool.prototype.getPhotos = function() {
      return this.photos;
    };

    ExifTool.prototype.parsePhoto = function(photoMetadata) {
      var extractor, sourceTag, sourceTags, tagData;
      sourceTags = [];
      for (sourceTag in extractorMap) {
        extractor = extractorMap[sourceTag];
        if (extractor.extract(photoMetadata)) {
          tagData = this.getSourceTagPreset(sourceTag);
          tagData.id = sourceTag;
          tagData.raw_value = extractor.extract(photoMetadata);
          tagData.value = extractor.convert ? extractor.convert(tagData.raw_value) : tagData.raw_value;
          sourceTags.push(tagData);
        }
      }
      return sourceTags;
    };

    return ExifTool;

  })(PicTagger.Base.Source);

}).call(this);
