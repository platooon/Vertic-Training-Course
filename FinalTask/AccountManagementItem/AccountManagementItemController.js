({
    handleInit: function(cmp, event, helper) {
        helper.doInit(
            cmp,
            'AccountManagementItemMetaProc',
            {},
            (response) => {},
            () => {},
            false
        )
    },

    deleteContactClick: function(cmp, event, helper) {
        let completeEvent = cmp.getEvent("onDelete");
        completeEvent.setParams({
            "payload": {
                index: cmp.get('v.index')
            }
        });
        completeEvent.fire();
    },
})