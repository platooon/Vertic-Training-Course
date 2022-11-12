public class CaseManagementMetaProc extends vertic_MetadataProcessor {

    public override vertic_Response process(vertic_Request request) {
        this.request = request == null ? new vertic_MetadataProcessor.MetadataRequest() : (vertic_MetadataProcessor.MetadataRequest) request;
        System.debug(this.request);
        this.request.fields = new Set<SObjectField>{
            Case.Status// SObject Fields, e.g. Contact.Salutation
        };

        super.process(this.request);

        this.init();

        return this.response;
    }

    private void init() {
        System.debug(this.request.getString('test'));
        this.response.getMapper().mapFromListSObjects('cases', [SELECT Id, Status FROM Case]);
    }
}