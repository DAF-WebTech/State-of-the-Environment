var a = regionInfoTemplate;

print(a);

print(String.format(regionInfoTemplate, "queensland", "heading", 0, "", "", "", "", "", ""));

var b = '%globals_asset_file_contents:75^replace:\r\n:|%';

print("<hr>");

var results = Papa.parse(
    b, 
    {
        skipEmptyLines: true, 
        dynamicTyping: true,
        newline: "|"
    }
);

print(JSON.stringify(results));
