const mongoose = require("mongoose");

const database = (module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.jf92v2w.mongodb.net/?retryWrites=true&w=majority`,
            connectionParams
        );
        console.log("🟰⏩▶️=>Database connected😎😍🆗");
        console.log("🟰⏩▶️ Connected with MongoDB-👍👌😍");
    } catch (error) {
        console.log(error);
        console.log("❌🛑🆘Database not connected,Try again😒😥😭");
    }
});

module.exports = database;