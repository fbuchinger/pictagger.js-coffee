(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PicTagger.Sources.PicasaIni = (function(_super) {

    __extends(PicasaIni, _super);

    function PicasaIni() {
      PicasaIni.__super__.constructor.apply(this, arguments);
    }

    PicasaIni.prototype.providedTags = [];

    PicasaIni.prototype.id = 'PicasaIniSource';

    PicasaIni.prototype.request = function() {
      return $.get(this.options.url);
    };

    PicasaIni.prototype.read = function() {
      var _this = this;
      return $.when(this.request()).done(function(metadata) {
        return _this.parse(metadata);
      });
    };

    PicasaIni.prototype.parse = function(metadata) {
      var photo, _i, _len, _ref, _results;
      this.iniParser = new PicTagger.Util.IniParser(metadata);
      this.photos = [];
      _ref = this.iniParser.sections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        photo = _ref[_i];
        if (photo !== 'Contacts') {
          _results.push(this.photos.push(this.parsePhoto(photo)));
        }
      }
      return _results;
    };

    PicasaIni.prototype.getPhotos = function() {
      return this.photos;
    };

    PicasaIni.prototype.createSourceTag = function(id, raw_value, value) {
      var tagData;
      tagData = this.getSourceTagPreset(id);
      _(tagData).extend({
        id: id,
        raw_value: raw_value,
        value: value || raw_value
      });
      return tagData;
    };

    PicasaIni.prototype.extractFaces = function(tagStr) {
      var bbox, bboxRect, contactId, face, faces, sourceTag, sourceTags, _i, _len, _ref;
      faces = tagStr.split(';');
      sourceTags = [];
      for (_i = 0, _len = faces.length; _i < _len; _i++) {
        face = faces[_i];
        _ref = face.split(','), bboxRect = _ref[0], contactId = _ref[1];
        bbox = bboxRect.slice(7, -1);
        sourceTag = {
          id: 'FaceBox',
          value: {
            left: parseInt(bbox.slice(0, 4), 16) / 65536,
            top: parseInt(bbox.slice(4, 8), 16) / 65536,
            right: parseInt(bbox.slice(8, 12), 16) / 65536,
            bottom: parseInt(bbox.slice(12, 16), 16) / 65536
          },
          multiple: true,
          raw_value: face
        };
        sourceTags.push(sourceTag);
      }
      return sourceTags;
    };

    PicasaIni.prototype.extractFilters = function(tagStr) {
      return [];
    };

    PicasaIni.prototype.parsePhoto = function(photoName) {
      var property, propertyValue, sourceTags, _i, _len, _ref;
      sourceTags = [];
      sourceTags.push(this.createSourceTag('FilePath', photoName));
      _ref = this.iniParser.properties(photoName);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        property = _ref[_i];
        propertyValue = this.iniParser.get(photoName, property);
        switch (property) {
          case 'faces':
            sourceTags = sourceTags.concat(this.extractFaces(propertyValue));
            break;
          case 'filters':
            sourceTags.push(this.createSourceTag('Edited', 'yes', true));
            break;
          case 'star':
            if (propertyValue === 'yes') {
              sourceTags.push(this.createSourceTag('Starred', 'yes', true));
            }
            break;
          case 'caption':
            sourceTags.push(this.createSourceTag('Caption', propertyValue));
            break;
          default:
            1 + 1;
        }
      }
      return sourceTags;
    };

    return PicasaIni;

  })(PicTagger.Base.Source);

}).call(this);
