const locationDataBase = require(`./locationDataBase`);
const placeDataBase = require(`./placeDataBase`);
const { v4: uuidv4 } = require('uuid');

const locationReceiveHandler = (request, h) => {
    try{
        const { Loc_latitude, loc_longitude, loc_address, loc_city } = request.payload;

        const locID = uuidv4().slice(0, 16);

        const locData = {
            locID, Loc_latitude, loc_longitude, loc_address, loc_city,
        }

        locationDataBase.push(locData);

        //Kirim status handler ke database
        const statusMSG = 'Location data successfully received';
        const time = new Date().toString();

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
        handleFailure("Failed to receive location data", error);
    }
};

const locationSendHandler = (request, h) => {
    try {
        //Kirim status handler ke database
        const statusMSG = 'Location data succesfully send';
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
                locationDataBase,
            },
        });
        response.code(200);
        return response;
    } catch (error) {
        //Kirim status handler ke database
        handleFailure("Failed to send location data", error);
    }
};

const placeReceiveHandler = (request, h) => {
    try {
        const { name, category } = request.payload;

        const placeID = uuidv4().slice(0, 16);

        const placeData = {
            placeID, name, category,
        }
        
        placeDataBase.push(placeData);
        
        //Kirim status handler ke database
        const statusMSG = 'Place data succesfully received';
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
                locationDataBase,
            },
        });
        response.code(200);
        return response;
    } catch (error) {
        //Kirim status handler ke database
        handleFailure("Failed to receive place data", error);
    }
};

const placeSendHandler = (request, h) => {
    try {
        //Kirim status handler ke database
        const statusMSG = 'Place data succesfully send';
        const time = new Date().toString();

        const gsmStatus = {
            statusMSG, time,
        }
        handlerStatus.push(gsmStatus);

        //Response
        const response = h.response({
            status: 'success',
            message: 'Place data succesfully send',
            data: {
                locationDataBase,
            },
        });
        response.code(200);
        return response;
    } catch (error) {
        //Kirim status handler ke database
        handleFailure("Failed to send place data", error);
    }
}

const handleFailure = (statusMSG, error) => {
    // Kirim status handler ke database
    const time = new Date().toString();

    const statusData = { statusMSG, time };
    handlerStatus.push(statusData);

    // Response
    const response = h.response({
        status: 'fail',
        message: statusMSG,
        error: error.message,
    });
    response.code(404);
    return response;
};

module.exports = {
    locationReceiveHandler,
    locationSendHandler,
    placeReceiveHandler,
    placeSendHandler,
    handleFailure,
}