import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { useAuth0 } from '@auth0/auth0-react'
import Header from './Header'
import { useQuery, useMutation, gql } from '@apollo/client'
import Dropdown from 'react-bootstrap/Dropdown'
import { getExpenses } from '../redux/reducers/expensesReducer'
import { getIncome } from '../redux/reducers/incomeReducer'
import { updateNetWorth, getNetWorth } from '../redux/reducers/netWorthReducer'
import './Month.css'

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
    const { user, isAuthenticated } = useAuth0()
    let today = new Date()
    const [expAmountInput, setExpAmountInput] = useState('')
    const [incAmountInput, setIncAmountInput] = useState('')
    const [categoryInput, setCategoryInput] = useState('')

    const { loading:loading_expenses, data:expenses_data, refetch:refetch_expenses } = useQuery(GET_MONTHLY_EXPENSES, { variables: {sub_id: user.sub, month: (today.getMonth() + 1)}})

    const { loading:loading_income, data:income_data, refetch:refetch_income } = useQuery(GET_MONTHLY_INCOME, { variables: {sub_id: user.sub, month: (today.getMonth() + 1)}})

    const { loading:loading_net_worth, data:net_worth_data, refetch:refetch_net_worth } = useQuery(GET_NET_WORTH, { variables: {sub_id: user.sub}})
    
    useEffect(() => {
        if(expenses_data) {
            props.getExpenses(expenses_data.get_expenses)
        }
        if(income_data) {
            props.getIncome(income_data.get_income)
        }
        if(net_worth_data) {
            props.getNetWorth(net_worth_data.get_net_worth)
        }
    }, [expenses_data, income_data, net_worth_data])

    const [addExpense, {loading:adding_expense, data:new_expenses}] = useMutation(ADD_EXPENSE)
    const [deleteExpense, {loading:deleting_expense, data:deleted_expense}] = useMutation(DELETE_EXPENSE)
    const [addIncome, {loading:adding_income, data:newIncome}] = useMutation(ADD_INCOME)
    const [deleteIncome, {loading:deleting_income}] = useMutation(DELETE_INCOME)
    const [updateNetWorth, {loading:updating_net_worth}] = useMutation(UPDATE_NET_WORTH)

    const addExpenseFn = () => {
        updateNetWorth({variables: {sub_id: user.sub, amount: (props.netWorthReducer.netWorth.amount - +expAmountInput)}})
            .then(() => {
                props.updateNetWorth(props.netWorthReducer.netWorth.amount - +expAmountInput)
                refetch_net_worth()
            })
        addExpense({variables: {sub_id: user.sub, amount: +expAmountInput, month: (today.getMonth() + 1), category:categoryInput, date: today.toISOString().split('T')[0]}})
            .then(() => refetch_expenses())
        setExpAmountInput('')
    }
    
    const deleteExpenseFn = (exp_id, amount) => {
        deleteExpense({variables: {exp_id}})
        .then(() => {
                updateNetWorth({variables: {sub_id: user.sub, amount: (props.netWorthReducer.netWorth.amount + amount)}})
                props.updateNetWorth(props.netWorthReducer.netWorth.amount + amount)
                refetch_expenses()
                refetch_net_worth()
            })
    }
    
    const addIncomeFn = () => {
        updateNetWorth({variables: {sub_id: user.sub, amount: (props.netWorthReducer.netWorth.amount + +incAmountInput)}})
        .then(() => {
            props.updateNetWorth(props.netWorthReducer.netWorth.amount + +incAmountInput)
            refetch_net_worth()
        })
        addIncome({variables: {sub_id: user.sub, amount: +incAmountInput, month: (today.getMonth() + 1), date: today.toISOString().split('T')[0]}})
            .then(() => refetch_income())
        setIncAmountInput('')
    }

    const deleteIncomeFn = (inc_id, amount) => {
        deleteIncome({variables: {inc_id}})
            .then(() => {
                updateNetWorth({variables: {sub_id: user.sub, amount: (props.netWorthReducer.netWorth.amount - amount)}})
                props.updateNetWorth(props.netWorthReducer.netWorth.amount - amount)
                refetch_income()
                refetch_net_worth()
            })
    }

    const renderSpending = () => {
            let expensesMap = props.expensesReducer.expenses.map(elem => {
                return (
                    <div key={elem.exp_id}>
                        <div>
                            {elem.amount}
                            {elem.category}
                            {elem.date.slice(6)}
                        </div>
                        <button onClick={() => deleteExpenseFn(elem.exp_id, elem.amount)}>X</button>
                    </div>
                )
            })
            return expensesMap
    }

    const renderIncome = () => {
            let incomeMap = props.incomeReducer.income.map(elem => {
                return (
                    <div key={elem.inc_id}>
                        <div>
                            {elem.amount}
                            {elem.date.slice(6)}
                        </div>
                        <button onClick={() => deleteIncomeFn(elem.inc_id, elem.amount)}>X</button>
                    </div>
                )
            })
            return incomeMap
    }

    return (
        <div>
            <Header/>
            <h1>Spending</h1>
            <input placeholder='amount' value={expAmountInput} onChange={e => setExpAmountInput(e.target.value)}/>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Dropdown Button
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
            <button onClick={() => addExpenseFn()}>Add Expense</button>
            {renderSpending()}
            <h1>Income</h1>
            <input placeholder='amount' value={incAmountInput} onChange={e => setIncAmountInput(e.target.value)}/>
            <button onClick={() => addIncomeFn()}>Add Income</button>
            {renderIncome()}
            <h1>Budget</h1>
        </div>
    )
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps, {getExpenses, getIncome, updateNetWorth, getNetWorth})(Month)