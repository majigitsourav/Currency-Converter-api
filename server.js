const http = require('http');

const API_KEY = "2Bu3ILU593rjNKq2uoNiNiBC2ECueJGR";
const BASE_URL = "https://api.apilayer.com/exchangerates_data/convert";

const server = http.createServer(async(req,res)=>{
    if(req.url.startsWith('/api/currency-convert') && req.method === 'GET'){
        const url = new URL(req.url, `http://${req.headers.host}`);
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
        const amount = parseFloat(url.searchParams.get('amount'));

        if(!from || !to || isNaN(amount)){
            res.writeHead(400,{ 'Content-Type':'application/json' })
            res.write(JSON.stringify({ error: 'Invalid query parameters. Please provide from, to, and amount.' }));
            res.end();
            return;
        }
        try{
            
            const apiUrl = `${BASE_URL}?from=${from}&to=${to}&amount=${amount}`;
            console.log(apiUrl);
            const response = await fetch(apiUrl,{ headers: { 'apikey': API_KEY }});
            //console.log(response);
            const data = await response.json();
            console.log(data);

            if( !response.ok ||!data.result){
                res.writeHead(500,{ 'Content-Type':'application/json' });
                res.write(JSON.stringify({ error: 'Conversion failed, try again later.' }));
                res.end();
                return;
            }

            const result = {
                from : from,
                to : to,
                amount : amount,
                convertedAmount: data.result,
                rate: data.info.rate
            }
            res.writeHead(200,{ 'Content-Type':'application/json' });
            res.write(JSON.stringify(result));
            res.end();

        }catch(err){
            res.writeHead(500,{ 'Content-Type':'application/json' });
            res.write(JSON.stringify({ error: 'An error occurred while processing your request.' ,details: err.message}));
            res.end();
        }
       
    } else{
        res.writeHead(404,{'Content-Type':'application/json'});
        res.write(JSON.stringify({message: 'Route Not Found'}));
        res.end();
    }
})
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", ()=>{
    console.log("Server running at PORT ${PORT}");
});
