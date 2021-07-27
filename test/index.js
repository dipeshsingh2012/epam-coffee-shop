const expect = require('chai').expect

const Menu = require('../src/menu')
const Order = require('../src/order')
const Discount = require('../src/discount')

describe('Menu', function () {
  describe('#add()', function () {
    it('should add menu items', function () {
      const menu = new Menu()

      const menuPayload = {
        id: 1,
        name: 'cofee',
        price: 100
      }

      menu.add(menuPayload)

      expect(menu.menuItems[0]).to.eql(menuPayload)
    })
  })

  describe('#listMenu()', function () {
    it('should list the menu', function () {
      const menu = new Menu()

      const cofee = {
        id: 1,
        name: 'cofee',
        price: 100
      }

      const tea = {
        id: 2,
        name: 'tea',
        price: 200
      }

      menu.add(cofee)
      menu.add(tea)

      const expectedList = [
        {
          value: 1,
          name: 'cofee - Rs 100',
          short: 'cofee'
        },
        {
          value: 2,
          name: 'tea - Rs 200',
          short: 'tea'
        }
      ]

      const actualList = menu.listMenu()

      expect(actualList).to.eql(expectedList)
    })

    it('should list empty menu when menu is empty', function () {
      const menu = new Menu()

      const expectedList = []

      const actualList = menu.listMenu()

      expect(actualList).to.eql(expectedList)
    })
  })

  describe('#getMenuItem()', function () {
    it('should return the menu item when id is passed', function () {
      const menu = new Menu()

      const cofee = {
        id: 1,
        name: 'cofee',
        price: 100
      }

      const tea = {
        id: 2,
        name: 'tea',
        price: 150
      }

      menu.add(cofee)
      menu.add(tea)

      expect(menu.getMenuItem(1)).to.eql(cofee)
    })

    it('should return undefined when passed id does not match any record', function () {
      const menu = new Menu()

      const cofee = {
        id: 1,
        name: 'cofee',
        price: 100
      }

      menu.add(cofee)

      expect(menu.getMenuItem(2)).to.be.undefined
    })
  })
})

describe('Order', function () {
  describe('#add()', function () {
    it('add an order', function () {
      const order = new Order()

      const orderPayload = {
        id: '1',
        quantity: 3
      }

      order.add(orderPayload)

      const expectedOutput = order.order[0]
      expect(expectedOutput).to.eql(orderPayload)
    })
  })

  describe('#isEligbleForCombiDiscount()', function () {
    it('should return true if menu item is eligible for combi discount', function () {
      const order = new Order()

      const orderPayload = {
        id: '1',
        quantity: 3
      }

      order.add(orderPayload)

      const expectedOutput = order.isEligbleForCombiDiscount('1')
      expect(expectedOutput).to.be.true
    })

    it('should return false if menu item is not eligible for combi discount', function () {
      const order = new Order()

      const orderPayload = {
        id: '1',
        quantity: 3
      }

      order.add(orderPayload)

      const expectedOutput = order.isEligbleForCombiDiscount('2')
      expect(expectedOutput).to.be.false
    })
  })

  describe('#prepareOrder()', function () {
    it('should return the final order', function () {
      const menu = new Menu()

      const cofeeMenu = {
        id: '1',
        name: 'cofee',
        price: 100
      }

      menu.add(cofeeMenu)

      const discount = new Discount()

      const discountPayload = {
        type: 'single',
        primaryItemId: '1',
        discountInPercentage: 50,
        minimumQty: 4
      }

      discount.add(discountPayload)

      const order = new Order()

      const orderPayload = {
        id: '1',
        quantity: 3
      }

      order.add(orderPayload)

      const expectedOutput = [
        {
          id: '1',
          name: 'cofee',
          price: 100,
          quantity: 3,
          discount: 'NA',
          totalPriceBeforeDiscount: 300,
          totalPriceAfterDiscount: 300
        }
      ]

      const actualOutput = order.prepareOrder(menu, discount)

      expect(actualOutput).to.eql(expectedOutput);
    })

    it('should return the final order bill amount', function () {
        const menu = new Menu()
  
        const cofeeMenu = {
          id: '1',
          name: 'cofee',
          price: 100
        }
  
        menu.add(cofeeMenu)
  
        const discount = new Discount()
  
        const discountPayload = {
          type: 'single',
          primaryItemId: '1',
          discountInPercentage: 50,
          minimumQty: 4
        }
  
        discount.add(discountPayload)
  
        const order = new Order()
  
        const orderPayload = {
          id: '1',
          quantity: 3
        }
  
        order.add(orderPayload)
  
        const expectedOutput = 300;
  
        const actualOutput = order.getFinalBill(menu, discount)
  
        console.log('actualOutput', actualOutput)
        expect(actualOutput).to.eql(expectedOutput);
      })
  })
})

describe('Discount', function () {
  describe('#add()', function () {
    it('should add a discount', function () {
      const discount = new Discount()

      const discountPayload = {
        type: 'single',
        primaryItemId: '1',
        discountInPercentage: 50,
        minimumQty: 4
      }

      discount.add(discountPayload)

      const expectedOutput = discount.discounts[0]
      expect(expectedOutput).to.eql(discountPayload)
    })
  })

  describe('#getDiscountForMenuItem()', function () {
    it('should return the discount for the given menu item id', function () {
      const discount = new Discount()

      const discountPayload = {
        type: 'single',
        primaryItemId: '1',
        discountInPercentage: 50,
        minimumQty: 4
      }

      discount.add(discountPayload)

      const actualOutput = discount.getDiscountForMenuItem('1')[0]
      expect(actualOutput).to.eql(discountPayload)
    })

    it('should return undefined if discount is not available for the menu item', function () {
      const discount = new Discount()

      const discountPayload = {
        type: 'single',
        primaryItemId: '1',
        discountInPercentage: 50,
        minimumQty: 4
      }

      discount.add(discountPayload)

      const actualOutput = discount.getDiscountForMenuItem('2')[0]

      expect(actualOutput).to.be.undefined
    })
  })
})
