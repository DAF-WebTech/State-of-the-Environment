var csv = '%frontend_asset_metadata_data-file^as_asset:asset_file_contents^replace:\r\n:\\n%';
var results = Papa.parse(
	csv,
	{
		skipEmptyLines: true,
		dynamicTyping: true
	}
);

var headData = results.data[0];
var data = results.data.slice(1);
var latestYear = headData[headData.length - 1];

//group by region
var regions = { /*queensland: []*/ };
data.forEach(function (record) {
	var region = record[1];
	if (!regions[region])
		regions[region] = [];
	regions[region].push(record);

});
var regionNames = Object.keys(regions);

var chartData = [];
var index = 0;

///////////////////////////////////////////////////
// 1. column for qld
var arrayTable = [["Bioregion", "Endangered", "Of concern", "No concern at present"]];
regionNames.forEach(function (regionName) {
	var region = regions[regionName];
	var arrayRow = [regionName];
	for (var i = 0; i < region.length; ++i) {
		arrayRow.push(region[i][3]);
	}

	arrayTable.push(arrayRow);
});

var htmlTable = tableToHtml(arrayTable, true);
var heading = String.format("Proportion of regional ecosystems by biodiversity status, {0}", latestYear);

print(String.format(regionInfoTemplate, "queensland", heading, index++, htmlTable.thead, htmlTable.tbody, htmlTable.tfoot));

var columnChartOptions = getDefaultColumnChartOptions();
columnChartOptions.vAxis.title = "Regional Ecosystems";
columnChartOptions.hAxis.title = "Bioregion";
columnChartOptions.isStacked = true;
chartData.push({ type: "column", options: columnChartOptions, data: arrayTable });

///////////////////////////////////////////////////
// 2. column for qld
var arrayTable = [["Bioregion", "Endangered", "Of concern", "No concern at present"]];
regionNames.forEach(function (regionName) {
	var region = regions[regionName];
	var arrayRow = [regionName];
	for (var i = 0; i < region.length; ++i) {
		arrayRow.push(region[i][region[i].length - 1]);
	}


	arrayTable.push(arrayRow);
});

var htmlTable = tableToHtml(arrayTable, true);
var heading = String.format("Proportion area of biodiversity status, {0}", latestYear);

print(String.format(regionInfoTemplate, "queensland", heading, index++, htmlTable.thead, htmlTable.tbody, htmlTable.tfoot));

var columnChartOptions = getDefaultColumnChartOptions();
columnChartOptions.vAxis.title = "Hectares";
columnChartOptions.vAxis.format = "short";
columnChartOptions.hAxis.title = "Bioregion";
columnChartOptions.isStacked = true;
chartData.push({ type: "column", options: columnChartOptions, data: arrayTable });


///////////////////////////////////////////////////
// 3. line for qld
var arrayTable = [["Status"], ["Endangered"], ["No concern at present"], ["Of Concern"]];
var years = headData.slice(4);
years.forEach(function(y) {
	arrayTable[0].push(y.toString());
	arrayTable[1].push(0);
	arrayTable[2].push(0);
	arrayTable[3].push(0);
});
for(var i = 0; i < data.length; ++i) {
	for (var j = 4; j < data[i].length; ++j)
		arrayTable[(i % 3) + 1][j-3] += data[i][j];
}

var htmlTable = tableToHtml(arrayTable, true);
var heading = "Trends in extent of remnant vegetation, by biodiversity status";

print(String.format(regionInfoTemplate, "queensland", heading, index++, htmlTable.thead, htmlTable.tbody, htmlTable.tfoot));

arrayTable = arrayTable.transpose();
var chartOptions = getDefaultLineChartOptions();
chartOptions.vAxis.title = "Hectares";
chartOptions.vAxis.format = "short";
chartData.push({ type: "line", options: chartOptions, data: arrayTable });




/////////////////////////////////////////////////////
regionNames.forEach(function (regionName) {

	var region = regions[regionName];

	//1. pie ///////////////////////////////////
	var arrayHead = ["Biodiversity status", "Number of regional ecosystems"];
	var arrayTable = [arrayHead];
	region.forEach(function (r) {
		arrayTable.push([r[2], r[3]]);
	});

	var htmlTable = tableToHtml(arrayTable, true);
	var heading = String.format("Proportion of regional ecosystems by biodiversity status in {0}, {1}", regionName, latestYear);

	print(String.format(regionInfoTemplate, regionName.toKebabCase(), heading, index++, htmlTable.thead, htmlTable.tbody, htmlTable.tfoot));

	// chart uses same data layout
	chartData.push({ type: "pie", options: getDefaultPieChartOptions(), data: arrayTable });


	// 2. pie ////////////////////////////////////////////////////////////
	arrayHead = ["Biodiversity status", "Area (hectares)"];
	var arrayTable = [arrayHead];

	var arrayTable = [arrayHead];
	region.forEach(function (r) {
		arrayTable.push([r[2], r[r.length - 1]]);
	});

	var htmlTable = tableToHtml(arrayTable, true);
	var heading = String.format("Proportion area of biodiversity status in {0}, {1}", regionName, latestYear);

	print(String.format(regionInfoTemplate, regionName.toKebabCase(), heading, index++, htmlTable.thead, htmlTable.tbody, htmlTable.tfoot));

	// chart uses same data layout
	chartData.push({ type: "pie", options: getDefaultPieChartOptions(), data: arrayTable });

	// 3. line //////////////////////////////////////////////////////////////////////

	arrayHead = ["Biodiversity status"];
	arrayHead = arrayHead.concat(headData.slice(4));
	var arrayTable = [arrayHead];

	var arrayTable = [arrayHead];
	region.forEach(function (r) {
		var arrayRow = [r[2]];
		for (var i = 4; i < r.length; ++i)
			arrayRow.push(r[i]);
		arrayTable.push(arrayRow);
	});

	var htmlTable = tableToHtml(arrayTable, true);
	var heading = String.format("Trends in extent of remnant vegetation by biodiversity status in {0}", regionName);

	print(String.format(regionInfoTemplate, regionName.toKebabCase(), heading, index++, htmlTable.thead, htmlTable.tbody, htmlTable.tfoot));

	// chart uses same data layout
	arrayTable = arrayTable.transpose();
	var lineChartOptions = getDefaultLineChartOptions();
	lineChartOptions.vAxis.title = "Hectares";
	lineChartOptions.vAxis.format = "short";
	chartData.push({ type: "line", options: lineChartOptions, data: arrayTable });

});






//////////////////////////////////////////////////////////////////////////

print("<script id=chartdata type=application/json>" + JSON.stringify(chartData) + "</" + "script>");
