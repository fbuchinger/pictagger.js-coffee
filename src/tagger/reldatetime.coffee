###
RelativeDateTagger

measures the difference from now to the datetime the picture was taken.
this time difference can be expressed in various units (day, week, year,...)
###

class PicTagger.Taggers.RelativeDateTime extends PicTagger.Base.Tagger
    @id: 'RelativeDateTime'
    id: 'RelativeDateTime'
    requires: ['DatetimeTaken']
    tags: [{
            predicate: 'daydiff',
            label: 'Day Difference',
            description: 'time difference between now and the moment the picture was taken, expressed in days',
            active: false
           },{
            predicate: 'weekdiff',
            label: 'Week Difference',
            description: 'time difference between now and the moment the picture was taken, expressed in weeks',
            active: false
           },
           {
            predicate: 'monthdiff',
            label: 'month Difference',
            description: 'time difference between now and the moment the picture was taken, expressed in months',
            active: false
           },
           {
            predicate: 'yeardiff',
            label: 'year Difference',
            description: 'time difference between now and the moment the picture was taken, expressed in years',
            active: false
           },
           {
            predicate: 'autodiff',
            label: 'Auto Difference',
            description: 'time difference between now and the moment the picture was taken, expressed in the smallest possible time unit',
            active: true
           }]
           
           run: (required, desired, config) ->
               [{ predicate: 'autodiff', value: '17days'}]
               