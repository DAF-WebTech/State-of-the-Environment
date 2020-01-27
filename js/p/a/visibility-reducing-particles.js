
var csv = '%globals_asset_file_contents:1469797^replace:\r\n:\\n%';
var results = Papa.parse(
	csv,
	{
		skipEmptyLines: true,
		dynamicTyping: true
	}
);

var region = "Queensland".toKebabCase(); // {0}
var heading = "Number of days when the 1-hour visibility-reducing particle concentrations exceed the Air EPP goal"; // {1}
var index = 0; // {2}
var thead = ""; // {3}
var tbody = ""; // {4}
var tfoot = ""; // {5}

thead = "<th scope=col>Airshed";
for (var i = 1; i < results.data[0].length; ++i) {
    thead += "<th scope=col class=num>" + results.data[0][i];
}

for (var i = 1; i < results.data.length; ++i) {
    var tr = "<tr><th scope=row>" + results.data[i][0];
    for (j = 1; j < results.data[i].length; ++j) {
        tr += "<td class=num>" + (results.data[i][j] === null ? "" : results.data[i][j]);
    }
    tbody += tr;
}

print (String.format(regionInfoTemplate, region, heading, index, thead, tbody, tfoot));

// transpose for chart
var chartData = results.data.transpose();
chartData[0][0] = { label: "Year", type: "string" };
				

print("\n<script id=chartjson type=application/json>" + JSON.stringify(chartData) + "<" + "/script>\n");   