({
    handleInit: function(cmp, event, helper){

        helper.execute(
            cmp,
            'vertic_SOQLProc',
            {
                'SOQL': 'SELECT Id, NamespacePrefix, Label, Description__c, Knowledge_Base_Link__c, Setup_Screen_Flow__c, Setup_Screen_Flow_Header__c, DeveloperName, Flow_API_Name__c FROM Flow_Setting__mdt WHERE Type__c = \'Data Import\' AND Is_Active__c = true'
            },
            function (response) {
                var flowSettings = {};
                var options = response.dto.records.map(function (record) {
                    let settingName = (record.NamespacePrefix ? record.NamespacePrefix + '.' : '') + record.DeveloperName;
                    flowSettings[settingName] = record;
                    return {
                        value: settingName,
                        label: record.Label
                    }
                });
                cmp.set('v.meta.selectOptions.flowSettingOptions', options);
                cmp.set('v.meta.flowSettings', flowSettings);
            }
        )
    }
})