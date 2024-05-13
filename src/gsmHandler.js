const gsmDataBase = require(`./gsmDatabase`);
const { handleFailure } = require("./locationHandler");
const handlerStatus = require(`./status`);

const gsmDataReceiveHandler = (request, h) => {
    try {
        const { gsmID, lv1, lv2, lv3, lv4 } = request.payload;

        const time = new Date().toString();

        const gsmData = {
            gsmID, lv1, lv2, lv3, lv4, time,
        }

        gsmDataBase.push(gsmData);

        //Kirim status handler ke database
        const statusMSG = 'Data from GSM module successfully received and processed';
        const gsmStatus = {
            statusMSG, time,
        }
        handlerStatus.push(gsmStatus);

        //Response
        const response = h.response({
            status: 'success',
            message: statusMSG,
        });
        response.code(200);
        return response;
    } catch (error) {
        //Kirim status handler ke database
        handleFailure("Failed to receive data from GSM module", error);
    }
};

const gsmDataSendHandler = (request, h) => {
    try {
        //Kirim status handler ke database
        const statusMSG = 'Data from GSM module successfully send';
        const time = new Date().toString();

        const gsmStatus = {
            statusMSG, time,
        }
        handlerStatus.push(gsmStatus);

        //Response
        const response = h.response({
            status: 'success',
            message: statusMSG,
            data: {
                gsmDataBase,
            },
        });
        response.code(200);
        return response;
    } catch (error) {
        //Kirim status handler ke database
        handleFailure("Failed to send data from GSM module", error);
    }
};

module.exports = { 
    gsmDataReceiveHandler,
    gsmDataSendHandler, 
};