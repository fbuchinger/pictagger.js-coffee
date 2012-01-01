(function() {
  var BaseSourceTag, SourceTags, root,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  SourceTags = root.PicTagger.SourceTags;

  BaseSourceTag = root.PicTagger.Base.SourceTag;

  /*
      SourceTag as Backbone Model
  */

  PicTagger.SourceTag = (function(_super) {

    __extends(SourceTag, _super);

    function SourceTag() {
      SourceTag.__super__.constructor.apply(this, arguments);
    }

    SourceTag.prototype.initialize = function(attributes, options) {
      attributes.name = attributes.id;
      if (attributes.multiple) {
        attributes.id = attributes.id + Math.floor(Math.random() * 1000);
      }
      return SourceTag.__super__.initialize.call(this, attributes, options);
    };

    SourceTag.prototype.validate = function(value) {
      switch (this.get('type')) {
        case "date":
          return _.isDate(value);
        case "integer":
        case "float":
          return _.isNumber(value);
        case "boolean":
          return _.isBoolean(value);
        default:
          return _.isString(value);
      }
    };

    SourceTag.prototype.convert = function(raw_value) {
      return raw_value;
    };

    return SourceTag;

  })(Backbone.Model);

  PicTagger.SourceTags = (function(_super) {

    __extends(SourceTags, _super);

    function SourceTags() {
      SourceTags.__super__.constructor.apply(this, arguments);
    }

    SourceTags.prototype.model = PicTagger.SourceTag;

    return SourceTags;

  })(Backbone.Collection);

  PicTagger.SourcetagView = (function(_super) {

    __extends(SourcetagView, _super);

    function SourcetagView() {
      SourcetagView.__super__.constructor.apply(this, arguments);
    }

    SourcetagView.prototype.tagName = 'li';

    SourcetagView.prototype.className = 'pictagger-sourcetag';

    SourcetagView.prototype.initialize = function() {
      this.defaultTemplateStr = '<%= id %>, <%= value %>, <%= raw_value %>';
      return this.template = _.template(this.model.get('template') || this.defaultTemplateStr);
    };

    SourcetagView.prototype.render = function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    };

    return SourcetagView;

  })(Backbone.View);

  /*
      SourceTags are specified in JSON-Schema form
  */

  PicTagger.SourceTagPresets = {
    FilePath: {
      type: 'string',
      description: 'relative path to the original photo file'
    },
    DatetimeTaken: {
      type: 'string',
      description: 'Date and time at which the photo was taken'
    },
    ProcessingSoftware: {
      type: 'string',
      description: 'The name and version of the software used to post-process the picture'
    },
    Orientation: {
      type: 'integer',
      description: 'rotation of the image in degrees clockwise'
    },
    CamMake: {
      type: 'string',
      description: 'name of the camera manufacturer'
      /*
              validate: (modelName) ->
                  manufacturers = 'apple canon nikon olympus nokia sonyerricson hewlett-packard pentax casio'.split(' ')
                  modelName.toLowerCase in manufacturers
      */
    },
    CamModel: {
      type: 'string',
      description: 'name of the camera model'
    },
    LensID: {
      type: 'string',
      description: 'The name and properties of the used lens'
    },
    FlashUsed: {
      type: 'boolean',
      description: 'Tells weather flash was used or not'
    },
    FlashModel: {
      type: 'string',
      description: 'The Model of the flash device if available'
    },
    FaceBox: {
      type: 'object',
      template: ' <%= id %>, <%= value.toSource() %>, <%= raw_value %>'
    },
    Edited: {
      type: 'boolean',
      description: 'if the photo was edited or not'
    },
    ThumbnailURL: {
      type: 'string',
      description: 'relative url to the thumbnail of the image',
      template: '<div class="pt-photothumbnail"><img src="<%= value %>" /></div>'
    }
  };

}).call(this);
