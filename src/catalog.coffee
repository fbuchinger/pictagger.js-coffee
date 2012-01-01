

PicTagger.Catalog = class
    @fromJSON: (jsonConfig) ->
        return "should return a new pictagger catalog from a json config"
    
    constructor: (@options) ->
        sources = @options.sources || []
        taggers = @options.taggers || []
        @taggers = []
        @sources = []
        @keywordTags = []
        @photos = new PicTagger.Photos
        
        for taggerInst in taggers
            @taggers.push taggerInst
               
        for source in sources
            if PicTagger.Sources[source]
                sourceInst = new PicTagger.Sources[source](options)
            else
                sourceInst = source
            @sources.push sourceInst
            
        # async read of all configured sources
        @readSources()
        
    ###
        merge the data collected from different sources
        using the specified id key (which must be present in all sourcetags)
        returns a backbone collection of all sources as a result
    ###
    mergeSources: (sources, idTagKey) ->
        # desc sort by photo number of source
        sources = sources.sort  (a,b) -> b.length - a.length
        mergedSources = {}
        for source in sources
            for photo in source.getPhotos()
                photoId = sTag.value for sTag in photo when sTag.id is idTagKey
                console.log photoId
                mergedSources[photoId] ?= []
                mergedSources[photoId] = mergedSources[photoId].concat (photo)
        mergedSources
        
        
    
    readSources: () ->
        asyncReadTasks = []
        for source in @sources
            # asyncReadTasks.push $.when(source.read()).done =>
            asyncReadTasks.push source.read()
                # TODO: merge sourcetags from different sources using some identifier (e.g. filename)
                
        # http://stackoverflow.com/questions/5627284/pass-in-an-array-of-deferreds-to-when
        $.when.apply($, asyncReadTasks).then =>
            mergedSources = @mergeSources(@sources, 'FilePath')
            for photoId, photoSourceTags of mergedSources
                @photos.add ({id: photoId, sourceTags: photoSourceTags})
            @launchTaggers()
            console.log("all reading done")
    
    launchTaggers: () ->
        @photos.each (photo) =>
            for tagger in @taggers
                kwTags = tagger.launch(photo)
                photo.addKeywordTags(kwTags)
            photo.view.render()
