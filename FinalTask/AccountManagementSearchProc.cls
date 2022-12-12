public class AccountManagementSearchProc extends vertic_AbstractProcessor implements vertic_Structs.IRollbackable {

    private final Set<String> shiftFields = new Set<String>{
        'Id',
        'FirstName',
        'LastName',
        'Phone'
    };

    public override vertic_Response process(vertic_Request request) {
        this.request = request;

        String firstName = this.request.getString('filter.firstName');
        String lastName = this.request.getString('filter.lastName');
        String phone = this.request.getString('filter.phone');

//        Contact contactVar = new Contact();
//        this.request.getMapper().mapToSObject('contacts', contactVar);
//
//        String firstName = contactVar.FirstName;
//        String lastName = contactVar.LastName;
//        String phone = contactVar.Phone;

        this.doSubmit(firstName, lastName, phone);

        return this.response;
    }

    private void doSubmit(String fName, String lName, String phone) {

        fflib_QueryFactory queryFactory = new fflib_QueryFactory(Contact.SObjectType);
        queryFactory.selectFields(this.shiftFields);

        List<String> conditions = new List<String>();

        if (String.isNotBlank(fName)) {
            conditions.add('FirstName = :fName');
        }

        if (!String.isBlank(lName)) {
            conditions.add('LastName =: lName');
        }

        if (!String.isBlank(phone)) {
            conditions.add('Phone =: phone');
        }

        queryFactory.setCondition(String.join(conditions, ' AND '));

        List<Contact> contactList = Database.query(queryFactory.toSOQL());

        this.response.getMapper().mapFromListSObjects(
            'contacts', contactList);
    }

}