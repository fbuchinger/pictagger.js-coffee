(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PicTagger.Photo = (function(_super) {

    __extends(Photo, _super);

    function Photo() {
      Photo.__super__.constructor.apply(this, arguments);
    }

    Photo.prototype.initialize = function(attributes, options) {
      this.sourceTags = new PicTagger.SourceTags;
      this.keywordTags = new PicTagger.KeywordTags;
      this.view = new PicTagger.PhotoView({
        model: this
      });
      if (attributes.sourceTags) return this.addSourceTags(attributes.sourceTags);
    };

    Photo.prototype.addSourceTags = function(tagsArr) {
      var tag, _i, _len;
      for (_i = 0, _len = tagsArr.length; _i < _len; _i++) {
        tag = tagsArr[_i];
        if (!this.sourceTags.get(tag.id)) this.sourceTags.add(tag);
      }
      return this.trigger('change', this);
    };

    Photo.prototype.addKeywordTags = function(tagsArr) {
      this.keywordTags.add(tagsArr);
      return this.view.render();
    };

    Photo.prototype.getThumbnailUrl = function() {
      var targetTag;
      targetTag = this.sourceTags.find(function(sourceTag) {
        return sourceTag.get('id') === 'ThumbnailURL';
      });
      return targetTag != null ? targetTag.get('value') : void 0;
    };

    return Photo;

  })(Backbone.Model);

  PicTagger.Photos = (function(_super) {

    __extends(Photos, _super);

    function Photos() {
      Photos.__super__.constructor.apply(this, arguments);
    }

    Photos.prototype.model = PicTagger.Photo;

    Photos.prototype.url = '/photo';

    return Photos;

  })(Backbone.Collection);

  PicTagger.PhotoView = (function(_super) {

    __extends(PhotoView, _super);

    function PhotoView() {
      PhotoView.__super__.constructor.apply(this, arguments);
    }

    PhotoView.prototype.tagName = 'div';

    PhotoView.prototype.className = 'pt-photo';

    PhotoView.prototype.template = _.template(' \n<div class="pt-photo-header">\n    <h2><%= id %></h2>\n</div>\n<div class="pt-photo-thumbnail">\n    <img src="<%= thumbnailUrl %>"/>\n</div>\n<div class="pt-photo-tags">\n    <div class="pt-photo-keywordtags">\n        <h2>KeywordTags</h2>\n    </div>\n    <div class="pt-photo-sourcetags">\n        <h2>SourceTags</h2>\n    </div>\n</div>\n<div style="clear:left;"></div>');

    PhotoView.prototype.initialize = function() {
      return this.model.bind('change', this.render, this);
    };

    PhotoView.prototype.renderTags = function(tagCollection, tagView) {
      var $oHtml;
      $oHtml = $('<div>');
      $oHtml.append('<ul class="tag-list">');
      tagCollection.each(function(tag) {
        var tagview;
        tagview = new tagView({
          model: tag
        });
        return $oHtml.find('.tag-list').append(tagview.render().el);
      });
      return $oHtml;
    };

    PhotoView.prototype.render = function() {
      var modelData;
      modelData = _.extend(this.model.toJSON(), {
        thumbnailUrl: this.model.sourceTags.getThumbnailUrl()
      });
      $(this.el).html(this.template(modelData));
      $(this.el).find('.pt-photo-keywordtags').append(this.renderTags(this.model.keywordTags, PicTagger.KeywordView));
      $(this.el).find('.pt-photo-sourcetags').append(this.renderTags(this.model.sourceTags, PicTagger.SourcetagView));
      $('#bb').append(this.el);
      return this;
    };

    return PhotoView;

  })(Backbone.View);

}).call(this);
