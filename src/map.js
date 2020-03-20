// for neighborhood map
// code adapted from example
// https://bl.ocks.org/shimizu/61e271a44f9fb832b272417c0bc853a5
import * as d3 from 'd3'
import {rank, display_rank} from './bar_charts.js'


// json is geography data, data is community data
function drawMap(json, data, no_school) {
    var width = 400,
        height = 600;

    var center = d3.geoCentroid(json)
    var scale = 150;
    var projection = d3.geoMercator()
              .scale(scale)
              .center(center);
    var path = d3.geoPath().projection(projection);

    var bounds = path.bounds(json);
    var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
    var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
    var scale = (hscale < vscale) ? hscale : vscale;

    var projection = d3.geoMercator()
                       .center(center)
                       .scale(scale * 0.85)
                       .translate([210,320]);

    var path = d3.geoPath().projection(projection);

    var svg = d3.select("#map-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr('class', 'map')
      .append('g')
      .attr('class', 'map');

    // tooltip
    var div = d3.select("#map-container")
      .append("div")
      .attr("class", "toolTip")
      .style("opacity", 0);

    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "area")
        .attr("id", function(d){ return d.properties.slug; })
        .style("fill", "lightgray")
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity",0.8)

        // events
        .on("mouseover", function(d){
          d3.select("h2").text(d.properties.name);
          d3.select(this).style("fill", "#E2856E");
        })

        .on("mouseout", function(d){
          // if there is an area clicked, return to clicked name
          if (d3.selectAll(".area.highlighted").size() !== 0) {
          d3.select("h2").html(d3.select("#clicked-area").html())
          } else {
          // otherwise reset 
          d3.select("h2").text("")
        }
          d3.select(this).style("fill", "lightgray");
        })

        .on('click', function(d) {

        // click on already highlighted area
        if (d3.select(d3.event.target).classed('highlighted')) {
          d3.select("h2").text("");
          d3.select(".app-title #clicked-area").text("")
          d3.selectAll("#" + d3.event.target.id).classed("highlighted", false);
          d3.selectAll(".bar").classed("unhighlighted", false);
          d3.select(".app-title #ranked-by").text("Ranked by...");          

        // click on unhighlighted area
        } else { 
          // clear canvas
          d3.selectAll(".bar").classed("highlighted", false);
          d3.selectAll(".bar").classed("unhighlighted", false);
          d3.selectAll(".area").classed("highlighted",false);  
          // highlight new
          d3.selectAll(".bar").classed("unhighlighted", true);        
          d3.selectAll("#" + d3.event.target.id).classed("highlighted", true);
          
          if (no_school.includes(d.properties.slug)) {
            d3.select("h2").html(d.properties.name + 
                                "<span style='color:#43464B'> does not have CPS high schools</span>")
            d3.select(".app-title #clicked-area").text(d.properties.name + " ");
            d3.select(".app-title #ranked-by").text("Does Not Have CPS High Schools");
          } else {
            d3.select("h2").text(d.properties.name)
            d3.select(".app-title #clicked-area").text(d.properties.name + " ");
            d3.select(".app-title #ranked-by").text("Ranked by...");
          //display rank
            var area = data.filter(area => area.slug === d.properties.slug)[0]
            display_rank(area)
          }
        } 
      })
    };
      
export function map(value, data, no_school){
  d3.json("../data/geography.geojson").then(function(json){ return drawMap(json, data, no_school); }) 
};
