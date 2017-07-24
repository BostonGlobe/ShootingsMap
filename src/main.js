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


	// graphic code
    $(document).ready(function(){
        d3.queue()
            .defer(d3.json, 'assets/bos_neighborhoods.json')
            .defer(d3.json, 'https://data.cityofboston.gov/resource/29yf-ye7n.json?shooting=Y&$limit=50000')
            .await(function(err, geo, data){
                var MapA= Map().geoData(geo);
                var shootingData = data.map(parseJson);
                d3.select('#mapid').datum(shootingData).call(MapA);
                var num = shootingData.length;
                var num2017= shootingData.filter(function(d){ return d.time.getYear()==117}).length;
            });


        function parseJson(d){
            return {
                id:d.incident_number,
                offenseCode:d.offense_code_group,
                district:d.district,
                street:d.street,
                description:d.offense_description,
                time:parseTime(d.occurred_on_date),
                location: d.location.coordinates?('['+d.location.coordinates[1]+','+d.location.coordinates[0]+']'):[0,0]
            }
        }
        function parseCSV(d){
            return {
                id:d['INCIDENT NUMBER'],
                offenseCode:d['CRIMETYPE_Revised'],
                district:d['DISTRICT'],
                street:d['STREET'],
                description:d['OFFENSE DESCRIPTION'],
                time: parseCsvTime(d['OCCURRED ON DATE'])
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

    });









	// run code
	init();
})();
