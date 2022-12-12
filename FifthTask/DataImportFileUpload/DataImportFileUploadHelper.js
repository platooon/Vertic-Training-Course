({
    parseFile: function (cmp, file) {
        return new Promise($A.getCallback(function (resolve, reject) {

            cmp.find('papaParseCmp').parseCSV(
                file,
                {
                    header: true,
                    dynamicTyping: false,
                    skipEmptyLines: true,
                    complete: function(results) {
                        console.log(JSON.parse(JSON.stringify(results)));
                        return resolve(results);
                    },
                    error: function (error) {
                        return reject(error);
                    }
                }
            );

        }));
    },

    import: function(cmp, event, helper, csvParsedData, checkOnly){

        var promises = [];
        csvParsedData.data.forEach(function (csvRowData) {
            var importPromise = function () {
                return new Promise(function (resolve, reject) {
                    csvRowData.recordId = cmp.get('v.recordId');
                    csvRowData.JSONData = JSON.stringify(csvRowData);
                    csvRowData.setup = cmp.get('v.meta.setup');
                    helper.utils(cmp).execute(
                        cmp,
                        'vertic_FlowSettingProc',
                        {
                            settingName: cmp.get('v.meta.dto.flowSetting'), //'Data_Import',
                            inputs: csvRowData,
                            checkOnly: checkOnly
                        },
                        function () {},
                        function () {}
                    ).then(resolve, function (errors) {
                        resolve({
                            isValid: false,
                            message: errors[0].message
                        });
                    }).finally(function () {
                        cmp.getConcreteComponent().getEvent('onProgress').fire();
                    });
                });
            }

            promises.push(importPromise);
        });

        return cmp.get('v.meta.dto.isParallel') == true ?
            Promise.all(promises.map(function (fn) { return fn(); })) :
            helper.sequencePromises(promises);
    },

    sequencePromises: function(promises){
        return new Promise(function (resolve, reject) {

            var results = [];

            promises.reduce(function (p, promise, index) {

                return p.then($A.getCallback(function (){
                    var isLast = index == promises.length - 1;
                    return promise().then(function (response) {
                        results.push(response);
                        if(isLast) {
                            resolve(results);
                        }
                    }).catch(function (reason) {
                        results.push({
                            isValid: false,
                            message: reason
                        });
                        if(isLast) {
                            resolve(results);
                        }
                    });
                }), reject);

            }, Promise.resolve());

        });
    },

    handleSetupClick: function(cmp, event, helper){
        return cmp.find('modalService').show(
            'ScreenFlowModal',
            {
                flow: cmp.get('v.meta.flowSetting.Setup_Screen_Flow__c')
            },
            {
                header: cmp.get('v.meta.flowSetting.Setup_Screen_Flow_Header__c') || 'Setup Data Import',
                cssClass: 'slds-modal_small'
            }
        ).then($A.getCallback(function (response) {
            if (response !== false) {
                cmp.set('v.meta.setup', response);
            }
        }, function (error) {
            console.error(error);
        }));
    },

    handleImport: function(cmp, event, helper){

        return new Promise((resolve, reject) => {
            var csvParsedData = cmp.get('v.meta.dto.csvParsedData');

            var checkOnly = cmp.get('v.meta.dto.checkOnly') === true;

            cmp.set('v.meta.dto.importSummary', null);
            cmp.set('v.isBusy', true);

            cmp.set('v.meta.dto.progress.total', csvParsedData.data.length);
            cmp.set('v.meta.dto.progress.current', 0);
            cmp.set('v.meta.dto.progress.isVisible', true);
            cmp.set('v.meta.dto.progress.startedOn', new Date());

            helper.import(cmp, event, helper, csvParsedData, checkOnly).then(function (results) {
                console.log('results', results);

                var resultsWithCSVData = results.map(function (result, index) {
                    result.CSVData = csvParsedData.data[index] || {};
                    return result;
                })

                var failed = resultsWithCSVData.filter(function (result) {
                    return result.isValid !== true;
                });

                var summary = {
                    totalProcessed: results.length,
                    totalSucceeded: results.length - failed.length,
                    totalFailed: failed.length,
                    results: resultsWithCSVData
                };

                cmp.set('v.meta.dto.importSummary', summary);
                return resolve();

            }).catch(function (errors) {
                console.log('errors', errors);
                return resolve();
            }).finally(function () {
                cmp.set('v.isBusy', false);
                cmp.set('v.meta.dto.progress.isVisible', false);
            });
        });
    }
})