(function() {
  var IniParser,
    __slice = Array.prototype.slice,
    __hasProp = Object.prototype.hasOwnProperty;

  PicTagger.Util = {};

  /*
     PicTagger.Util =
      # convert an array to a javascript date object
      dateFromArray:(dateArr) ->
          [year, month, day , hour, minute, second, millisecond] = dateArr
          new Date year, month || 0, day || 0, minute || 0, second || 0, millisecond || 0
      # parse date according to given format, e.g. PicTagger.Util.parseDate("12-25-1995", "MM-DD-YYYY")
      parseDate: (dateString, format) ->
          inArray = new Array(0)
          charactersToPutInArray = /[0-9a-zA-Z]+/g
          inputParts = dateString.match(charactersToPutInArray)
          formatParts = format.match(charactersToPutInArray)
          isPm = false
          
          addTime = (format, input) ->
              switch format
                  # MONTH
                  when 'M', 'MM'
                      inArray[1] = Math.floor(input) - 1;
                  # DAY
                  when 'D','DD','DDD','DDDD'
                      inArray[2] = Math.floor(input)
                  # YEAR
                  when 'YY'
                      input = Math.floor(input);
                      inArray[0] = input + (input > 70 ? 1900 : 2000)
                  when 'YYYY'
                      inArray[0] = Math.floor(input)
                  # AM/PM
                  when 'a','A'
                      isPm = true if input.toLowerCase() is 'pm'
                  # 24 hour
                  when 'H','HH','h','hh'
                      inArray[3] = Math.floor(input)
                  # second
                  when 's','ss'
                      inArray[5] = Math.floor(input)
                              
          for part, i in formatParts
              addTime(part, inputParts[i])
              
          if isPm and inArray[3] < 12
              inArray[3] += 12
              
          @dateFromArray(inArray)
  */

  "use strict";

  IniParser = (function() {

    IniParser._pathTo = function() {
      var current_key, current_value, found, key, keys, path, quevedo_mode, target, _i, _j, _len;
      target = arguments[0], keys = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), quevedo_mode = arguments[_i++];
      path = [];
      for (_j = 0, _len = keys.length; _j < _len; _j++) {
        key = keys[_j];
        key = key.toString();
        found = false;
        for (current_key in target) {
          if (!__hasProp.call(target, current_key)) continue;
          current_value = target[current_key];
          if (key.toLowerCase() === current_key.toLowerCase()) {
            found = true;
            path.push(current_key);
            target = current_value;
            break;
          }
        }
        if (!found) {
          if (quevedo_mode) {
            path.push(key);
            target[key] = {};
            target = target[key];
          } else {
            return;
          }
        }
      }
      return path;
    };

    IniParser._getPathValue = function() {
      var key, keys, paths, target, _i, _len;
      target = arguments[0], keys = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      paths = this._pathTo.apply(this, [target].concat(__slice.call(keys), [false]));
      if (!paths) return;
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        key = paths[_i];
        target = target[key];
      }
      return target;
    };

    IniParser._setPathValue = function() {
      var key, keys, paths, target, value, _i, _j, _len, _ref;
      target = arguments[0], keys = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), value = arguments[_i++];
      paths = this._pathTo.apply(this, [target].concat(__slice.call(keys), [true]));
      if (!paths) return;
      _ref = paths.slice(0, -1);
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        key = _ref[_j];
        target = target[key];
      }
      return target[paths.pop()] = value;
    };

    function IniParser(string) {
      var input, line, matches, section, _base, _i, _len;
      this.$ = this.constructor;
      this.contents = {};
      if (!string) return;
      input = string.split(/\r?\n/);
      input = input.filter(function(line) {
        return line.search(/^\s*$/) === -1;
      });
      input = input.filter(function(line) {
        return line.search(/^\s*;/) === -1;
      });
      for (_i = 0, _len = input.length; _i < _len; _i++) {
        line = input[_i];
        matches = line.match(/^\[(.+)\]$/);
        if (matches) {
          section = matches[1];
          if ((_base = this.contents)[section] == null) _base[section] = {};
        } else {
          matches = line.match(/^\s*(.+?)=\s*["']?(.+?)['"]?\s*$/);
          if (matches && matches[1]) {
            this.contents[section][matches[1]] = matches[2];
          }
        }
      }
    }

    IniParser.prototype.hasSection = function(section) {
      return !!this.$._pathTo(this.contents, section, false);
    };

    IniParser.prototype.hasProperty = function(section, prop) {
      return !!this.$._pathTo(this.contents, section, prop, false);
    };

    IniParser.prototype.get = function(section, property) {
      return this.$._getPathValue(this.contents, section, property);
    };

    IniParser.prototype.set = function(section, property, value) {
      return this.$._setPathValue(this.contents, section, property, value);
    };

    IniParser.prototype.getPath = function(path) {
      return this.get.apply(this, /^\[(.+)\]:(.+)$/.exec(path).slice(1, 3));
    };

    IniParser.prototype.setPath = function(path, value) {
      return this.set.apply(this, __slice.call(/^\[(.+)\]:(.+)$/.exec(path).slice(1, 3)).concat([value]));
    };

    IniParser.prototype.unset = function(section, property) {
      if (!property) {
        property = section;
        section = this.contents;
      } else {
        section = this.$._getPathValue(this.contents, section);
        if (!section) return;
      }
      property = this.$._pathTo(section, property, false);
      if (!property) return;
      return delete section[property];
    };

    IniParser.prototype.sections = function() {
      var section, _ref, _results;
      _ref = this.contents;
      _results = [];
      for (section in _ref) {
        if (!__hasProp.call(_ref, section)) continue;
        _results.push(section);
      }
      return _results;
    };

    IniParser.prototype.properties = function(section) {
      var name;
      if (!this.hasSection(section)) return;
      return (function() {
        var _ref, _results;
        _ref = this.$._getPathValue(this.contents, section);
        _results = [];
        for (name in _ref) {
          if (!__hasProp.call(_ref, name)) continue;
          _results.push(name);
        }
        return _results;
      }).call(this);
    };

    IniParser.prototype.toString = function(section, property, include_value) {
      var name, path, properties, string, value, _ref, _ref2;
      if (include_value == null) include_value = true;
      if (section != null) {
        if (property != null) {
          path = this.$._pathTo(this.contents, section, property, false);
          if (include_value) {
            value = this.$._getPathValue(this.contents, section, property);
            return "[" + path[0] + "]:" + path[1] + "=" + value;
          } else {
            return "[" + path[0] + "]:" + path[1];
          }
        } else {
          string = [];
          string.push("[" + section + "]");
          _ref = this.$._getPathValue(this.contents, section);
          for (name in _ref) {
            if (!__hasProp.call(_ref, name)) continue;
            value = _ref[name];
            string.push("" + name + "=" + value);
          }
          string.push("");
        }
        return string.join("\n");
      } else {
        string = [];
        _ref2 = this.contents;
        for (section in _ref2) {
          if (!__hasProp.call(_ref2, section)) continue;
          properties = _ref2[section];
          string.push("[" + section + "]");
          for (name in properties) {
            if (!__hasProp.call(properties, name)) continue;
            value = properties[name];
            string.push("" + name + "=" + value);
          }
          string.push("");
        }
        return string.join("\n");
      }
    };

    return IniParser;

  })();

  /*
  ini = new IniParser """
  [Launch]
  ProgramExecutable=netbeans\\bin\\netbeans.exe
  CommandLineArguments=--userdir "%PAL:DataDir%\\settings\\.netbeans\\6.9" -J-Dplugin.manager.install.global=true --jdkhome "%JAVA_HOME%"
  LaunchAppAfterSplash=true
  
  [Activate]
  Java=require
  """
  */

  PicTagger.Util.IniParser = IniParser;

  PicTagger.Module = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref2;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref2 = name.split('.');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      item = _ref2[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };

}).call(this);
