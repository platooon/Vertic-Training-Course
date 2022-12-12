global class CreateContactInvocable {

    @InvocableMethod(Label='Create Contact')
    global static void process(List<InvocableRequest> requests) {

        CreateContactInvocable.InvocableRequest req = requests[0];

        Contact contactVar = (Contact) vertic_Utils.arrays.firstOrNull([
            SELECT Id, FirstName, LastName, Email
            FROM Contact
            WHERE FirstName LIKE :req.firstName
            AND LastName LIKE :req.lastName
            AND Email LIKE :req.email
        ]);

        if (contactVar == null) {
            contactVar = new Contact(
                FirstName = req.firstName,
                LastName = req.lastName
            );
        }

        if (contactVar.Email == null) {
            contactVar.Email = generateUsername(contactVar);
        }
        upsert contactVar;
    }
    
    private static String generateUsername(Contact contactVar) {
        if (contactVar.Email != null) {
            return contactVar.Email;
        } else {
            return contactVar.FirstName + contactVar.LastName + '@test.com';
        }
    }

    global class InvocableRequest {

        @InvocableVariable(Label='First Name')
        global String firstName;

        @InvocableVariable(Label='Last Name')
        global String lastName;

        @InvocableVariable(Label='Email')
        global String email;
    }
}