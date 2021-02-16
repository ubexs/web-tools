const axios = require('axios').default;
const path = require('path');
const fs = require('fs');
const conf = JSON.parse(fs.readFileSync(path.join(__dirname, '../../deploy/config/config.web-backend.json')).toString());

const main = async () => {
    let key = conf.render.key;
    let url = conf.render.url + '?key=' + key + '&id=5&type=avatar';
    axios.post(url, { "UserId": 5, "Leg": [0.20392156862745098, 0.22745098039215686, 0.25098039215686274], "Head": [0.8117647058823529, 0.7019607843137254, 0.26666666666666666], "Torso": [0.1568627450980392, 0.6549019607843137, 0.27058823529411763], "Hats": { "Texture": ["442.png", "176.png", "224.png"], "OBJ": ["442.obj", "176.obj", "224.obj"], "MTL": ["442.mtl", "176.mtl", "224.mtl"] }, "Face": false, "Gear": true, "TShirt": { "Texture": ["1053.jpg"] }, "Shirt": { "Texture": ["479.png"] }, "Pants": { "Texture": ["483.png"] } }).then(d => {
        console.log('done', d.data);
    }).catch(err => {
        console.log(err.response.status, err.response.headers, err.response.data);
    })
}
main();