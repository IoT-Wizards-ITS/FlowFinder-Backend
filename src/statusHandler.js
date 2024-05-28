const statusHandler = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Status data successfully displayed',
        data: {
            handlerStatus,
        },
    });
};

module.exports = statusHandler;
