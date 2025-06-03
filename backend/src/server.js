// server.js
import app from './src/app.js';

const server = app.listen(process.env.PORT || 3000, () => {

});

export default server;
