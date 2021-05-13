import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { useAuth0 } from '@auth0/auth0-react'
import Header from './Header'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Dropdown, Table, Button, Navbar } from 'react-bootstrap'
import { getExpenses } from '../redux/reducers/expensesReducer'
import { getIncome } from '../redux/reducers/incomeReducer'
import { updateNetWorth, getNetWorth } from '../redux/reducers/netWorthReducer'
import { getBudgets } from '../redux/reducers/budgetReducer'
import { Bar } from 'react-chartjs-2'

const ADD_EXPENSE = gql`
    mutation Expense($sub_id:String, $amount:Int, $month:Int, $category:String, $date:String) {
        add_expense(sub_id:$sub_id, amount:$amount, month:$month, category:$category, date:$date) {
            exp_id
        }
    }
`

const ADD_INCOME = gql`
    mutation Income($sub_id:String, $amount:Int, $month:Int, $date:String) {
        add_income(sub_id:$sub_id, amount:$amount, month:$month, date:$date){
            amount
            month
        }
    }
`

const ADD_BUDGET = gql`
    mutation Budget($sub_id:String, $amount:Int, $category:String) {
        add_budget(sub_id:$sub_id, amount:$amount, category:$category){
            budget_id
        }
    }
`

const GET_MONTHLY_EXPENSES = gql`
    query Expense($sub_id:String, $month:Int) {
        get_expenses(sub_id:$sub_id, month:$month){
            exp_id
            amount
            category
            date
        }
    }
`

const GET_MONTHLY_INCOME = gql`
    query Income($sub_id:String, $month:Int) {
        get_income(sub_id:$sub_id, month:$month){
            inc_id
            amount
            date
        }
    }
`

const GET_BUDGETS = gql`
    query Budget($sub_id:String) {
        get_budgets(sub_id:$sub_id){
            budget_id
            amount
            category
        }
    }
`

const DELETE_EXPENSE = gql`
    mutation Expense($exp_id: String) {
        delete_expense(exp_id:$exp_id){
            exp_id
        }
    }
`

const DELETE_INCOME = gql`
    mutation Income($inc_id: String) {
        delete_income(inc_id:$inc_id){
            inc_id
        }
    }
`

const DELETE_BUDGET = gql`
    mutation Budget($budget_id: String) {
        delete_budget(budget_id:$budget_id){
            budget_id
        }
    }
`

const GET_NET_WORTH = gql`
    query NetWorth($sub_id:String) {
        get_net_worth(sub_id:$sub_id){
            amount
        }
    }
`

const UPDATE_NET_WORTH = gql`
    mutation NetWorth($sub_id:String, $amount:Int) {
        update_net_worth(sub_id:$sub_id, amount:$amount){
            amount
        }
    }
`

const Month= (props) => {
    const { user } = useAuth0()
    let today = new Date()
    const [expAmountInput, setExpAmountInput] = useState('')
    const [incAmountInput, setIncAmountInput] = useState('')
    const [categoryInput, setCategoryInput] = useState('Category')
    const [budgetInput, setBudgetInput] = useState('')
    const [budgetCategory, setBudgetCategory] = useState('Category')

    const { data:expenses_data, refetch:refetch_expenses } = useQuery(GET_MONTHLY_EXPENSES, { variables: {sub_id: user.sub, month: (today.getMonth() + 1)}})

    const { data:income_data, refetch:refetch_income } = useQuery(GET_MONTHLY_INCOME, { variables: {sub_id: user.sub, month: (today.getMonth() + 1)}})

    const { data:net_worth_data, refetch:refetch_net_worth } = useQuery(GET_NET_WORTH, { variables: {sub_id: user.sub}})

    const { data:budget_data, refetch:refetch_budget } = useQuery(GET_BUDGETS, { variables: {sub_id: user.sub}})
    
    useEffect(() => {
        if(expenses_data) {
            props.getExpenses(expenses_data.get_expenses)
        }
        if(income_data) {
            props.getIncome(income_data.get_income)
        }
        if(net_worth_data) {
            props.getNetWorth(net_worth_data.get_net_worth.amount)
        }
        if(budget_data) {
            props.getBudgets(budget_data.get_budgets)
        }
    }, [expenses_data, income_data, net_worth_data, budget_data])

    const [addExpense, {data:new_expenses}] = useMutation(ADD_EXPENSE)
    const [deleteExpense, {loading:deleting_expense, data:deleted_expense}] = useMutation(DELETE_EXPENSE)
    const [addIncome, {data:newIncome}] = useMutation(ADD_INCOME)
    const [addBudget, {data:newBudget}] = useMutation(ADD_BUDGET)
    const [deleteIncome] = useMutation(DELETE_INCOME)
    const [deleteBudget] = useMutation(DELETE_BUDGET)
    const [updateNetWorth] = useMutation(UPDATE_NET_WORTH)

    const addExpenseFn = () => {
        updateNetWorth({variables: {sub_id: user.sub, amount: (props.netWorthReducer.netWorth - +expAmountInput)}})
            .then(() => {
                props.updateNetWorth(props.netWorthReducer.netWorth - +expAmountInput)
                refetch_net_worth()
            })
        addExpense({variables: {sub_id: user.sub, amount: +expAmountInput, month: (today.getMonth() + 1), category:categoryInput, date: today.toISOString().split('T')[0]}})
            .then(() => refetch_expenses())
        setExpAmountInput('')
        setCategoryInput('Category')
    }
    
    const deleteExpenseFn = (exp_id, amount) => {
        deleteExpense({variables: {exp_id}})
        .then(() => {
                updateNetWorth({variables: {sub_id: user.sub, amount: (props.netWorthReducer.netWorth + amount)}})
                props.updateNetWorth(props.netWorthReducer.netWorth + amount)
                refetch_expenses()
                refetch_net_worth()
            })
    }
    
    const addIncomeFn = () => {
        updateNetWorth({variables: {sub_id: user.sub, amount: (props.netWorthReducer.netWorth + +incAmountInput)}})
        .then(() => {
            props.updateNetWorth(props.netWorthReducer.netWorth + +incAmountInput)
            refetch_net_worth()
        })
        addIncome({variables: {sub_id: user.sub, amount: +incAmountInput, month: (today.getMonth() + 1), date: today.toISOString().split('T')[0]}})
            .then(() => refetch_income())
        setIncAmountInput('')
    }

    const deleteIncomeFn = (inc_id, amount) => {
        deleteIncome({variables: {inc_id}})
            .then(() => {
                updateNetWorth({variables: {sub_id: user.sub, amount: (props.netWorthReducer.netWorth - amount)}})
                props.updateNetWorth(props.netWorthReducer.netWorth - amount)
                refetch_income()
                refetch_net_worth()
            })
    }

    const addBudgetFn = () => {
        addBudget({variables: {sub_id: user.sub, amount: +budgetInput, category: budgetCategory}})
            .then(() => {
                refetch_budget()
            })
        setBudgetInput('')
        setBudgetCategory('Category')
    }

    const deleteBudgetFn = (budget_id) => {
        deleteBudget({variables: {budget_id}})
            .then(() => {
                refetch_budget()
            })
    }

    const renderSpending = () => {
            let expensesMap = props.expensesReducer.expenses.map(elem => {
                return (
                    <tr key={elem.exp_id}>
                        <td>${elem.amount}</td>
                        <td>{elem.category}</td>
                        <td>{elem.date.slice(6)}</td>
                        <td><Button className='x-buttons' onClick={() => deleteExpenseFn(elem.exp_id, elem.amount)}>X</Button></td>
                    </tr>
                )
            })
            return expensesMap
    }

    const renderIncome = () => {
            let incomeMap = props.incomeReducer.income.map(elem => {
                return (
                    <tr key={elem.inc_id}>
                        <td>${elem.amount}</td>
                        <td>{elem.date.slice(6)}</td>
                        <td><Button className='x-buttons' onClick={() => deleteIncomeFn(elem.inc_id, elem.amount)}>X</Button></td>
                    </tr>
                )
            })
            return incomeMap
    }

    const renderBudget = () => {
            let budgetMap = props.budgetReducer.budget.map(elem => {
                let categoryArr = props.expensesReducer.expenses.filter(e => e.category === elem.category)
                let total = categoryArr.reduce((total, obj) => obj.amount + total,0)
                return (
                    <div className='chart-container' key={elem.budget_id}>
                        <Bar data={{
                            labels: [elem.category],
                            datasets: [
                                {
                                    label: 'goal',
                                    data: [elem.amount],
                                    backgroundColor: 'rgb(134, 203, 150)'
                                },
                                {
                                    label: 'current',
                                    data: [total],
                                    backgroundColor: 'rgb(156, 202, 252)'
                                }
                            ]
                            }}
                            options={{
                                indexAxis: 'y',
                                scales: {
                                    yAxes: [
                                      {
                                        stacked: true,
                                        ticks: {
                                          beginAtZero: true,
                                        },
                                      },
                                    ],
                                    xAxes: [
                                      {
                                        stacked: true,
                                      },
                                    ]
                                  }
                            }}
                        />
                        <Button className='x-buttons' onClick={() => deleteBudgetFn(elem.budget_id)}>X</Button>
                    </div>
                )
            })
            return budgetMap
    }

    return (
        <div>
            <Navbar>
                <Header/>
            </Navbar>
            <section className='month'>
                <section className='container'>
                    <h1>Spending</h1>
                    <div className='spending'>
                        <input placeholder='amount' value={expAmountInput} onChange={e => setExpAmountInput(e.target.value)}/>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Category
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='dropdown-menu'>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button' 
                                    onClick={() => setCategoryInput('Food/Dining')}>Food/Dining</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button' 
                                    onClick={() => setCategoryInput('Auto/Transport')}>Auto/Transport</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button' 
                                    onClick={() => setCategoryInput('Gifts/Donations')}>Gifts/Donations</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setCategoryInput('Entertainment')}>Entertainment</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setCategoryInput('Shopping')}>Shopping</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setCategoryInput('Personal Care')}>Personal Care</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setCategoryInput('Education')}>Education</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setCategoryInput('Bills/Utilities')}>Bills/Utilities</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setCategoryInput('Travel')}>Travel</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <h3>{categoryInput}</h3>
                        <Button onClick={() => addExpenseFn()}>Add Expense</Button>
                    </div>
                </section>
                <div className='table-container'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderSpending()}
                        </tbody>
                    </Table>
                </div>
                <section className='container'>
                    <h1>Income</h1>
                    <div className='income'>
                        <input className='income-input' placeholder='amount' value={incAmountInput} onChange={e => setIncAmountInput(e.target.value)}/>
                        <Button onClick={() => addIncomeFn()}>Add Income</Button>
                    </div>
                </section>
                <div className='table-container'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderIncome()}
                        </tbody>
                    </Table>
                </div>
                <section className='container'>
                    <h1>Budget</h1>
                    <div className='budget'>
                        <input placeholder='amount' value={budgetInput} onChange={e => setBudgetInput(e.target.value)}/>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Dropdown Button
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='dropdown-menu'>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button' 
                                    onClick={() => setBudgetCategory('Food/Dining')}>Food/Dining</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button' 
                                    onClick={() => setBudgetCategory('Auto/Transport')}>Auto/Transport</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button' 
                                    onClick={() => setBudgetCategory('Gifts/Donations')}>Gifts/Donations</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setBudgetCategory('Entertainment')}>Entertainment</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setBudgetCategory('Shopping')}>Shopping</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setBudgetCategory('Personal Care')}>Personal Care</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setBudgetCategory('Education')}>Education</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setBudgetCategory('Bills/Utilities')}>Bills/Utilities</Dropdown.Item>
                                <Dropdown.Item 
                                    className='dropdown-item' 
                                    as='button'
                                    onClick={() => setBudgetCategory('Travel')}>Travel</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <h3>{budgetCategory}</h3>
                        <Button onClick={() => addBudgetFn()}>Add Budget</Button>
                    </div>
                </section>
                {renderBudget()}
            </section>
        </div>
    )
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps, {getExpenses, getIncome, updateNetWorth, getNetWorth, getBudgets})(Month)