// compile
import * as d3 from 'd3';
import {ind_chart, counsel_chart, rank} from './bar_charts.js';
import {map} from './map.js'

/// initial bar charts
var init_val = 'single-parent-households'
var init_text = 'Single Parent Households (%)'
viz(init_val, init_text)
//style="color:#8596ab; font-weight: bold"
// <span style="color:#82A7A6">

function viz(value, text){


	// load data
	var community_json = require("../data/community_and_schools.json");
	var raw_data = JSON.parse(community_json).filter(d => d.avg_access !== 'No Schools');
  
  // rank data
  var data = rank(raw_data, value)
  data = rank(data, 'avg_access')

	// special area slugs
	var no_counselor = JSON.parse(community_json).filter(d => d.avg_access === 1600).map(d => d.slug);
	var no_school = JSON.parse(community_json).filter(d => d.avg_access === 'No Schools').map(d => d.slug);

	// clear canvas
  d3.select("svg.map").remove()
  d3.select("#counselor-svg").remove()
  
  // make charts
  ind_chart(value, text, data);
  counsel_chart(data, no_counselor);
  map(value, data, no_school)

}


window.viz = viz;
window.map = map;