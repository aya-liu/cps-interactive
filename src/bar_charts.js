// for neighborhood ranking bar charts
import * as d3 from 'd3'

/*
// load data
var community_json = require("../data/community_and_schools.json");
var raw_data = JSON.parse(community_json).filter(d => d.avg_access !== 'No Schools');

// special area slugs
var no_counselor = JSON.parse(community_json).filter(d => d.avg_access === 1600).map(d => d.slug);
var no_school = JSON.parse(community_json).filter(d => d.avg_access === 'No Schools').map(d => d.slug);
*/
// constants
var format_pct = d3.format(".1f");
var format_cnt = d3.format(",.0f");
var format_k = d3.format("~s")
var tooltip_dur = 450
var margin = {top: 80, right: 90, bottom: 50, left: 155};
var width = 600 - margin.left - margin.right;
var height = 1000 - margin.top - margin.bottom;

var indicator_info = {

  "single-parent-households": {
    "short_desc":"Percentage of householdsw with children aged 18 and under who live with one parent (2012-2016)",
    "long_desc":"Percentage of households with children aged under 18 years who live with their own single parent among all households (2012-2016).",
    "tick_format": format_cnt,
    "unit": "%"
    },

  "limited-english-proficiency": {
    "short_desc":"Percentage of population aged 5 years or older who speak English less than very well (2012-2016)",
    "long_desc": "Percentage of population aged 5 years or older who speak English less than very well among the total population aged 5 years or older (2012-2016).",
    "tick_format": format_cnt,
    "unit": "%"
    },
  "PERCENT OF HOUSING CROWDED": {
    "short_desc":"Percentage of occupied housing units with more than one person per room (2008-2012)",
    "long_desc":"Percentage of occupied housing units with more than one person per room (2008-2012).",
    "tick_format": format_cnt,
    "unit": "%"
    },
  "PERCENT HOUSEHOLDS BELOW POVERTY": {
    "short_desc":"Percentage of households living below the federal poverty level (2008-2012)",
    "long_desc":"Percentage of households living below the federal poverty level (2008-2012).",
    "tick_format": format_cnt,
    "unit": "%"
    },
  "PERCENT AGED 16+ UNEMPLOYED": {
    "short_desc":"Percentage of unemployed persons in the labor force over the age of 16 years (2008-2012)",
    "long_desc":"Percentage of persons in the labor force over the age of 16 years that are unemployed (2008-2012).",
    "tick_format": format_cnt,
    "unit": "%"
    },
  "PERCENT AGED UNDER 18 OR OVER 64": {
    "short_desc":"Percentage of persons over the age of 25 years without a high school diploma (2008-2012)",
    "long_desc":"Percentage of persons over the age of 25 years without a high school diploma (2008-2012).",
    "tick_format": format_cnt,
    "unit": "%"
    },
  "PER CAPITA INCOME ": {
    "short_desc": "Average income earned per person (2008-2012)",
    "long_desc": "Average income earned per person, calculated by the community area's total income by its total population (2008-2012).",
    "tick_format": format_k,
    "unit": "$"
    },
  "violent-crime": {
    "short_desc":"Number of reported violent crime incidents per 100,000 population (2018)",
    "long_desc": "Number of reported violent crime incidents per 100,000 population (2018). Violent crime incidents include homicide, criminal sexual assault, robbery, aggravated assault, and aggravated battery.",
    "tick_format": format_k,
    "unit": ""
    }
}


// helpers
function tooltip_labelhtml(text, dvalue) {
  if ((text === "Number of Students per Full Time Counselor") ||
      (text === "Per Capita Income Level")) {
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

export function rank(raw_data, value){
  var data = raw_data.slice(0)
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

function sort(data, value) {
  return data.sort(function(a, b){
    return Number(a[value]) - Number(b[value]);
  }).reverse()
}


function highlight(d, target){
  //clear canvas
  d3.selectAll(".bar")
    .classed("highlighted", false)
    .classed("unhighlighted", true)
  d3.selectAll(".area")
    .classed("highlighted", false)
  
  d3.selectAll("#" + target.id)
    .classed("unhighlighted", false)
    .classed("highlighted", true)
  // titles
  d3.select(".app-title #clicked-area").text(d.name + " ");
  d3.select("h2").text(d.name + " ");

}

function restore(target){
  d3.selectAll(".bar").classed("highlighted", false)
  d3.selectAll(".bar").classed("unhighlighted", false)
  d3.selectAll("#" + target.id).classed("highlighted", false)
  d3.select("#ind-rank-text").text("")
  d3.select("#counsel-rank-text").text("")
  // titles
  d3.select(".app-title #clicked-area").text("");
  d3.select("h2").text("");
}

export function display_rank(d){
  d3.select("#ind-rank-text")
    .text("Rank: " +  d.ind_rank)
  d3.selectAll("#counsel-rank-text")
    .text("Rank: " +  d.counsel_rank)
}


// main functions

export function counsel_chart(data, no_counselor) {
  var value = "avg_access"
  var text = "Number of Students per Full Time Counselor"
  data = sort(data, value)

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
    .domain([0, d3.max(data.map(function (d) {return Number(d[value]);}))]);

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
      .call(d3.axisTop(xScale)
        .tickFormat(format_k));

  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale))
      .attr("transform", "translate(0,0)")

  // set up rank text
  svg.append("text")
    .attr("id", "counsel-rank-text")
    .attr("transform", "translate(" + 0.7*width + "," + 0.05*height + ")") 

  // set up title
  svg.append("text")
    .attr("id", "chart-title")
    .attr("x", -110)
    .attr("y", -65)
    .text('CPS High School Counselor Availability')

  // set up description
  svg.append("text")
    .attr("id", "chart-desc")
    .attr("x", -110)
    .attr("y", -45)
    .text("Number of Students per CPS High School Counselor")

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
                  .style("left", d3.event.pageX - 50 + "px")
                  .style("top", d3.event.pageY - 110 + "px")
                  .style("display", "inline-block")
        })
      .on("mouseout", function(d){ 
        div.transition()
          .duration(tooltip_dur)
          .style("opacity", 0);
        })

      // click event
      .on('click', function(d) {
            // if click on already highlighted bar, restore bars
            if (d3.select(d3.event.target).classed('highlighted')) {
              restore(d3.event.target);
            } else {
              highlight(d, d3.event.target);
              display_rank(d)
            }
        });

  no_counselor.forEach(function(slug){
    svg.select(".bar.counselor-bar#"+slug)
        .attr("width", "12")
        .attr("rx", "15")
        .attr("ry", "15")
        .on("mouseover", function(d){
                div.transition()
                   .duration(tooltip_dur)
                   .style("opacity", .9); 
                var tooltip_text = (d.name)
                  + "<br><span>No Counselor Available</span>"
                  + "<br><span>"
                  + "Rank: "
                  + (d.counsel_rank)
                  + "</span>"
                div.html(tooltip_text)           
                  .style("left", d3.event.pageX - 50 + "px")
                  .style("top", d3.event.pageY - 110 + "px")
                  .style("display", "inline-block")
        })
  })
};


export function ind_chart(value, text, data) {
//  d3.select("#indicator-svg").remove()

  data = sort(data, value)

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
      .call(d3.axisTop(xScale).
        tickFormat(indicator_info[value].tick_format));

  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale))
      .attr("transform", "translate(0,0)")

  svg.append("text")
    .attr("id", "ind-unit")
    .attr("transform", "translate(" + 1.02*width + "," + -0.01*height + ")") 
    .text(indicator_info[value].unit)


  // set up rank text
  svg.append("text")
    .attr("id", "ind-rank-text")
    .attr("transform", "translate(" + 0.7*width + "," + 0.05*height + ")") 

  // set up title
  svg.append("text")
    .attr("id", "chart-title")
    .attr("x", -110)
    .attr("y", -65)
    .text(text)

  // set up x axis short description
  svg.append("text")
    .attr("id", "chart-desc")
    .attr("x", -110)
    .attr("y", -45)
    .text(indicator_info[value].short_desc)

  // set up left side long description
  d3.select("#var-name").text(text + ": ")
  d3.select("#long-desc").text(indicator_info[value].long_desc)

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
      .on('click', function(d) {
            // if click on already highlighted bar, restore bars
            if (d3.select(d3.event.target).classed('highlighted')) {
              restore(d3.event.target);
            } else {
              highlight(d, d3.event.target);
              display_rank(d)
              
            }
          });
    };


