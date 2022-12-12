public class AccountManagementDeleteProc extends vertic_AbstractProcessor implements vertic_Structs.IRollbackable {

    public override vertic_Response process(vertic_Request request) {
        this.request = request;

        String firstName = this.request.getString('items.firstName');
        String lastName = this.request.getString('items.lastName');

        this.doSubmit(firstName, lastName);

        return this.response;
    }

    private void doSubmit(String fName, String lName) {
        Contact contactVar = new Contact();
        contactVar = [SELECT Id, FirstName, LastName
                        FROM Contact
                        WHERE FirstName =: fName
                        AND LastName =: lName];

        delete contactVar;
    }

}