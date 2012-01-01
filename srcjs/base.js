(function() {
  var Base, root,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Base = {};

  Base.Tagger = (function() {

    Tagger.prototype.requires = [];

    Tagger.prototype.desires = [];

    function Tagger(options) {
      this.options = options;
    }

    /*
            getOutputTags
            retrieve a list of tag predicates the tagger should output
    */

    Tagger.prototype.getOutputTags = function() {
      var oTag, outputTags, validTags, _i, _j, _len, _len2, _ref, _ref2;
      if (this.options.activeTags) {
        validTags = _(this.tags).pluck('predicate');
        _ref = this.options.activeTags;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          oTag = _ref[_i];
          if (__indexOf.call(validTags, oTag) >= 0) outputTags = oTag;
        }
      } else {
        _ref2 = this.tags;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          oTag = _ref2[_j];
          if (oTag.active === true) outputTags = oTag.predicate;
        }
      }
      return outputTags;
    };

    Tagger.prototype.launch = function(photo) {
      var config, desired, i, meetsReqs, obj, outputTags, required, sTag, sourceTags, _len;
      desired = [];
      sourceTags = photo.sourceTags.toJSON();
      required = (function() {
        var _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = sourceTags.length; _i < _len; _i++) {
          sTag = sourceTags[_i];
          if (_ref = sTag.id, __indexOf.call(this.requires, _ref) >= 0) {
            _results.push(sTag);
          }
        }
        return _results;
      }).call(this);
      meetsReqs = required.length === this.requires.length;
      config = {
        outputTags: this.getOutputTags()
      };
      if (meetsReqs === true) {
        outputTags = this.run.apply(this, [required, desired, config]);
        for (i = 0, _len = outputTags.length; i < _len; i++) {
          obj = outputTags[i];
          outputTags[i].tagger = this.id;
        }
        return outputTags;
      } else {
        return [];
      }
    };

    Tagger.prototype.run = function(required, desired) {
      throw "You need to provide a run method in your tagger";
    };

    return Tagger;

  })();

  Base.Source = (function() {
    /*
            the source tags this format provides
    */
    Source.prototype.providedTags = [];

    Source.prototype.sourceTags = [];

    function Source(name, options) {
      this.name = name;
      this.options = options;
    }

    Source.prototype.getSourceTagPreset = function(tagId) {
      return _(PicTagger.SourceTagPresets[tagId]).clone();
    };

    Source.prototype.read = function() {};

    Source.prototype.write = function() {};

    return Source;

  })();

  Base.SourceTag = (function() {

    function SourceTag() {}

    /*
            source tag is initialized with raw value
    */

    SourceTag.prototype.initialize = function(raw_value) {
      var value;
      this.raw_value = raw_value;
      value = this.convert(this.raw_value);
      if (this.validate(value)) return this.value = value;
    };

    /*
            validate ()
            optional validation function for the retrieved tag value
    */

    SourceTag.prototype.validate = function(value) {
      return true;
    };

    /*
            convert ()
            converts the source_tags raw value and returns the parsed value
    */

    SourceTag.prototype.convert = function(raw_value) {
      return raw_value;
    };

    SourceTag.prototype.raw_value = null;

    SourceTag.prototype.value = null;

    return SourceTag;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.PicTagger = {
    Taggers: {},
    Sources: {},
    SourceTags: {},
    addTagger: function(tagger) {
      return this.Taggers[tagger.id] = tagger;
    },
    addSource: function(source) {
      return this.Sources[source.id] = source;
    }
  };

  _.extend(root.PicTagger, {
    Base: Base
  });

}).call(this);
