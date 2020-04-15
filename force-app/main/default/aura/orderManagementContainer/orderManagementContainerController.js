({
    myAction : function(component, event, helper) {

    },

    doInit : function(component, helper) {
        $A.get("e.force:closeQuickAction").fire();
        var recordId = component.get('v.recordId');
        var pageReference = { 
            "type": "standard__navItemPage",
            "attributes": { 
                "apiName": "Order_Management"
            },    
            "state": {
                "c__recordId": recordId 
            }
        };
        component.set("v.pageReference", pageReference);
        var navService = component.find("navService");
        var pageReference = component.get("v.pageReference");
        navService.navigate(pageReference);
    }
})
