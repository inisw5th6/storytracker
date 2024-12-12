import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const NetworkGraph = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/output')
      .then(response => response.json())
      .then(data => {
        const nodes = data.top_20_persons.map(([name, size]) => ({ id: name, size }));

        const links = [];
        for (const source in data.jaccard_similarity) {
          for (const target in data.jaccard_similarity[source]) {
            const value = data.jaccard_similarity[source][target];
            if (value > 0) {
              links.push({ source, target, value });
            }
          }
        }

        setData({ nodes, links });
      });
  }, []);

  useEffect(() => {
    if (data) {
      const width = 800;
      const height = 600;

      const svg = d3.select('#network-graph')
        .attr('width', width)
        .attr('height', height);

      const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id).distance(d => 1 / d.value * 200))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(width / 2, height / 2));

      const link = svg.append('g')
        .selectAll('line')
        .data(data.links)
        .enter().append('line')
        .style('stroke', '#aaa');

      const node = svg.append('g')
        .selectAll('circle')
        .data(data.nodes)
        .enter().append('circle')
        .attr('r', d => d.size / 4)
        .attr('fill', '#69b3a2')
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      const label = svg.append('g')
        .selectAll('text')
        .data(data.nodes)
        .enter().append('text')
        .text(d => d.id)
        .attr('x', 6)
        .attr('y', 3);

      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);

        label
          .attr('x', d => d.x)
          .attr('y', d => d.y);
      });

      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    }
  }, [data]);

  return <svg id="network-graph"></svg>;
};

export default NetworkGraph;
