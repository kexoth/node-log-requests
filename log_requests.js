var http = require('http');
var url = require('url');

var requests = [];
var port = Number(process.env.PORT || 5000);

function reqHandler(req, res) {
	
	if (req.url == "/log") {

		var log = "";
		
		for (var i = 0; i < requests.length; i++) {
			
			log += requests[i];
		}
		res.statusCode = 200;
		res.write(log);
		res.end();
	}
	else if (req.url != "/favicon.ico") {
	
		var requestString = "";
		var url_parts = url.parse(req.url, true);
		
		requestString += "____________________________\n";
		
		var now = new Date();
		var jsonDate = now.toJSON();
		requestString += now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '\n';
	
	  	requestString += "URL:" + url_parts.href + '\n';
		requestString += "Path: " + url_parts.pathname + '\n';
		requestString += "QueryString: " + url_parts.search + '\n';
		requestString += "Method: " + req.method + '\n';
		
		for(var item in req.headers) {
		    requestString += item + ": " + req.headers[item] + '\n';
		}
		
		requestString += "Body:" + req.body + '\n';

		req.addListener("data", function(data) {
				var encoded = new Buffer(data, 'binary').toString('utf8');
				requestString += "Encoded Data: " + encoded + '\n';
		});

		requests.unshift(requestString);
		
		if (requests.length > 100) {
			
			requests.pop();
		}
		
		res.statusCode = 200;
		res.write("SUCCESS!!");
		res.end();	
	}
}

var server = http.createServer(reqHandler);
server.listen(port);
