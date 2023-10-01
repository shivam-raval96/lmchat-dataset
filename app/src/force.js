import { ForceGraph2D } from "react-force-graph";
import React, { useContext, useState, useRef, useEffect } from 'react';
import * as d3 from "d3";
import papers from './datasets/papers.json'
import papers_labels from './datasets/papers_lbls.json'

function ForceGraph() {
    // gen a number persistent color from around the palette
    const getColor = n => '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');

    function nodePaint(node, color, ctx, size) {
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false); ctx.fill();  // circle
        ctx.globalAlpha   = 0.8;
        ctx.fillStyle = "rgba(0,0,0, 0.2)";
        ctx.shadowColor="black";
        ctx.shadowBlur=5;  
      }
    function nodeLabel(node, ctx, globalScale){
            const label = node.label;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = "black";
            ctx.fillText(label, node.x, node.y);
            ctx.shadowColor="black";
            ctx.shadowBlur=7;

            node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
            
    }
    let data = papers
    let labels = papers_labels
    let range=1400



        let x = d3.scaleLinear().range([-range,range]),
        y = d3.scaleLinear().range([-range,range]);




    var d_extent_x = d3.extent(data['nodes'], (d) => +d['x']),
        d_extent_y = d3.extent(data['nodes'], (d) => +d['y']);

    // Draw axes
    x.domain(d_extent_x);
    y.domain(d_extent_y);

    data['nodes'] = data['nodes'].map(function(e){
        e['x'] = x(+e['x'])
        e['y'] = y(+e['y'])
        return e;
    });

    data['links'] = data['links'].map(function(e){
        e['value'] = +e['value']
        return e;
    });

    console.log(data)

    const forceRef = useRef(null);
    useEffect(() => {
        forceRef.current.d3Force("charge").strength(0);
    });
    return (

        <>


        <ForceGraph2D
          graphData={data}
          nodeLabel="id"
          nodeAutoColorBy="group"
          nodeRelSize={8}
          d3VelocityDecay={0.95}
          nodeOpacity ={0.01}
          nodeLabel = {"name"}
          nodeDesc = {"id"}
          linkWidth={1.5}
          //linkDirectionalParticles={4}
          //linkDirectionalParticleWidth={1}
          linkVisibility ={true}
          onNodeClick =  {node=>{console.log(node)}}
          onLinkClick =  {link=>{console.log(link);link['value'] = 50}}

          ref={forceRef}
          nodeCanvasObject={(node, ctx, globalScale) => {
            if (node.group){
                nodePaint(node, getColor(node.group), ctx, 8)
            }else{
                nodeLabel(node, ctx, globalScale)
            }
          }}
          onNodeDragEnd={node => {
            node.fx = node.x;
            node.fy = node.y;
            node.fz = node.z;
          }}
          
            />
        </>
      );
    }
    
    export default ForceGraph;
    
    