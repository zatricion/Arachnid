;
(function () {
  plotPathmark = function (links, nodes, width, height) {  
    var timelineVis = true;

    var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(200)
      .charge(-1000)
      .on("tick", tick)
      .start();

    var tooltip = d3.select("body")
      .append("div")
      .style("position", "fixed")
      .style("white-space", "nowrap")
      .style("z-index", 111111221)
      .style("visibility", "hidden")
      .text("Current URL")
      .style("left", 0)
      .style("top", 0)
      .style("color", "white")
      .style("font-size", "32px");

    var svg = d3.select("body").append("svg")
      .attr("viewBox", "0 0 " + width + " " + height ) 
      .style("left", 0)
      .style("top", 0)
      .style("position", "fixed")
      .style("z-index", 111111112)
      .style("pointer-events", "none")
      .on("dblclick", update);

    var link = svg.selectAll(".link")
      .data(force.links())
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", "white")
      .style("stroke-width", 3);

    var node_drag = d3.behavior.drag()
      .on("dragstart", dragstart)
      .on("drag", dragmove)
      .on("dragend", dragend);

    var node = svg.selectAll(".node")
      .data(force.nodes())
      .enter().append("g")
      .attr("class", "node")
      .style("pointer-events", "all")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", click)
      .call(node_drag);

    var defs = svg.append("defs");

    var pattern = defs.selectAll(".pattern")
      .data(force.nodes())
      .enter().append("pattern")
      .attr("class", "pattern")
      .attr("id", function (d, i) {return "pattern-" + i;})
      .attr("width", 32)
      .attr("height", 32)
      .attr("patternContentUnits", "objectBoundingBox");

    pattern
      .append("rect")
      .attr("fill", "white")
      .attr("width", 1)
      .attr("height", 1);

    pattern
      .append("image")
      .attr("xlink:href", function (d) {return d.favicon})
      .attr("width", 1)
      .attr("height", 1);

    node.append("circle")
      .attr("r", 16)
      .attr("fill", function (d, i) {return "url(#pattern-" + i + ")" })
      .style("stroke", "white")
      .style("stroke-width", 2)
      .append("title")
      .text(function(d) { return d.name; });

    function dragstart(d, i) {
      force.stop() // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
      d.px += d3.event.dx;
      d.py += d3.event.dy;
      d.x += d3.event.dx;
      d.y += d3.event.dy; 
      tick(); 
    }

    function dragend(d, i) {
      d.fixed = true;
      tick();
      force.resume();
    }

    function tick() {
      if (timelineVis) {
        link
          .attr("x1", function(d) { return d.source.xt; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.xt; })
          .attr("y2", function(d) { return d.target.y; });

        node
          .attr("transform", function(d) { return "translate(" + d.xt + "," + d.y + ")"; });
      } else {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        node
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      }
    }

    function update() {
      timelineVis = ! timelineVis;
      node.each(function (d) { d.fixed = false; });
      force.start();
    }

    function mouseover() {
      d3.select(this).select("circle").transition()
        .duration(1)
        .attr("r", 24);
      tooltip.style("visibility", "visible");
      tooltip.text('http:' + d3.select(this).select("circle").select("title").text());
    }

    function mouseout() {
      d3.select(this).select("circle").transition()
        .duration(300)
        .attr("r", 16);
      tooltip.style("visibility", "hidden");
    }

    function click() {
      // Click only if not dragging
      if(!d3.event.defaultPrevented) {
        var url = tooltip.text();

        // Compatibility
        var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

        chrome[runtimeOrExtension].sendMessage({
          message_type: "newtab",
          url: url
        });

      }
    }

  }
})();
