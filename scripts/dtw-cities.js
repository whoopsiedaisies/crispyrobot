// 3 places we want to run our data viz:
// 1. on page load
// 2. on any change of any select box
// all of them will run the same code

const svg = d3.select("svg")

// svg responsive size
svg
	.attr("viewBox", "0 0 960 720") //top left position, height, width, scaleable

// here is the things we want to set up
// axes, scales, text elements
const axisXGroup = svg
	.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(0,620)") // position of the axis

const axisYGroup = svg
	.append("g")
	.attr("class", "y-axis")
	.attr("transform", "translate(100,0)") // position of the axis

// label of the axes
const axisXText = svg
	.append("text")
	.attr("class", "x-axis")
	.attr("transform", "translate(480,670)")
	.text("x-axis")

const axisYText = svg
	.append("text")
	.attr("class", "y-axis")
	.attr("transform", "translate(30,360) rotate(-90)")
	.text("y-axis")

// here is the place we update things, massive bracket including lots of functions below:
const placeCities = function () {

  let inputX = document.querySelector("select[name=valueX]")
  let inputY = document.querySelector("select[name=valueY]")

  let valueX = inputX.value
  let valueY = inputY.value

  // make axis labels automatic
  let textX = inputX.options[inputX.selectedIndex].innerHTML
  let textY = inputX.options[inputY.selectedIndex].innerHTML

  axisXText.text(textX)
  axisYText.text(textY)


  // max value from the data
  let maxValueX = d3.max(data, (d, i ) => {return d[valueX]})
  let maxValueY = d3.max(data, (d, i ) => {return d[valueY]})
  let maxValueR = d3.max(data, (d, i ) => {return d.population})

  // scales
  const scaleX = d3.scaleLinear()
  	.domain([0,maxValueX])
  	.range([100,860])

  const scaleY = d3.scaleLinear()
  	.domain([0,maxValueY])
  	.range([620,100])

  const scaleR = d3.scaleSqrt() // scale circle
  	.domain([0, maxValueR])
  	.range([0, 30])

  // axes styling and scale
  const axisX = d3.axisBottom(scaleX)
  	.tickSizeInner(-520)
  	.tickSizeOuter(0)
  	.tickPadding(10)
  	.ticks(10, "$,f")

  const axisY = d3.axisLeft(scaleY)
  	.tickSizeInner(-760)
  	.tickSizeOuter(0)
  	.tickPadding(10)
  	.ticks(10, "$,f")

  axisXGroup.call(axisX)
  axisYGroup.call(axisY)


  const cities = svg
  	.selectAll("g.city")
  	.data(data, (d, i) => { return d.city }) // keep order of cities (fixes hover)
  	.enter()
  	.append("g")
  	.attr("class", "city")
  	.attr("transform", (d, i) => {
      const x = scaleX(d[valueX])
      const y = scaleY(d[valueY])
      return `translate(${x}, ${y})`
    })

  // circles based on population size
  cities
  	.append("circle")
  	.attr("cx", 0)
  	.attr("cy", 0)
  	.attr("r", 0)
  	.transition()
  	.attr("r", (d, i) => { return scaleR(d.population)})

  // circle label rectangle
  cities
  	.append("rect")
		.attr("x", -60)
  	.attr("y", (d, i) => { return -1 * scaleR(d.population) - 35}) // position
  	.attr("width", 120)
  	.attr("height", 30)

  // circle label text
  cities
  	.append("text")
  	.attr("x", 0)
  	.attr("y", (d, i) => { return -1 * scaleR(d.population) - 15})
  	.text((d, i) => { return d.city })

  // updating svg
  svg
  	.selectAll("g.city")
  	.transition()
  	.duration(500)
  	.attr("transform", (d, i) => {
      const x = scaleX(d[valueX])
      const y = scaleY(d[valueY])
      return `translate(${x}, ${y})`
  })

  svg
  	.selectAll("g.city")
  	.on("mouseover", function () { // this is a d3 event
    	d3.select(this).raise() // move it down in the code = above everything else
  })

}

// on page load
placeCities()

// select all of the select boxes
const selectTags = document.querySelectorAll("select")
// for each of them, when they do change, we want to run placeCities
selectTags.forEach((selectTag) => {
  selectTag.addEventListener("change", function () { // this is a Javascript event
    placeCities()
  })
})
