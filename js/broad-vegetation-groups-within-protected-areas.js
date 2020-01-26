
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

var groups = {};
data.forEach(function(record) {
	var group = String.format("{0}. {1}", record[1], record[2]);
	if (!groups[group]) {
		groups[group] = { p: 0, np: 0 };
	}
	groups[group].p += record[4];
	groups[group].np += record[5];
});

print("<hr>");
print(JSON.stringify(groups));

//print(String.format(regionInfoTemplate, "Hectares of broad vegetation groups in protected areas, 2015", "heading", 0, "", "", "", "", "", ""));


print("<hr>");
print(JSON.stringify(data));
