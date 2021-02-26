const mongoose = require('mongoose');

module.exports = () => {
    const connect = () => {
        if (process.env.NODE_ENV !== 'production'){
            mongoose.set('debug', true);
        }
        mongoose.connect('mongodb://yungukbae:qwe123@localhost:27017/admin', {
        dbName: 'nodejs'},        
        (error)=>{
            if(error){
                console.log('mongodb connection error',error);
            }else{
                console.log('connection success');
            }
        });
    };

    connect();
    mongoose.connection.on('error', (error) => {
        console.error('connection error', error);
    });
    mongoose.connection.on('disconnected',() => {
        console.error('mongodb disconnected,..  try to connect');
        connect();
    });

    require('./user');
    require('./comment');

};