(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PicTagger.KeywordTag = (function(_super) {

    __extends(KeywordTag, _super);

    function KeywordTag() {
      KeywordTag.__super__.constructor.apply(this, arguments);
    }

    return KeywordTag;

  })(Backbone.Model);

  PicTagger.KeywordTags = (function(_super) {

    __extends(KeywordTags, _super);

    function KeywordTags() {
      KeywordTags.__super__.constructor.apply(this, arguments);
    }

    KeywordTags.prototype.model = PicTagger.KeywordTag;

    return KeywordTags;

  })(Backbone.Collection);

  PicTagger.KeywordView = (function(_super) {

    __extends(KeywordView, _super);

    function KeywordView() {
      KeywordView.__super__.constructor.apply(this, arguments);
    }

    KeywordView.prototype.tagName = 'li';

    KeywordView.prototype.className = 'pictagger-keywordtag';

    KeywordView.prototype.events = {
      "click": "clickKeywordTag"
    };

    KeywordView.prototype.clickKeywordTag = function() {
      console.log(arguments, this);
      return alert("You clicked the keyword tag:" + this.model.get('value'));
    };

    KeywordView.prototype.initialize = function() {
      return this.template = _.template('<!-- <%= tagger %>, <%= predicate %>,--> <%= value %>');
    };

    KeywordView.prototype.render = function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    };

    return KeywordView;

  })(Backbone.View);

}).call(this);
