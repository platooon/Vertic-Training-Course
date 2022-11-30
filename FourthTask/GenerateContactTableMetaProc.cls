public class GenerateContactTableMetaProc extends vertic_MetadataProcessor {

    public override vertic_Response process(vertic_Request request) {
        this.request = request == null ? new vertic_MetadataProcessor.MetadataRequest() : (vertic_MetadataProcessor.MetadataRequest) request;

        this.request.fields = new Set<SObjectField>{
            Contact.FirstName,
            Contact.LastName,
            Contact.Email
        };

        super.process(this.request);

        this.init();

        return this.response;
    }

    private void init() {

        List<Object> components = new List<Object>();
        List<Integer> lst = new List<Integer>();
        Integer len = [SELECT Id FROM Contact].size() - 1;
        for (Integer i=0; i<=len; i++){
            lst.add(i);
        }
        vertic_DTO dto = new vertic_DTO();
        dto.getMap();
        dto.getMapper().mapFromListSObjects('contacts', [SELECT Id, FirstName, LastName, Email FROM Contact]);
        components.add(new Component.GenerateContactTable(
            dto = dto.getMap(),
            len = lst
        ));
        this.response.dto.put('components', components);
        this.response.dto.put('head-component', new Component.GenerateContactTableStyles());
    }
}