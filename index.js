const inquirer = require('inquirer');
const Table = require('cli-table');

const Menu = require('./src/menu');
const Order = require('./src/order');
const Discount = require('./src/discount');

const menu = new Menu();

const cofeeId = '1';
const teaId = '2';
const biscuitsId = '3';
const sandwichId = '4';

// add menu items
menu.add({
    id: cofeeId,
    name: 'cofee',
    price: 100
});

menu.add({
    id: teaId,
    name: 'tea',
    price: 100
});

menu.add({
    id: biscuitsId,
    name: 'cookies',
    price: 100
});

menu.add({
    id: sandwichId,
    name: 'sandwich',
    price: 100
});


// add discount
const discounts = new Discount();

discounts.add({
    type: 'single',
    primaryItemId: cofeeId,
    discountInPercentage: 50,
    minimumQty: 4,
})

discounts.add({
    type: 'combi',
    primaryItemId: cofeeId,
    discountInPercentage: 100,
    secondaryItemId: teaId
})

console.log('Hi, welcome to Epam Coffee shop');

const askForMenu = [
    {
        type: 'list',
        name: 'menuItem',
        message: 'What do you want to order?',
        choices: menu.listMenu(),
        validate(answer) {
            if (answer.length < 1) {
              return 'You must choose at least one item.';
            }
    
            return true;
        },
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'How many do you need?',
        validate(value) {
          const valid = !isNaN(parseFloat(value));
          return valid || 'Please enter a number';
        },
        filter: Number,
    },
    {
        type: 'confirm',
        name: 'askAgain',
        message: 'Want to enter another item (just hit enter for YES)?',
        default: true,
      },
]

const order = new Order();

function ask () {
    inquirer.prompt(askForMenu).then((answers) => {
        order.add({
            id: answers.menuItem,
            quantity: answers.quantity
        });

        if (answers.askAgain) {
            ask();
          } else {
            const table = new Table({
                head: [
                    'id', 
                    'name', 
                    'price', 
                    'quantity', 
                    'discount', 
                    'totalPriceBeforeDiscount', 
                    'totalPriceAfterDiscount',
                    'totalAmount'
                ],
            });

            const currentOrder = order.prepareOrder(
                menu,
                discounts
            );

            let finalAmount = 0;

            currentOrder.forEach(orderItem => {
                table.push(Object.values(orderItem));
                finalAmount = finalAmount +  orderItem.totalPriceAfterDiscount;
            });

            table.push(['--','--','--','--','--','--','--',`Rs ${finalAmount}`]);

            console.log(table.toString());
          }
    });
}

ask();