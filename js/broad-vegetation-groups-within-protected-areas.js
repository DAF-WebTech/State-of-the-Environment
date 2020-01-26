var x = regionInfoTemplate;

print(x);

print String.format(x, "this is a heading", "", "", "", "", "", "");

var results = Papa.parse("%globals_asset_file_contents:75^replace:\r\n:\\n%", {
    skipEmptyLines: true, 
    dynamicTyping: true
});

print(JSON.stringify(results));
