const http = require("http");

function GetAllArtists() {
    const url = 'http://groupietrackers.herokuapp.com/api/artists';

    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const artists = JSON.parse(data).map(artist => ({
                        id: artist.id,
                        image: artist.image,
                        name: artist.name
                    }));
                    resolve(artists);
                } catch (error) {
                    reject('Error parsing JSON');
                }
            });
        });

        req.on('error', (error) => {
            reject(`Error fetching artists: ${error.message}`);
        });

        req.end();
    });
}

function GetArtistByID(id) {
    const url = 'http://groupietrackers.herokuapp.com/api/artists' + '/' + id;

    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const artists = JSON.parse(data);
                    resolve(artists);
                } catch (error) {
                    reject('Error parsing JSON');
                }
            });
        });

        req.on('error', (error) => {
            reject(`Error fetching artists: ${error.message}`);
        });

        req.end();
    });
}

function GetRelationByID(id) {
    const url = 'http://groupietrackers.herokuapp.com/api/relation' + '/' + id;

    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const relation = JSON.parse(data);
                    resolve(relation);
                } catch (error) {
                    reject('Error parsing JSON');
                }
            });
        });

        req.on('error', (error) => {
            reject(`Error fetching relation: ${error.message}`);
        });

        req.end();
    });
}


function GetLocationByID(id) {
    const url = 'http://groupietrackers.herokuapp.com/api/locations/' + id;

    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const location = JSON.parse(data);
                    resolve(location);
                } catch (error) {
                    reject('Error parsing JSON');
                }
            });
        });

        req.on('error', (error) => {
            reject(`Error fetching location: ${error.message}`);
        });

        req.end();
    });
}

module.exports = {GetAllArtists, GetArtistByID, GetRelationByID, GetLocationByID};


