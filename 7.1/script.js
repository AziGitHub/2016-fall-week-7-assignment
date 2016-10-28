console.log('7.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:200,b:50,l:200};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

var scaleX, scaleY;

//Step 1: importing multiple datasets
d3.queue()
    .defer(d3.csv,'../data/olympic_medal_count_1900.csv',parse)
    .defer(d3.csv,'../data/olympic_medal_count_1960.csv',parse)
    .defer(d3.csv,'../data/olympic_medal_count_2012.csv',parse)
    .await(function(err,rows1900,rows1960,rows2012){

        //Draw axis
        scaleY = d3.scaleLinear()
            .domain([0,120])
            .range([h,0]);
        scaleX = d3.scaleLinear()
            .domain([0,4])
            .range([0,w]);

        //Draw axis
        var axisY = d3.axisLeft()
            .scale(scaleY)
            .tickSize(-w-200);
        var axisX = d3.axisBottom()
            .scale(scaleX)
            .ticks(5)
            .tickSize(-h);

        plot.append('g')
            .attr('class','axis axis-y')
            .attr('transform','translate(-100,0)')
            .call(axisY);
        plot.append('g').attr('class','axis axis-x')
            .attr('transform','translate(0,'+h+')')
            .call(axisX);


        draw(rows1900);


        //Step 2: implement the code to switch between three datasets
        d3.select('#year-1900').on('click', function(){
            var nodes = plot.selectAll('.country');
            nodes.remove();
            draw(rows1900);
        });
        d3.select('#year-1960').on('click', function(){
            var nodes = plot.selectAll('.country');
            nodes.remove();
            draw(rows1960);
        });
        d3.select('#year-2012').on('click', function(){
            var nodes = plot.selectAll('.country');
            nodes.remove();
            draw(rows2012);
        });
    });

//Step 3: implement the enter / exit / update pattern
function draw(rows) {

    var top5 = rows.sort(function(a,b){
        return b.count - a.count;
    }).slice(0,5);

    //Represent: nodes
    var nodes = plot.selectAll('.country')
        .data(top5,function(d){return d.country;})
        .enter() //ENTER
        .append('g')
        .attr('class','country')
        .attr('transform',function(d,i){
            return 'translate('+scaleX(i)+','+scaleY(d.count)+')';
        });

     nodes
    .append('rect')
        .attr('x',0)
        .attr('y',0)
        .attr("width",40)
        .attr("height",0)
        .style('fill-opacity',.1)
        .style('stroke','black');
    nodes
         .append('text')
         .text(function(d){return d.country;});


    nodes.exit().remove();

    //Update
    var nodesTransition = nodes
        .merge(nodes) //UPDATE + ENTER
        .transition().duration(1000);
    nodesTransition.select('rect')
        .attr('height', function(d){return h-scaleY(d.count);});
}




function parse(d){
    return {
        country: d.Country,
        count: +d.count
    }
}
