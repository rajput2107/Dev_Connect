const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');


// Connect DB
connectDB();

// Init Middleware(BodyParser)
app.use(express.json({extended: false}));

// app.get('/',(req,res)=>{
//     res.send('Running');
// });

// Define Routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/posts',require('./routes/api/posts'));
app.use('/api/profile',require('./routes/api/profile'));



// Serve Static Assets in Production
if(process.env.NODE_ENV === 'production'){
    //Set Static Folder
    app.use(express.static('client/build'));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server started on PORT ${PORT}`)
});