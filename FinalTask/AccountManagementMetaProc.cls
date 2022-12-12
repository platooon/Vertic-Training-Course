public class AccountManagementMetaProc extends vertic_MetadataProcessor {

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
        this.response.getMapper().mapFromListSObjects('account', [SELECT Id, Name, Type
                                                                    FROM Account]);
        this.response.getMapper().mapFromListSObjects('contacts', [SELECT Id, FirstName, LastName, Phone
                                                                    FROM Contact LIMIT 10]);
    }
}