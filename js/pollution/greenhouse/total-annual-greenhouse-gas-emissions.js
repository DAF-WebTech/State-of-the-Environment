var csv = '%frontend_asset_metadata_data-file^as_asset:asset_file_contents^replace:\r\n:\\n%';

var results = Papa.parse(
	csv,
	{
		skipEmptyLines: true,
		dynamicTyping: true
	}
);

var dataHead = results.data.shift();
var data = results.data;
var latestYear = dataHead[dataHead.length - 1];

var lastIndex = dataHead.length - 1;

///////////////////////////////////////////////////
var records = {};
data.forEach(function (record) {
	if (!records[record[0]])
		records[record[0]] = {};
	records[record[0]][record[1]] = record;
});

var arrayHead = ["Sector", "Emissions (million tonnes)"];
var arrayBody = [];
for (record in records.Queensland) {
	if (record != "All")
		arrayBody.push([records.Queensland[record][1], records.Queensland[record][lastIndex]]);
}
arrayBody.sort(function (a, b) {
	return a[0] > b[0] ? 1 : -1;
});
var arrayTable = [arrayHead].concat(arrayBody);


var heading = "Proportion of Queensland's emissions by sector, " + latestYear;
var index = 0;
var region = "queensland";

var htmlTable = tableToHtml(arrayTable, false, Number.prototype.toFixed, [3]);
print(String.format(regionInfoTemplate, region, heading, index++, htmlTable.thead, htmlTable.tbody));

var chartOptions = getDefaultPieChartOptions();
var chartData = [{ type: "pie", options: chartOptions, data: arrayTable }];


//////////////////////////////////////////////////////////
arrayHead = ["Sector", "Qld", "NSW", "Vic", "WA", "SA", "NT", "Tas", "ACT"];
arrayBody = [];
Object.keys(records).forEach(function (state) {
	Object.keys(records[state]).forEach(function (sector, i) {
		if (state == "Queensland") //this is first, so we can initialise our rows
			arrayBody.push([sector]);
		arrayBody[i].push(records[state][sector][lastIndex]);
	});
});
arrayBody.shift(); // get rid of "All"
arrayBody.sort(function (a, b) {
	return a[0] > b[0] ? 1 : -1;
});
arrayTable = [arrayHead].concat(arrayBody);

heading = "Comparison of state and territory emissions by sector,  " + latestYear;
htmlTable = tableToHtml(arrayTable, false, Number.prototype.toFixed, [3]);
print(String.format(regionInfoTemplate, region, heading, index++, htmlTable.thead, htmlTable.tbody));

chartOptions = getDefaultBarChartOptions();
chartOptions.hAxis.format = "#m";
chartOptions.hAxis.title = "Emissions (million tonnes of carbon dioxide equivalent)";
chartOptions.isStacked = true;
chartOptions.vAxis.title = "State";
chartData.push({ type: "bar", options: chartOptions, data: arrayTable.transpose() });

///////////////////////////////////////////////////////////////////////////////
var qldRecords = records.Queensland;
var allQld = qldRecords.All;
delete qldRecords.All;
arrayHead = ["Sector"].concat(dataHead.slice(2));
arrayHead = arrayHead.map(function (h) { return h.toString() }); // turns year Number types into strings
arrayBody = [];
for (sector in qldRecords) {
	arrayBody.push(qldRecords[sector].slice(1));
}
arrayBody.sort(function (a, b) {
	return a[2] < b[2] ? 1 : -1;
});

arrayTable = [arrayHead].concat(arrayBody);
console.log(arrayTable);

heading = "Trends in Queensland emissions, by sector";
htmlTable = tableToHtml(arrayTable, false, Number.prototype.toFixed, [3]);
print(String.format(regionInfoTemplate, region, heading, index++, htmlTable.thead, htmlTable.tbody));

chartOptions = getDefaultLineChartOptions();
chartOptions.isStacked = true;
chartOptions.vAxis.format = "#m";
chartOptions.vAxis.title = "Tonnes (million)";
chartData.push({ type: "line", options: chartOptions, data: arrayTable.transpose() });

/////////////////////////////////////////////////////////////////////////////////////////////////
arrayHead[0] = "";
arrayBody = ["Emissions (million tonnes)"];
for (var i = 2; i <= lastIndex; ++i)
	arrayBody.push(allQld[i])
arrayTable = [arrayHead, arrayBody];
heading = "Total Queensland emissions";
htmlTable = tableToHtml(arrayTable, false, Number.prototype.toFixed, [3]);
print(String.format(regionInfoTemplate, region, heading, index++, htmlTable.thead, htmlTable.tbody));

arrayTable[0][0] = "Year";
chartOptions = getDefaultLineChartOptions();
chartOptions.legend.position = "none";
chartOptions.vAxis.format = "#m";
chartOptions.vAxis.minValue = 0;
chartOptions.vAxis.title = "Tonnes (million)";
chartData.push({ type: "line", options: chartOptions, data: arrayTable.transpose() });

print("<script id=chartdata type=application/json>" + JSON.stringify(chartData) + "</" + "script>");
