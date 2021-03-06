// Colour settings
if(themeColour == 'white'){
    var metric = '#a9a9a9';
    var backColor = '#7d7d7d';
    var pieTrack = metric;
    var pieBar = backColor;
}
else {
    //default to black
    var backColor = '#4f4f4f';
    var metric = '#f2f2f2';
    var pieTrack = backColor;
    var pieBar = metric;
}

// Stores
var cf_rPs = [];

/*
 *	Create single value pie charts
 */

function rSVP(element, options){
    // Call the chart generation on window resize
    $(window).on('resize', generateChart);

    var container = $(element);

    var ret = {};

    ret.generateChart = generateChart;

    ret.destroy = function destroy(){
        $(window).off('resize', generateChart);
        $('canvas', $(container)).remove();
    };

    // Create the chart
    function generateChart(evt){
        if (evt && evt.target !== window) {
            return;
        }
        // Resize when width is 768 or greater
        // Remove any existing canvas
        if($('canvas', $(container)).length){
            $.when($('canvas', $(container)).remove()).then(addChart());
        } else{
            addChart();
        }

        function addChart(){
            var $chart  = container.find('.chart');
            //Setup options
            var rsvpOpt = {
                barColor: pieBar,
                trackColor: pieTrack,
                scaleColor: false,
                lineWidth: 15,
                lineCap: 'butt',
                size: 100
            };

            var width = container.width();
            var height = container.height();
            var size = Math.min(width, height);

            rsvpOpt.size = size;

            var lineWidth = Math.max(0, ((size - 215) / 285) * 20) + 10;
            lineWidth = Math.min(lineWidth, 45);

            rsvpOpt.lineWidth = lineWidth;

            var textWidth = size - 2 * lineWidth - 20;
            var $metrics = $(element).find('.metrics');
            var $metricSmall = $(element).find('.metrics .metric-small');
            $metrics.width(textWidth).css('margin-right', -textWidth / 2);
//          $metricSmall.css('margin-bottom', $metrics.find('.metric').css('width') * (-1)).css('margin-left', '5px');

            //set chart centered horizontally and vertically
            var marginTop = ($(element).height() - $chart.width())/2;
            marginTop = marginTop>0? marginTop : 0;
            $chart.css('margin-top', marginTop);

            // Create and store the chart
            ret.chart = new EasyPieChart($chart.get(0), rsvpOpt);
        }
    }

    // Run once on first load
    generateChart();

    return ret;
}


/*
 *	Shorten large numbers
 */
function prettyNumber (number) {
    var prettyNumberSuffixes = ["", "K", "M", "bn", "tr"];
    var addCommas = function (nStr){
        var x = '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x)) {
            x = x.replace(rgx, '$1' + ',' + '$2');
        }
        return x;
    }
    var prettyNumber_rec = function (number, i) {
        if (i === prettyNumberSuffixes.length) {
            return addCommas(Math.round(number*1000)) + prettyNumberSuffixes[i-1];
        }
        if (number / 1000 >= 1) { // 1000+
            return prettyNumber_rec(number / 1000, ++i);
        }
        else {
            var decimals = number - Math.floor(number);
            if (decimals !== 0) {
                if (number >= 10) { // 10 - 100
                    number = Math.floor(number) + Math.round(decimals*10) / 10 + '';
                    number = number.replace(/(.*\..).*$/, '$1');
                }
                else { // 0 - 10
                    number = Math.floor(number) + Math.round(decimals*100) / 100 + '';
                    number = number.replace(/(.*\...).*$/, '$1');
                }
                return number + prettyNumberSuffixes[i];
            }
            else {
                return Math.floor(number) + prettyNumberSuffixes[i];
            }
        }
    };
    return prettyNumber_rec(number, 0);
}
