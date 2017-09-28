

var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var itemSize = 11, cellSize = itemSize - 1, margin = {top: 120, right: 20, bottom: 80, left: 90}; //base margins
var width = 1000 - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom;

// =======JSON BEGINS ======================
d3.json(url, function(error, json){
  var item = json.monthlyVariance
  var baseTemp = json.baseTemperature;
//Years Data
var yearData = item.map(function(data) {
  return data.year;
});
yearData = yearData.filter(function(d, i) {
  return yearData.indexOf(d) == i;
});
var minYr = d3.min(yearData);
var maxYr = d3.max(yearData);
var minYear = new Date(minYr , 0);
var maxYear = new Date(maxYr, 0);
//the key:values of month, year, variance are pushed into an array
var data = [];
//goes through each object to get requested data: month, year, variance
item.forEach(function(item){
  var newItem = {};
  newItem.month = item.month;
  newItem.year = item.year;
  newItem.variance = item.variance;
  ;
  data.push(newItem);
})
//--X - Scales & Axis
var xScale = d3.time.scale() //xScale uses
  .range([0, width])
  .domain([minYear,maxYear]); //using date formatting.
var xAxis = d3.axisBottom()
  .scale(xScale)
  .ticks(d3.time.years,10);

//--Y - Scales & Axis
var yScale = d3.time.scale()
    .range([0, height])
    .domain([new Date(2017, 0, 1), new Date(2017, 11, 31)]) //using date formatting
var yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(d3.time.months)
  .tickSize(16,0)
  .tickFormat(d3.time.format("%B"));

//color scale for heatmap
var colorScale = d3.scale.threshold()
    .domain([-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7])
    .range(["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"]);

//appends the svg and title to body
var svg = d3.select('body')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("text")  //creates the title
        .attr("x", (width / 2))
        .attr("y", margin.top - 185)
        .attr("text-anchor", "middle")
        .attr('class', 'title')
        .text("Monthly Global Land-Surface Temperature");

    svg.append("text")  //creates the sub-title
        .attr("x", (width / 2))
        .attr("y", margin.top - 150)
        .attr("text-anchor", "middle")
        .attr('class', 'title')
        .text("1753 - 2015");

    svg.append("text") //creates the sub-title
    .attr("x", (width / 2))
    .attr("y", margin.top -130 )
    .attr("text-anchor", "middle")
    .attr('class', 'xAx')
    .text("Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.Estimated Jan 1951-Dec 1980 absolute temperature °C: 8.66 +/- 0.07");

//creates rectangles for visualization
var gridHeight = height / months.length;
var gridWidth = width / yearData.length;
var cells = svg.selectAll('rect')
    .data(data)
    .enter().append('g').append('rect')
    .attr('width', cellSize -1)
    .attr('height', cellSize + 35)
    .attr("x", function(d) {
      return ((d.year - minYr) * gridWidth);
    })
    .attr("y", function(d) {
      return ((d.month - 1) * gridHeight);
    })
    .attr('fill', function(d) { return colorScale(d.variance); })
    .on('mouseover', function(d){
      var celcius = (Math.floor((baseTemp + d.variance) * 1000) / 1000)
      var fahrenheit = (Math.floor((celcius * (9 / 5) + 32) * 1000) / 1000);
      var xCoordinate = parseFloat(d3.select(this).attr('x'));
      var yCoordinate = parseFloat(d3.select(this).attr('y'));
      d3.select('#tooltip')
      .style('left', (xCoordinate)+ "px")
      .style('top', (yCoordinate + 80) + "px")
      .select('#value')
      .html("<strong>" + months[d.month - 1] + "</strong>, <strong> "
            + d.year + "</strong><br><br> <strong>" + (Math.floor((baseTemp + d.variance) * 1000) / 1000)
            + "&#8451" + "</strong> | <strong>" +  fahrenheit + "&#8457"
            +" </strong><br><br> <strong> A difference of  " + d.variance + "&#8451  "
            + "from base level Temperature</strong>");
      d3.select('#tooltip').classed('hidden', false);
    })  //mouseover
    .on('mouseout', function(d){
      d3.select('#tooltip').classed('hidden', true);
    });

//appends yAxis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0," + (height - 400) +")")//adjusting the number inside (height - 400) repositions y axis
        .call(yAxis)
        .selectAll('.tick text')
        .attr('font-weight', 'bold');

//appends xAxis to
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + 10 )+ ")") //adjusts x-axis line (horiz, vert)
        .call(xAxis)
        .attr('font-weight', 'bold');;

   }) //json
