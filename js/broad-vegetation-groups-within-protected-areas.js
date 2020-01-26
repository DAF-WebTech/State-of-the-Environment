var a = regionInfoTemplate;

print(a);

print(String.format(a, "this is a heading", "", "", "", "", "", ""));

var b = '%globals_asset_file_contents:75^replace:\r\n:\\n%';

print (b);


var results = Papa.parse(
    b, 
    {
        skipEmptyLines: true, 
        dynamicTyping: true
    }
);

print(JSON.stringify(results));
