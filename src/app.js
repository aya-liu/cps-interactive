// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
// const domReady = require('domready');
//import {choropleth} from 'map';
import * as d3 from 'd3';
import {ind_chart, counsel_chart} from './utils.js';

//var counsel_val = "pct_counsel";
//var counsel_text = "CPS High Schools with Counselors";

function viz(value, text){
  ind_chart(value, text);
  counsel_chart();
}

//function get_selected_text(){
//  var sel = document.getElementById("select-indicator");
//  return sel.options[this.selectedIndex].text
//}

window.viz = viz;
//window.get_selected_text = get_selected_text;