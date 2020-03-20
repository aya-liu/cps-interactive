// utility
import * as d3 from 'd3'

export function rank(raw_data, value){
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