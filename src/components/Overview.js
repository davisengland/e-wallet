import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { useAuth0 } from '@auth0/auth0-react'
import Header from './Header'
import { useQuery, useMutation, gql } from '@apollo/client'
import { update_worth } from '../redux/reducers/worthReducer'
import './Overview.css'

const GET_PROFILE = gql`
    query Profile($sub_id:String) {
        profile(sub_id:$sub_id){
            sub_id
        }
    }
`

const GET_NET_WORTH = gql`
    query Worth($sub_id:String, $amount:Int) {
        get_worth(sub_id:$sub_id, amount:$amount){
            amount
        }
    }
`

const UPDATE_NET_WORTH = gql`
    mutation Worth($sub_id:String, $amount:Int) {
        update_worth(sub_id:$sub_id, amount:$amount){
            amount
        }
    }
`

const GET_MONTHLY_EXPENSES = gql`
    query Expense($sub_id:String, $month:Int) {
        get_expenses(sub_id:$sub_id, month:$month){
            amount
        }
    }
`

const Overview = (props) => {

    const [worthInput, setWorthInput] = useState('')
    const [expAmountInput, setExpAmountInput] = useState('')
    const [categoryInput, setCategoryInput] = useState('')
    let today = new Date()

    const { user, isAuthenticated } = useAuth0()

    const { loading:loading_profile, data:profile_data } = useQuery(GET_PROFILE, { variables: {sub_id: user.sub}})

    const { loading:loading_worth, data:net_worth } = useQuery(GET_NET_WORTH, { variables: {sub_id: user.sub, amount: 0}})

    const { loading:loading_expenses, data:expenses } = useQuery(GET_MONTHLY_EXPENSES, { variables: {sub_id: user.sub, month: (today.getMonth() + 1)}})

    const [updateNetWorth, {loading:updating_worth, data:updated_data}] = useMutation(UPDATE_NET_WORTH)

    const setNetWorth = () => {
        props.update_worth(worthInput)
        updateNetWorth({variables: {sub_id: user.sub, amount: +worthInput}})
        setWorthInput('')
    }

   const renderNetWorth = () => {
       if(net_worth) {
           return <h1>{net_worth.get_worth.amount}</h1>
       }
   }

   const renderSpending = () => {
       if(expenses) {
           let total = expenses.get_expenses.reduce((total, obj) => obj.amount + total,0)
           console.log(total)
        //    let expensesMap = expenses.get_expenses.map(elem => )
           return <h1>{total}</h1>
       }
   }

    return (
        <div>
            <Header/>
            <h1>Net Worth</h1>
            {renderNetWorth()}
            <input placeholder='amount' value={worthInput} onChange={e => setWorthInput(e.target.value)}/>
            <button onClick={() => setNetWorth()}>Update</button>
            <h1>Spending</h1>
            {renderSpending()}
        </div>
    )
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps, {update_worth})(Overview)