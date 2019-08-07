// various helper functions for JS libraries and the DOM
"use strict";
if (!String.format) {
	String.format = function (format, args) {
		var result = '';

		for (var i = 0; ;) {
			var open = format.indexOf('{', i);
			var close = format.indexOf('}', i);
			if ((open < 0) && (close < 0)) {
				result += format.slice(i);
				break;
			}
			if ((close > 0) && ((close < open) || (open < 0))) {
				if (format.charAt(close + 1) !== '}') {
					throw 'The format string contains an unmatched opening or closing brace.';
				}
				result += format.slice(i, close + 1);
				i = close + 2;
				continue;
			}
			result += format.slice(i, open);
			i = open + 1;
			if (format.charAt(i) === '{') {
				result += '{';
				i++;
				continue;
			}
			if (close < 0)
				throw 'The format string contains an unmatched opening or closing brace.';
			var brace = format.substring(i, close);
			var colonIndex = brace.indexOf(':');
			var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10) + 1;
			if (isNaN(argNumber))
				throw 'The format string is invalid.';
			var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);
			var arg = arguments[argNumber];
			if (typeof (arg) === "undefined" || arg === null) {
				arg = '';
			}
			if (arg.format) {
				result += arg.format(argFormat);
			}
			else
				result += arg.toString();
			i = close + 1;
		}
		return result;
	};
}

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (prefix) {
		return (this.substr(0, prefix.length) === prefix);
	};
}

if (! String.prototype.contains) {
	String.prototype.contains = function(value)
	{
		return this.indexOf(value) >= 0;
	};
}

if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(fn, scope) {
        for(var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    }
}

if (!Object.keys) {
    Object.keys = function(o) {
        if (o !== Object(o))
            throw new TypeError('Object.keys called on a non-object');
        var k=[], p;
        for (p in o) 
            if (Object.prototype.hasOwnProperty.call(o,p)) 
                k.push(p);
        return k;
    }
}

if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

(function() 
{ // this one needs a variable so wrap it in a function invoke
    var proxied = Number.prototype.toLocaleString;
    Number.prototype.toLocaleString = function() {
        if (this.valueOf() < 10000)
            return this.toString();
        else
            return proxied.apply(this);
    };
}());
//~ end helpers


// set the print link URLs
if(typeof jQuery != "undefined") {
    $.fn.printLinkURLs = function() {
        var printLinkMaxURLLength = 200;
        $(this).filter("a").each(function() {
            var linkHref = this.href;
            if (linkHref.length > printLinkMaxURLLength) {
                linkHref = this.protocol + "//" + this.hostname;
            }
            $(this).after('<small class="print-link-url"> ( ' + linkHref + " )</small>");
        });
    }
}
$(function() {
    $("#content-container a[href], #footer a").not("#breadcrumbs a, .page-options a, #fat-footer a, .image-gallery li a").printLinkURLs();
});


// some code to run at startup
document.addEventListener("DOMContentLoaded", function() {

    // **** Track PDFs in Google Analytics ****
    $("#page-container a[href^='\/']").each(function(index) {
      var filepath = $(this).attr('href');
      var ext = filepath.substr(filepath.lastIndexOf('.'));
      var options = " {'page': '" + filepath + "', 'nonInteraction': 0}";
    
      var on_click = '';
      if (ext == '.pdf') {
        on_click = "ga('send', 'event', 'PDF', 'Download', " + options + "); ga('send', 'pageview', '" + filepath +"');";
      } else if (ext == '.doc' || ext == 'docx') {
        on_click = "ga('send', 'event', 'Doc', 'Download', " + options + "); ga('send', 'pageview', '" + filepath +"');";
      } else if (ext == '.xls' || ext == '.xlsx') {
        on_click = "ga('send', 'event', 'Excel', 'Download', " + options + "); ga('send', 'pageview', '" + filepath +"');";
      }
      if (on_click != '') {
        $(this).attr("onClick", on_click);
      }
    });


    // ******  Links to external sites and RSS feeds *****
    var ext_img = '<img src="https://www.stateoftheenvironment.des.qld.gov.au/__data/assets/image/0020/1260605/externallink.gif" alt="External link icon" class="linkicon" />'; //externallink.gif
    var rss_img = '<img src="https://www.stateoftheenvironment.des.qld.gov.au/__data/assets/image/0003/1260606/feed-icon.gif" alt="RSS feed icon" class="linkicon" />'; //feed-icon.gif
    $('#content-container a[href]').each(function() {
        var elem = $(this);
        if (elem.parents('.page-options').length != 0 || elem.parents('.socialmedia').length != 0 || "fancybox" in this.dataset) 
            return;
        var href = elem.attr("href");
        if (href.indexOf("stateoftheenvironment") >= 0)
            return;
        if (href.indexOf(".") == 0
                || href.indexOf("/") == 0
                || href.indexOf("?") == 0
                || href.indexOf("#") == 0 )
            return;
    
        elem.attr("target", "_blank");
        $(ext_img).insertAfter(elem);
    });
    
    // toggle key messages visibility subtheme pages
    if ($('dl.keymessages dt').length > 1) {
        $('dl.keymessages').addClass('active');
        $('dl.keymessages dd').hide();
        $('dl.keymessages dt').on("click", function(event) {
            event.preventDefault();
            var me = $(this);
            
            if (me.hasClass("selected")) {
                me.removeClass("selected");
                me.next('dd').slideUp().addClass('screen-hidden');
                me.find("a.more").text("show details…");
            }
            else {
                me.addClass("selected");
                me.next('dd').slideDown().removeClass('screen-hidden');
                me.find("a.more").text("hide details…");
            }
            
        });
    }

    
    //toggle programs visibility on sub-theme
    var show_link = '<a href="#" class="more">show programs</a>';
    $('div.programs dl, div.programs table').hide().addClass('screen-hidden');
    $('div.programs h3').append(show_link).addClass('active');
    $('div.programs h3').on("click", function(event) {
        event.preventDefault();
        var me = $(this);
        var prog_list = me.parent('div').find('dl, table');
        if (prog_list.hasClass('screen-hidden')) {
            prog_list.slideDown().removeClass('screen-hidden');
            me.addClass('selected');
            me.find('a.more').text('hide programs');
        } else {
            prog_list.slideUp().addClass('screen-hidden');
            me.removeClass('selected');
            me.find('a.more').text('show programs');
        }
    });
    
    //toggle responses visibility on theme
    var show_link = '<a href="#" class="more">show responses</a>';
    $('div.responses dl, div.responses table').hide().addClass('screen-hidden');
    $('div.responses h3').append(show_link).addClass('active');
    $('div.responses h3').on("click", function(event) {
        event.preventDefault();
        var me = $(this);
        var prog_list = me.parent('div').find('dl, table');
        if (prog_list.hasClass('screen-hidden')) {
            prog_list.slideDown().removeClass('screen-hidden');
            me.addClass('selected');
            me.find('a.more').text('hide responses');
        } else {
            prog_list.slideUp().addClass('screen-hidden');
            me.removeClass('selected');
            me.find('a.more').text('show responses');
        }
    });
    

    if (window.location.pathname.indexOf("/heritage/") >= 0)
    {
        soejs.highlightColour = "#c91c21";
        soejs.highlightColourClickable = "#f7eb6f";
        soejs.fillColour = "#ec2127";
        soejs.regionColour = "#ec2127";
    }
    else if (window.location.pathname.indexOf("/pollution/") >= 0)
    {
        soejs.highlightColour = "#cf692a";
        soejs.highlightColourClickable = "#f7eb6f";
        soejs.fillColour = "#f47b31";
        soejs.regionColour = "#f47b31";
    }
    else if (window.location.pathname.indexOf("/climate/") >= 0)
    {
        soejs.highlightColour = "#32478b";
        soejs.highlightColourClickable = "#f7eb6f";
        soejs.fillColour = "#3b53a4";
        soejs.regionColour = "#3b53a4";
    }
    else if (window.location.pathname.indexOf("/human-settlements/") >= 0)
    {
        soejs.highlightColour = "#32478b";
        soejs.highlightColourClickable = "#f7eb6f";
        soejs.fillColour = "#82368c";
        soejs.regionColour = "#82368c";
    }
        
    soejs.clickable = ($(".regiontabs").length == 0) ? false : true;
    soejs.highlight_colour = (!soejs.clickable) ? soejs.highlightColour : soejs.highlightColourClickable;
    $('.regiontabs').tabs();
    
    if (window.populateIndicatorCharts) { // it's a finding page
        soejs.loadFindingData(populateIndicatorCharts);
    
        $('.region-info').each(function() {
            if(!$(this).hasClass('region-queensland')) {
        	    soejs.only_qld_flag = false;
        	    return false;
            }
        });

        if ($('.region-info').length > 2) { // text and graph
        
            if ($('.chart').length == 0) {
        	    // Don't need to wait for charts to load, just hide the non Qld sections
        	    $('.region-info').not('.region-queensland').hide();
        	    $('.regionlinks a:first').addClass('current');
            }
        
            // Watch for region clicks
            $('.regionlinks a').on("click", function(e) {
        	    e.preventDefault();
        
        	    // Get the selected region from the anchor link
        	    var selected_region = $(this).attr('href');
        	    selected_region = selected_region.substr(1); // remove '#' part of anchor to get class name
        	    soejs.selectPolyRegion(selected_region);
            });
        }

    }//~ if populateIndicatorCharts

}); //~ end document ready


// our global to hold all our variables and functions
var soejs = {
    regionTabs: true,
    fetchData: true,
    map: {},
    path: "",
    polygonArray: [],
    last_id_selected: 0,
    highlight_colour: "",
    highlightColour: "#5da23b", // set to biodiversity by default 
    highlightColourClickable: "#f7eb6f",
    fillColour: "#6dbe45",
    regionColour: "#6dbe45",
    clickable: false,
    num_charts: 0,
    findingPageData: "",
    num_charts_loaded: 0,
    only_qld_flag: true,
    thisFindingHasRegionTabs: true,
    markers: [],
    infoWindows: [],
    map_bounds: {},

    
    fixDataTableFormat: function (dataTable, factor) //used on finding pages
    {
        if (!factor)
            factor = 1000000;
        
        var formattedData = dataTable.clone();
        for (var x = 0; x < formattedData.getNumberOfRows(); x++) {
            for (var y = 0; y < formattedData.getNumberOfColumns(); y++) {
                if (y != 0) { // first col is row heading
                    var dataPoint = formattedData.getValue(x, y);
                    if (dataPoint != null) {
                        formattedData.setValue(x, y, dataPoint / factor);
                        formattedData.setFormattedValue(x, y, dataPoint.toString());
                    } else {
                        formattedData.setValue(x, y, dataPoint);
                    }
                }
            }
      }
      return formattedData;
    },

    // Manage wide table display - on resize
    // (scroller borrowed from QGov)
    tableManage: function () { //used on finding pages
    
    
    return;
    // for 2019, don't do anything yet at first
    // test all table look and feel 
    // and find better ways of doing all this.

    
        // NOTE: this timeout fixes a bug with the width() values returned in IE8
        // http://stackoverflow.com/a/10170769
        setTimeout(function() {
            var content_width = $('#content .article .box-sizing').width();
            $('table').each(function(index) {

                // Apply special style to tables that are wider than the content area
                if ($(this).width() > (content_width + 1)) {  // IE bug? table width always 1px wider than content width. + 1 seems to fix
                    $(this).addClass('widetable');
                    // Strip manually added strong tags - they prevent widetable styles working as well as they should.
                    $(this).find('th').each(function() {
                        if ($(this).find('strong').length != 0) {
                            $(this).find('strong').contents().unwrap();
                        }
                    });
                    // Strip any set widths
                    $(this).find('th[width], td[width]').removeAttr('width');
    
                } else {
                    $(this).removeClass('widetable');
                }
    
                // If still not narrow enough, add scroller
                var isScrollable = $(this).parent().parent().hasClass('scrollable');
                if ($(this).width() > (content_width + 1)) {
                    if (!isScrollable) {
                        $(this).wrap('<div class="scrollable"/>').wrap('<div class="inner"/>');
                    }
                } else {
                    if (isScrollable) { // remove div.scrollable > div.inner wrappers
                        $(this).unwrap().unwrap();
                    }
                }
            });
        }, 0 );
    },

    setContentTableStyles: function() { //used on finding pages
    
    
    return;    
    // for 2019, don't do anything yet at first
    // test all table look and feel 
    // and find better ways of doing all this.

    
    
        if ($('#content table').length != 0) {
    
            $('#content table').each(function() {
                var this_table = $(this);
                // Apply special style to tables where table heading cells are down side instead of across top
                this_table.find('th').first(function() {
                    if ($(this).attr('scope') == 'row') {
                        this_table.addClass('acrosstable');
                    }
                });
    
                // Apply special style to tables containing only number cells
                var is_numeric = true;
                this_table.find('tbody td').each(function() {
                    var filtered_text = $(this).text();
                    filtered_text = filtered_text.replace(',','');
                    filtered_text = filtered_text.replace('-','');
                    filtered_text = filtered_text.replace('&#8211;','');
                    filtered_text = filtered_text.replace('&ndash;','');
                    filtered_text = filtered_text.replace('$','');
                    filtered_text = filtered_text.replace(' ','');
                    if (isNaN(filtered_text) && filtered_text.toLowerCase() != 'n/a') {
                        is_numeric = false;
                    }
                });
                if (is_numeric) {
                    this_table.addClass('numeric');
                }
            }); // end each table
    
            // Zebra table
            $('table.zebra tbody tr:odd').addClass('even'); /* zero-indexed rows, hence ":odd" selector */
    
            // Sortable table
            $('table.sort').tablesorter({dateFormat: "uk"});
    
            // Sortable zebra table
            $("table.zebrasort").tablesorter({dateFormat: 'uk', widgets: ['zebra']});
    
    
            soejs.tableManage();
            $(window).on("resize", function() {
                soejs.tableManage();
            });
    
        } // end if tables exist
    },
    
    
    initialisePoly: function() {

        var mapCanvas = document.getElementById('map-canvas');
        if (!mapCanvas)
            return; //no map

        if (!soejs.thisFindingHasRegionTabs)
            return; // not all finding pages have region maps
            

        var default_center = new google.maps.LatLng(-19.5, 145.75);
        var bounds = new google.maps.LatLngBounds();
    	var location_code = document.getElementById("location_code").value; //encoded polygon
    	var location_name = document.getElementById("location_name").value; //region name
    	var latitude = document.getElementById("latitude").value;
    	var longitude = document.getElementById("longitude").value;
    
    	// define zoom for the spatial filter
    	var mapOptions = {
    		zoom: 6,
    		center: default_center,
    		draggable: true,
    		mapTypeControl: true,
    		mapTypeControlOptions: {
    			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    		},
    		streetViewControl: false,
    		zoomControl: true,
    	    scrollwheel: false
    	};
    	soejs.map = new google.maps.Map(mapCanvas, mapOptions);
    
    	for (var i = 0; i < polyArray.length; i++) {
    		// where encoding includes more than one polygon, QGIS separates them with a <br> tag so we need to split on it to ensure the <br> is not considered when decoding
    
    		var multiPoly = String(polyArray[i][location_code]).split("<br>"); //the array position of encoding may change depending on the layer's order of attributes
    		var region_name = polyArray[i][location_name]; // this will change depending on the dataset
    		var region_code = 'region-' + soejs.codify(String(region_name));
    		var info_content = region_name;
    		var region_lat = polyArray[i][latitude];
    		var region_long = polyArray[i][longitude];
    
    
    		for (var j = 0; j < multiPoly.length; j++) {
    			var decodedPath = google.maps.geometry.encoding.decodePath(String(multiPoly[j]));
    
    			var setRegion = new google.maps.Polygon({
    				path: decodedPath,
    				clickable: true,
    				strokeColor: "#CDCDCD",
    				fillColor: soejs.fillColour,
    				fillOpacity: 0.75,
    				strokeOpacity: 0.5,
    				strokeWeight: 1.0,
    				map: soejs.map,
    				regionname: region_name,
    				label: region_name,
    				regionlat: region_lat,
    				regionlong: region_long,
    				regioncolor: soejs.regionColour,
    				id: region_code
    			});
    
    			// If no info to show set cursor to default
    			if (!soejs.clickable) {
    				setRegion.set("cursor", "default");
    			}
    
    			// Add to global array of polygon elements
    			soejs.polygonArray.push(setRegion);
    
    			// Watch for hovering over region
    			google.maps.event.addListener(setRegion, "mouseover", function (event) {
    				soejs.showSelectedRegion(this.id, this.regionname);
    			});
    
    			// Watch for hovering out of region
    			google.maps.event.addListener(setRegion, "mouseout", function (event) {
    				if (soejs.last_id_selected) {
    					soejs.selectPolyRegion(soejs.last_id_selected);
    				}
    			});
    
    
    			// Watch for clicking on region
    			google.maps.event.addListener(setRegion, 'click', function (event) {
    				if ($("." + this.id).length || location.href.indexOf("/about/search") >= 0) {
    					soejs.showSelectedRegion(this.id, this.regionname);
    					soejs.showHideRegionInfo(this.id);
    					soejs.last_id_selected = this.id;
    				}
    			});
    
    			// Expand the map viewport extent to include all polygons
    			// compatible with IE8
    			for (var k = 0; k < decodedPath.length; k++) {
    				soejs.path += decodedPath[k];
    				bounds.extend(decodedPath[k]);
    			}
    		}
    	}
    	soejs.map.fitBounds(bounds);
    	var listener = google.maps.event.addListener(soejs.map, "idle", function () {
    		soejs.map.fitBounds(bounds);
    		if (soejs.map.getZoom() > 10) {
    			soejs.map.setZoom(10);
    		}
    		google.maps.event.removeListener(listener);
    	});
    	
    	
    	// bounds of the desired area
        var allowedBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-31, 137), 
            new google.maps.LatLng(-10, 155)
        );
        var lastValidCenter = soejs.map.getCenter();
    
        google.maps.event.addListener(soejs.map, 'center_changed', function() {
            if (allowedBounds.contains(soejs.map.getCenter())) {
                // still within valid bounds, so save the last valid position
                lastValidCenter = soejs.map.getCenter();
                return; 
            }
            // not valid anymore => return to last valid position
            soejs.map.panTo(lastValidCenter);
        });
        
        google.maps.event.addListener(soejs.map, "maptypeid_changed", function() {
            console.log ("maptypeid_changed", arguments);  
        });
    },//~ initialise

    initialisePin: function() {
        var infowindow = new google.maps.InfoWindow();
        var centre_latlng = new google.maps.LatLng(-21,146);
        var mapOptions = {
                zoom: 5,
                center: centre_latlng,
                draggable: true,
                streetViewControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
        	    scrollwheel: false
        };

        //Set the custom map type
        var mapCanvas = document.getElementById('map-canvas');
        if (!mapCanvas)
            return; //no map
        soejs.map = new google.maps.Map(mapCanvas, mapOptions);

        soejs.map_bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < pinLocationArray.length; i++) {
            // data in format:
            var location_id = pinLocationArray[i][0];  // 0: region code
            var location_title = pinLocationArray[i][1];  // 1: title for infowindow
            var location_content = pinLocationArray[i][2];  // 1: content for infowindow
            var location_lat = pinLocationArray[i][3];  // 2: lat
            var location_lng = pinLocationArray[i][4];  // 3: long

            var content = '<div class="infowindow">' + location_content + '</div>';

            var location = new google.maps.LatLng(location_lat, location_lng);

            var thisMarker = new google.maps.Marker({
                position: location,
                draggable: false,
                map: soejs.map,
                title: location_title,
                icon: "./?a=1267015",
                id:'region-' + location_id,
                html: content
            });
            soejs.map_bounds.extend(location);

            google.maps.event.addListener(thisMarker, 'click', function() {
                if($("." + this.id).length){
                    soejs.showHideRegionInfo(this.id);
                }
                infowindow.setContent(this.html);
                infowindow.open(soejs.map, this);
                soejs.infoWindows.push(infowindow);
            });
            soejs.markers.push(thisMarker);
            soejs.map.fitBounds(soejs.map_bounds);
        }

        var listener = google.maps.event.addListener(soejs.map, "idle", function() {
            soejs.map.fitBounds(soejs.map_bounds);
            google.maps.event.removeListener(listener);
        });
    
        // bounds of the desired area
        var allowedBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-30, 137), 
            new google.maps.LatLng(-10, 155)
        );
        var lastValidCenter = soejs.map.getCenter();

        google.maps.event.addListener(soejs.map, 'center_changed', function() {
            if (allowedBounds.contains(soejs.map.getCenter())) {
                // still within valid bounds, so save the last valid position
                lastValidCenter = soejs.map.getCenter();
                return; 
            }
            // not valid anymore => return to last valid position
            soejs.map.panTo(lastValidCenter);
        });
        
    },


    // Function to highlight the region and show the region name
    showSelectedRegion: function(region_code, region_name) {
    	// Create an infobox with the name of the selected region
    	soejs.map.controls[google.maps.ControlPosition.RIGHT_TOP].clear();
    	if (soejs.map.getZoom() == 0) {
    		soejs.map.setZoom(6);
    	}
    	if (region_code !== "region-queensland" && region_code !== undefined) {
    		var selectedRegionDiv = document.createElement('div');
    		selectedRegionDiv.className = "infobox";
    		selectedRegionDiv.innerHTML = region_name;
    		soejs.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(selectedRegionDiv);
    	}
    
    	// Highlight selected region
    	var GBR = ['region-wet-tropics-healthy-waterways-partnership-report-card', 'region-fitzroy-basin-report-card', 'region-mackay-whitsunday-report-card', 'region-gladstone-harbour-report-card', 'region-qcatchment-endeavour', 'region-qcatchment-jacky-jacky', 'region-qcatchment-jeannie', 'region-qcatchment-lockhart', 'region-qcatchment-normanby', 'region-qcatchment-olive-pascoe', 'region-qcatchment-stewart', 'region-wet-tropics-report-card'];

    	for (var i = 0; i < soejs.polygonArray.length; i++) {
    		soejs.polygonArray[i].set("fillColor", soejs.polygonArray[i].regioncolor); //set to default color of the filter
    		if (soejs.polygonArray[i].id == region_code) {
    			// highlight the region
    			soejs.polygonArray[i].set("fillColor", soejs.highlight_colour);
    		}
    		// special handling for GBR area for Water Quality Cathcments. should also highlight smaller polygon under GBR for water quality catchments
    		if (soejs.polyFilter == 'qld-water-quality-catchments-poly-v3.js' && region_code == 'region-great-barrier-reef-report-card' && (GBR.indexOf(soejs.polygonArray[i].id) != -1)) {
    			soejs.polygonArray[i].set("fillColor", soejs.highlight_colour);
    		}
    		
    	}
    }, //~showSelectedRegion


    // function when region has been selected outside the map (i.e. from the list of region links)
    selectPolyRegion: function (region_code) {
    	if (region_code === 'region-queensland' || region_code === undefined) {
    		// reset to default region (Qld)
    		soejs.showSelectedRegion(region_code);
    		soejs.showHideRegionInfo(region_code);
    	} else {
    		// find the polygon that matches the selected region
    		for (var i = 0; i < soejs.polygonArray.length; i++) {
    			if (soejs.polygonArray[i].id == region_code) {
    				var region_latlng = new google.maps.LatLng(soejs.polygonArray[i].regionlat, soejs.polygonArray[i].regionlong);
    				var mev = { stop: null, latLng: region_latlng }
    				google.maps.event.trigger(soejs.polygonArray[i], 'click', mev);
    				break;
    			}
    		}
    	}
    },//~selectPolyRegion
    
    
    selectPinRegion: function(region_code) {
        if (region_code==='region-queensland') {
            infoWindows[0].close();
            soejs.showHideRegionInfo(region_code);
            soejs.map.fitBounds(soejs.map_bounds);
            soejs.map.setZoom(5);
        } else {
            //  reset all the icons back to normal except the one you clicked
            for (var i = 0; i < soejs.markers.length; i++) {
                if (soejs.markers[i].id === region_code){
                    google.maps.event.trigger(soejs.markers[i], 'click');
                    break;
                }
            }
        }
    },//~selectPinRegion


    /*doesnt' seem to be used*/ decodeLevels: function(encodedLevelsString) {
    	var decodedLevels = [];
    	for (var i = 0; i < encodedLevelsString.length; ++i) {
    		var level = encodedLevelsString.charCodeAt(i) - 63;
    		decodedLevels.push(level);
    	}
    	return decodedLevels;
    },//~decodeLevels


    codify: function(strvar) {
    	var strcode = strvar.replace(/\s/g, '-');
    	strcode = strcode.replace(/---/g, '-');
    	strcode = strcode.toLowerCase();
    	strcode = strcode.replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\/]/gi, '');
    	return strcode;
    },//~ codify


    loadFindingData: function (populateIndicatorChartFunction) {
        var url = String.format("/2019/datasets/indicator-{0}.csv", soejs.resourceId.replace(/\./g, "-"));
        Papa.parse(url, {
	        download: true,
	        header: true,
	        skipEmptyLines: true,
	        complete: function(results) {
                soejs.findingPageData = results;
                google.charts.setOnLoadCallback(populateIndicatorChartFunction);
	        },
	        error: function(error, file) {
	            console.log("findLoadingData error: ", url, error, file);
	        }
        });
    },//~loadFindingData
    
    
    chartsLoaded: function(parentElement) {
    	// Called each time a chart is loaded.
    	// Checks whether it's the last one to load. If it is, hides all but Qld ones.
    	// Need to wait until all are loaded because charts don't draw corectly if hidden.
    
    	soejs.num_charts_loaded++;
    	if (soejs.num_charts_loaded == soejs.num_charts) {
    	    parentElement = parentElement || ""; //TODO add parent element to selectors
    	    
    		// Hide all but Qld
    		$('.region-info').not('.region-queensland').hide();
    
    		// Highlight Qld/first
    		$('.regionlinks a:first').addClass('current');
    
    		/* Add tabs to each chart group (chart/table) */
    		$('.chart-table').each(function() {
    			var group_num = $(this).attr('id').substr(11); // string after 'region-info-'
    			// add the tab nav
    			$(this).prepend('<ul><li class="chart"><a href="#chart_' + group_num + '">Chart</a></li><li class="table"><a href="#table_' + group_num + '">Table</a></li></ul>');
    			$(this).tabs();
    			
    			//not good, special case because this is the only table that is actually too wide.
    			// not sure what we're going to do when more and more tables come into this category.
    			// probably scrap all the code and rewrite.
    			    // for 2019, don't do anything yet at first
                    // test all table look and feel 
                    // and find better ways of doing all this.
    
//    			if (soejs.resourceId == "1.1.0.11.1") {
//    			    $("div#chartgroup_0").tabs({activate: function(event, ui) {
//    			        if (ui.newTab[0].innerText == "Table")
//    			            soejs.setContentTableStyles();
//    			    }});
//    			}
    		});
    		
    		soejs.setContentTableStyles();
    		
    		// reset these values because they need to be reused by the multi-indicator pages
    		soejs.num_charts_loaded = soejs.num_charts = 0;
    	}
    }, //~ chartsLoaded


    showHideRegionInfo: function(selected_region) {
        if (soejs.only_qld_flag) {
    	    return false;
        }
    
        // Hide all the region infos
        $('.region-info').hide();
    
        // Check we have a valid region class name (should be 'region-' followed by region code)
        if (selected_region.substr(0,7) != 'region-') {
    	    selected_region = 'region-' + selected_region;
        }
    
        $('.'+selected_region).show();
    
        // Show that this is the selected region
        $('.regionlinks a').removeClass('current');
        $('.regionlinks a[href="#' + selected_region + '"]').addClass('current');
    }

};

(function(){ // this stuff does not need dom ready

}())
