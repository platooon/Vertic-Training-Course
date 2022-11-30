public class CaseManagementMetaProc extends vertic_MetadataProcessor {

    public override vertic_Response process(vertic_Request request) {
        this.request = request == null ? new vertic_MetadataProcessor.MetadataRequest() : (vertic_MetadataProcessor.MetadataRequest) request;
        this.request.fields = new Set<SObjectField>{
            Case.Status,
            Contact.FirstName,
            Contact.LastName,
            Contact.Email
        };

        super.process(this.request);

        this.init();

        return this.response;
    }

    private void init() {
        this.response.getMapper().mapFromListSObjects('cases', [SELECT Id, Status
                                                                    FROM Case]);
        System.debug(response);
        this.response.getMapper().mapFromListSObjects('contacts', [SELECT Id, FirstName, LastName, Email
                                                                    FROM Contact]);
        this.response.getMapper().mapAnyValue('publicSiteURL', System.Url.getOrgDomainUrl().toExternalForm());
    }
}