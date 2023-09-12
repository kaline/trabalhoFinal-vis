(function (d3$1) {
  'use strict';

  const titleText = 'Despesas';
  const xAxisLabelText = 'Valores';

  const svg = d3$1.select('svg');

  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const colorSchemes = {
    Empenhado: ['#0000FF', '#0000FF'], // Green
    Pago: ['#FFD700', '#FFD700'], // Yellow
    Liquidado: ['#008000', '#008000'],   // Blue
    //White: ['#FFFFFF', '#FFFFFF']   // White
  };
  
  

  // set the dimensions and margins of the graph
const margin = {top: 50, right: 0, bottom: 50, left: 180},
width1 = 800 - margin.left - margin.right,
height1 = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg1 = d3.select("#my_dataviz1")
.append("svg")
.attr("width", width1 + margin.left + margin.right)
.attr("height", height1 + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);


  const render = (data,colorScheme) => {
    
    const xValue = d => d.value;
    const yValue = d => d.key;
    const margin = { top: 50, right: 40, bottom: 77, left: 180 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3$1.scaleLinear()
      .domain([0, d3$1.max(data, xValue)])
      .range([0, innerWidth]);
    
    const yScale = d3$1.scaleBand()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.1);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xAxisTickFormat = number =>
      d3$1.format('.3s')(number)
        .replace('G', 'B');
    
    const xAxis = d3$1.axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize(-innerHeight);
    
    g.append('g')
      .call(d3$1.axisLeft(yScale))
      .selectAll('.domain, .tick line')
        .remove();
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    const tooltip = g.append("text")
    .attr("class", "tooltip")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0);

    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 65)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabelText);
    
    g.selectAll('rect').data(data)
      .enter().append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))

        .attr('height', yScale.bandwidth())
     	 .attr('fill', colorScheme[0])
    	 .attr('opacity', 0.8)
       .on('mouseenter', function (event, d) {
        	 d3$1.select(this).attr('opacity', 1);
  		})
        .on('mouseleave', function () {
        d3$1.select(this).attr('opacity', 0.8);
        tooltip.style("opacity", 0);
      });

    
      
    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text(titleText);
  };



  d3.csv('orcamentoNew.csv').then(data => {
    data.forEach(d => {
      //Entender este problema do bundle.js
      d['Empenhado'] = +d['Empenhado'].replaceAll(".","");
      d['Pago'] = +d['Pago'].replaceAll(".","");
      d['Liquidado'] = +d['Liquidado'].replaceAll(".", "");

    });
    
    // Remove the data entry where Ano is "Total"
    data = data.filter(d => d.Ano !== "Total");
     var groupedData = d3.nest()
     				
              .key(function (d) { return d.Ano })
              .rollup(function(d) { 

              	return d3.sum(d, function(g) {return g.Empenhado; })
              })
              .entries(data);
    
    // Extract unique values of Resultado Primário
        const uniqueResultadoPrimario = [...new Set(data.map(d => d["Resultado Primário"]))];
    		console.log("uniqueResultadoPrimario ", uniqueResultadoPrimario);
    
    // Extract unique values of Função
        const uniqueFuncao = [...new Set(data.map(d => d["Função"]))];
    		console.log("uniqueFuncao ", uniqueFuncao);
    
    // Extract unique values of Subfunção
        const uniqueSubfuncao = [...new Set(data.map(d => d["Subfunção"]))];
    		console.log("uniqueSunfuncao", uniqueSubfuncao);
    
        const dropdown = document.getElementById('chartSelector');
        const filterSelect = document.getElementById('filter');
        const filterFuncao = document.getElementById('Funcao');
        const filterSubfuncao = document.getElementById('Subfuncao');

    
        // Populate the filter select options
        uniqueResultadoPrimario.forEach(value => {
          var option = document.createElement("option");
  				option.text = value;
          filterSelect.add(option);
        });
    
        // Populate the funcao select options
    		uniqueFuncao.forEach(value => {
        	var optionFuncao = document.createElement("option");
          optionFuncao.text = value;
          filterFuncao.add(optionFuncao);
          
        });


        // Populate the funcao select options
    		uniqueSubfuncao.forEach(value => {
        	var optionSubFuncao = document.createElement("option");
          optionSubFuncao.text = value;
          filterSubfuncao.add(optionSubFuncao);
          
        });
    		

    
    
    const updateChart = () => {
       // Clear the previous chart
      svg.selectAll('*').remove();

    const selectedValue = dropdown.value;
    console.log("selected value dropdown ", selectedValue);
    const selectedDespesaType = filterSelect.value;
    console.log("selected value selectedDespesaType ", selectedDespesaType);
    const selectedFuncaoType = filterFuncao.value;
    console.log("selected value selectedFuncaoType ", selectedFuncaoType);
    const selectedSubfuncaotype = filterSubfuncao.value;
    console.log("selected value selectedFuncaoType ", selectedSubfuncaotype);

    const filteredDespesaData = data.filter((d) => d['Resultado Primário'] === selectedDespesaType ||  d['Função'] === selectedFuncaoType || d['Subfunção'] === selectedSubfuncaotype);
      const groupedData = d3
        .nest()
        .key((d) =>  d.Ano)
        .rollup((d) => {
          return d3.sum(d, (g) => g[selectedValue]);
        })
        .entries(filteredDespesaData);

        console.log("groupedData ", groupedData);
      
      const colorScheme = colorSchemes[selectedValue];
      render(groupedData, colorScheme);
    };

    dropdown.addEventListener('change', updateChart);
    filterSelect.addEventListener('change', updateChart);
    filterFuncao.addEventListener('change', updateChart);
    filterSubfuncao.addEventListener('change', updateChart);
   	updateChart(); // Initial chart rendering.



// X axis
const x = d3.scaleBand()
  .range([ 0, width1 ])
  .domain(data.map(d => d.Ano))
  .padding(0.2);
svg1.append("g")
  .attr("transform", `translate(0, ${height1})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Add Y axis with formatted labels
var formatYAxis = d3.format(","); // Format with commas
// Add Y axis
const y = d3.scaleLinear()
//      .domain([0, d3$1.max(data, xValue)])
.domain([0, d3.max(data, function(d) { return d.Empenhado; })])  
.range([ height1, 0]);
svg1.append("g")
  .call(d3.axisLeft(y).tickFormat(number =>
    d3$1.format('.3s')(number)
      .replace('G', 'B')));

      // Define selectedData with an initial value
let selectedData = "Empenhado";

// Add an event listener for changing the selected data (this could be a dropdown change event or any user interaction)
document.getElementById("data-toggle").addEventListener("change", function () {
  selectedData = this.value; // Update selectedData when the user changes the filter
});

// Bars
svg1.selectAll("mybar")
  .data(data)
  .enter().append("rect")
    .attr("x", d => x(d.Ano))
    .attr("y", function(d) { return y(d.Empenhado); })    
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.Empenhado); })
    .attr("fill", "#69b3a2")
    // Add hover interactions
    // Define selectedData at a scope where it's accessible to both event handlers


    .on("mouseover", function(d, event) {
      // Add code here to handle mouseover event
      // For example, you can change the color of the bar or display a tooltip.
      d3.select(this).attr("fill", "red"); // Change the color to red on hover
      showTooltip(d, event, selectedData);
    })
    .on("mousemove", function(d, event) {
      // Add code here to handle mousemove event
      // For example, you can display a tooltip with information about the bar.
      showTooltip(d, event, selectedData);
    })
    .on("mouseout", function() {
      // Add code here to handle mouseout event
      // For example, you can revert the color of the bar or hide the tooltip.
      d3.select(this).attr("fill", "#69b3a2"); // Revert the color on mouseout
      hideTooltip();
    });
  
console.log(data);
// Define an object to map selectedData values to their corresponding legend labels
var legendData = {
  "Empenhado":{
    label:"Empenhado",
    color: colorSchemes["Empenhado"][0]
  },
  "Pago":{
    label:"Pago",
    color: colorSchemes["Pago"][0]
  },
  "Liquidado":{
    label:"Liquidado",
    color: colorSchemes["Liquidado"][0]
  },
 
};


function showTooltip(d, event, selectedData) {  
  const tooltip = d3.select("#tooltip");
  let formattedValue;

  console.log("event ", event)
  console.log("d ",d);
  console.log("Selected Data:", selectedData); // Log the selectedData to the console
  console.log("formattedValue ", formattedValue)
  console.log("Empenhado Type:", typeof d["Empenhado"]);
  console.log("Empenhado Value:", d["Empenhado"]);
  switch (selectedData) {
    case "Empenhado":
      // Check if d["Empenhado"] is a valid numeric value before formatting
      if (!isNaN(parseFloat(d["Empenhado"]))) {
        formattedValue = parseFloat(d["Empenhado"]).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      break;
    case "Pago":
      // Similar check for "Pago" data
      if (!isNaN(parseFloat(d["Pago"]))) {
        formattedValue = parseFloat(d["Pago"]).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      break;
    case "Liquidado":
      // Similar check for "Liquidado" data
      if (!isNaN(parseFloat(d["Liquidado"]))) {
        formattedValue = parseFloat(d["Liquidado"]).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      break;
    default:
      formattedValue = "";
  }


  tooltip
  .html(`Ano: ${d["Ano"]}<br>${selectedData}: R$ ${formattedValue}`)
  .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY - 10 + "px")
    .style("opacity", 0.9)
    .style("position", "absolute"); 

  tooltip.node().classList.add("show"); // Add a class to show the tooltip
}

// Function to hide the tooltip
function hideTooltip() {
  const tooltip = d3.select("#tooltip");
  tooltip.style("opacity", 0);
  tooltip.node().classList.remove("show"); // Remove the class to hide the tooltip
}
    


// Function to update the bars based on selected data
function updateBars(selectedData) {
  var yKey;
  var color;

    // Get the legend data for the selectedData from the legendData object
  var legendDataItem = legendData[selectedData];

  if (legendDataItem) {
    yKey = selectedData;
    color = legendDataItem.color; // Use the color from legendData
  } else {
    // Handle other cases or set a default behavior
  }
  switch (selectedData) {
    case "Empenhado":
      yKey = "Empenhado";
      color = colorSchemes[selectedData][0]; // Use the first color for Empenhado
      break;
    case "Pago":
      yKey = "Pago";
      color = colorSchemes[selectedData][0]; // Use the first color for Pago
      break;
    case "Liquidado":
      yKey = "Liquidado";
      color = colorSchemes[selectedData][0]; // Use the first color for Liquidado
      break;
    default:
      // Handle other cases or set a default behavior
      break;
  }

  svg1.selectAll("rect")
      .data(data)
      .transition()
      .duration(500)
      .attr("y", function(d) { return y(d[yKey]); })
      .attr("height", function(d) { return height - y(d[yKey]); })
      .attr("fill", color);

   // Update the legend with the selectedData label and color
   updateLegend(legendDataItem);
}

// Function to update the legend element with the selectedData label and color
function updateLegend(legendDataItem) {
  // Assuming you have an HTML element with the id "legend" to display the legend
  var legendElement = document.getElementById("legend");

  if (legendDataItem) {
    // Update the legend text with the selectedData label
    legendElement.textContent = legendDataItem.label;

    // Set the color of the legend text
    legendElement.style.color = legendDataItem.color;
  } else {
    // Handle other cases or set a default behavior
    legendElement.textContent = ""; // Clear the legend text
    legendElement.style.color = ""; // Reset the color to its default state
  }
}
// Initial rendering of bars with "Empenhado" data
updateBars("Empenhado");

 // Function to update the color square based on the selected data
 function updateColorSquare() {
  const selectedData = document.getElementById("data-toggle").value;
  const colorSquare = document.getElementById("colorSquare");

  // Get the color for the selectedData from the colorSchemes object
  const color = colorSchemes[selectedData] ? colorSchemes[selectedData][0] : '';

  // Update the background color of the square
  colorSquare.style.backgroundColor = color;
}
 // Add an event listener to the select element to update the color square
 document.getElementById("data-toggle").addEventListener("change", updateColorSquare);
// Initialize the color square with the default selectedData
updateColorSquare();

// Add an event listener to the dropdown menu
d3.select("#data-toggle").on("change", function() {
  var selectedData = d3.select(this).property("value");
  updateBars(selectedData);
  console.log("selectedData ", selectedData)
});


})

/* 

// Initial chart state
let currentChart = 1;

// Function to update the chart based on the current state
function changeChart() {
  const chartContainer = document.getElementById('chart-container');

  // Clear the existing chart
  chartContainer.innerHTML = '';

  // Render the current chart based on the state
  if (currentChart === 1) {
    //render();
  } else if (currentChart === 2) {
    //render1();
  }
} */

// Add an event listener to the "Next" button
/* const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', () => {
  // Toggle between Chart 1 and Chart 2
  currentChart = currentChart === 1 ? 2 : 1;
  changeChart();
});

// Initial rendering of the chart
changeChart();
 */
// Set the dimensions and margins of the graph
var margin2 = { top: 10, right: 10, bottom: 10, left: 10 },
  width2 = 445 - margin2.left - margin2.right,
  height2 = 445 - margin2.top - margin2.bottom;

// Append the SVG object to the body of the page
var svg2 = d3
  .select("#my_dataviz2")
  .append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


     // Define color scale for values
     const colorScale = d3.scaleOrdinal()
     .domain(["Empenhado3", "Liquidado3", "Pago3"])
     .range(["#1f77b4", "#ff7f0e", "#2ca02c"]); // Define colors for each value

 // Define chart dimensions
 const margin3 = {top: 100, right: 40, bottom: 50, left: 180},
 width3 = 1200 - margin3.left - margin3.right,
 height3 = 600 - margin3.top - margin3.bottom;

 // Create SVG canvas
 const svg3 = d3.select("#my_dataviz3")
     .append("svg")
     .attr("width", width3)
     .attr("height", height3);

 // Load data from CSV file
 d3.csv("orcamentoNew.csv").then(function (data) {

  const maxValue = d3.max(data, d => Math.max(d.Empenhado, d.Liquidado, d.Pago));
     // Parse data types as needed
     data.forEach(function (d) {
         d.Empenhado = +d.Empenhado;
         d.Liquidado = +d.Liquidado;
         d.Pago = +d.Pago;
     });

     // Define scales
     const xScale3 = d3.scaleBand()
         .domain(data.map(d => d.Ano))
         .range([margin3.left, width3 - margin3.right])
         .padding(0.1);

     const yScale3 = d3.scaleLinear()
         .domain([0, maxValue])
         .range([height3 - margin3.bottom, margin3.top]);

     // Create and append bars for Empenhado
     svg3.selectAll(".empenhado-bar3")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "empenhado-bar3")
         .attr("x", d => xScale3(d.Ano))
         .attr("y", d => yScale3(d.Empenhado3))
         .attr("width", xScale3.bandwidth())
         .attr("height", d => yScale3(0) - yScale3(d.Empenhado))
         .attr("fill", colorScale("Empenhado3")); // Assign color for Empenhado

     // Create and append bars for Liquidado
     svg3.selectAll(".liquidado-bar3")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "liquidado-bar3")
         .attr("x", d => xScale3(d.Ano))
         .attr("y", d => yScale3(d.Liquidado))
         .attr("width", xScale3.bandwidth())
         .attr("height", d => yScale3(0) - yScale3(d.Liquidado))
         .attr("fill", colorScale("Liquidado3")); // Assign color for Liquidado

     // Create and append bars for Pago
     svg3.selectAll(".pago-bar3")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "pago-bar3")
         .attr("x", d => xScale3(d.Ano))
         .attr("y", d => yScale3(d.Pago))
         .attr("width", xScale3.bandwidth())
         .attr("height", d => yScale3(0) - yScale3(d.Pago))
         .attr("fill", colorScale("Pago3")); // Assign color for Pago

     // Create x-axis
     svg3.append("g")
         .attr("transform", `translate(0,${height3 - margin3.bottom})`)
         .call(d3.axisBottom(xScale3))
         .selectAll("text")
         .style("text-anchor", "middle");

         // Create y-axis with automatically formatted labels
         svg3.append("g")
         .attr("transform", `translate(${margin3.left},0)`)
         .call(d3.axisLeft(yScale3).ticks(5).tickFormat(d3.format(".2s")));
         
     
 });

 // Set the dimensions of the treemap container
 const width4 = 800;
 const height4 = 400;

 // Select the treemap container
 const treemapContainer = d3.select("#treemap");

 // Load the CSV data
 d3.csv("orcamentoNew.csv").then(data => {
   // Create a hierarchical structure from the data
   const root = d3.stratify()
     .id(d => d.Função)
     .parentId(d => d.Pago)
     (data);

   // Create a treemap layout
   const treemap = d3.treemap()
     .size([width4, height4]);

   // Apply the layout to the hierarchical data
   treemap(root);

   // Create color scale (you can customize the colors)
   const color = d3.scaleOrdinal(d3.schemeCategory10);

   // Create an SVG for the treemap
   const svg4 = treemapContainer.append("svg")
     .attr("width", width4)
     .attr("height", height4);

   // Create groups for each node and add rectangles
   const cell = svg4.selectAll("g")
     .data(root.descendants())
     .enter().append("g")
     .attr("transform", d => `translate(${d.x0},${d.y0})`);

   cell.append("rect")
     .attr("width", d => d.x1 - d.x0)
     .attr("height", d => d.y1 - d.y0)
     .attr("fill", d => color(d.depth));

   // Add text labels
   cell.append("text")
     .attr("x", 3)
     .attr("y", 13)
     .text(d => d.data.Subcategory);
 });

}(d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIHNlbGVjdCxcbiAgY3N2LFxuICBzY2FsZUxpbmVhcixcbiAgbWF4LFxuICBzY2FsZUJhbmQsXG4gIGF4aXNMZWZ0LFxuICBheGlzQm90dG9tLFxuICBmb3JtYXQsXG4gIGFycmF5LFxufSBmcm9tICdkMyc7XG5cbmNvbnN0IHRpdGxlVGV4dCA9ICdEZXNwZXNhcyc7XG5jb25zdCB4QXhpc0xhYmVsVGV4dCA9ICdWYWxvcmVzJztcblxuY29uc3Qgc3ZnID0gc2VsZWN0KCdzdmcnKTtcblxuY29uc3Qgd2lkdGggPSArc3ZnLmF0dHIoJ3dpZHRoJyk7XG5jb25zdCBoZWlnaHQgPSArc3ZnLmF0dHIoJ2hlaWdodCcpO1xuXG5jb25zdCBjb2xvclNjaGVtZXMgPSB7XG4gIEVtcGVuaGFkbzogWycjMWY3N2I0JywgJyNhZWM3ZTgnXSxcbiAgUGFnbzogWycjZmY3ZjBlJywgJyNmZmJiNzgnXSxcbn07XG5cbmNvbnN0IHJlbmRlciA9IChkYXRhLGNvbG9yU2NoZW1lKSA9PiB7XG4gIFxuICBjb25zdCB4VmFsdWUgPSBkID0+IGQudmFsdWU7XG4gIGNvbnN0IHlWYWx1ZSA9IGQgPT4gZC5rZXk7XG4gIGNvbnN0IG1hcmdpbiA9IHsgdG9wOiA1MCwgcmlnaHQ6IDQwLCBib3R0b206IDc3LCBsZWZ0OiAxODAgfTtcbiAgY29uc3QgaW5uZXJXaWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG4gIGNvbnN0IGlubmVySGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gIFxuICBjb25zdCB4U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihbMCwgbWF4KGRhdGEsIHhWYWx1ZSldKVxuICAgIC5yYW5nZShbMCwgaW5uZXJXaWR0aF0pO1xuICBcbiAgY29uc3QgeVNjYWxlID0gc2NhbGVCYW5kKClcbiAgICAuZG9tYWluKGRhdGEubWFwKHlWYWx1ZSkpXG4gICAgLnJhbmdlKFswLCBpbm5lckhlaWdodF0pXG4gICAgLnBhZGRpbmcoMC4xKTtcbiAgXG4gIGNvbnN0IGcgPSBzdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke21hcmdpbi5sZWZ0fSwke21hcmdpbi50b3B9KWApO1xuICBcbiAgY29uc3QgeEF4aXNUaWNrRm9ybWF0ID0gbnVtYmVyID0+XG4gICAgZm9ybWF0KCcuM3MnKShudW1iZXIpXG4gICAgICAucmVwbGFjZSgnRycsICdCJyk7XG4gIFxuICBjb25zdCB4QXhpcyA9IGF4aXNCb3R0b20oeFNjYWxlKVxuICAgIC50aWNrRm9ybWF0KHhBeGlzVGlja0Zvcm1hdClcbiAgICAudGlja1NpemUoLWlubmVySGVpZ2h0KTtcbiAgXG4gIGcuYXBwZW5kKCdnJylcbiAgICAuY2FsbChheGlzTGVmdCh5U2NhbGUpKVxuICAgIC5zZWxlY3RBbGwoJy5kb21haW4sIC50aWNrIGxpbmUnKVxuICAgICAgLnJlbW92ZSgpO1xuICBcbiAgY29uc3QgeEF4aXNHID0gZy5hcHBlbmQoJ2cnKS5jYWxsKHhBeGlzKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsJHtpbm5lckhlaWdodH0pYCk7XG4gIFxuICBjb25zdCB0b29sdGlwID0gZy5hcHBlbmQoXCJ0ZXh0XCIpXG4gIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b29sdGlwXCIpXG4gIC5hdHRyKFwieFwiLCAwKVxuICAuYXR0cihcInlcIiwgMClcbiAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcblxuICBcbiAgeEF4aXNHLnNlbGVjdCgnLmRvbWFpbicpLnJlbW92ZSgpO1xuICBcbiAgeEF4aXNHLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcy1sYWJlbCcpXG4gICAgICAuYXR0cigneScsIDY1KVxuICAgICAgLmF0dHIoJ3gnLCBpbm5lcldpZHRoIC8gMilcbiAgICAgIC5hdHRyKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgIC50ZXh0KHhBeGlzTGFiZWxUZXh0KTtcbiAgXG4gIGcuc2VsZWN0QWxsKCdyZWN0JykuZGF0YShkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cigneScsIGQgPT4geVNjYWxlKHlWYWx1ZShkKSkpXG4gICAgICAuYXR0cignd2lkdGgnLCBkID0+IHhTY2FsZSh4VmFsdWUoZCkpKVxuXG4gICAgICAuYXR0cignaGVpZ2h0JywgeVNjYWxlLmJhbmR3aWR0aCgpKVxuICAgXHQgLmF0dHIoJ2ZpbGwnLCBjb2xvclNjaGVtZVswXSlcbiAgXHQgLmF0dHIoJ29wYWNpdHknLCAwLjgpXG4gICAgIC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uIChldmVudCwgZCkge1xuICAgICAgXHQgc2VsZWN0KHRoaXMpLmF0dHIoJ29wYWNpdHknLCAxKTtcbiAgICAgIC8vc2VsZWN0KHRoaXMpLmF0dHIoJ29wYWNpdHknLCAxKTtcbiAgICAgLy8gdG9vbHRpcC50ZXh0KHhWYWx1ZShkKSkgIC8vIFVwZGF0ZSB0aGUgdG9vbHRpcCB0ZXh0IHdpdGggdGhlIHhWYWx1ZSBvZiB0aGUgYmFyXG4gICAgICAgLy8gLmF0dHIoXCJ4XCIsIHhTY2FsZSh4VmFsdWUoZCkpICsgNSkgIC8vIFBvc2l0aW9uIHRoZSB0b29sdGlwIG5lYXIgdGhlIGJhclxuICAgICAgIC8vIC5hdHRyKFwieVwiLCB5U2NhbGUoeVZhbHVlKGQpKSArIHlTY2FsZS5iYW5kd2lkdGgoKSAvIDIpXG4gICAgICAgLy8gLnN0eWxlKFwib3BhY2l0eVwiLCAxKTsgICAgXG5cdFx0fSlcbiAgICAgIC5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGVjdCh0aGlzKS5hdHRyKCdvcGFjaXR5JywgMC44KTtcbiAgICAgIHRvb2x0aXAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuICAgIH0pO1xuXG4gIFxuICAgIFxuICBnLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAndGl0bGUnKVxuICAgICAgLmF0dHIoJ3knLCAtMTApXG4gICAgICAudGV4dCh0aXRsZVRleHQpO1xufTtcblxuXG5cbmQzLmNzdignb3JjYW1lbnRvRGF0YS5jc3YnKS50aGVuKGRhdGEgPT4ge1xuICBkYXRhLmZvckVhY2goZCA9PiB7XG4gICAgZFsnRW1wZW5oYWRvJ10gPSArZFsnRW1wZW5oYWRvJ10ucmVwbGFjZUFsbChcIi5cIixcIlwiKTtcbiAgICAgIGRbJ1BhZ28nXSA9ICtkWydQYWdvJ10ucmVwbGFjZUFsbChcIi5cIixcIlwiKTtcblxuICB9KTtcbiAgXG4gIC8vIFJlbW92ZSB0aGUgZGF0YSBlbnRyeSB3aGVyZSBBbm8gaXMgXCJUb3RhbFwiXG4gIGRhdGEgPSBkYXRhLmZpbHRlcihkID0+IGQuQW5vICE9PSBcIlRvdGFsXCIpO1xuICAgdmFyIGdyb3VwZWREYXRhID0gZDMubmVzdCgpXG4gICBcdFx0XHRcdFxuICAgICAgICAgICAgLmtleShmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5Bbm8gfSlcbiAgICAgICAgICAgIC5yb2xsdXAoZnVuY3Rpb24oZCkgeyBcblxuICAgICAgICAgICAgXHRyZXR1cm4gZDMuc3VtKGQsIGZ1bmN0aW9uKGcpIHtyZXR1cm4gZy5FbXBlbmhhZG87IH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVudHJpZXMoZGF0YSk7XG4gIFxuICAvLyBFeHRyYWN0IHVuaXF1ZSB2YWx1ZXMgb2YgUmVzdWx0YWRvIFByaW3Dg8KhcmlvXG4gICAgICBjb25zdCB1bmlxdWVSZXN1bHRhZG9QcmltYXJpbyA9IFsuLi5uZXcgU2V0KGRhdGEubWFwKGQgPT4gZFtcIlJlc3VsdGFkbyBQcmltw4PCoXJpb1wiXSkpXTtcbiAgXHRcdGNvbnNvbGUubG9nKFwidW5pcXVlUmVzdWx0YWRvUHJpbWFyaW8gXCIsIHVuaXF1ZVJlc3VsdGFkb1ByaW1hcmlvKVxuICBcbiAgLy8gRXh0cmFjdCB1bmlxdWUgdmFsdWVzIG9mIEZ1bsODwqfDg8Kjb1xuICAgICAgY29uc3QgdW5pcXVlRnVuY2FvID0gWy4uLm5ldyBTZXQoZGF0YS5tYXAoZCA9PiBkW1wiRnVuw4PCp8ODwqNvXCJdKSldO1xuICBcdFx0Y29uc29sZS5sb2coXCJ1bmlxdWVGdW5jYW8gXCIsIHVuaXF1ZUZ1bmNhbylcbiAgXG4gIC8vIEV4dHJhY3QgdW5pcXVlIHZhbHVlcyBvZiBTdWJmdW7Dg8Knw4PCo29cbiAgICAgIGNvbnN0IHVuaXF1ZVN1YmZ1bmNhbyA9IFsuLi5uZXcgU2V0KGRhdGEubWFwKGQgPT4gZFtcIlN1YmZ1bsODwqfDg8Kjb1wiXSkpXTtcbiAgXHRcdGNvbnNvbGUubG9nKFwidW5pcXVlU3VuZnVuY2FvXCIsIHVuaXF1ZVN1YmZ1bmNhbylcbiAgXG4gICAgICBjb25zdCBkcm9wZG93biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFydFNlbGVjdG9yJyk7XG4gICAgICBjb25zdCBmaWx0ZXJTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsdGVyJyk7XG4gICAgICBjb25zdCBmaWx0ZXJGdW5jYW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnRnVuY2FvJyk7XG4gIFxuICAgICAgLy8gUG9wdWxhdGUgdGhlIGZpbHRlciBzZWxlY3Qgb3B0aW9uc1xuICAgICAgdW5pcXVlUmVzdWx0YWRvUHJpbWFyaW8uZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuXHRcdFx0XHRvcHRpb24udGV4dCA9IHZhbHVlO1xuICAgICAgICBmaWx0ZXJTZWxlY3QuYWRkKG9wdGlvbik7XG4gICAgICB9KTtcbiAgXG4gICAgICAvLyBQb3B1bGF0ZSB0aGUgZnVuY2FvIHNlbGVjdCBvcHRpb25zXG4gIFx0XHR1bmlxdWVGdW5jYW8uZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICBcdHZhciBvcHRpb25GdW5jYW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICBvcHRpb25GdW5jYW8udGV4dCA9IHZhbHVlO1xuICAgICAgICBmaWx0ZXJGdW5jYW8uYWRkKG9wdGlvbkZ1bmNhbyk7XG4gICAgICAgIFxuICAgICAgfSlcbiAgXHRcdFxuXG4gIFxuICBcbiAgY29uc3QgdXBkYXRlQ2hhcnQgPSAoKSA9PiB7XG4gICAgIC8vIENsZWFyIHRoZSBwcmV2aW91cyBjaGFydFxuICAgIHN2Zy5zZWxlY3RBbGwoJyonKS5yZW1vdmUoKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkVmFsdWUgPSBkcm9wZG93bi52YWx1ZTtcbiAgICBjb25zdCBzZWxlY3RlZERlc3Blc2FUeXBlID0gZmlsdGVyU2VsZWN0LnZhbHVlO1xuICAgIGNvbnN0IHNlbGVjdGVkRnVuY2FvVHlwZSA9IGZpbHRlckZ1bmNhby52YWx1ZTtcbiAgICBjb25zb2xlLmxvZyhzZWxlY3RlZEZ1bmNhb1R5cGUpO1xuICAgIGNvbnN0IGZpbHRlcmVkRGVzcGVzYURhdGEgPSBkYXRhLmZpbHRlcigoZCkgPT4gZFsnUmVzdWx0YWRvIFByaW3Dg8KhcmlvJ10gPT09IHNlbGVjdGVkRGVzcGVzYVR5cGUgfHwgIGRbJ0Z1bmNhbyddID09PSBzZWxlY3RlZEZ1bmNhb1R5cGUpO1xuICAgIGNvbnN0IGZpbHRlcmVkRnVuY2FvRGF0YSA9IGRhdGEuZmlsdGVyKChkKSA9PiBkWydGdW5jYW8nXSA9PT0gc2VsZWN0ZWRGdW5jYW9UeXBlKTtcbiAgICBjb25zdCBncm91cGVkRGF0YSA9IGQzXG4gICAgICAubmVzdCgpXG4gICAgICAua2V5KChkKSA9PiAgZC5Bbm8pXG4gICAgICAucm9sbHVwKChkKSA9PiB7XG4gICAgICAgIHJldHVybiBkMy5zdW0oZCwgKGcpID0+IGdbc2VsZWN0ZWRWYWx1ZV0pO1xuICAgICAgfSlcbiAgICAgIC5lbnRyaWVzKGZpbHRlcmVkRGVzcGVzYURhdGEpO1xuICAgIFxuICAgIGNvbnN0IGNvbG9yU2NoZW1lID0gY29sb3JTY2hlbWVzW3NlbGVjdGVkVmFsdWVdO1xuICAgIHJlbmRlcihncm91cGVkRGF0YSwgY29sb3JTY2hlbWUpO1xuICB9O1xuXG4gIGRyb3Bkb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoYXJ0KTtcbiAgZmlsdGVyU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoYXJ0KTtcbiAgZmlsdGVyRnVuY2FvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoYXJ0KTtcbiBcdHVwZGF0ZUNoYXJ0KCk7IC8vIEluaXRpYWwgY2hhcnQgcmVuZGVyaW5nLlxuXG5cblxuXG59KTsiXSwibmFtZXMiOlsic2VsZWN0Iiwic2NhbGVMaW5lYXIiLCJtYXgiLCJzY2FsZUJhbmQiLCJmb3JtYXQiLCJheGlzQm90dG9tIiwiYXhpc0xlZnQiXSwibWFwcGluZ3MiOiI7OztFQVlBLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQztFQUM3QixNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUM7QUFDakM7RUFDQSxNQUFNLEdBQUcsR0FBR0EsV0FBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCO0VBQ0EsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ2pDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuQztFQUNBLE1BQU0sWUFBWSxHQUFHO0VBQ3JCLEVBQUUsU0FBUyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztFQUNuQyxFQUFFLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7RUFDOUIsQ0FBQyxDQUFDO0FBQ0Y7RUFDQSxNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEtBQUs7RUFDckM7RUFDQSxFQUFFLE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO0VBQzlCLEVBQUUsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENB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