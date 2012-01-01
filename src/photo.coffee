class PicTagger.Photo extends Backbone.Model
    initialize: (attributes, options)->
        @sourceTags = new PicTagger.SourceTags
        @keywordTags = new PicTagger.KeywordTags
        @view = new PicTagger.PhotoView({model: @})
        if (attributes.sourceTags)
            @addSourceTags(attributes.sourceTags)
            
    addSourceTags: (tagsArr) ->
        for tag in tagsArr
            @sourceTags.add(tag) unless @sourceTags.get(tag.id) # TODO: allow the addition of tags that occur multiple times per foto, e.g. face tags
        @trigger('change',@)
        
    addKeywordTags: (tagsArr) ->
        @keywordTags.add(tagsArr)
        @view.render()
        
    getThumbnailUrl: () ->
        targetTag = @sourceTags.find (sourceTag) -> sourceTag.get('id') is 'ThumbnailURL'
        targetTag?.get('value')
        
class PicTagger.Photos extends Backbone.Collection
    model: PicTagger.Photo
    url: '/photo'
    
class PicTagger.PhotoView extends Backbone.View
    tagName: 'div'
    className: 'pt-photo'
    template: _.template(''' 
        <div class="pt-photo-header">
            <h2><%= id %></h2>
        </div>
        <div class="pt-photo-thumbnail">
            <img src="<%= thumbnailUrl %>"/>
        </div>
        <div class="pt-photo-tags">
            <div class="pt-photo-keywordtags">
                <h2>KeywordTags</h2>
            </div>
            <div class="pt-photo-sourcetags">
                <h2>SourceTags</h2>
            </div>
        </div>
        <div style="clear:left;"></div>
    ''')
    initialize: ->
        @model.bind('change', @render, @)
    
    
    renderTags: (tagCollection, tagView) ->
        $oHtml = $('<div>')
        $oHtml.append('<ul class="tag-list">')
        tagCollection.each (tag) ->
            tagview = new tagView({model: tag})
            $oHtml.find('.tag-list').append tagview.render().el
        $oHtml
        
    render: () ->
        # $(@el).html('<h2> PicTagger Photo ' + @model.id + '</h2>')
        modelData = _.extend(@model.toJSON(),{thumbnailUrl: @model.sourceTags.getThumbnailUrl()})
        $(@el).html(@template(modelData))
        # Keyword tags
        $(@el).find('.pt-photo-keywordtags').append(@renderTags(@model.keywordTags, PicTagger.KeywordView))
        # SourceTags
        $(@el).find('.pt-photo-sourcetags').append(@renderTags(@model.sourceTags, PicTagger.SourcetagView))
        $('#bb').append(@el)
        @
        