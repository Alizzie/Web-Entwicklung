
export function eventRequest(field){
const port = window.location.port;
fetch(`http://localhost:${port}/api/login`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'},
    body: field
    }).then((res) => res.text).
    then(data => {
        const result = JSON.parse(data); 
        return result; 
    }).
    catch( (err) => {
        throw err;
    })
}
