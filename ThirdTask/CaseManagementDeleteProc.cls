public class CaseManagementDeleteProc extends vertic_AbstractProcessor implements vertic_Structs.IRollbackable {

    public override vertic_Response process(vertic_Request request) {
        this.request = request;

        this.doSubmit();

        return this.response;
    }

    private void doSubmit() {
        List<Contact> contacts = this.request.getMapper().mapToListSObjects('contacts', Contact.SObjectType);
        if(!contacts.isEmpty()) {
            delete contacts;
        }
    }

}