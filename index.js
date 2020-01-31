const axios = require('axios');
const fs = require('fs');
const JPIdata = {
    service(pathJson) {
        if (typeof pathJson !== "string") {
            console.error("make your path JSON into a string");
        }
        let process = null;
        let apikey = '';
        fs.readFile(pathJson , (err , fileData) => {
            if (err) {
                console.error(err);
            } 
            try {
                const object = JSON.parse(fileData);
                process = true;
                apikey = object.apikey;

            } catch (err) {
                console.error(err);
            }
        })

        let RESULTAUTHORIZATION = {
            getTable(table) {
                let tableid = "";
                let tableprocess = "";
                setTimeout(() => {
                    if (process === false) {
                        return console.error("You do not have authorization");
                    }
                    axios.default({
                        method: 'GET',
                        url: "http://localhost:8080/analytics/table/gettable/" + apikey + "/" + table
                    }).then((res) => {
                        if (typeof res.data === "string") {
                            tableprocess = res.data.process;
                            return console.error(res.data.tableapi);
                        }
                        tableid = res.data.tableapi;
                        tableprocess = res.data.process;
                    }).catch((error) => {
                        console.error(error);
                    })
                }, 500);
                let TABLEAUTHORIZATION = {
                    getTableData() {
                        return new Promise((resolve , reject) => {
                            setTimeout(() => {
                                if (tableprocess === false) {
                                    reject("You have an error when you try to retrieve the table")
                                } 

                            axios.default({
                                method: 'GET',
                                url: `http://localhost:8080/analytics/table/getwholetable/${apikey}/${tableid}`
                            }).then((res) => {
                                resolve(res.data);
                            }).catch((error) => {
                                console.error(error);
                            })

                            }, 1000);
                        })
                    },
                    setTableData(tablearray , map) {
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                if (tableprocess === false) {
                                    reject("You have an error when you try to retrieve the table");
                                }
                                const dataresponse = {
                                    request: map,
                                    labels: tablearray,
                                    apikey: apikey
                                }

                                let error =  null

                                if (Array.isArray(tablearray) !== true || typeof map !== "object") {
                                   error = "There is an error with your array of labels"
                                }

                                if (tablearray === null || map === null) {
                                    error = "One or both your parameters are missing";
                                } 

                                if (tablearray.length !== Object.keys(map).length) {
                                   error =  "You do not have the same number of items in your JSON that correlates to your array labels";
                                }
                                let result = true;
                                let objectMap = Object.keys(map);
                                for(let i = 0; i < objectMap.length; i++) {
                                    if (objectMap[i] !== tablearray[i]) {
                                        result = false
                                    }
                                }

                                if (result === false) {
                                  error = "Your labels dont match your JSON keys";
                                }

                                if (error !== null) {
                                    reject(error);
                                }

                                 axios.default({
                                    method:'POST',
                                    url: `http://localhost:8080/analytics/table/settable/${tableid}`,
                                    data: dataresponse
                                }).then((res) => {
                                    if (res.data.error !== null) {
                                        reject(res.data.error);
                                    } else {
                                        resolve(res.data);
                                    }
                                }).catch((error) => {
                                    console.error(error);
                                })
                            }, 1000);
                        })
                    },
                    fetchTableDetails() {
                        return new Promise((resolve , reject) => {
                            setTimeout(() => {
                                if (tableprocess === false) {
                                    reject("You have an error when you try to retrieve the table")
                                }
                                axios.default({
                                    method: 'GET',
                                    url: `http://localhost:8080/analytics/table/gettabledetails/${apikey}/${tableid}`
                                }).then((res) => {
                                    resolve(res.data)
                                }).catch((error) => {
                                    console.log(error);
                                })
                            }, 1200);
                        })
                    }
                }
                return TABLEAUTHORIZATION;
            }
        }
        return RESULTAUTHORIZATION;
    }
}

module.exports = JPIdata
