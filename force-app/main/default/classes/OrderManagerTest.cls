@isTest
private class OrderManagerTest {
    @TestSetup
    static void setup(){
        List<SObject> records = new List<SObject>();

        Account account = new Account(Name='testAcc');
        records.add(account);

        Product__c product = new Product__c(
            Name      = 'IPhone XR',
            Price__c  = 500,
            Family__c = 'Electronics',
            Type__c   = 'Phone'
        );

        Product__c product2 = new Product__c(
            Name      = 'IPhone X',
            Price__c  = 400,
            Family__c = 'Electronics',
            Type__c   = 'Phone'
        );
        records.add(product);
        records.add(product2);

        insert records;    
    }

    @isTest
    private static void createOrderTest() {
        Account account = [SELECT Id FROM Account LIMIT 1];
        List<Product__c> products = [SELECT Id, Price__c FROM Product__c];
        
        OrderManager.OrderWrapper orderWrapper = new OrderManager.OrderWrapper();
        orderWrapper.accountId  = account.Id;
        orderWrapper.orderItems = new List<OrderManager.OrderItemWrapper>();

        OrderManager.OrderItemWrapper orderItemWrapper = new OrderManager.OrderItemWrapper();
        orderItemWrapper.orderId   = '';
        orderItemWrapper.productId = products[0].Id;
        orderItemWrapper.quantity  = 4;
        orderItemWrapper.price     = products[0].Price__c;


        OrderManager.OrderItemWrapper orderItemWrapper1 = new OrderManager.OrderItemWrapper();
        orderItemWrapper1.orderId   = '';
        orderItemWrapper1.productId = products[1].Id;
        orderItemWrapper1.quantity  = 1;
        orderItemWrapper1.price     = products[1].Price__c;

        orderWrapper.orderItems.add(orderItemWrapper);
        orderWrapper.orderItems.add(orderItemWrapper1);
        
        String orderJSON = JSON.serialize(orderWrapper);

        OrderManager.createOrder(orderJSON);

        List<Order__c> orders = [
            SELECT Id, AccountId__c, TotalProductCount__c, TotalPrice__c 
            FROM Order__c
        ];

        System.assertEquals(1, orders.size());
        System.assertEquals(5, orders[0].TotalProductCount__c);
        System.assertEquals(2400, orders[0].TotalPrice__c);
    }
}
