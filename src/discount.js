function Discount() {
    this.discounts = [];
}

Discount.prototype.add = function (discount) {
    this.discounts.push(discount);
}

Discount.prototype.getDiscountForMenuItem = function (menuItemId) {
    const discounts = this.discounts.filter(
        discount => discount.primaryItemId === menuItemId
    );

    return discounts;
}
 
module.exports = Discount;