// bikin waktu make GMT +7
function getGMT7Date(opt) {
    const date = new Date();
    const utcOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const gmt7Offset = 7 * 60 * 60000; // GMT+7 offset in milliseconds
    const gmt7Date = new Date(date.getTime() + utcOffset + gmt7Offset);
    
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const isoGmt7Date = gmt7Date.toISOString();
    const formattedDate = gmt7Date.toLocaleString('en-GB', options).replace(',', '');

    if(opt === 1) {
        return isoGmt7Date;
    }

    if (opt === 2) {
        return formattedDate;
    }
}

module.exports = getGMT7Date;