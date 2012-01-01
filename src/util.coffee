PicTagger.Util = {}

###
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
###

"use strict"
## INI file parser
## Copyright © 2011 Aluísio Augusto Silva Gonçalves
## This code is free software, licensed under the terms of the Artistic License 2.0.

class IniParser
	@_pathTo: (target, keys..., quevedo_mode) ->
		path = []
		for key in keys
			key = key.toString()
			found = false
			for own current_key, current_value of target
				if key.toLowerCase() == current_key.toLowerCase()
					found = true
					path.push current_key
					target = current_value
					break
			if not found # Icso non ecziste!
				if quevedo_mode
					path.push key
					target[key] = {}
					target = target[key]
				else
					return undefined
		return path
	@_getPathValue: (target, keys...) ->
		paths = @_pathTo(target, keys..., false)
		return undefined if not paths
		target = target[key] for key in paths
		return target
	@_setPathValue: (target, keys..., value) ->
		paths = @_pathTo(target, keys..., true)
		return if not paths
		target = target[key] for key in paths[...-1]
		target[paths.pop()] = value

	constructor: (string) ->
		@$ = @.constructor
		@contents = {}
		return if not string
		# Split the input lines
		input = string.split(/\r?\n/)
		# Filter empty and comment lines
		input = input.filter((line) -> line.search(/^\s*$/) is -1)
		input = input.filter((line) -> line.search(/^\s*;/) is -1)

		# Parse each remaining line
		for line in input
			matches = line.match(/^\[(.+)\]$/)
			if matches
				section = matches[1]
				@contents[section] ?= {}
			else
				matches = line.match(/^\s*(.+?)=\s*["']?(.+?)['"]?\s*$/)
				if matches and matches[1]
					@contents[section][matches[1]] = matches[2]

	hasSection: (section) -> !!@$._pathTo(@contents, section, false)
	hasProperty: (section, prop) ->	!!@$._pathTo(@contents, section, prop, false)

	get: (section, property) -> @$._getPathValue(@contents, section, property)
	set: (section, property, value) -> @$._setPathValue(@contents, section, property, value)
	getPath: (path) -> @get(/^\[(.+)\]:(.+)$/.exec(path)[1..2]...)
	setPath: (path, value) -> @set(/^\[(.+)\]:(.+)$/.exec(path)[1..2]..., value)
	unset: (section, property) ->
		if not property
			property = section
			section = @contents
		else
			section = @$._getPathValue(@contents, section)
			return if not section
		property = @$._pathTo(section, property, false)
		return if not property
		delete section[property]

	sections: -> section for own section of @contents
	properties: (section) ->
		return undefined if not @hasSection(section)
		return (name for own name of @$._getPathValue(@contents, section))

	toString: (section, property, include_value=true) ->
		if section?
			if property?
				path = @$._pathTo(@contents, section, property, false)
				if include_value
					value = @$._getPathValue(@contents, section, property)
					return "[#{path[0]}]:#{path[1]}=#{value}"
				else
					return "[#{path[0]}]:#{path[1]}"
			else
				string = []
				string.push "[#{section}]"
				for own name, value of @$._getPathValue(@contents, section)
					string.push "#{name}=#{value}"
				string.push ""
			return string.join("\n")
		else
			string = []
			for own section, properties of @contents
				string.push "[#{section}]"
				for own name, value of properties
					string.push "#{name}=#{value}"
				string.push ""
			return string.join("\n")
###
ini = new IniParser """
[Launch]
ProgramExecutable=netbeans\\bin\\netbeans.exe
CommandLineArguments=--userdir "%PAL:DataDir%\\settings\\.netbeans\\6.9" -J-Dplugin.manager.install.global=true --jdkhome "%JAVA_HOME%"
LaunchAppAfterSplash=true

[Activate]
Java=require
"""
###

PicTagger.Util.IniParser = IniParser

PicTagger.Module = (target, name, block) ->
  [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
  top    = target
  target = target[item] or= {} for item in name.split '.'
  block target, top


