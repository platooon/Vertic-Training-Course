public class AccountManagementSaveProc extends vertic_AbstractProcessor implements vertic_Structs.IRollbackable {

    private vertic_UnitOfWork uow = new vertic_UnitOfWork(
        new Schema.SObjectType[]{
            Account.SObjectType,
            Contact.SObjectType
        }
    );

    public override vertic_Response process(vertic_Request request) {
        this.request = request;

        this.doSubmit();

        this.uow.commitWork();

        return this.response;
    }

    private void doSubmit() {

        List<Contact> contactList = this.request.getMapper().mapToListSObjects('items', Contact.SObjectType);

        Account accVar = new Account();
        this.request.getMapper().mapToSObject('accounts', accVar);

        this.uow.registerUpsert(accVar);
        this.uow.registerUpsert(contactList);
        this.uow.registerRelationship(contactList, Contact.AccountId, accVar);
    }
}