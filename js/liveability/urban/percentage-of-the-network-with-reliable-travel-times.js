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

///////////////////////////////////////////////////
var arrayTable = [["Year"], ["AM"], ["Off-Peak"], ["PM"]];
var qFirstIndex = 0;
for (var i = 2; dataHead[i].indexOf("Q") == -1; ++i) {
	arrayTable[0].push(dataHead[i]);
	arrayTable[1].push(data[0][i]);
	arrayTable[2].push(data[1][i]);
	arrayTable[3].push(data[2][i]);
	qFirstIndex = i;
}
qFirstIndex++; // we'll use this in next chart

var heading = "Percentage of network with good travel time reliability";
var index = 0;
var region = "queensland";

var htmlTable = tableToHtml(arrayTable, false)
print(String.format(regionInfoTemplate, region, heading, index++, htmlTable.thead, htmlTable.tbody));

var chart1 = arrayTable.transpose();
for (var i = 1; i < chart1.length; ++i)
	for (var j = 1; j < chart1[i].length; ++j)
		chart1[i][j] = chart1[i][j] / 100;
var chartOptions = getDefaultLineChartOptions();
chartOptions.vAxis.format = "percent";
chartData = [{ type: "line", options: chartOptions, data: chart1 }];


//////////////////////////////////////////////////////////
arrayTable = [["Quarter"]];
var numberTripsIndex = [];
data.forEach(function (d, i) {
	if (d[0] == "Number of trips") {
		arrayTable.push([d[1]]);
		numberTripsIndex.push(i);
	}
});
for (var i = qFirstIndex; i < dataHead.length; ++i) {
	arrayTable[0].push(dataHead[i]);

	numberTripsIndex.forEach(function (j) {
		arrayTable[j - 2].push(data[j][i]);
	});

}

heading = "Millions of Trips by Public Transport Mode in SEQ";
htmlTable = tableToHtml(arrayTable, false, Number.prototype.toFixed, [2])
print(String.format(regionInfoTemplate, region, heading, index++, htmlTable.thead, htmlTable.tbody));

var chart2 = arrayTable.transpose();
chartOptions = getDefaultColumnChartOptions();
chartOptions.vAxis.title = "Trips (millions)";
chartData.push({ type: "column", options: chartOptions, data: chart2 });


//////////////////////////////////////////////////////////////

var arrayTable = [arrayTable.shift()];
var percentTripsIndex = [];
data.forEach(function (d, i) {
	if (d[0] == "Percentage of trips") {
		arrayTable.push([d[1]]);
		percentTripsIndex.push(i);
	}
});
for (var i = qFirstIndex; i < dataHead.length; ++i) {
	percentTripsIndex.forEach(function (j) {
		arrayTable[j - 2 - numberTripsIndex.length].push(data[j][i]);
	});
}

heading = "On-Time Running by Public Transport Mode in SEQ — percentage of Trips";
htmlTable = tableToHtml(arrayTable, false, Number.prototype.toFixed, [2])
print(String.format(regionInfoTemplate, region, heading, index++, htmlTable.thead, htmlTable.tbody));

var chart3 = arrayTable.transpose();
for (var i = 1; i < chart3.length; ++i)
	for (var j = 1; j < chart3[i].length; ++j)
		chart3[i][j] = chart3[i][j] / 100;
chartOptions = getDefaultLineChartOptions();
chartOptions.vAxis.title = "Reliability";
chartOptions.vAxis.format = "percent";
chartData.push({ type: "line", options: chartOptions, data: chart3 });




print("<script id=chartdata type=application/json>" + JSON.stringify(chartData) + "</" + "script>");
