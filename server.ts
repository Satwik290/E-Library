import app from './src/app.js'; 
import { config } from './src/config/config.js';
import connectDB from './src/config/db.js';


const startServer = async () => {
  try {
    await connectDB();

    const port = config.port || 3000;

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

startServer();
