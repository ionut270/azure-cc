module.exports.innerText = (text) => {
	var response = "";
	text.split(/&lt;/).map((a) => (a.split(/&gt;/)[1] ? (response += a.split(/&gt;/)[1] + " ") : null));
	return response;
};
module.exports.rssContent = (text) => {
	var response = "";
	text.split("</content>").map((a) => (a.split('<content type="html">')[1] ? (response += a.split('<content type="html">')[1] + " ") : null));
	return response;
};
module.exports.queryParse = (req) => {
	if (req.url.split(/\?/)[1]) {
		var processed = {};
		req.url.split(/\?/)[1].split(/&/).map((p) => (processed[p.split(/=/)[0]] = p.split(/=/)[1]));
		req.query = processed;
	}
	req.url = req.url.split(/\?/)[0];
    return req;
};
module.exports.sendErr=(res,status,err)=>{
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify(err)); 
}
module.exports.id_regExp = /^[a-z0-9]{4,8}$/i