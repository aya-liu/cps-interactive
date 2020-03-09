// example of how to export functions
// this particular util only doubles a value so it shouldn't be too useful
import * as d3 from 'd3'

// load data
var community_json = require("../data/community_and_schools.json");
var raw_data = JSON.parse(community_json)
raw_data = raw_data.filter(d => d.avg_access != 'No Schools');
var format_pct = d3.format(".1f");
var format_cnt = d3.format(".0f");
var tooltip_dur = 450
var margin = {top: 50, right: 90, bottom: 50, left: 150};
var width = 600 - margin.left - margin.right;
var height = 1000 - margin.top - margin.bottom;

export function counsel_chart() {
  console.log("counsel")
  d3.select("#counselor-svg").remove()
  var value = "avg_access"
  var text = "Number of Students per Full Time Counselor"
  var data = rank(raw_data, value)
  console.log(data.length)


  // draw chart
  var svg = d3.select("#counselor-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "counselor-svg")
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

  // tooltip
  var div = d3.select("#counselor-chart")
      .append("div")
      .attr("class", "toolTip")
      .style("opacity", 0);

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

  // set up rank text
  svg.append("text")
    .attr("id", "rank-text")
    .attr("transform", "translate(" + 0.7*width + "," + 0.05*height + ")") 

  // set up title
  svg.append("text")
    .attr("id", "chart-title")
    .attr("x", -110)
    .attr("y", -35)
    .text('Number of Students per CPS High School Counselor')

  // draw bars
  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .classed("bar", true) 
      .classed("counselor-bar", true)
      .attr("id", function(d){ return d.slug; })
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .attr("y", function (d) { return yScale(d.name); })
      .attr("width", function(d){ return xScale(d[value]); })

      // tooltip
      .on("mouseover", function(d){
      // Replace hard coded vals (50, 90) with 50% of the tooltip wioth and height + a top buffer
              div.transition()
                 .duration(tooltip_dur)
                 .style("opacity", .9); 
              var tooltip_text = (d.name)
                + tooltip_labelhtml(text, d[value])
                + "<br><span>"
                + "Rank: "
                + (d.counsel_rank)
                + "</span>"
              div.html(tooltip_text)           
                .style("left", d3.event.pageX - 90 + "px")
                .style("top", d3.event.pageY - 75 + "px")
                .style("display", "inline-block")
        })
      .on("mouseout", function(d){ 
        div.transition()
          .duration(tooltip_dur)
          .style("opacity", 0);
        })

      // click event
      .on('click', function() {
      // if click on already highlighted bar, restore bars
      if (d3.select(d3.event.target).classed('highlighted')) {
        restore();
      } else {
        highlight(d3.event.target)
        display_rank(data, d3.event.target)
      }
    });
  };


export function ind_chart(value, text) {
  console.log("ind:" + value)
  d3.select("#indicator-svg").remove()

  var data = rank(raw_data, value)

  // draw chart
  var svg = d3.select("#indicator-chart")
    .append("svg")
    .attr("id", "indicator-svg")
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

  // tooltip
  var div = d3.select("#indicator-chart")
    .append("div")
    .attr("class", "toolTip")
    .style("opacity", 0);

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

  // set up rank text
  svg.append("text")
    .attr("id", "rank-text")
    .attr("transform", "translate(" + 0.7*width + "," + 0.05*height + ")") 

  // set up title
  svg.append("text")
    .attr("id", "chart-title")
    .attr("x", -110)
    .attr("y", -35)
    .text(text)    

  // draw bars
  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("id", function(d){ return d.slug; })
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .attr("y", function (d) { return yScale(d.name); })
      .attr("width", function(d){ return xScale(d[value]); })

      .on("mouseover", function(d){
      // Replace hard coded vals (50, 90) with 50% of the tooltip wioth and height + a top buffer
              div.transition()
                 .duration(tooltip_dur)
                 .style("opacity", .9); 
              var tooltip_text = (d.name)
                + tooltip_labelhtml(text, d[value])
                + "<br><span>"
                + "Rank: "
                + (d.ind_rank)
                + "</span>"
              div.html(tooltip_text)        
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 75 + "px")
                .style("display", "inline-block")
        })
      .on("mouseout", function(d){ 
        div.transition()
          .duration(tooltip_dur)
          .style("opacity", 0);}
      )
      .on('click', function() {
            // if click on already highlighted bar, restore bars
            if (d3.select(d3.event.target).classed('highlighted')) {
              restore();
            } else {
              highlight(d3.event.target);
              display_rank(data, d3.event.target)
            }
          });
    };


function tooltip_labelhtml(text, dvalue) {
  if ((text === "Number of Students per Full Time Counselor") ||
      (text === "Economic Hardship Index")) {
    var labelhtml = "<br><span>" + text + ": " + format_cnt(Number(dvalue))
                + "</span>"
  } else {
    var labelhtml = "<br><span>" 
                + text
                + ": "
                + format_pct(Number(dvalue))
                + "% </span>"
  }
  return labelhtml

}


function rank(raw_data, value){
  var data = raw_data.slice(0)

  // sort
  data.sort(function(a, b){
    return Number(a[value]) - Number(b[value]);
  }).reverse()

  // rank
  if (value === "avg_access"){
    var label="counsel_rank"
  } else {
  var label = "ind_rank" }

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



function highlight(target){
  console.log('highlight')
  d3.selectAll(".bar")
    //clear canvas
    .classed("highlighted", false)
    .classed("unhighlighted", true)
  d3.selectAll("#" + target.id)
    .classed("unhighlighted", false)
    .classed("highlighted", true)

}

function restore(){
  console.log('restore')
  d3.selectAll(".bar").classed("highlighted", false)
  d3.selectAll(".bar").classed("unhighlighted", false)
  d3.selectAll("#rank-text").text("")
}

function display_rank(data, target){
  var slug = target.id;
  var row = data.find(d => d.slug === slug);
  var chart_id = target.parentNode.parentNode.parentNode.id;

  d3.selectAll("#indicator-chart #rank-text")
    .text("Rank: " +  row.ind_rank)
  d3.selectAll("#counselor-chart #rank-text")
    .text("Rank: " +  row.counsel_rank)


}

// code source:
// https://bl.ocks.org/guypursey/f47d8cd11a8ff24854305505dbbd8c07
function wrap(text, width) {
  console.log('wrap')
  console.log(text)
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  })
}




