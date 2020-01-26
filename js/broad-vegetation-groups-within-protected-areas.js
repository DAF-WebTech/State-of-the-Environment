var a = regionInfoTemplate;

print(a);

print(String.format(a, "this is a heading", "", "", "", "", "", ""));

var b = "%globals_asset_file_contents:70:js/broad-vegetation-groups-within-protected-areas.js";

print (b);


//var results = Papa.parse(
//    "%globals_asset_file_contents:70:js/broad-vegetation-groups-within-protected-areas.js^replace:\r\n:\\n%", 
//    {
//        skipEmptyLines: true, 
//        dynamicTyping: true
//    }
//);

//print(JSON.stringify(results));
