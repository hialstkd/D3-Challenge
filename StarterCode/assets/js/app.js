var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

function Tooltip(circlesGroup) {
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state} <hr> Poverty: ${d.poverty} <br> Healthcare: ${d.healthcare}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

}

d3.csv("assets/data/data.csv").then(function (stateData, err) {
  if (err) throw err;

  // parse data
  stateData.forEach(function (data) {
    data.poverty = + data.poverty;
    data.healthcare = + data.healthcare;
  });

  //Create Scales
  //= ============================================
  var xLinearscale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d.poverty) * 0.8,
    d3.max(stateData, d => d.poverty) * 1.2
    ])
    .range([0, width]);

  var yLinearscale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d.healthcare) * 0.8,
    d3.max(stateData, d => d.healthcare) * 1.2
    ])
    .range([height, 0]);

  //Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xLinearscale)
  var leftAxis = d3.axisLeft(yLinearscale)

  // append x axis
  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearscale(d.poverty))
    .attr("cy", d => yLinearscale(d.healthcare))
    .attr("r", 10)
    .attr("opacity", ".5")
    .attr("fill", "blue")


  chartGroup.select("g")
    .selectAll("circle")
    .data(stateData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearscale(d.poverty))
    .attr("y", d => yLinearscale(d.healthcare))
    .attr("dy", -395)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);


  labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("axis-text", true)
    .text("In Poverty (%)");


  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

  Tooltip(circlesGroup);

}).catch(function (error) {
  console.log(error);
});
