const { getLatestStatusData } = require("./db/getData");

const latestStatus = getLatestStatusData() 
const statusHandler = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Status data successfully displayed',
        data: {
            latestStatus,
        },
    });
};

module.exports = statusHandler;
