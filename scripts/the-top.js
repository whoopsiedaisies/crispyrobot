// adding the svg
const svg = d3.select("svg")

// add new data
data = data.map((d, i) => {
  d.difference = d.imdb - d.metascore // adding an extra data layer
  return d
})


// change height & width of svg depending on the length of data.js
svg
  .attr("height", 40 * data.length)
	.attr("width", "100%") // responsive size


// scales
const scoreScale = d3.scaleLinear()
	.domain([0,100]) // max and min of scores
	.range([420, 900]) // where it is

// area chart
const area = d3.area()
	.x0((d, i ) => { return scoreScale(d.imdb)})
	.x1((d, i ) => { return scoreScale(d.metascore)})
	.y0((d, i ) => { return 40 * i + 20})
	.y1((d, i ) => { return 40 * i + 20})

const areaPath = svg
	.append("path")
	.datum(data)
	.attr("d", area)
	.attr("class", "area")

// imdb line: how it looks
const imdbLine = d3.line()
	.x((d, i) => { return scoreScale(d.imdb)})
	.y((d, i) => { return 40 * i + 20}) // shift it down x-40 each time, starts +20 from the top

// imdb line tag itself
const imdbPath = svg
	.append("path")
	.datum(data)
	.attr("d", imdbLine)
	.attr("class", "imdb")

// metascore line: how it looks
const metascoreLine = d3.line()
	.x((d, i) => { return scoreScale(d.metascore)})
	.y((d, i) => { return 40 * i + 20}) // shift it down x-40 each time, starts +20 from the top
// metascore line tag itself
const metascorePath = svg
	.append("path")
	.datum(data)
	.attr("d", metascoreLine)
	.attr("class", "metascore")

// movie list group
const groups = svg
	.selectAll("g.movie")
	.data(data)
	.enter()
	.append("g")
	.attr("class", "movie")
	.attr("transform", (d, i) => { return `translate(0,${i * 40})`}) // put distance between rows

// hover rectangle goes first so it is behind all elements
groups
	.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 960)
	.attr("height", 40)
	.attr("class", "background")

groups
	.append("text")
	.attr("x", 90) // position titles
	.attr("y", 20)
	.attr("class", "title")
	.text((d, i) => {return d.title}) // lay out the titles

groups
	.append("text")
	.attr("x", 24)
	.attr("y", 20)
	.attr("class", "year")
	.text((d, i ) => { return d.year}) // lay out the years

groups
	.append("circle") // attach metascore circle tags to group
	.attr("cx", (d, i) => {return scoreScale(d.metascore)})
  .attr("cy", 20)
	.attr("r", 8)
	.attr("class", "metascore")

groups
	.append("circle") // attach imdb circle tags to group
	.attr("cx", (d, i) => {return scoreScale(d.imdb)})
  .attr("cy", 20)
	.attr("r", 8)
	.attr("class", "imdb")

// imdb numbers
groups
	.append("text")
	.attr("x", (d, i) => {
  	if (d.difference > 0) { // align text on right side
      return scoreScale(d.imdb) + 15
    } else {
      return scoreScale(d.imdb) - 15
    }
	})
	.attr("y", 20)
	.text((d, i) => {return d.imdb})
	.attr("class", "imdb")
	.style("text-anchor", (d, i) => { // align text based on text anchor
  	if (d.difference > 0) {
      return "start"
    } else {
      return "end"
    }
})

// metascore numbers
groups
	.append("text")
	.attr("x", (d, i) => {
  	if (d.difference > 0) { // align text on right side
      return scoreScale(d.metascore) - 15
    } else {
      return scoreScale(d.metascore) + 15
    }
	})
	.attr("y", 20)
	.text((d, i) => {return d.metascore})
	.attr("class", "metascore")
	.style("text-anchor", (d, i) => { // align text based on text anchor
  	if (d.difference > 0) {
      return "end"
    } else {
      return "start"
    }
})




// load on drop down menu
const selectTag = document.querySelector("select") // picks the first select tag

// whenever we change select tag something changes
selectTag.addEventListener("change", function () {
  data.sort((a, b) => { // sort the data by:
    if (this.value == "imdb") {
      return d3.descending(a.imdb, b.imdb)
    }
    else if (this.value == "year") {
      return d3.ascending(a.year, b.year)
    }
    else if (this.value == "title") {
      return d3.ascending(a.title, b.title)
    }
    else if (this.value == "difference") {
      return d3.descending(a.difference, b.difference)
    }
    else {
      return d3.descending(a.metascore, b.metascore)
    }
  })
  // tell the groups the data has been resorted and transition things and move them where they should be now
  groups
  	.data(data, (d, i) => { return d.title})
  	.transition()
  	.duration(1000)
  	.attr("transform", (d, i) => { return `translate(0,${i * 40})`})

  imdbPath
  	.datum(data, (d, i) => { return d.title})
  	.transition()
  	.duration(1000)
  	.attr("d", imdbLine)

  metascorePath
  	.datum(data, (d, i) => { return d.title})
  	.transition()
  	.duration(1000)
  	.attr("d", metascoreLine)

 areaPath
 	.datum(data, (d, i ) => { return d.title})
  .transition()
  .duration(1000)
  .attr("d", area)
})

// responsiveness of the svg
const resize = function () {
  const svgTag = document.querySelector("svg")
  const svgWidth = svgTag.clientWidth

  scoreScale
  	.range([420 / 960 * svgWidth, 900 / 960 * svgWidth])

  groups
  	.selectAll("circle.metascore")
  	.attr("cx", (d, i) => {return scoreScale(d.metascore)})

  groups
  	.selectAll("circle.imdb")
  	.attr("cx", (d, i) => {return scoreScale(d.imdb)})

  groups
  	.selectAll("text.title")
  	.attr("x", (svgWidth >= 960) ? 90 : 70) // if svg width >= 960 -> 90, if not -> 70

  metascoreLine
  	.x((d, i) => { return scoreScale(d.metascore)})

  metascorePath
  	.attr("d", metascoreLine)

  imdbLine
  	.x((d, i) => { return scoreScale(d.imdb)})

  imdbPath
  	.attr("d", imdbLine)
}

// I want to run resize on page load
resize()
// and if I change the page width
window.addEventListener("resize", function() {
  resize()
})
