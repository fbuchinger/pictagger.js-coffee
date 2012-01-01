
/*
DateTimeTagger

classifies the weekday, day, daytime, calweek, month, year and season
a picture was taken
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  PicTagger.Taggers.DateTime = (function(_super) {

    __extends(DateTime, _super);

    function DateTime() {
      DateTime.__super__.constructor.apply(this, arguments);
    }

    DateTime.id = 'DateTime';

    DateTime.prototype.id = 'DateTime';

    DateTime.prototype.requires = ['DatetimeTaken'];

    DateTime.prototype.tags = [
      {
        predicate: 'weekday',
        label: 'Weekday',
        description: 'the day of the week the picture was taken on',
        active: true
      }, {
        predicate: 'day',
        label: 'Day',
        description: 'the day of the month the picture was taken on',
        active: true
      }, {
        predicate: 'daytime',
        label: 'Daytime',
        description: 'the daytime (morning|noon|afternoon|evening|night) in which the picture was taken',
        active: true
      }, {
        predicate: 'calweek',
        label: 'Calendar Week',
        description: 'the calendar week in which the picture was taken',
        active: true
      }, {
        predicate: 'month',
        label: 'Month',
        description: 'the month of the week the picture was taken on',
        active: true
      }, {
        predicate: 'year',
        label: 'Year',
        description: 'the year the picture was taken in',
        active: true
      }, {
        predicate: 'season',
        label: 'Season',
        description: 'the season the picture was taken in',
        active: true
      }
    ];

    DateTime.prototype.getDay = function(date) {
      var day;
      day = date.getDate();
      if (day < 10) {
        return '0' + day;
      } else {
        return day;
      }
    };

    DateTime.prototype.getMonth = function(date) {
      var months;
      months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      return months[date.getMonth()];
    };

    DateTime.prototype.getWeekday = function(date) {
      var weekdays;
      weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      return weekdays[date.getDay()];
    };

    DateTime.prototype.getDaytime = function(date) {
      var daytimeBegins, daytimes, hours;
      hours = date.getHours();
      daytimes = ['night', 'morning', 'noon', 'afternoon', 'evening', 'night'];
      daytimeBegins = [6, 11, 13, 18, 21];
      return daytimes[_(daytimeBegins).sortedIndex(hours)];
    };

    DateTime.prototype.getCalweek = function(date) {
      var a, b;
      a = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 5);
      b = new Date(a.getFullYear(), 0, 4);
      return ~~((a - b) / 864e5 / 7 + 1.5);
    };

    DateTime.prototype.getSeason = function(date) {
      var dYear, seasonStarts, seasons;
      dYear = date.getFullYear();
      seasonStarts = [new Date(dYear, 2, 20), new Date(dYear, 5, 21), new Date(dYear, 8, 22), new Date(dYear, 11, 21)];
      seasons = ['winter', 'spring', 'summer', 'autumn', 'winter'];
      return seasons[_(seasonStarts).sortedIndex(date)];
    };

    DateTime.prototype.run = function(required, desired, config) {
      var allTags, output, photo_taken, tag;
      photo_taken = required[0];
      photo_taken = photo_taken.value;
      allTags = [
        {
          predicate: 'weekday',
          value: this.getWeekday(photo_taken)
        }, {
          predicate: 'day',
          value: 'day' + this.getDay(photo_taken)
        }, {
          predicate: 'month',
          value: this.getMonth(photo_taken)
        }, {
          predicate: 'season',
          value: this.getSeason(photo_taken)
        }, {
          predicate: 'calweek',
          value: 'cw' + this.getCalweek(photo_taken)
        }, {
          predicate: 'daytime',
          value: this.getDaytime(photo_taken)
        }
      ];
      output = (function() {
        var _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = allTags.length; _i < _len; _i++) {
          tag = allTags[_i];
          if (_ref = tag.predicate, __indexOf.call(config.outputTags, _ref) >= 0) {
            _results.push(tag);
          }
        }
        return _results;
      })();
      return allTags;
    };

    return DateTime;

  })(PicTagger.Base.Tagger);

}).call(this);
