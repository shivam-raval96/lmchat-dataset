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
    "#17becf", "#17becf", "#7f7f7f", "#e377c2", "#e377c2", 
    "#9467bd", "#d62728", "#2ca02c", "#ff7f0e", "#1f77b4"
]

var legend_dict = {
    5:{male: "#17becf", female: "#17becf", upper: "#ff7f0e", middle:"#e377c2", lower: "#2ca02c"},
    4:{gender: "#2ca02c", socioeco:"#d62728"}
}





function Scatterplot(props) {
  const { width, height, data , labels, colorcol} = props;
  const margin = {top:50, left:80, right:80, bottom:20}
  const ref = useRef();
  const legendref = useRef();


  const color_dict = legend_dict[+colorcol]

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
        .style("margin-right", "300px")
        .style("position", "absolute");

    d3.select("#chatcontent").selectAll('*').remove()

    // Chat content
    const chatcontent = d3.select("#chatcontent").append("div")


    // Bind data to circles and add tooltips
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d[0]))
        .attr('cy', d => yScale(d[1]))
        .attr('r', 4)
        .style("opacity", d =>  d[3]===-1? 0.2 : 0.7)
        .attr('fill', d => color_dict[d[+colorcol]])
        .attr('stroke', 'black')  // Add this line for the boundary color
        .attr('stroke-width', 0.5)  // Add this line for the boundary width
        .on("mouseover", (event, d) => {
            svg.selectAll('circle')
            .transition().duration(100)
            .style("opacity", d =>  d[3]===-1? 0.2 : 0.7) 
            .attr('stroke-width', 0.5) 
            .attr('r', 4);
            // Add the hovered to the current circle
            d3.select(event.currentTarget)
                .transition().duration(100)
                .style("opacity", 1) 
                .attr('stroke-width', 0.6)  // Add this line for the boundary width
                .attr('r', 10);

            tooltip.transition()
                .duration(100)
                .style("opacity", .9);
            tooltip.html("<b>Keywords:</b> "+ d[3].slice(0,10))
                .style("font-size", "15px")
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");

            chatcontent.transition()
                .duration(100)
                .style("opacity", 1);
            chatcontent.html(d[2])
        })
        .on("mouseout", (d) => {            
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    

    // Render the legend
    var keys = Object.keys(color_dict)
    const legend = d3.select(legendref.current);
    legend.selectAll('*').remove()


    legend.selectAll('circle')
        .data(keys)
        .enter()
        .append('circle')
        .attr('cx', (d,i) => 10)
        .attr('cy', (d,i) => 18+ 30*i)
        .attr('r', 7)
        .attr('fill', d => color_dict[d])
        .attr('stroke', 'black')  // Add this line for the boundary color
        .attr('stroke-width', 0.5)  // Add this line for the boundary width

    legend.selectAll("mylabels").data(keys)
        .enter()
        .append("text")
            .attr("x", 20)
            .attr("y", function(d,i){ return 20 + i*30}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill",'black')
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

    // Bind data to text elements and add labels
    /*svg.selectAll('text.label')
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
        .attr('font-weight', '800') ;*/

      

  }, [data, labels, colorcol, width, height]);

  return (
  <>
  <svg ref={ref} width={width} height={height}></svg>
  <div style={{ position: 'absolute', top: "75%", left: '20px', width: '100px', backgroundColor: 'rgba(0, 0, 0, 0.1)',
                 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',  // Drop shadow
                borderRadius: '20px' ,                         // Curved edges
                fontFamily: 'Perpetua',  // Setting the font family
                padding: '15px',
                overflow:'scroll',
                textAlign:'left',
                flex: 1
                

            }}>
            <b>Legend</b>
            

            <svg ref={legendref}></svg>
        </div>

    </>

  )
}

export default Scatterplot;
