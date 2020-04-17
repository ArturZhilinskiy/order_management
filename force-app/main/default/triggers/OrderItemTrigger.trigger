trigger OrderItemTrigger on OrderItem__c (after insert) {
    if (Trigger.isAfter && Trigger.isInsert) {
        OrderItemTriggerHelper.afterInsert(Trigger.new);
    }
}