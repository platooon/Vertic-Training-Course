public class FirstTaskPostProc extends vertic_AbstractProcessor implements vertic_Structs.IRollbackable {

    private vertic_RestService.Response response;
    private vertic_RestService.Request request;

    public override vertic_Response process(vertic_Request request) {
        this.request = (vertic_RestService.Request) request;
        this.response = (vertic_RestService.Response) super.response;

        this.doSubmit();

        return this.response;
    }

    private void doSubmit() {

        Contact contactVar = new Contact(
            FirstName = this.request.getRequiredString('firstName'),
            LastName = this.request.getRequiredString('lastName')
        );
        vertic_Utils.sObjects.deduplicate(contactVar);
        
        Case caseVar = new Case(
            Subject = this.request.getRequiredString('subject'),
            ContactId = contactVar.Id
        );

        vertic_UnitOfWork uow = new vertic_UnitOfWork(
            new Schema.SObjectType[]{
                Case.SObjectType,
                Contact.SObjectType
            }
        );

        uow.registerNew(contactVar);
        uow.registerNew(caseVar, Case.ContactId, contactVar);

        uow.commitWork();
    }

    protected override vertic_Response getResponseInstance() {
        return new vertic_RestService.Response();
    }

    public override Type getRequestType() {
        return vertic_RestService.Request.class;
    }

    public override vertic_Request getRequestInstance(String requestJSON) {
        return (vertic_RestService.Request) JSON.deserialize(requestJSON, this.getRequestType());
    }
}
