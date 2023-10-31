import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { layoutTextLabel, layoutGreedy,
    layoutLabel, layoutRemoveOverlaps } from 'd3fc-label-layout';
import { select } from 'd3-selection';


const colors = [
    "#9edae5", "#17becf", "#dbdb8d", "#bcbd22", "#c7c7c7", "#7f7f7f", 
    "#f7b6d2", "#e377c2", "#c49c94", "#8c564b", "#c5b0d5", "#9467bd", 
    "#ff9896", "#d62728", "#98df8a", "#2ca02c", "#ffbb78", "#ff7f0e", 
    "#aec7e8", "#1f77b4"
]

const colors2 = [
    "#17becf", "#bcbd22", "#7f7f7f", "#e377c2", "#8c564b", 
    "#9467bd", "#d62728", "#2ca02c", "#ff7f0e", "#1f77b4"
]


function Scatterplot(props) {
  const { width, height, data , labels} = props;
  const margin = {top:50, left:80, right:80, bottom:10}
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);


    svg.selectAll('*').remove()
    
    // Set scales for the scatterplot
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])])
      .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])])
      .range([height-margin.bottom, margin.top]);


    // Tooltips
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("margin-right", "50px")
        .style("position", "absolute");


    // Bind data to circles and add tooltips
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d[0]))
        .attr('cy', d => yScale(d[1]))
        .attr('r', 4)
        .style("opacity", d =>  d[3]===-1? 0.2 : 0.9)
        .attr('fill', d =>  d[3]===-1?'grey':colors[d[3]%20])
        .attr('stroke', 'black')  // Add this line for the boundary color
        .attr('stroke-width', 0.5)  // Add this line for the boundary width
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(100)
                .style("opacity", .9);
            tooltip.html(d[2])
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", (d) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


    // Bind data to text elements and add labels
    svg.selectAll('text.label')
        .data(labels)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('fill', 'black')  
        .attr('x', d => xScale(d[0])) 
        .attr('y', d => yScale(d[1]))
        .attr('dy', '.35em')  
        .attr('text-anchor', 'middle')
        .text(d => `${d[2]}`)
        .attr('stroke', 'white')  
        .attr('stroke-width', '0.3px') 
        .attr('font-size', '17px')
        .attr('font-weight', '800') ;

      

  }, [data, labels, width, height]);

  return <svg ref={ref} width={width} height={height}></svg>;
}

export default Scatterplot;
