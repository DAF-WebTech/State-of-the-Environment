var csv = '%globals_asset_file_contents:81^replace:\r\n:\\n%';
var results = Papa.parse(
	csv,
	{
		skipEmptyLines: true,
		dynamicTyping: true
	}
);

var headData = results.data[0];
var data = results.data.slice(1);

//group by region
var regions = {queensland: []};
data.forEach(function(record) {
	var region = record[1];
	if(!regions[region])
		regions[region] == [];
	regions[region].push(record);
});

Object.keys(regions).forEach(function(regionName) {
	var region = regions[regionName];

});









//////////////////////////////////////////////////////////////////////////

print("<script id=chartdata type=application/json>" + JSON.stringify(chartData) + "</" + "script>");