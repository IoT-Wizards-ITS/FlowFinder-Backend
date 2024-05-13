const handlerStatus = require(`./status`);

const statusHandler = (request, h) => {
    const response = h.response({
        status: 'success',
        message: 'Status data succesfully displayed',
        data: {
            handlerStatus,
        },
    });
    response.code(200);
    return response;
};

module.exports = statusHandler;