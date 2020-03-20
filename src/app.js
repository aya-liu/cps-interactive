// compile
import * as d3 from 'd3';
import {ind_chart,counsel_chart,sort,rank} from './bar_charts.js';
import {map} from './map.js'

/// initial bar charts
var init_val = 'single-parent-households'
var init_text = 'Single Parent Households (%)'
viz(init_val, init_text)

function viz(value, text){
	// load data
	var community_json = require("../data/community_and_schools.json");
	var raw_data = JSON.parse(community_json).filter(d => d.avg_access !== 'No Schools');
  
  // rank data
  var data = get_ranks(raw_data, value)

	// special area slugs
	var no_counselor = JSON.parse(community_json).filter(d => d.avg_access === 1600).map(d => d.slug);
	var no_school = JSON.parse(community_json).filter(d => d.avg_access === 'No Schools').map(d => d.slug);

	// clear canvas
  d3.select("svg.map").remove()
  d3.select("#counselor-svg").remove()
  d3.select("#indicator-svg").remove()

  // make charts
  ind_chart(value, text, data);
  counsel_chart(data, no_counselor);
  map(value, data, no_school)

}

function get_ranks(raw_data, value){
    var data = sort(raw_data, value)
    data = rank(data, value)
    data = sort(data, 'avg_access')
    data = rank(data, 'avg_access')
    return data
}
window.viz = viz;