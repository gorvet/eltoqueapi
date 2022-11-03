import app from './app.js';

const main = async (port) => {
    app.listen(port);
    console.log('>>> Server on port', port);
};

main(process.env.PORT || 3001);