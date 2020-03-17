// compile
import * as d3 from 'd3';
import {ind_chart, counsel_chart} from './bar_charts.js';
//import {map} from './map.js'

/// initial bar charts
var init_val = 'single-parent-households'
var init_text = 'Single Parent Households (%)'
viz(init_val, init_text)

/// initial map
//map()



function viz(value, text){
  ind_chart(value, text);
  counsel_chart();
}


window.viz = viz;
window.map = map;

