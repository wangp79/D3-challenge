// @TODO: YOUR CODE HERE!
svgHeight = 960
svgWidth = 960

margin = {
    top: 30,
    left: 30,
    right: 30,
    bottom: 30
}

width = svgWidth - margin.left - margin.right
height = svgHeight - margin.top - margin.bottom

svg = d3.select('#scatter')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)

chartGroup = svg.append('g')
                .attr('transform',`translate(${margin.left},${margin.top})`)       


d3.csv('../assets/data/data.csv').then(function(povertyData){

console.log(povertyData)

povertyData.forEach(function(data){
    data.poverty = +data.poverty
    data.healthcare = +data.healthcare
    // console.log(data)
})

//Healthcare vs. Poverty

xScale = d3.scaleLinear()
            .domain(d3.extent(povertyData, d=>d.poverty))
            .range([0,width])               
yScale = d3.scaleLinear()
            .domain(d3.extent(povertyData, d=>d.healthcare))
            .range([height,0])


bottomAxis = d3.axisBottom(xScale)
leftAxis = d3.axisLeft(yScale)

chartGroup.append('g')
          .attr('transform',`translate(0,${height})`)
          .call(bottomAxis)

chartGroup.append('g')
          .call(leftAxis)          


circleGroup = chartGroup.selectAll('circle')                    
                        .data(povertyData)
                        .enter()
                        .append('circle')
                        .attr('cx', d=>xScale(d.poverty))
                        .attr('cy', d=>yScale(d.healthcare))
                        .attr('r', '15')
                        .attr('fill', 'red')
                        .attr('opacity', '.5')


toolTip = d3.tip()
           .attr('class','tooltip')
           .offset([80,-60])
           .html(function(d){
            return (`<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`)
           })
chartGroup.call(toolTip)

circleGroup.on('mouseover',function(d){
    toolTip.show(d,this)
})
          .on('mouseout', function(d){
            toolTip.hide(d)
          })

          chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 40)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("lack of healthcare");
    
        chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .attr("class", "axisText")
          .text("in poverty");
      }).catch(function(error) {
        console.log(error);

})


