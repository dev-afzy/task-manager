const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('MongoDB successfully connected. Database URL:', process.env.MONGODB_URL);
}).catch(error => {
    console.log('Error establishing MongoDB connection. Error:', error.message);
});    