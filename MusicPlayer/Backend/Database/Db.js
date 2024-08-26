const connectDB = async () => {
    const mongoUrl = process.env.MONGO_URL;
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const connection = await mongoose.connect(mongoUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            });
            console.log(`MongoDB Connected: ${connection.connection.host}`);
            break; 
        } catch (error) {
            console.error(`MongoDB connection failed. Retry ${retries + 1}/${maxRetries}`);
            retries += 1;
            if (retries === maxRetries) {
                console.error("Max retries reached. Exiting process.");
                process.exit(1);
            }
            
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};
