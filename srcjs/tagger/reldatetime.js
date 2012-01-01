
/*
RelativeDateTagger

measures the difference from now to the datetime the picture was taken.
this time difference can be expressed in various units (day, week, year,...)
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PicTagger.Taggers.RelativeDateTime = (function(_super) {

    __extends(RelativeDateTime, _super);

    function RelativeDateTime() {
      RelativeDateTime.__super__.constructor.apply(this, arguments);
    }

    RelativeDateTime.id = 'RelativeDateTime';

    RelativeDateTime.prototype.id = 'RelativeDateTime';

    RelativeDateTime.prototype.requires = ['DatetimeTaken'];

    RelativeDateTime.prototype.tags = [
      {
        predicate: 'daydiff',
        label: 'Day Difference',
        description: 'time difference between now and the moment the picture was taken, expressed in days',
        active: false
      }, {
        predicate: 'weekdiff',
        label: 'Week Difference',
        description: 'time difference between now and the moment the picture was taken, expressed in weeks',
        active: false
      }, {
        predicate: 'monthdiff',
        label: 'month Difference',
        description: 'time difference between now and the moment the picture was taken, expressed in months',
        active: false
      }, {
        predicate: 'yeardiff',
        label: 'year Difference',
        description: 'time difference between now and the moment the picture was taken, expressed in years',
        active: false
      }, {
        predicate: 'autodiff',
        label: 'Auto Difference',
        description: 'time difference between now and the moment the picture was taken, expressed in the smallest possible time unit',
        active: true
      }
    ];

    RelativeDateTime.prototype.run = function(required, desired, config) {
      return [
        {
          predicate: 'autodiff',
          value: '17days'
        }
      ];
    };

    return RelativeDateTime;

  })(PicTagger.Base.Tagger);

}).call(this);
