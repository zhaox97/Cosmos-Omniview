const config = require('../../../config');


module.exports = function(size, latRange, longRange, timeQuery) {
    return {
        index: config.elasticSearchIndex,
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
                        timeQuery   // ES formatted json range query
                    ] // must
                } // bool
            } // query
        } // body
    };
}
