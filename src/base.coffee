Base = {}

# base class for all taggers
class Base.Tagger
    requires: []
    desires: []
    
    constructor: (@options) ->
    # TODO: make tagger configurable (turn off/on options)
    
    ###
        getOutputTags
        retrieve a list of tag predicates the tagger should output
    ###
    getOutputTags: () ->
        if @options.activeTags
            validTags = _(@tags).pluck('predicate')
            outputTags = oTag for oTag in @options.activeTags when oTag in validTags
        else
            outputTags = oTag.predicate for oTag in @tags when oTag.active is true
        
        outputTags
        
    # checks if the supplied sourceTags meet the requirements of the tagger
    # returns undefined otherwise
    launch: (photo) ->
        desired = []
        sourceTags = photo.sourceTags.toJSON()
        required = (sTag for sTag in sourceTags when sTag.id in @requires)
        # desired = (sourceTag for sourceTag in sourceTags when sourceTag.id in @desired)
        meetsReqs = (required.length is @requires.length)
        # prepare tagger config
        config =
            outputTags: @getOutputTags()
            
        if meetsReqs is true
            outputTags = @run.apply(@,[required, desired, config])
            for obj, i in outputTags
                outputTags[i].tagger = @id
            return outputTags
        else
            return []
        
    # main tagger function
    run: (required, desired) ->
        throw "You need to provide a run method in your tagger"
        
class Base.Source
    ###
        the source tags this format provides 
    ###
    providedTags: []
    sourceTags: []
    constructor: (@name, @options) ->
    getSourceTagPreset: (tagId) ->
        _(PicTagger.SourceTagPresets[tagId]).clone() # || throw "no source tag defined for" + tagId
        
    read: () ->
        
    
    write: () ->
    
        
        
class Base.SourceTag
    ###
        source tag is initialized with raw value
    ###
    initialize: (@raw_value) ->
        value = @convert(@raw_value)
        if (@validate(value))
            @value = value
    
    ###
        validate ()
        optional validation function for the retrieved tag value
    ###
    validate: (value) ->
        true
    
    ###
        convert ()
        converts the source_tags raw value and returns the parsed value
    ###
    convert: (raw_value) ->
        return raw_value
    
    # the raw value of the tag
    raw_value: null,
    # the value of the tag
    value: null


root = exports ? this
root.PicTagger = {
    Taggers: {},
    Sources: {},
    SourceTags: {},
    addTagger: (tagger) ->
        @Taggers[tagger.id] = tagger
    addSource: (source) ->
        @Sources[source.id] = source
}
_.extend(root.PicTagger,{Base:Base})
   
