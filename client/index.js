function submitURL(){
    document.getElementById("submit_button").classList += ' disabled';
    fetch('/new',{
        method:'POST',
        headers : {"Content-Type" : "application/json"},
        body:JSON.stringify({ "url":document.getElementById('url_input').value })
    }).then(res=>res.json())
    .then(res=>{
        document.getElementById("submit_button").classList = document.getElementById("submit_button").classList.value.split(' disabled')[0]
        document.getElementById('response').innerHTML = JSON.stringify(res)
        document.getElementById('response').innerHTML +=`<a href="${res.url}">${res.url}</a>`
    })
}