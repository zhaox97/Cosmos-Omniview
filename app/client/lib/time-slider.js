const ui = require('../ui');

module.exports = {
    update: update,
    getESQuery: getESQuery
};

function update() {
    const timeCurrent = document.getElementById(ui.timeCurrent),
        slider = document.getElementById(ui.timeSlider);
    timeCurrent.innerHTML = getDateString(
        getCurrentTime(
            slider.value,
            Number(slider.getAttribute('max'))
        )
    );
}

function getESQuery() {
    const timeCurrent = document.getElementById(ui.timeCurrent),
        slider = document.getElementById(ui.timeSlider),
        lowerTime = getCurrentTime(
            slider.value,
            Number(slider.getAttribute('max'))
        ),
        upperTime = (new Date()).getTime();
    return {
        range: {
            timestamp: {
                lte: upperTime,
                gte: lowerTime
            }
        }
    };
}

function getLowerTimeBound(now) {
    const timeStr = document.getElementById(ui.timeBoundDropdown).innerHTML.split(' '),
        count = Number(timeStr[0]),
        unit = timeStr[1].toLowerCase();
    console.log(timeStr);
    if (unit.includes('year'))
        return now - (count * (1000 * 60 * 60 * 24 * 365));
    else if (unit.includes('month'))
        return now - (count * (1000 * 60 * 60 * 24 * 30));
    return now;
}

function getCurrentTime(val, maxVal) {
    const now = (new Date()).getTime(),
        lower = getLowerTimeBound(now),
        range = now - lower,
        percent = val / maxVal;
    return lower + (range * percent);
}

function getDateString(unixTime) {
    const date = new Date(unixTime),
        months = ['January','February','March',
            'April','May','June',
            'July','August','September',
            'October','November','December'],
        month = months[date.getMonth()],
        day = date.getDate(),
        year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}
