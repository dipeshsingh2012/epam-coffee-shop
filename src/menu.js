function Menu() {
    this.menuItems = [];
}

Menu.prototype.add = function (menuItem) {
    this.menuItems.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
    });
}

Menu.prototype.listMenu = function () {
    return this.menuItems.map(menuItem => ({
        value: menuItem.id,
        name: `${menuItem.name} - Rs ${menuItem.price}`,
        short: menuItem.name
    }))
}

Menu.prototype.getMenuItem = function(menuId) {
    return this.menuItems.filter(menuItem => menuItem.id === menuId)[0];
}

module.exports = Menu;