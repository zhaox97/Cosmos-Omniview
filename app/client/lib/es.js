const elasticsearch = require('elasticsearch');
module.exports = new elasticsearch.Client({
    // log: 'trace',
    host: 'localhost:9200'
});

// Theo's example ES request
// {
// 'size': 50,
//     'query': {
//         'range':{
//             'latt' : {
//                 'gte' : latt[0],
//                 'lte' : latt[1]
//             },
//             'longt' : {
//                 'gte' : longt[0],
//                 'lte' : longt[1]
//             }
//         }
//     }
// }
