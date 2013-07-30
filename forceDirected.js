;
(function () {
  plotPathmark = function (links, nodes, width, height) {  
    
    var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(60)
      .charge(-300)
      .on("tick", tick)
      .start();

    // consider pulling some/all of these styles out to css
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
      .attr("width", width)
      .attr("height", height)
      .style("left", 0)
      .style("top", 0)
      .style("position", "fixed")
      .style("z-index", 111111112)
      .style("pointer-events", "none");

    var link = svg.selectAll(".link")
      .data(force.links())
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", "white")
      .style("stroke-width", 3);

    var node = svg.selectAll(".node")
      .data(force.nodes())
      .enter().append("g")
      .attr("class", "node")
      .style("pointer-events", "all")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", click)
      .call(force.drag);

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

    function tick() {
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
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
