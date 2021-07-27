function Order() {
   this.order = [];
}

Order.prototype.add = function (orderItem) {
    this.order.push(orderItem);
}

Order.prototype.isEligbleForCombiDiscount = function (secondaryItemId) {
    return !!this.order.filter(order => order.id === secondaryItemId).length;
}

Order.prototype.prepareOrder = function (
    menu,
    discount
) {
    const finalOrders = [];

    this.order.forEach(orderItem => {
        const menuItemId = orderItem.id;
        const orderQty = orderItem.quantity; 

        const discountsForMenuItem = discount.getDiscountForMenuItem(menuItemId);
        const menuItem = menu.getMenuItem(menuItemId);

        let finalPrice = orderQty * menuItem.price;
        let discountApplied;

        if (discountsForMenuItem && discountsForMenuItem.length) {
            discountsForMenuItem.forEach(discount => {
                if (discount.type === 'single') {
                    if (orderQty >= discount.minimumQty) {
                        finalPrice = (finalPrice - (finalPrice/100)*discount.discountInPercentage)
                        discountApplied = discount.discountInPercentage;
                    }
                } else if (discount.type === 'combi') {
                    if (this.isEligbleForCombiDiscount(discount.secondaryItemId)) {
                        finalPrice = (finalPrice - (finalPrice/100)*discount.discountInPercentage)
                        discountApplied = discount.discountInPercentage;
                    }
                }
            })
        } 

        const finalOrder = {
            id: menuItemId,
            name: menuItem.name,
            price: menuItem.price,
            quantity: orderQty,
            discount: discountApplied ? `${discountApplied}%` : 'NA',
            totalPriceBeforeDiscount: (menuItem.price*orderQty),
            totalPriceAfterDiscount: finalPrice,
        }

        finalOrders.push(finalOrder);
    })

    return finalOrders;
}

Order.prototype.getFinalBill = function (menu, discount) {
    const currentOrder = this.prepareOrder(
        menu,
        discount
    );

    let finalAmount = 0;

    currentOrder.forEach(orderItem => {
        finalAmount = finalAmount +  orderItem.totalPriceAfterDiscount;
    });

    return finalAmount;
}

module.exports = Order;