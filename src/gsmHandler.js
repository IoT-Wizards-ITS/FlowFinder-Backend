const gsmDataBase = require(`./gsmDatabase`);
const { handleFailure } = require("./locationHandler");
const handlerStatus = require(`./status`);

const gsmDataReceiveHandler = (req, res) => {
    try {
        const { rawData } = req.body;
        const parsedData = parseBinaryData(rawData);
        const time = new Date().toString();

        const gsmData = {
            parsedData, time,
        }
        gsmDataBase.push(gsmData);

        //Kirim status handler ke database
        const statusMSG = 'Data from GSM module successfully received and processed';
        const gsmStatus = {
            statusMSG, time,
        }
        handlerStatus.push(gsmStatus);

        //Response
        res.status(200).json({
            status: 'success',
            message: statusMSG,
        });
    } catch (error) {
        //Kirim status handler ke database
        handleFailure("Failed to receive data from GSM module", error);
        res.status(500).json({
            status: 'fail',
            message: 'Failed to receive data from GSM module',
            error: error.message,
        });
    }
};

const gsmDataSendHandler = (req, res) => {
    try {
        //Kirim status handler ke database
        const statusMSG = 'Data from GSM module successfully sent';
        const time = new Date().toString();

        const gsmStatus = {
            statusMSG,
            time,
        }
        handlerStatus.push(gsmStatus);

        //Response
        const gsmLatestData = gsmDataBase[gsmDataBase.length - 1];
        res.status(200).json({
            status: 'success',
            message: statusMSG,
            data: {
                gsmLatestData,
            },
        });
    } catch (error) {
        //Kirim status handler ke database
        handleFailure("Failed to send data from GSM module", error);
        res.status(500).json({
            status: 'fail',
            message: 'Failed to send data from GSM module',
            error: error.message,
        });
    }
};

//fungsi
function parseBinaryData(binaryData) {
    // Pisahkan 2 digit pertama sebagai ID dan 2 digit terakhir sebagai level
    const id = binaryData.slice(0, 2);
    const level = binaryData.slice(2);

    // Konversi level dari biner ke desimal
    const levelDecimal = parseInt(level, 2);

    const result = {
        id,
        level: levelDecimal + 1
    };

    return result;
}

module.exports = { 
    gsmDataReceiveHandler,
    gsmDataSendHandler, 
};
