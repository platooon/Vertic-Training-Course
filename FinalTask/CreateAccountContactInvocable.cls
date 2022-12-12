global class CreateAccountContactInvocable {

    @InvocableMethod(Label='Create Account&Contact')
    global static void process(List<InvocableRequest> requests) {

        CreateAccountContactInvocable.InvocableRequest req = requests[0];

        Account accountVar = new Account(
            Name = req.name,
            Type = req.type
        );

        Contact contactVar = new Contact(
            FirstName = req.firstName,
            LastName = req.lastName,
            Phone = req.phone
        );

        List<Contact> contactList = new List<Contact>();
        contactList.add(contactVar);

        vertic_UnitOfWork uow = new vertic_UnitOfWork(
            new Schema.SObjectType[]{
                Account.SObjectType,
                Contact.SObjectType
            });

        uow.registerUpsert(accountVar);
        uow.registerUpsert(contactVar);
        uow.registerRelationship(contactList, Contact.AccountId, accountVar);

        uow.commitWork();
    }

    global class InvocableRequest {

        @InvocableVariable(Label='First Name')
        global String firstName;

        @InvocableVariable(Label='Last Name')
        global String lastName;

        @InvocableVariable(Label='Phone')
        global String phone;

        @InvocableVariable(Label='Name')
        global String name;

        @InvocableVariable(Label='Type')
        global String type;
    }
}