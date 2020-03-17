// for neighborhood map
// code adapted from example
// https://medium.com/@ivan.ha/using-d3-js-to-plot-an-interactive-map-34fbea76bd78
import * as d3 from 'd3'


var width = 400,
	height = 700;
var hover_color = ''

function mouseOverHandler(d, i) {
  d3.select(this).attr("fill", HOVER_COLOR)
}

function mouseOutHandler(d, i) {
  d3.select(this).attr("fill", color(i))
}

function clickHandler(d, i) {
  console.log('clicked')}

// prepare

var svg = d3
  .select(".container#map")
  .append("svg")
         .data(values[1])
        .enter()
        .append("circle")
        .attr("class","circles")
        .attr("cx", function(d) {return projection([d.Longitude, d.Lattitude])[0];})
        .attr("cy", function(d) {return projection([d.Longitude, d.Lattitude])[1];})
        .attr("r", "1px"),
// add labels
    svg.selectAll("text")
        .data(values[1])
        .enter()
        .append("text")
        .text(function(d) {
            return d.City;
            })
        .attr("x", function(d) {return projection([d.Longitude, d.Lattitude])[0] + 5;})
        .attr("y", function(d) {return projection([d.Longitude, d.Lattitude])[1] + 15;})
        .attr("class","labels");
areas.then(function(values){

});