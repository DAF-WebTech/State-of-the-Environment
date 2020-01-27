var csv = '%globals_asset_file_contents:76^replace:\r\n:\\n%';
var results = Papa.parse(
	csv,
	{
		skipEmptyLines: true,
		dynamicTyping: true
	}
);


var headData = results.data[0];
var data = results.data.slice(1);

//////////////////////////////////////////////////////////////////

var head = ["Protected Areas"];
for (var i = 2; i < headData.length; i +=3) {
	var year = headData[i].split(" ")[0];
	head.push(year);
}
var table = [head];
data.forEach(function(record) {
	if (record[0] == "All")
		return;

	var row = [record[0]];
	for (var i = 2; i < record.length; i +=3) {
		row.push(record[i]);
	}
	table.push(row);
});

// convert to html
var htmlTable = tableToHtml(table, true);
var heading = "Cumulated number of each protected area";
print(String.format(regionInfoTemplate, "queensland", heading, 0, htmlTable.thead, htmlTable.tbody, htmlTable.tfoot));

var chartData = [];
var chartTable = table.transpose();
chartTable[0].forEach(function(cell, i) {
	cell = {label: cell, type: i == 0 ? "string" : "number"};	
});

var options = getDefaultColumnChartOptions();	
options.vAxis.title = "Number of protected areas";
options.isStacked = true;


chartData.push({type: "column", options: options, data: chartTable});


print("<script id=chartdata type=application/json>" + JSON.stringify(chartData) + "</" + "script>");