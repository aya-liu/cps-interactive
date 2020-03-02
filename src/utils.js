// example of how to export functions
// this particular util only doubles a value so it shouldn't be too useful
import * as d3 from "d3";

// load data
var community_json = require("../data/community_and_schools.json");
var raw_data = JSON.parse(community_json);
var format = d3.format(".1f");



export function counsel_chart() {
  console.log("counsel--")
  var value = "pct_counsel"
  var text = "CPS High Schools with Counselors"

  var data = sort_and_rank(raw_data, "pct_counsel")
  console.log(data)
  var margin = {top: 20, right: 120, bottom: 70, left: 20};
  var width = 400 - margin.left - margin.right;
  var height = 1100 - margin.top - margin.bottom;


  var tooltip = d3.select("#counselor-chart")
                .append("div")
                .attr("class", "toolTip");

  // draw chart
  var svg = d3.select("#counselor-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data.map(function (d) { return Number(d[value])  ; }))]);

  var yScale = d3.scaleBand()
    .range([height, 0])
    .domain(data.map(function(d) { return d.name; }))
    .paddingInner(0.15);

  // draw grid
  svg.append("g")     
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisTop(xScale)
          .ticks(10)
          .tickSize(height)
          .tickFormat("")
      )

  // draw axis
  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisTop(xScale));

  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale).tickFormat(""))
      .attr("transform", "translate(0,0)")


  // draw bars
  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .style("fill", "grey")
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .attr("y", function (d) { return yScale(d.name); })
      .attr("width", function(d){ return xScale(d[value]); })

      // tooltip
      .on("mousemove", function(d){
      // Replace hard coded vals (50, 90) with 50% of the tooltip wioth and height + a top buffer
            tooltip
              .style("left", d3.event.pageX - 120 + "px")
              .style("top", d3.event.pageY - 90 + "px")
              .style("display", "inline-block")
              .html((d.name)
                + tooltip_labelhtml(text, d[value])
                + "<br><span>"
                + "Rank: "
                + (d.counsel_rank)
                + "</span>"
                );
        })
      .on("mouseout", function(d){ 
        tooltip.style("display", "none");});
    };

export function ind_chart(value, text) {
  console.log("ind:" + value)
  d3.select("svg").remove()

  var data = sort_and_rank(raw_data, value)
  var margin = {top: 20, right: 20, bottom: 70, left: 120};
  var width = 400 - margin.left - margin.right;
  var height = 1100 - margin.top - margin.bottom;

  var tooltip = d3.select("#indicator-chart")
                .append("div")
                .attr("class", "toolTip");

  // draw chart
  var svg = d3.select("#indicator-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
  
  var xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data.map(function (d) { return Number(d[value])  ; }))]);

  var yScale = d3.scaleBand()
    .range([height, 0])
    .domain(data.map(function(d) { return d.name; }))
    .paddingInner(0.15);

  // draw grid
  svg.append("g")     
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisTop(xScale)
          .ticks(10)
          .tickSize(height)
          .tickFormat("")
      )

  // draw axis
  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisTop(xScale));

  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale))
      .attr("transform", "translate(0,0)")


  // draw bars
  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .attr("y", function (d) { return yScale(d.name); })
      .attr("width", function(d){ return xScale(d[value]); })

      // tooltip
      .on("mousemove", function(d){
      // Replace hard coded vals (50, 90) with 50% of the tooltip wioth and height + a top buffer
            tooltip
              .style("left", d3.event.pageX - 120 + "px")
              .style("top", d3.event.pageY - 90 + "px")
              .style("display", "inline-block")
              .html((d.name) 
                + tooltip_labelhtml(text, d[value])
                + "<br><span>"
                + "Rank: "
                + (d.ind_rank)
                + "</span>"
                );
        })
      .on("mouseout", function(d){ 
        tooltip.style("display", "none");});
    };

function tooltip_labelhtml(text, dvalue) {
  if (text === "Economic Hardship Index") {
    var labelhtml = "<br><span>" 
                + text
                + ": "
                + Number(dvalue)
                + "</span>"
  } else if (text === "CPS High Schools with Counselors") {
    var labelhtml = "<br><span>" 
                + text
                + ": "
                + format(100*Number(dvalue))
                + "% </span>"
  } else {
    var labelhtml = "<br><span>" 
                + text
                + ": "
                + format(Number(dvalue))
                + "% </span>"
  }
  return labelhtml

}


function sort_and_rank(raw_data, value){
  var data = raw_data.slice(0)

  data.sort(function(a, b){
    return Number(a[value]) - Number(b[value]);
  })

  if (value === "pct_counsel"){
    var label="counsel_rank"
  } else { label = "ind_rank" }

  data[data.length-1][label] = 1
  for (let i = data.length-2; i >= 0; i--) {
    var prev_val = Number(data[i+1][value]);
    var prev_rank = data[i+1][label];
    if (Number(data[i][value]) === prev_val) {
      data[i][label] = prev_rank;
    }
    else {
      data[i][label] = data.length - i
    };
  };
  return data;
};