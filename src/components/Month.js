import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { useAuth0 } from '@auth0/auth0-react'
import Header from './Header'
import { useQuery, useMutation, gql } from '@apollo/client'
import Dropdown from 'react-bootstrap/Dropdown'
import './Month.css'

const ADD_EXPENSE = gql`
    mutation Expense($sub_id:String, $amount:Int, $month:Int, $category:String, $date:String) {
        add_expense(sub_id:$sub_id, amount:$amount, month:$month, category:$category, date:$date){
            amount
            month
        }
    }
`
const GET_MONTHLY_EXPENSES = gql`
    query Expense($sub_id:String, $month:Int) {
        get_expenses(sub_id:$sub_id, month:$month){
            amount
            category
            date
        }
    }
`

const Month= (props) => {

    const [expAmountInput, setExpAmountInput] = useState('')
    const [categoryInput, setCategoryInput] = useState('')
    let today = new Date()

    const { user, isAuthenticated } = useAuth0()

    const { loading:loading_expenses, data:expenses } = useQuery(GET_MONTHLY_EXPENSES, { variables: {sub_id: user.sub, month: (today.getMonth() + 1)}})

    const [addExpense, {loading:adding_expense, data:newExpense}] = useMutation(ADD_EXPENSE)

    const addExpenseFn = () => {
        console.log(today.toISOString().split('T')[0])
        addExpense({variables: {sub_id: user.sub, amount: +expAmountInput, month: (today.getMonth() + 1), category:categoryInput, date: today.toISOString().split('T')[0]}})
    }

    const renderSpending = () => {
        if(expenses) {
            let expensesMap = expenses.get_expenses.map((elem,i) => {
                return (
                    <div key={i}>
                        {elem.amount}
                        {elem.category}
                        {elem.date.slice(6)}
                    </div>
                )
            })
            return expensesMap
        }
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
        </div>
    )
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps, {})(Month)