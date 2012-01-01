class PicTagger.Sources.ExifTool extends PicTagger.Base.Source
    providedTags: ['DatetimeTaken','CamMake','CamModel','FlashUsed','FilePath']
    id: 'ExifToolSource'
    extractorMap =
        'FilePath':
            'extract': (etJson) ->
                # as pictagger doesn't support catalogs with nested directories
                # we just return the filename for now
                fnParts = etJson['FileName'].split('/')
                _.last fnParts
        'ThumbnailURL':
            'extract': (etJson) ->
                # TODO: make thumbnail prefix configurable
                fnParts = etJson['FileName'].split('/')
                [fName, fExt] = _.last(fnParts).split('.')
                'testcatalog/' + fName + '_thumb.jpg'
            'template': '<img src=" <%= value %>" />'
        'Orientation':
            'extract': (etJson) ->
                etJson['Orientation']
            'convert': (exValue) ->
                exValue.match /[0-9]+/g
                if _.isArray(exValue) then exValue[0] else 0
        'DatetimeTaken': 
            'extract':(etJson) -> 
                etJson['DateTimeOriginal'] || etJson['DateTimeCreated'] || etJson['DateTimePublished']
            'convert': (exValue) ->
                # for now just support this format: "2011:07:02 17:18:43"
                # TODO: add am/pm support
                dateparts = exValue.match(/[0-9a-zA-Z]+/g)
                [year, month, day, hour, minute, seconds] = dateparts
                new Date ~~year, ~~month - 1, ~~day, ~~hour, ~~minute, ~~seconds
        'CamMake': 
            'extract':(etJson) ->
                etJson['Make']
        'CamModel':
            'extract':(etJson) ->
                etJson['Model']
        'FlashUsed':
            'extract':(etJson) ->
                etJson['Flash']
            'convert': (exValue) ->
                'Fired' in exValue
            
    request: () ->
        $.get(@options.url)
        
    read: () ->
       $.when(@request()).done (metadata) =>
            @parse(metadata)

            
    parse: (metadata) ->
        @photos = []
        for photo in metadata
            @photos.push(@parsePhoto(photo))
        
    getPhotos: ->
        @photos
        
    # TODO: return real source tags
    parsePhoto: (photoMetadata) ->
        sourceTags = []
        for sourceTag, extractor of extractorMap
            if extractor.extract(photoMetadata)
                tagData = @getSourceTagPreset(sourceTag)
                tagData.id = sourceTag
                tagData.raw_value = extractor.extract(photoMetadata)
                tagData.value = if extractor.convert then extractor.convert(tagData.raw_value) else tagData.raw_value
                sourceTags.push (tagData)
        sourceTags
        
                
                
            