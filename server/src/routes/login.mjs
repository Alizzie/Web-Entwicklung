import express from 'express';
import {db} from '../database.mjs'; 

const loginRouter = express.Router(); 

loginRouter.post('/' ,function (request,response) {
    const sqlStmt = 'select name,password from veranstalter where name=? and password=?'; 
    db.get(sqlStmt,request.body, (err,row) => {
        let loginSucces = false; 
        if(err){
            throw err; 
        }
        if(row){
            loginSucces = true; 
        }
        const data = {
            accepted:loginSucces
        } 
        response.json(data); 
    })});

/*
loginRouter.post('/signUp' ,function (request,response) {
    const addUser = 'INSERT INTO veranstalter(name,password,email) VALUES(?,?,?)';
    db.run(addUser,request.body, (err) => {
        let signedUp = true; 
        if(err){
            console.log("something went wrong"); 
            signedUp = false; 
            throw err; 
        }
        data = {
            acces:signedUp
        } 
    })
    
    
    });
*/
export {loginRouter};
