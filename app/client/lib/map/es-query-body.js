timeSlider = require('../time-slider');

module.exports = function(size, latRange, longRange) {
    return {
        index: 'test_index',
        body: {
            size: size,
            query: {
                bool: {
                    must: [
                        {range: {
                            latt: {
                                gte: latRange[0],
                                lte: latRange[1]
                            }
                        }},
                        {range: {
                            longt: {
                                gte: longRange[0],
                                lte: longRange[1]
                            }
                        }},
                        timeSlider.getESQuery()
                    ] // must
                } // bool
            } // query
        } // body
    };
}
