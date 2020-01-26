var a = regionInfoTemplate;

print(a);

print(String.format(a, "this is a heading", "", "", "", "", "", ""));

var b = '%globals_asset_file_contents:75^replace:\r\n:|%';

print ("<P><P><P><P>");


var results = Papa.parse(
    b, 
    {
        skipEmptyLines: true, 
        dynamicTyping: true,
        delimiter: "|"
    }
);

print(JSON.stringify(results));
