const width = 900;
const height = 450;
const margin = { top: 20, right: 30, bottom: 50, left: 50 };

const svg = d3.select("svg");

const xAxisGroup = svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`);

const yAxisGroup = svg.append("g")
  .attr("transform", `translate(${margin.left},0)`);

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// ✅ MOCK DATA (AUTO)
const data = d3.range(60).map((d, i) => ({
  track_id: i,
  track_name: "Track " + i,
  track_genre: ["pop", "rock", "rap", "electro"][Math.floor(Math.random() * 4)],
  energy: Math.random(),
  danceability: Math.random(),
  popularity: Math.floor(Math.random() * 100)
}));

// Populate genre filter
const genres = [...new Set(data.map(d => d.track_genre))].sort();
genres.forEach(g => {
  d3.select("#genre")
    .append("option")
    .attr("value", g)
    .text(g);
});

const x = d3.scaleLinear()
  .domain([0, 1])
  .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
  .domain([0, 1])
  .range([height - margin.bottom, margin.top]);

const r = d3.scaleSqrt()
  .domain([0, 100])
  .range([4, 12]);

xAxisGroup.call(d3.axisBottom(x));
yAxisGroup.call(d3.axisLeft(y));

let currentGenre = "all";

function update() {

  let filtered = data;
  if (currentGenre !== "all") {
    filtered = data.filter(d => d.track_genre === currentGenre);
  }

  const circles = svg.selectAll("circle")
    .data(filtered, d => d.track_id);

  circles.enter()
    .append("circle")
    .merge(circles)
    .transition()
    .duration(600)
    .attr("cx", d => x(d.energy))
    .attr("cy", d => y(d.danceability))
    .attr("r", d => r(d.popularity))
    .attr("fill", "#1DB954")
    .attr("opacity", 0.6);

  circles.exit().remove();

  svg.selectAll("circle")
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 1)
        .html(`
          <strong>${d.track_name}</strong><br>
          Genre : ${d.track_genre}<br>
          Popularité : ${d.popularity}
        `)
        .style("left", event.pageX + 12 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));
}

// Initial render
update();

// Genre filter
d3.select("#genre").on("change", function () {
  currentGenre = this.value;
  update();
});
