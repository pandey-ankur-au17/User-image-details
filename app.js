const mongoose = require('mongoose');
const express = require ('express');
const formServer = express();

const fileUploadMiddleware = require('express-fileupload')

formServer.use(express.urlencoded({extended:true}))

formServer.use(fileUploadMiddleware())

formServer.use(express.static(__dirname));

const dbImport = require('./db.js');

dbImport.dbInit()

const formSchema = new mongoose.Schema({
    Name:
    {
        type: String,
        require: true
    },
    Email_Id:
    {
        type: String,
        require: true
    },
    Password:
    {
        type: String,
        require: true
    },
    imageURL:
    {
        type: String,
    },

})

const formModel = mongoose.model('user',formSchema)

formServer.get('/signup',(req,res) => {
    res.sendFile(`${__dirname}`+`/index.html`)
});

formServer.post('/signup',async (req,res) =>{
    try{
        const data = req.body
        const fileData = req.files.imageURL
        console.log('File Received', fileData)
        const fileName = `${fileData.md5}-${fileData.name}`
        
        const filePath = `${__dirname}/userUploads/${fileName}`
        await fileData.mv(filePath)

        data.imageURL = `userUploads/${fileName}`
        
        console.log("data", data)

        const insertedData  = await formModel.create(data)
        const allData = await formModel.find({})
        
        res.send(allData)

    }
    catch (error) {
        res.send({
            error: true,
            errorObj: error
        })
    }

});

formServer.get('/signup', async (req,res)=>{
    try {
        
        const insertedData  = await formModel.find({})
        res.send(insertedData)

    } catch (error) {
        res.send({
            error: true,
            errorObj: error
        })
    }

})

formServer.get('/Allusers', async (req,res)=>{
    try {
        
        const insertedData  = await formModel.find({})
        res.send(`<h1 style="text-align:center">User Details Card</h1>

        <div style="display:flex; justify-content:center; align-items:center;  width:100vw">${insertedData.map(d => `

        <div style="border:2px solid black;border-radius:5px; width:250px; height:250px>
        <center><img src="${d.imageURL}" alt="Avatar"></center>
            <div>
                <center><img src="${d.imageURL}" alt="Avatar" style="width:200px; height:200px"></center>
                <p style="text-align:center"><b>${d.Name}</b></p>
                <p style="text-align:center">${d.Email_Id}</p>
            </div>
        </div>
        `)}</div>`)

    } catch (error) { 
        res.send({
            error: true,
            errorObj: error
        })
    }

})



formServer.get(`/signup/:uniqueId`, async (req,res)=>{
    try {
        
        const restaurant  = await formModel.findById(req.params.uniqueId)
        res.send(restaurant)

    } catch (error) {
        res.send({
            error: true,
            errorObj: error
        })
    }

})

formServer.put('/signup/:uniqueID',async (req,res)=>{
    try{
        const data = req.body
        const updatedData = await formModel.findByIdAndUpdate(req.params.uniqueID, data)
        res.send(updatedData)
    }
    catch(err){
        res.send({
            error:true,
            errorObj:err
        })
    }
})

formServer.delete('/signup/:uniqueID',async (req,res)=>{
    try{
        
        const deletedData = await formModel.findByIdAndDelete(req.params.uniqueID)
        res.send(deletedData)
    }
    catch(err){
        res.send({
            error:true,
            errorObj:err
        })
    }
})


formServer.get('*',(req,res) => {
    res.sendFile(`${__dirname}`+`/error.html`)
});

const PORT = process.env.PORT || 3001

formServer.listen(PORT,() => {
    console.log(`User Form listening on Port ${PORT}!`);

});
