//! --------------------------------------------------------------------
//! BudgetController --> responsible for storing DOM data, 
//! logic stuff(calculate budget, expense and inc constructors);
//! --------------------------------------------------------------------
var BudgetController = (function () {
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        totalItems: {
            inc: [],
            exp: []
        },

        totals: {
            inc: [],
            exp: []
        },

        budget: 0,
        percentage: -1

    }

    return {
        addItem: function (type, des, value) {

            var newItem, ID;

            //? Make our ID based on array length(inc or exp)

            if (data.totalItems[type].length > 0) {
                ID = data.totalItems[type].length;
            } else {
                ID = 0;
            }


            //? Make an item whether its exp or inc
            if (type === 'exp') {
                newItem = new Expense(ID, des, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, value);
            }
            data.totalItems[type].push(newItem);

            return newItem;
        },

        calculateTotal: function (type) {
            var sum = 0;
            data.totalItems[type].forEach(function (cur) {
                sum += cur.value;
            })

            data.totals[type] = sum;

        },

        calculateBudget: function () {
            //* calculate budget by substracting expenses from total income 

            budget = data.totals.inc - data.totals.exp;

            //* put a "," after every 1st number and save the value to our data structure
            data.budget = budget;


            return data.budget;

        },


        calcIndPercentage: function (item) {
            item.percentage = Math.round((item.value / data.totals.inc) * 100);

            return item.percentage;
        },

        calcTotalPercentage: function (totalIncome, totalExpenses) {
            if (totalIncome > 0) {
                data.percentage = Math.round((totalExpenses / totalIncome) * 100);

                return data.percentage;
            } else {
                return data.percentage = 0;
            }
        },


        removeItem: function (type, id) {
            var ids, index;


            ids = data.totalItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.totalItems[type].splice(index, 1);
            }

        },

        getData: function () {
            return data;
        },

        testing: function () {
            console.log(data);
        }
    }


})();
//! ----------------------------------------------------------------------
//! ----------------------------------------------------------------------





//!---------------------------------------------------------------------
//! UIController --> takes care of DOM Manipulation(retrieving value);
//!---------------------------------------------------------------------


var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        descriptionInput: '.add__description',
        valueLabel: '.add__value',
        addBtn: '.add__btn',
        indPercentage: '.item__percentage',
        container: '.container',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        totalBudget: '.budget__value',
        totalIncome: '.budget__income--value',
        totalExpenses: '.budget__expenses--value',
        totalPercentage: '.budget__expenses--percentage',
        month: '.budget__title--month'

    }

    return {
        getDOMstrings: function () {
            return DOMstrings;
        },

        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,

                description: document.querySelector(DOMstrings.descriptionInput).value,

                value: parseFloat(document.querySelector(DOMstrings.valueLabel).value)
            }
        },

        clearFields: function () {
            document.querySelector(DOMstrings.descriptionInput).value = '';
            document.querySelector(DOMstrings.valueLabel).value = '';



        },



        addListItem: function (obj, type) {
            var html, newHtml, element;
            if (type === 'inc') {

                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'


            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }

            //! replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value.toLocaleString());
            newHtml = newHtml.replace('%percentage%', obj.percentage);


            //! Insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },



        displayTotal: function (el) {
            var inc = el.inc;
            var exp = el.exp;


            document.querySelector(DOMstrings.totalIncome).textContent = '+ ' + inc.toLocaleString();



            document.querySelector(DOMstrings.totalExpenses).textContent =
                '- ' + exp.toLocaleString();



        },


        displayBudget: function (el) {

            document.querySelector(DOMstrings.totalBudget).textContent = el.toLocaleString();
        },

        displayTotalPercentage: function (el) {
            document.querySelector(DOMstrings.totalPercentage).textContent = el + '%';
        },


        displayType: function () {
            return {
                type: document.querySelector(DOMstrings.inputType),

                description: document.querySelector(DOMstrings.descriptionInput),

                value: document.querySelector(DOMstrings.valueLabel),

                btn: document.querySelector(DOMstrings.addBtn)

            }

        },


        displayMonth: function () {
            var date = new Date();
            var year = date.getFullYear();
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var month = date.getMonth();
            month = months[month];

            document.querySelector(DOMstrings.month).textContent = month + ' ' + year;


        },


        removeListItem: function (selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },


    }

})();

//! ---------------------------------------------------------------------------------------------------
//! ---------------------------------------------------------------------------------------------------








//! --------------------------------------------------------------------------------------------------
//! GlobalController 
//! --------------------------------------------------------------------------------------------------


var GlobalController = (function (BudgetCtrl, UICtrl) {
    var setupEventListeners = function () {

        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.which === 13) {
                ctrlAddItem();

            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlRemoveItem);

        document.querySelector(DOM.inputType).addEventListener('change', ctrlDisplayType)
    }

    var ctrlDisplayType = function () {
        var inputType = UICtrl.displayType();
        inputType.type.classList.toggle('red-focus');
        inputType.description.classList.toggle('red-focus');
        inputType.value.classList.toggle('red-focus');
        inputType.btn.classList.toggle('red');

    }


    var ctrlAddItem = function () {
        var input, newItem;
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value !== 0) {
            newItem = BudgetCtrl.addItem(input.type, input.description, input.value);

            if (input.type === 'exp') {
                //! calculate ind percentage of every item and append it via the whole item using addListItem function
                var indPercentage = BudgetCtrl.calcIndPercentage(input);
                newItem.percentage = indPercentage;
            }

            //* 3. add the new item to the UI
            UICtrl.addListItem(newItem, input.type);

            //* 4. clear the fields
            UICtrl.clearFields();

            //* 5. calculate total income and expenses
            BudgetCtrl.calculateTotal(input.type);

            //* 6. Get data object from budget controller and use it to display total
            var data = BudgetCtrl.getData();
            UICtrl.displayTotal(data.totals);

            //* 7. Calculate budget 
            BudgetCtrl.calculateBudget();
            //* 8. Display budget
            var budget = BudgetCtrl.calculateBudget();
            UICtrl.displayBudget(budget);


            //? display total percentage

            var percentage = BudgetCtrl.calcTotalPercentage(data.totals.inc, data.totals.exp);

            data.percentage = percentage;
            UICtrl.displayTotalPercentage(data.percentage);

            //? ---------------------------


        } else {
            alert('Please enter something in the fields!');
        }
    }


    var ctrlRemoveItem = function () {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            //* inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //* 1. delete the item from the data structure
            BudgetCtrl.removeItem(type, ID);

            //* 2. Delete the item from the UI
            UICtrl.removeListItem(itemID);

        }

        //* Update totals and budget
        BudgetController.calculateTotal("inc");
        BudgetController.calculateTotal("exp");
        BudgetCtrl.calculateBudget();



        //* Display them to the DOM
        var budget = BudgetCtrl.calculateBudget();
        UICtrl.displayBudget(budget);

        var data = BudgetCtrl.getData();
        UICtrl.displayTotal(data.totals);


        //* update percentages
        var percentage = BudgetCtrl.calcTotalPercentage(data.totals.inc, data.totals.exp);

        data.percentage = percentage;
        UICtrl.displayTotalPercentage(data.percentage);

    }





    //? ------------ PUBLIC METHODS --------------
    return {
        init: function () {
            console.log('Application has started!');
            setupEventListeners();

            //* show total exp and inc
            var data = BudgetCtrl.getData();
            UICtrl.displayTotal(data.totals);

            var budget = BudgetCtrl.calculateBudget();
            UICtrl.displayBudget(budget);

            var DOM = UICtrl.getDOMstrings();
            document.querySelector(DOM.totalPercentage).textContent = "---";

            UICtrl.displayMonth();

        }
    }



})(BudgetController, UIController);
//! -------------------------------------------------------------------------------------------
//! -------------------------------------------------------------------------------------------



GlobalController.init();