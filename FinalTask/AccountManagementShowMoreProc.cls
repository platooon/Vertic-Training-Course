public class AccountManagementShowMoreProc extends vertic_AbstractProcessor implements vertic_Structs.IRollbackable {

    public override vertic_Response process(vertic_Request request) {
        this.request = request;

        this.doSubmit();

        return this.response;
    }

    private void doSubmit() {

        this.response.getMapper().mapFromListSObjects('account', [SELECT Id, Name, Type
        FROM Account]);


        Integer showMore = this.request.getInteger('showMore');
        this.response.getMapper().mapFromListSObjects('contacts', [SELECT Id, FirstName, LastName, Phone
                                                                        FROM Contact LIMIT: showMore]);
    }

}