import app from './app.js';
const startServer = () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Listening to the port: ${port}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map