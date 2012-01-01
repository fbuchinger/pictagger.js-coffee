###
    DateTime Facts
    this module all facts related to datetime aspects
###

PicTagger.Module 'Foo.Bar', (exports) ->
    exports.CalWeekFact = 
        requires: 'DatetimeTaken'
        predicate: 'calweek'
        label: 'Calendar Week'
        description: 'the calendar week in which the picture was taken',
        active: true,
        run: (date) ->
            date = required['DatetimeTaken']
            a = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 5);
            b = new Date(a.getFullYear(), 0, 4);
            return ~~ ((a - b) / 864e5 / 7 + 1.5)
     
            
    exports.WeekdayFact =
        requires: 'DatetimeTaken'
        predicate: 'calweek'
        label: 'Weekday'
        description: 'the day of the week the picture was taken on',
        active: true,
        run: (required, desired, context) ->
            date = required['DatetimeTaken']
            a = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 5);
            b = new Date(a.getFullYear(), 0, 4);
            return ~~ ((a - b) / 864e5 / 7 + 1.5)
            

    exports.SeasonFact =
        requires: 'DatetimeTaken'
        predicate: 'season'
        label: 'season'
        description: 'the season in which the picture was taken'
        run: (required, desired, context) ->
            'bar'

    exports
          
    ###

    class Thing:
        initialize: (foo) ->
            'bar'
        
    class DateTime extends Thing:
        initialize: (date) ->
            'check'
            
    class Weekday extends DateTime:
        @specializes: (date) -> # TODO: other name like details
            days = ['sunday','monday','tuesday','wednesday','thursday','friday']
            return new Weekday(days[date.getDay()]);
        initialize: (dayname) ->
            ''

    class Duration extends Time:

    class Season extends Duration:
        @from_fact (date):
        
    class Summer extends Season:
        @from_fact (date):
    ###