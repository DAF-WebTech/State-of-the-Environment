var csv = '%frontend_asset_metadata_data-file^as_asset:asset_file_contents^replace:\r\n:\\n%';


var results = Papa.parse(
	csv,
	{
		skipEmptyLines: true,
		dynamicTyping: true,
	}
);
var headRow = results.data.shift().map(function (th) { return th.toString(); });
var totalRow = results.data.pop();

console.log("data from papaparse", results);

var index = 0;

///////////////////////////////////////////////////

var tableData = results.data.map(function (record) {
	return [record[0], record[record.length - 1]];
});

tableData.sort(function (a, b) {
	return a[1] < b[1] ? 1 : -1;
});

var head = ["Category", "Emissions (million tonnes)"];
tableData.unshift(head);


var tables = [{
	rows: tableData,
	type: "pie",
	options: getDefaultPieChartOptions(),
	heading: "Proportion of Queensland’s transport emissions by category, " + headRow[headRow.length - 1],
	hasChart: true,
	index: index++
}];


//////////////////////////////////////////////////////////////////////////////////////

chart = results.data;
chart.unshift(headRow);
chart = chart.transpose();

var options = getDefaultAreaChartOptions();
options.vAxis.title = "Tonnes (millions)";


tables.push({
	rows: chart,
	heading: "Trends in Queensland’s transport emissions, by category",
	hasChart: true,
	index: index++,
	type: "area",
	options: options,
});


//////////////////////////////////////////////
data = totalRow.slice(1).map(function (row, i) {
	return [headRow[i + 1], row];
});
data.unshift(["Year", "Emissions (million tonnes)"]);

tables.push(
	{
		rows: data,
		heading: "Queensland’s total transport emissions",
		hasChart: false,
		index: index++
	});



print("<script id=chartdata type=application/json>" + JSON.stringify(tables) + "</" + "script>");



