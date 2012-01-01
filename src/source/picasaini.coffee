class PicTagger.Sources.PicasaIni extends PicTagger.Base.Source
    providedTags: []
    id: 'PicasaIniSource'
        
    request: () ->
        $.get(@options.url)
        
    read: () ->
       $.when(@request()).done (metadata) =>
            @parse(metadata)

            
    parse: (metadata) ->
        @iniParser = new PicTagger.Util.IniParser(metadata)
        @photos = []
        for photo in @iniParser.sections() when photo isnt 'Contacts'
            @photos.push(@parsePhoto(photo))
        
    getPhotos: ->
        @photos
        
    createSourceTag: (id, raw_value, value) ->
        tagData = @getSourceTagPreset(id)
        _(tagData).extend({ 
            id: id,
            raw_value: raw_value,
            value: value || raw_value
        })
            
        tagData
        
    extractFaces: (tagStr) ->
    # all recognized faces are stored as bigint crop rectangles in the faces key
    # format faces=rect64(CROP_RECTANGLE*), contact_id;
    # faces=rect64(3f845bcb59418507),8e62398ebda8c1a5;rect64(9eb15e89b6b584c1),d10a8325c557b085
        faces = tagStr.split (';')
        sourceTags = []
        
        for face in faces
            [bboxRect, contactId] = face.split(',')
            bbox = bboxRect.slice(7,-1)
            sourceTag =
                id: 'FaceBox'
                value:
                    left: parseInt(bbox.slice(0,4),16) / 65536
                    top: parseInt(bbox.slice(4,8),16) / 65536
                    right: parseInt(bbox.slice(8,12),16) / 65536
                    bottom: parseInt(bbox.slice(12,16),16) / 65536
                multiple: true # allow multiple facebox tags per foto
                raw_value: face
            sourceTags.push sourceTag  
        sourceTags
        
    extractFilters: (tagStr) ->
    # TODO: interpret the filters values of the picasa.ini string
        []
        
    # TODO: return real source tags
    parsePhoto: (photoName) ->
        sourceTags = []
        sourceTags.push @createSourceTag('FilePath',photoName)
        for property in @iniParser.properties photoName
            propertyValue = @iniParser.get photoName,property
            switch property
                when 'faces'
                    sourceTags = sourceTags.concat @extractFaces  propertyValue
                when 'filters'
                    sourceTags.push  @createSourceTag('Edited','yes', true)
                when 'star'
                    sourceTags.push @createSourceTag('Starred','yes', true) if propertyValue is 'yes'
                when 'caption'
                    sourceTags.push @createSourceTag('Caption',propertyValue)
                else 1+1
        sourceTags