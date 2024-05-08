const gsmDataHandler = (request, h) => {
    try {
        const { data } = request.payload;

        // Proses data dari modul GSM
        console.log('Data yang diterima dari modul GSM:', data);

        const response = h.response({
            status: 'success',
            message: 'Data from GSM module successfully received and processed',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: 'Failed to process data from GSM module',
            error: error.message,
        });
        response.code(500);
        return response;
    }
};

module.exports = { gsmDataHandler };