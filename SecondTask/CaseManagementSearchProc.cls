public class CaseManagementSearchProc extends vertic_AbstractProcessor implements vertic_Structs.IRollbackable {

    public override vertic_Response process(vertic_Request request) {
        this.request = request;

        String firstName = this.request.getString('filter.firstName');

        this.doSubmit(firstName);

        return this.response;
    }

    private void doSubmit(String fName) {
        System.debug(this.response);
        List<Contact> conList = new List<Contact>();
        conList = [SELECT FirstName, LastName, Email
                    FROM Contact
                    WHERE FirstName =: fName ];
        this.response.put('contacts', conList);
    }

}