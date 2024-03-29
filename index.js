const axios = require('axios');
const stat_endpoints = require('./endpoint.json');
const jsonp = require('jsonp');

var default_options = {formatted: true, parameters: false}

var headers = {
	'Host': 'stats.nba.com',
	'Referer': 'https://www.nba.com',
	'Origin': 'https://stats.nba.com/',
	'Connection': 'keep-alive',
	'x-nba-stats-origin': 'stats',
	'x-nba-stats-token': 'true',
	'Cache-Control': 'max-age=0',
	'Upgrade-Insecure-Requests': '1',
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3',
	'Accept-Encoding': 'gzip, deflate, br',
	'Accept-Language': 'en-US,en;q=0.9',
};

generateURL = (params, endpoint) => {
	var values = ({...stat_endpoints[endpoint].params, ...params});
	var url = stat_endpoints[endpoint].url + "?";
	var param_names = Object.keys(values);
	
	for(var i = 0; i < param_names.length; i++){
		url = url + param_names[i] + "=" + values[param_names[i]] + "&";  
	}

	return url;
}

formatData = (json, options) => {

	var data = {};
	var parameters = json.parameters;

	if(options.formatted){
		var result_set = json.resultSets;
		for(i in result_set){
			var merged = {};
			if(result_set[i].rowSet.length !== 1){
				var multipleRowSets = {};
				for(j in result_set[i].rowSet){
					var temp = {};
					for(k in result_set[i].headers){
						temp[result_set[i].headers[k]] = result_set[i].rowSet[j][k];
					}
					multipleRowSets[j] = temp;
				}
				data[result_set[i].name] = multipleRowSets;	
			} else {
				for(j in result_set[i].headers){
					merged[result_set[i].headers[j]] = result_set[i].rowSet[0][j];
				}
				data[result_set[i].name] = merged;
			}
		}
	} else data = json;
	if (options.parameters) return {data, parameters};
	else return data;
}

getDataFromNBA = (params, endpoint, options) => {
	var url = generateURL(params, endpoint);
	
	return new Promise(function(resolve, reject){
		if(typeof window === 'undefined'){
			axios.get(url, {headers}).then(function(res){
				resolve(formatData(res.data, options))
			}).catch(function(err){
				reject(err)
			});	
		} else {
			jsonp(url, null, (err, data) => {
				if(!err) resolve(formatData(data, options))
					else reject(err)
				});
		}
	});
}

module.exports = {

    playByPlay: function(params, options){
		return getDataFromNBA(params, "play_by_play", {...default_options, ...options});
	},

	getPBPVideoURL: function(vid){
		return new Promise(function(resolve, reject){
			var url = 'https://stats.nba.com/stats/videoeventsasset?GameEventID=' + vid.EventNum + '&GameID=' + vid.GameID;
			axios.get(url, {headers}).then((res) => {
			    var vidUrl = res.data.resultSets.Meta.videoUrls[0].lurl;
				resolve(vidUrl);
			}) 
			.catch(function(err){
				console.log(err);
				reject(err)
			});
        })
    }
};

