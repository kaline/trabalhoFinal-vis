import {
  select,
  csv,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
  format,
  array,
} from 'd3';

const titleText = 'Despesas';
const xAxisLabelText = 'Valores';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const colorSchemes = {
  Empenhado: ['#1f77b4', '#aec7e8'],
  Pago: ['#ff7f0e', '#ffbb78'],
};

const render = (data,colorScheme) => {
  
  const xValue = d => d.value;
  const yValue = d => d.key;
  const margin = { top: 50, right: 40, bottom: 77, left: 180 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);
  
  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xAxisTickFormat = number =>
    format('.3s')(number)
      .replace('G', 'B');
  
  const xAxis = axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight);
  
  g.append('g')
    .call(axisLeft(yScale))
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
      	 select(this).attr('opacity', 1);
      //select(this).attr('opacity', 1);
     // tooltip.text(xValue(d))  // Update the tooltip text with the xValue of the bar
       // .attr("x", xScale(xValue(d)) + 5)  // Position the tooltip near the bar
       // .attr("y", yScale(yValue(d)) + yScale.bandwidth() / 2)
       // .style("opacity", 1);    
		})
      .on('mouseleave', function () {
      select(this).attr('opacity', 0.8);
      tooltip.style("opacity", 0);
    });

  
    
  g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .text(titleText);
};



d3.csv('public/orcamentoData.csv').then(data => {
  data.forEach(d => {
      d['Empenhado'] = +d['Empenhado'].replaceAll(".","");
      d['Pago'] = +d['Pago'].replaceAll(".","");

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
  		console.log("uniqueResultadoPrimario ", uniqueResultadoPrimario)
  
  // Extract unique values of Função
      const uniqueFuncao = [...new Set(data.map(d => d["Função"]))];
  		console.log("uniqueFuncao ", uniqueFuncao)
  
  // Extract unique values of Subfunção
      const uniqueSubfuncao = [...new Set(data.map(d => d["Subfunção"]))];
  		console.log("uniqueSunfuncao", uniqueSubfuncao)
  
      const dropdown = document.getElementById('chartSelector');
      const filterSelect = document.getElementById('filter');
      const filterFuncao = document.getElementById('Funcao');
      const filterSubFuncao = document.getElementById('Subfuncao');

  
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
        
      })

      // Populate the funcao select options
  		uniqueSubfuncao.forEach(value => {
      	var optionFuncao = document.createElement("option");
        optionFuncao.text = value;
        filterFuncao.add(optionFuncao);
        
      })
  		

  
  
  const updateChart = () => {
     // Clear the previous chart
    svg.selectAll('*').remove();

    const selectedValue = dropdown.value;
    console.log("selected value dropdown ", selectedValue);
    const selectedDespesaType = filterSelect.value;
    console.log("selected value selectedDespesaType ", selectedDespesaType);
    const selectedFuncaoType = filterFuncao.value;
    console.log("selected value selectedFuncaoType ", selectedFuncaoType);
    const filteredDespesaData = data.filter((d) => d['Resultado Primário'] === selectedDespesaType ||  d['Funcao'] === selectedFuncaoType);
    const groupedData = d3
      .nest()
      .key((d) =>  d.Ano)
      .rollup((d) => {
        return d3.sum(d, (g) => g[selectedValue]);
      })
      .entries(filteredDespesaData);
    
      console.log("grouped data ", groupedData)
    const colorScheme = colorSchemes[selectedValue];
    render(groupedData, colorScheme);
  };

  dropdown.addEventListener('change', updateChart);
  filterSelect.addEventListener('change', updateChart);
  filterFuncao.addEventListener('change', updateChart);
 	updateChart(); // Initial chart render