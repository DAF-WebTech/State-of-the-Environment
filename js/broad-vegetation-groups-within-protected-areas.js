
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

// write out first table
var index = 0;
var region = "queensland"

var thead = "<th scope=row>Broad vegetation group<th scope=row class=num>Protected vegetation<th scope=row class=num>Non-protected vegetation";

var tbody = "";
Object.keys(groups).forEach(function(groupName) {
	var group = groups[groupName];
	tbody += String.format("<tr><td scope=row>{0}<td class=num>{1}<td class=num>{2}", groupName, group.p.toLocaleString(), group.np.toLocaleString());
});

print(String.format(regionInfoTemplate, region, "Hectares of broad vegetation groups in protected areas, 2015", index, thead, tbody));


print("<hr>");
print(JSON.stringify(groups));


print("<hr>");
print(JSON.stringify(data));
