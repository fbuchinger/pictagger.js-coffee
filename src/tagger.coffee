Tagger = {}

class Tagger.DateTime extends PicTagger.Base.Tagger
    requires: ['DatetimeTaken']
    tags: [{
            predicate: 'weekday',
            label: 'Weekday',
            description: 'the day of the week the picture was taken on',
            active: true
           },{
            predicate: 'day',
            label: 'Day',
            description: 'the day of the month the picture was taken on',
            active: true
           },{
            predicate: 'daytime',
            label: 'Daytime',
            description: 'the daytime (morning|noon|afternoon|evening|night) in which the picture was taken',
            active: true
           },{
            predicate: 'calweek',
            label: 'Calendar Week',
            description: 'the calendar week in which the picture was taken',
            active: true
           },{
            predicate: 'month',
            label: 'Month',
            description: 'the month of the week the picture was taken on',
            active: true
           },{
            predicate: 'year',
            label: 'Year',
            description: 'the year the picture was taken in',
            active: true
          },{
            predicate: 'season',
            label: 'Season',
            description: 'the season the picture was taken in',
            active: true
        }]
        
    getDay: (date) ->
        day = date.getDate()
        if day < 10 then '0' + day else day
        
    getMonth: (date) ->
        months = ['january', 'february', 'march','april','may','june', 'july', 'august','september','october','november','december']
        months[date.getMonth()]
        
    getWeekday: (date) ->
        weekdays = ['sunday', 'monday', 'tuesday','wednesday','thursday','friday', 'saturday']
        weekdays[date.getDay()]
        
    getDaytime: (date) ->
        hours = date.getHours()
        daytimes = ['night', 'morning','noon', 'afternoon', 'evening', 'night']
        daytimeBegins = [6,11,13,18,21]
        daytimes[_(daytimeBegins).sortedIndex(hours)]
        
    getCalweek: (date) ->
        a = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 5);
        b = new Date(a.getFullYear(), 0, 4);
        return ~~ ((a - b) / 864e5 / 7 + 1.5)
        
    getSeason: (date) ->
        dYear = date.getFullYear();
        seasonStarts = [
             new Date(dYear, 2, 20) # SPRING
             new Date(dYear, 5, 21) # SUMMER
             new Date(dYear, 8, 22) # AUTUMN
             new Date(dYear, 11, 21) # WINTER
        ]
        seasons = ['winter','spring','summer','autumn','winter'];
        return seasons[_(seasonStarts).sortedIndex(date)]
        
    run: (required, desired, config) ->
        [photo_taken] = required
        photo_taken = photo_taken.value
        allTags = [
            { predicate: 'weekday', value: @getWeekday(photo_taken)},
            { predicate: 'day', value: 'day' + @getDay(photo_taken)},
            { predicate: 'month', value: @getMonth(photo_taken)},
            { predicate: 'season', value: @getSeason(photo_taken)},
            { predicate: 'calweek', value: 'cw' + @getCalweek(photo_taken)},
            { predicate: 'daytime', value: @getDaytime(photo_taken)}
        ]
        
        output = (tag for tag in allTags when tag.predicate in config.outputTags)
        output

# TODO: check syntax like
#  PicTagger.addTagger('DateTime', Tagger.DateTime)
        
root = exports ? this
_.extend(root.PicTagger,{Tagger:Tagger})