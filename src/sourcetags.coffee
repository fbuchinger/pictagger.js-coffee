root = exports ? this

SourceTags = root.PicTagger.SourceTags
BaseSourceTag = root.PicTagger.Base.SourceTag

###
    SourceTag as Backbone Model
###
class PicTagger.SourceTag extends Backbone.Model
    initialize: (attributes, options) ->
        attributes.name = attributes.id
        if attributes.multiple
            attributes.id = attributes.id + Math.floor(Math.random() * 1000) # pseudo-random id for multiple tags
        super attributes, options
            
    validate: (value) ->
        switch @get('type')
            when "date" then _.isDate value
            when "integer", "float" then _.isNumber value
            when "boolean" then _.isBoolean value
            else _.isString value
        
    convert: (raw_value) ->
        raw_value

class PicTagger.SourceTags extends Backbone.Collection
    model: PicTagger.SourceTag

class PicTagger.SourcetagView extends Backbone.View
    tagName: 'li'
    className: 'pictagger-sourcetag'
    initialize: ->
        # @model.bind('change', @render, @)
        @defaultTemplateStr = '''
            <%= id %>, <%= value %>, <%= raw_value %>
        '''
        @template = _.template(@model.get('template') || @defaultTemplateStr)
    render: () ->
        $(@el).html(@template(@model.toJSON()))
        @

###
    SourceTags are specified in JSON-Schema form
###     
PicTagger.SourceTagPresets =
    FilePath:
        type: 'string'
        description: 'relative path to the original photo file'
    DatetimeTaken:
        type: 'string'
        description: 'Date and time at which the photo was taken'
    ProcessingSoftware:
        type: 'string'
        description: 'The name and version of the software used to post-process the picture'
    Orientation:
        type: 'integer'
        description: 'rotation of the image in degrees clockwise'
    CamMake:
        type: 'string'
        description: 'name of the camera manufacturer'
        ###
        validate: (modelName) ->
            manufacturers = 'apple canon nikon olympus nokia sonyerricson hewlett-packard pentax casio'.split(' ')
            modelName.toLowerCase in manufacturers
        ###
    CamModel:
        type: 'string'
        description: 'name of the camera model'
    LensID:
        type: 'string'
        description: 'The name and properties of the used lens'
    FlashUsed:
        type: 'boolean'
        description: 'Tells weather flash was used or not'
    FlashModel:
        type: 'string'
        description: 'The Model of the flash device if available'
    FaceBox:
        type: 'object'
        template: ' <%= id %>, <%= value.toSource() %>, <%= raw_value %>'
    Edited:
        type: 'boolean'
        description: 'if the photo was edited or not'
    ThumbnailURL:
        type: 'string'
        description: 'relative url to the thumbnail of the image'
        template: '<div class="pt-photothumbnail"><img src="<%= value %>" /></div>'
    