'use strict';
(function() {
	// global variables



	// called once on page load
	var init = function() {

	};


	// called automatically on article page resize
	window.onResize = function(width) {

	};

	// called when the graphic enters the viewport
	window.enterView = function() {

	};



    // var dataUrl="http://services.odata.org/OData/OData.svc/Products?$filter=Price gt 20";
      var dataUrl="https://data.boston.gov/api/3/action/datastore_search?resource_id=12cb3883-56f5-47de-afa5-3b1cf61b257b&limit=1000&q='Y'";
var dataUrl2= "assets/shootingsToSep.json";

	// graphic code
    $(document).ready(function(){

        d3.queue()
            .defer(d3.json, 'assets/bos_neighborhoods.json')
            .defer(d3.json, dataUrl)
            //.defer(d3.json, 'https://data.cityofboston.gov/resource/29yf-ye7n.json?shooting=Y&$limit=50000')
            .await(function(err, geo, data){
                // var shootingData = data2.value.filter(function (t) { return t['SHOOTING']=='Y' });
                console.log(data.result.records);
                //get and parse data

                var shootingData = data.result.records.map(parseSavedJson);
                //Data processing shooting nested by Id
                var shootingNested = d3.nest()
                    .key(function(d) { return d.id; })
                    .rollup(function(leaves) { return leaves.length; })
                    .entries(shootingData);

                //get multiShootings
                //add shooting numbers to per incident
                shootingData.forEach(function (shooting) {
                    shooting.num=1;
                    for (var j in shootingNested){
                        if(shootingNested[j].key == shooting.id){
                            shooting.num= shootingNested[j].value;
                            return;
                        }
                    }
                });
                //init map
                var MapA= Map().geoData(geo).multiShootings(shootingData);
                d3.select('#mapid').datum(shootingData).call(MapA);
                var num = shootingData.length;
                var num2017= shootingData.filter(function(d){ return d.time.getYear()==117}).length;

            });
    });


    function parseJson(d){
        return {
            id:d.incident_number,
            offenseCode:d.offense_code_group,
            district:d.district,
            street:d.street,
            description:d.offense_description,
            time:parseTime(d.occurred_on_date),
            location: d.location.coordinates?('['+d.location.coordinates[1]+','+d.location.coordinates[0]+']'):[0,0],
            hour: +d.hour
        }
    }


    function parseSavedJson(d){
        var arr= [];
        if(d.Lat&&d.Long){
            arr.push(d.Lat);
            arr.push(d.Long);
        }else {
            arr.push(0);
            arr.push(0);
        }

        return {
            id:d['INCIDENT_NUMBER'],
            offenseCode:d['OFFENSE_CODE_GROUP'],
            district:d['DISTRICT'],
            street:d['STREET'],
            description:d['OFFENSE_DESCRIPTION'],
            time: parseTime(d['OCCURRED_ON_DATE']),
            location: arr
        }
    }

    function parseTime(timeStr){
        var time = timeStr.split('T')[1].split(':'),
            hour = +time[0],
            min = +time[1],
            sec = +time[2];

        var	date = timeStr.split('T')[0].split('-'),
            year = date[0],
            month = date[1]-1,
            day = date[2];

        return new Date(year,month,day,hour,min,sec);
    }

    function parseCsvTime(timeStr){
        var time = timeStr.split(' ')[1].split(':'),
            hour = +time[0],
            min = +time[1];

        var	date = timeStr.split(' ')[0].split('/'),
            year = +date[2]+2000,
            month = +date[0],
            day = +date[1];

        return new Date(year,month-1,day,hour,min);
    }

	// run code
	init();
})();
