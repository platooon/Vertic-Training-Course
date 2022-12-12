({
    handleInit: function(cmp, event, helper) {
        helper.doInit(
            cmp,
            'AccountManagementMetaProc',
            {},
            (response) => {},
            () => {},
            false
        )
    },

    handleAddNewContactClick: function(cmp, event, helper) {
        let items = cmp.get('v.meta.dto.items') || [];
        items.push({});
        cmp.set('v.meta.dto.items', items);
    },

    handleAddExistingContactClick: function (cmp, event, helper) {
        cmp.set("v.isModalOpen", true);
    },

    closeModel: function(cmp, event, helper) {
        cmp.set("v.isModalOpen", false);
    },

    deleteContactClick: function(cmp, event, helper) {
        let payload = event.getParam('payload');

        if(payload){
            let items = cmp.get('v.meta.dto.items') || [];
            items.splice(payload.index, 1);
            cmp.set('v.meta.dto.items', items);
        }
    },

    handleCancelClick: function(cmp, event, helper) {
        window.history.back()
    },

    handleSaveClick: function(cmp, event, helper) {
        let errorMessageCmp = cmp.find('errors');
        errorMessageCmp.clearErrors();
        let validationResultAccount = cmp.utils.validate(
            cmp.find('accountManagementAccount'),
            {}
        );

        let validationResultContact = cmp.utils.validate(
            cmp.find('accountManagementContact'),
            {}
        );

        if (validationResultContact.allValid !== true && validationResultAccount.allValid !== true) {
            errorMessageCmp.showErrors('Account Name' + validationResultAccount.getErrorMessages() +
                ' Contact Last Name' + validationResultContact.getErrorMessages(), true);

            helper.doInit(
                cmp,
                'AccountManagementMetaProc',
                {},
                (response) => {},
                () => {},
                false
            )

            return false;
        }

        if (validationResultAccount.allValid !== true) {
            errorMessageCmp.showErrors('Account Name' + validationResultAccount.getErrorMessages(), true);

            helper.doInit(
                cmp,
                'AccountManagementMetaProc',
                {},
                (response) => {},
                () => {},
                false
            )

            return false;
        }

        if (validationResultContact.allValid !== true) {
            errorMessageCmp.showErrors(' Contact Last Name' + validationResultContact.getErrorMessages(), true);

            helper.doInit(
                cmp,
                'AccountManagementMetaProc',
                {},
                (response) => {},
                () => {},
                false
            )

            return false;
        }

        helper.execute(
            cmp,
            'AccountManagementSaveProc',
            {
                accounts: cmp.get('v.meta.dto.accounts'),
                items: cmp.get('v.meta.dto.items')
            },
            (response) => {
                console.log(JSON.parse(JSON.stringify(response)));
                helper.doInit(
                    cmp,
                    'AccountManagementMetaProc',
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

    searchAllContactClick: function(cmp, event, helper) {

        cmp.set('v.meta.dto.contacts', []);
        helper.execute(
            cmp,
            'AccountManagementSearchProc',
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

    handleConfirmClick: function(cmp, event, helper) {
        cmp.set('v.meta.dto.items', cmp.get('v.meta.dto.contacts').filter(contact => contact.checked))
        cmp.set('v.isModalOpen', false);
    },

    handleSelectAll: function(cmp, event, helper) {
        let isSelectAll = event.getSource().get('v.checked');
        let contacts  = cmp.get('v.meta.dto.contacts');
        contacts.forEach(contact => {contact.checked = isSelectAll})
        cmp.set('v.meta.dto.contacts', contacts)
    },

    keyCheck: function(cmp, event, helper) {
        if(event.key === 'Enter') {
            cmp.set('v.meta.dto.contacts', []);
            helper.execute(
                cmp,
                'AccountManagementSearchProc',
                {
                    filter: cmp.get('v.filter')
                },
                (response) => {
                    cmp.set('v.meta.dto.contacts', response.dto.contacts);
                },
                () => {},
                false
            )
        }
    },

    handleShowMoreClick: function(cmp, event, helper) {

        let showMore = cmp.get('v.showMore');
        cmp.set('v.showMore', showMore + 10);
        cmp.set('v.viewAll', false);
        cmp.set('v.showLess', true);

        helper.doInit(
            cmp,
            'AccountManagementShowMoreProc',
            {
                showMore: cmp.get('v.showMore')
            },
            (response) => {
                console.log(showMore)
            },
            () => {},
            false
        )
    },

    handleShowLessClick: function(cmp, event, helper) {

        cmp.set('v.showLess', false);
        cmp.set('v.viewAll', false);
        cmp.set('v.showMore', 10);

        helper.doInit(
            cmp,
            'AccountManagementShowLessProc',
            {},
            (response) => {},
            () => {},
            false
        )
    },

    handleViewAllClick: function(cmp, event, helper) {

        cmp.set('v.viewAll', true);
        cmp.set('v.showLess', true);
        cmp.set('v.showMore', 10000);

        helper.doInit(
            cmp,
            'AccountManagementViewAllProc',
            {},
            (response) => {},
            () => {},
            false
        )
    },


});