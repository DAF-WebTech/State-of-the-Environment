
//print(String.format(regionInfoTemplate, "queensland", "heading", 0, "", "", "", "", "", ""));

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

// write it out as array
var table = [["Broad vegetation group", "Protected vegetation", "Non-protected vegetation"]];
Object.keys(groups).forEach(function(groupName) {
	var group = groups[groupName];
	table.push([groupName, group.p, group.np]);
});

// convert to html
var htmlTable = tableToHtml(table);

// write out first table
var index = 0;
var region = "queensland"
print(String.format(regionInfoTemplate, region, "Hectares of broad vegetation groups in protected areas, 2015", index, htmlTable.thead, htmlTable.tbody));

var chartData = [table];
print("<script id=chartdata type=application/json>" + JSON.stringify(chartData) + "</" + "script>");
