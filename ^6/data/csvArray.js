var csv = "";
csv += "rank,name,age,team,position";

var lines = csv.split("\n");
var titles = lines[0].split(" ");
var data = new Array(lines.length - 1);

for (var i = 1; i < lines.length; i++) {
  data[i - 1] = {};
  line[i] = lines[i].split(" ");
  for (var j = 0; j < titles.length; j++) {
    data[i - 1][titles[j]] = lines[i][j];
  }
}

console.log(data);