public class CaseManagementSubmitProc extends vertic_AbstractProcessor implements vertic_Structs.IRollbackable {

    public override vertic_Response process(vertic_Request request) {
        this.request = request;

        this.doSubmit();

        return this.response;
    }

    private void doSubmit() {
        System.debug(this.request);
        Case caseVar = new Case();
        this.request.getMapper().mapToSObject('case', caseVar);
        System.debug(caseVar);
        insert caseVar;
        this.response.put('caseId', caseVar.Id);
    }

}