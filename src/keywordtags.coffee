class PicTagger.KeywordTag extends Backbone.Model
        
class PicTagger.KeywordTags extends Backbone.Collection
    model: PicTagger.KeywordTag
    
class PicTagger.KeywordView extends Backbone.View
    tagName: 'li'
    className: 'pictagger-keywordtag'
    events: {
        "click":  "clickKeywordTag",
    }
    clickKeywordTag: ->
        console.log arguments, this
        alert "You clicked the keyword tag:" + @model.get('value');
    
    initialize: ->
        # @model.bind('change', @render, @)
        @template = _.template('''
           <!-- <%= tagger %>, <%= predicate %>,--> <%= value %>
        ''')
    render: () ->
        $(@el).html(@template(@model.toJSON()))
        @