const express = require('express');
const connectDB = require('./utils/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

//load env vars
require('dotenv').config()

//Connect to database
connectDB();

//route files
const userRoutes = require('./routes/user.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const roomRoutes = require('./routes/room.routes');
const app = express();

//body parser
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//mount routers
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/room', roomRoutes);
app.use('/api/v1/schedule', scheduleRoutes);


const PORT = process.env.PORT;

const server = app.listen(PORT, function () {
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
});

//handle unhandled PromiseRejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`.red);

    //Close Server & exit process
    server.close(() => process.exit(1));
})
