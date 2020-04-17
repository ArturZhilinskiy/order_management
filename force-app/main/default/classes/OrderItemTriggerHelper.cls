public class OrderItemTriggerHelper {
    public static void afterInsert(List<OrderItem__c> orderItems) {
        Order__c order = [
            SELECT Id, TotalProductCount__c, TotalPrice__c
            FROM Order__c
            WHERE Id =: orderItems[0].OrderId__c
        ];

        Integer totalProductCount = 0;
        Decimal totalPrice = 0;
        for (OrderItem__c orderItem : orderItems) {
            totalProductCount += (Integer) orderItem.Quantity__c;
            totalPrice += orderItem.Price__c;
        }

        order.TotalProductCount__c = totalProductCount;
        order.TotalPrice__c = totalPrice;

        update order;
    }
}
