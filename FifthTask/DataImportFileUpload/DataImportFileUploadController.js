({
    handleInit: function(cmp, event, helper){
        var hooks = {
            validate: function (cmp) {
                return new Promise(function (resolve, reject) {
                    var csvParsedData = cmp.get('v.meta.dto.csvParsedData');
                    if (!csvParsedData || !csvParsedData.data || !csvParsedData.data.length){
                        return reject(['No Data to Import']);
                    }
                    return resolve();
                });
            },
            onNext: function (cmp) {
                return new Promise($A.getCallback(function (resolve, reject) {

                    let setupFlow = cmp.get('v.meta.flowSetting.Setup_Screen_Flow__c');

                    if(setupFlow){
                        helper.handleSetupClick(cmp, event, helper).then(function (){
                            helper.handleImport(cmp, event, helper).then(resolve).catch(reject);
                        });
                    } else {
                        helper.handleImport(cmp, event, helper).then(resolve).catch(reject);
                    }

                }));
            }
        };

        cmp.set('v.hooks', hooks);
    },

    handleFilesChange: function(cmp, event, helper){

        var files = event.getSource().get('v.files');
        if(!files || !files.length){
            return;
        }

        cmp.set('v.meta.dto.csvParsedData', null);
        cmp.set('v.isBusy', true);

        helper.parseFile(cmp, files[0]).then(function (csvParsedData) {
            if(csvParsedData && csvParsedData.errors && csvParsedData.errors.length){
                csvParsedData.errors = csvParsedData.errors.sort(function(a, b){return a.row - b.row});
            }
            cmp.set('v.meta.dto.csvParsedData', csvParsedData);
        }).catch(function (error) {
            helper.utils(cmp).showToast({
                message: JSON.stringify(error),
                type: 'error'
            });
        }).finally(function () {
            cmp.set('v.isBusy', false);
        });

    },

    handleOnProgress: function(cmp, event, helper){

        var current = cmp.get('v.meta.dto.progress.current') || 0;
        current = current + 1;
        var total = cmp.get('v.meta.dto.progress.total');

        var value = (current * 100 / total).toFixed(2);

        cmp.set('v.meta.dto.progress.value', value);
        cmp.set('v.meta.dto.progress.current', current);
    },

    handleFlowSettingChange: function(cmp, event, helper){
        var selectedFlowSettingName = cmp.get('v.meta.dto.flowSetting');
        let flowSettings = cmp.get('v.meta.flowSettings') || {};
        let flowSetting = flowSettings[selectedFlowSettingName];
        cmp.set('v.meta.flowSetting', flowSetting);
        cmp.set('v.meta.setup', {});
    },
})