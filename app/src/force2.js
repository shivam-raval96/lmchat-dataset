import React, { Component } from "react";
import { ForceGraph2D } from "react-force-graph";
import * as d3 from "d3";
import { node } from "prop-types";
import test from './datasets/test.json'

; 

const data =test


data['nodes'] = data['nodes'].map(function(e){
    e['fx'] = +e['fx']
    e['fy'] = +e['fy']
    return e;
});
console.log(data)


export default class Bubbles extends Component {
  componentDidMount() {
    this.fg.d3Force("center", null);
    this.fg.zoom(1.0000000001);     
    this.fg.d3Force('charge').strength(0);
    this.fg.d3Force('x', d3.forceX().x(function(d){ 
      return  -600/2 +  d.x ;
    }));
    this.fg.d3Force('y', d3.forceY().y(function(d){ 
      return -600/2 + d.y
    }));

    this.fg.d3Force("collide", d3.forceCollide(5)); 
  }
  
  render() {
    return (
      <ForceGraph2D
        ref={el => (this.fg = el)}
        graphData={{ nodes:data['nodes'], links: []}} 
        cooldownTime={Infinity}
        d3AlphaDecay={0.0228}
        d3VelocityDecay={0.2}
        width={1500}
        height={1500}
        nodeColor={"red"}
        enableZoomPanInteraction={true}
      />
    );
  }
}