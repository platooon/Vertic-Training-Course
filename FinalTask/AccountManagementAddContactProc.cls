public class AccountManagementAddContactProc extends vertic_AbstractProcessor implements vertic_Structs.IRollbackable {

    public override vertic_Response process(vertic_Request request) {
        this.request = request;

        this.doSubmit();

        return this.response;
    }

    private void doSubmit() {
        Contact contactVar = new Contact();
        this.request.getMapper().mapToSObject('contact', contactVar);
        upsert contactVar;
        this.response.put('contactId', contactVar.Id);
    }

}