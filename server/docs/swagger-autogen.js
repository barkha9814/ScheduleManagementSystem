const swaggerAutogen = require("swagger-autogen")();
const dotenv = require('dotenv');
const outputFile = "./docs/swagger.json";
const endpointsFiles = ["./server.js"];

dotenv.config({path: './config/.env'});

const config = {
    info: {
        title: "Schedule Management API",
        description: "Schedule Meeting API documentation",
    },
    host: `localhost:${process.env.PORT}`,
    schemes: ["http", "https"],
    definitions: {
        schedule: {
            $userId: "U6",
            $roomId: "R4",
            guestUsers: ["U2", "U4"],
            $meetingDate: "2022-04-25",
            $startTime: "12:30",
            $endTime: "12:35"
        },
        user: {
            $userId: "yash",
            userName: "Yash",
            userEmail: "yash@growthpal.com"
        },
        updateUser: {
            userName: "Yash",
            userEmail: "yash@growthpal.com"
        },
        room: {
            $roomId: "R1",
            roomName: "Main Conference Room"
        },
        updateRoom: {
            roomName: "Main Room"
        }
    }
};

swaggerAutogen(outputFile, endpointsFiles, config);
