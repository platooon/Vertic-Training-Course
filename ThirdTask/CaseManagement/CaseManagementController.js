({
    handleInit: function(cmp, event, helper) {
        helper.doInit(
            cmp,
            'CaseManagementMetaProc',
            {},
            (response) => {

            },
            () => {},
            false
        )
    },

    createCaseClick: function(cmp, event, helper) {
        helper.execute(
            cmp,
            'CaseManagementSubmitProc',
            {
                case: cmp.get('v.meta.dto.case')
            },
            (response) => {
                console.log(JSON.parse(JSON.stringify(response)));
            },
            () => {},
            false
        )
    },

    handleDeleteRecordClick: function(cmp, event, helper) {
        helper.execute(
            cmp,
            'CaseManagementDeleteProc',
            {
                contacts: cmp.get('v.meta.dto.contacts').filter(contact => contact.checked)
            },
            (response) => {
                console.log(JSON.parse(JSON.stringify(response)));
                helper.doInit(
                    cmp,
                    'CaseManagementMetaProc',
                    {},
                    (response) => {

                    },
                    () => {},
                    false
                )
            },
            () => {},
            false
        )
    },

    handleSaveRecordsClick: function(cmp, event, helper) {
        helper.execute(
            cmp,
            'CaseManagementSaveProc',
            {
                contacts: cmp.get('v.meta.dto.contacts')
            },
            (response) => {
                console.log(JSON.parse(JSON.stringify(response)));
            },
            () => {},
            false
        )
    },

    searchAllContactClick: function(cmp, event, helper) {

        cmp.set('v.meta.dto.contacts', []);
        helper.execute(
            cmp,
            'CaseManagementSearchProc',
            {
                filter: cmp.get('v.filter')
            },
            (response) => {
                cmp.set('v.meta.dto.contacts', response.dto.contacts);
            },
            () => {},
            false
        )
    },

    handleSelectRecordsClick: function(cmp, event, helper) {

        helper.execute(
            cmp,
            'CaseManagementSelectProc',
            {
                contacts: cmp.get('v.meta.dto.contacts')
            },
            (response) => {
                console.log(JSON.parse(JSON.stringify(response)));
            },
            () => {},
            false
        )
    },

});