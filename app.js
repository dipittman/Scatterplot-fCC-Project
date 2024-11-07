let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
let req = new XMLHttpRequest();
let w = 800;
let h = 600;
let p = 70;
let svg = d3.select("svg");
let yScale;
let xScale;
let data = [];
let xAxis;
let yAxis;

let drawCanvas = () => {
    svg.attr("width", w)
       .attr("height", h)
}

let generateScales = () => {

   yScale = d3.scaleTime()
              .domain([d3.min(data, (d) => {
                return new Date(d.Seconds * 1000)
              }), d3.max(data, (d) => {
                return new Date(d.Seconds * 1000)
              })])
              .range([p, h - p])

   xScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Year), d3.max(data, (d) => d.Year)])
              .range([p, w - p])

   xAxis = d3.axisBottom(xScale)
             .tickFormat(d3.format('d'))
   yAxis = d3.axisLeft(yScale)
             .tickFormat(d3.timeFormat('%M:%S'))

   svg.append("g")
      .attr("transform", `translate(0, ${h - p})`)
      .attr("id", "x-axis")
      .call(xAxis)

   svg.append("g")
      .attr("transform", `translate(${p}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis)
    
   svg.append("text")
      .attr("text-anchor", "end")
      .attr("dy", ".75em")
      .attr("y", 10)
      .attr("x", -70)
      .attr("transform", "rotate(-90)")
      .text("Time (Minutes)")
}

let drawPoints = () => {
    let toolTip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("visibility", "hidden")
                    .style("width", "auto")
                    .style("height", "auto")
                    .style("position", "absolute")
                    .style("padding", "5px")

   svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => {
        return yScale(new Date(d.Seconds * 1000))
    })
      .attr("r", 5)
      .attr("data-xvalue", (d) => d.Year )
      .attr("data-yvalue", (d) => {
        return new Date(d.Seconds * 1000)
      })
      .style("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", (e, d) => {
        toolTip.transition()
        .style("visibility", "visible")
        .style("left", (event.pageX + 10)+ "px") 
        .style("top", (event.pageY) + "px")
      toolTip.html(`${d.Name}: ${d.Nationality} <br />Year: ${d.Year} Time: ${d.Time}<br />${d.Doping}`)
      document.querySelector('#tooltip').setAttribute('data-year', d.Year)
      })
      .on("mouseout", (d) => {
        toolTip.transition()
            .style('visibility', 'hidden')
      })
      .attr("fill", (d) => {
        if (d.Doping === "") {
            return "green"
        } else {return "red"}
      })
    
    let keys = ["No doping allegations", "Riders with doping allegations"]
    let size = 20
    svg.selectAll("rect")
       .data(keys)
       .enter()
       .append("rect")
       .attr("x", w - 100)
       .attr("y", (d,i) => 100 + i * (size + 5))
       .attr("width", size)
       .attr("height", size)
       .style("stroke", "black")
       .style("stroke-width", 1)
       .style("fill", (d) => {
        if (d === "No doping allegations") {
            return "green"
        } else {return "red"}
       })

    svg.selectAll("mylabels")
       .data(keys)
       .enter()
       .append("text")
       .text((d) => d)
       .attr("x", w - 105)
       .attr("y", (d,i) => 115 + i * (size + 5))
       .attr("text-anchor", "end")
       .style("fill", "black")
       .attr("id", "legend")
    
    
}

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    console.log(data)
    
    drawCanvas()
    generateScales()
    drawPoints()
    //generateAxes()
}
req.send()