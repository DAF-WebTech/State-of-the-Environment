
var csv = '%globals_asset_file_contents:75^replace:\r\n:\\n%';
var results = Papa.parse(
	csv,
	{
		skipEmptyLines: true,
		dynamicTyping: true
	}
);

var headData = results.data[0];
var data = results.data.slice(1);

// group the data for the first table
var groups = {};
data.forEach(function(record) {
	var group = String.format("{0}. {1}", record[1], record[2]);
	if (!groups[group]) {
		groups[group] = { p: 0, np: 0 };
	}
	groups[group].p += record[4];
	groups[group].np += record[5];
});

var groupNames = Object.keys(groups);

// write it out as array
var table = [["Broad vegetation group", "Protected vegetation", "Non-protected vegetation"]];
groupNames.forEach(function(groupName) {
	var group = groups[groupName];
	table.push([groupName, group.p, group.np]);
});

// convert to html
var htmlTable = tableToHtml(table, true);

// write out first table
var index = 0;
var region = "queensland";
var year = "2015";
var heading = "Hectares of broad vegetation groups in protected areas, " + year;
print(String.format(regionInfoTemplate, region, heading, index, htmlTable.thead, htmlTable.tbody, htmlTable.tfoot));

// chart uses same data layout
var options = getDefaultColumnChartOptions();
options.hAxis.title = "Broad Vegetation Group";
options.vAxis.title = "Hectares (million)";
options.vAxis.format = "short";
var chartData = [{type: "column", options: options, data: table}];


////////////////////////////////////////////////////////////////////////////////////////////////////
++index;

table = [["Type", "Area (hectares)"], ["Protected", 0], ["Non-protected", 0]];
// get a sum of each type
groupNames.forEach(function(groupName) {
	var group = groups[groupName];
	table[1][1] += group.p;
	table[2][1] += group.np;
});
htmlTable = tableToHtml(table);
heading = "Proportion of total remnant vegetation in protected areas, " + year;
print(String.format(regionInfoTemplate, region, heading, index, htmlTable.thead, htmlTable.tbody));

// chart uses same data layout
options = getDefaultPieChartOptions();
chartData.push({type: "pie", options: options, data: table});
print("<script id=chartdata type=application/json>" + JSON.stringify(chartData) + "</" + "script>");

