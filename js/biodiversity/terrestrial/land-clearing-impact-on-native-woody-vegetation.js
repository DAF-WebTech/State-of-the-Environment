
var results = Papa.parse("%frontend_asset_metadata_data-file^as_asset:asset_file_contents^replace:\r\n:\\n%", {
	skipEmptyLines: true, 
	dynamicTyping: true
});

var data = results.data;

var region = "Queensland".toKebabCase(); // {0}
var heading = ""; // {1}
var index = -1; // {2} use ++index each time
var thead = ""; // {3}
var tbody = ""; // {4}
var tfoot = ""; // {5}
var chartData = [];




// fix our first row data
var years = data[0];
years = years.slice(2);
years = years.map(function (year) {
return year.replace("-", "–"); //&ndash; in years
});



// chart 1 total clearing
var heading = "Proportion of total woody vegetation clearing, by bioregion"; // {1}



// create an 2d array to represent our table
// head
var table = [["Region"]];
table[0] = table[0].concat(years);


//body
for (var i = 1; i < data.length; ++i) {
if (data[i][1] == "Total clearing") {
	var row = [data[i][0]]// region name
	row = row.concat(data[i].slice(2));
	table.push(row);
}
}

// iterate array for our html table
var tableHtml = tableToHtml(table, true);

// TODO matrix replace
var regionInfo = String.format(regionInfoTemplate, region, heading, ++index, tableHtml.thead, tableHtml.tbody, tableHtml.tfoot)
print(regionInfo);



// transpose for chart
var chart = { data: table.transpose() };
chart.data[0][0] = { label: "Year", type: "string" };
chart.options = getDefaultColumnChartOptions();
chart.options.hAxis.title = "Year range";
chart.options.vAxis.title = "Hectares per year";
chart.options.isStacked = true;
chartData.push(chart);




// chart 2 total clearing type
heading = "Proportion of replacement landcover (clearing type) "; // {1}
// get our clearing types
var excludes = ["Total clearing", "Non-remnant", "Remnant"];
var clearingTypes = data.slice(1).reduce(function (acc, current) {
if (excludes.indexOf(current[1]) == -1 && acc.indexOf(current[1]) == -1) {
	acc.push(current[1]);
	return acc;
}
else
	return acc;
}, []);
// create an 2d array to represent our table
table = [["Clearing"]];
table[0] = table[0].concat(years);
//body
var empties = years.map(function (y) {
return null;
});
clearingTypes.forEach(function (ct) {
var row = [ct].concat(empties);
for (var i = 1; i < data.length; ++i) {
	if (data[i][1] == ct) {
		for (var j = 2; j < data[i].length; ++j) {
			if (data[i][j] != null)
				row[j - 1] += data[i][j];
		}
	}
}
table.push(row);
});

// iterate array for our html table
tableHtml = tableToHtml(table, true);

// TODO matrix replace
regionInfo = String.format(regionInfoTemplate, region, heading, ++index, tableHtml.thead, tableHtml.tbody, tableHtml.tfoot);
print(regionInfo);


// transpose for chart
chart = { data: table.transpose() };
chart.data[0][0] = { label: "Year", type: "string" };
chart.options = getDefaultColumnChartOptions();
chart.options.hAxis.title = "Year range";
chart.options.vAxis.title = "Hectares per year";
chart.options.isStacked = true;
chartData.push(chart);






// chart 3
// remnant, non-remnant
heading = "Historic woody vegetation clearing in Queensland "; // {1}
// get our clearing types
var myClearingTypes = ["Remnant", "Non-remnant"];
// create an 2d array to represent our table
table = [["Historic"]];
table[0] = table[0].concat(years);
//body
myClearingTypes.forEach(function (ct) {
var row = [ct].concat(empties);
for (var i = 1; i < data.length; ++i) {
	if (data[i][1] == ct) {
		for (var j = 2; j < data[i].length; ++j) {
			if (data[i][j] != null)
				row[j - 1] += data[i][j];
		}
	}
}
table.push(row);
});

// iterate array for our html table
tableHtml = tableToHtml(table, true);

// TODO matrix replace
regionInfo = String.format(regionInfoTemplate, region, heading, ++index, tableHtml.thead, tableHtml.tbody, tableHtml.tfoot)
print(regionInfo);


// transpose for chart
chart = { data: table.transpose() };
chart.data[0][0] = { label: "Year", type: "string" };
chart.options = getDefaultColumnChartOptions();
chart.options.hAxis.title = "Year range";
chart.options.vAxis.title = "Clearing rate (hectares per year)";
chart.options.isStacked = true;
chartData.push(chart);




// charts per region
var regions = data.slice(1).reduce(function (acc, current) {
if (acc.indexOf(current[0]) == -1) {
	acc.push(current[0]);
	return acc;
}
else
	return acc;
}, []);


regions.forEach(function (regionName) {

region = regionName.toKebabCase(); // {0}
// chart 1 total clearing
heading = "Proportion of replacement landcover (clearing type) in " + regionName; // {1}
table = [["Type"]];
table[0] = table[0].concat(years)

//body
for (var i = 1; i < data.length; ++i) {
	if (data[i][0] == regionName && clearingTypes.indexOf(data[i][1]) > -1) {
		var row = [data[i][1]]// clearing type
		row = row.concat(data[i].slice(2));
		table.push(row);
	}
}

// iterate array for our html table
tableHtml = tableToHtml(table, true);

regionInfo = String.format(regionInfoTemplate, region, heading, ++index, tableHtml.thead, tableHtml.tbody, tableHtml.tfoot)
print(regionInfo);


// transpose for chart
chart = { data: table.transpose() };
chart.data[0][0] = { label: "Year", type: "string" };
chart.options = getDefaultColumnChartOptions();
chart.options.hAxis.title = "Year range";
chart.options.vAxis.title = "Hectares";
chart.options.isStacked = true;
chartData.push(chart);


// chart 2 total clearing


// chart 1 total clearing
heading = "Historic woody vegetation clearing in  " + regionName; // {1}
table = [["Type"]];
table[0] = table[0].concat(years)

//body
for (var i = 1; i < data.length; ++i) {
	if (data[i][0] == regionName && (data[i][1] == "Remnant" || data[i][1] == "Non-remnant")) {
		var row = [data[i][1]]// clearing type
		row = row.concat(data[i].slice(2));
		table.push(row);
	}
}

// iterate array for our html table
tableHtml = tableToHtml(table, true);

regionInfo = String.format(regionInfoTemplate, region, heading, ++index, tableHtml.thead, tableHtml.tbody, tableHtml.tfoot)
print(regionInfo);


// transpose for chart
chart = { data: table.transpose() };
chart.data[0][0] = { label: "Year", type: "string" };
chart.options = getDefaultColumnChartOptions();
chart.options.hAxis.title = "Year range";
chart.options.vAxis.title = "Clearing rate (hectares per year)";
chart.options.isStacked = true;
chartData.push(chart);



});



print("\n<script id=chartjson type=application/json>" + JSON.stringify(chartData) + "<" + "/script>\n");
