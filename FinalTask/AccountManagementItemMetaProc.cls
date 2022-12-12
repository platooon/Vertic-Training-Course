public class AccountManagementItemMetaProc extends vertic_MetadataProcessor {

    public override vertic_Response process(vertic_Request request) {
        this.request = request == null ? new vertic_MetadataProcessor.MetadataRequest() : (vertic_MetadataProcessor.MetadataRequest) request;

        this.request.fields = new Set<SObjectField>{
            Account.Type
        };

        super.process(this.request);

        this.init();

        return this.response;
    }

    private void init() {
        List<Contact> contactList = this.request.getMapper().mapToListSObjects('items', Contact.SObjectType);

        this.response.getMapper().mapFromListSObjects('item', contactList);
        this.response.getMapper().mapFromListSObjects('account', [SELECT Id, Name, Type
        FROM Account]);
    }
}