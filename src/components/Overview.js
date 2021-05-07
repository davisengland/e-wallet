import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { useAuth0 } from '@auth0/auth0-react'
import Header from './Header'
import { useQuery, useMutation, gql } from '@apollo/client'
import { updateNetWorth, getNetWorth } from '../redux/reducers/netWorthReducer'
import { getExpenses } from '../redux/reducers/expensesReducer'
import './Overview.css'
import { extendResolversFromInterfaces } from 'graphql-tools'

const GET_PROFILE = gql`
    query Profile($sub_id:String) {
        profile(sub_id:$sub_id){
            sub_id
        }
    }
`

const GET_NET_WORTH = gql`
    query NetWorth($sub_id:String, $amount:Int) {
        get_net_worth(sub_id:$sub_id, amount:$amount){
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

const GET_MONTHLY_EXPENSES = gql`
    query Expense($sub_id:String, $month:Int) {
        get_expenses(sub_id:$sub_id, month:$month){
            amount
        }
    }
`

const Overview = (props) => {

    const [netWorthInput, setNetWorthInput] = useState('')
    const [expAmountInput, setExpAmountInput] = useState('')
    const [categoryInput, setCategoryInput] = useState('')
    let today = new Date()

    const { user, isAuthenticated } = useAuth0()

    const { loading:loading_profile, data:profile_data } = useQuery(GET_PROFILE, { variables: {sub_id: user.sub}})

    const { loading:loading_net_worth, data:net_worth_data } = useQuery(GET_NET_WORTH, { variables: {sub_id: user.sub, amount: 0}})

    const { loading:loading_expenses, data:expenses } = useQuery(GET_MONTHLY_EXPENSES, { variables: {sub_id: user.sub, month: (today.getMonth() + 1)}})

    useEffect(() => {
        if(net_worth_data) {
            props.getNetWorth(net_worth_data.get_net_worth.amount)
        }
        if(expenses) {
            props.getExpenses(expenses.get_expenses)
        }
    }, [net_worth_data, expenses])

    const [update_net_worth, {loading:updating_net_worth, data:updated_net_worth}] = useMutation(UPDATE_NET_WORTH)

    const setNetWorth = () => {
        props.updateNetWorth(netWorthInput)
        update_net_worth({variables: {sub_id: user.sub, amount: +netWorthInput}})
        setNetWorthInput('')
    }

   const renderNetWorth = () => {
       if(net_worth_data && !updated_net_worth) {
           return <h1>{net_worth_data.get_net_worth.amount}</h1>
       } else if(updated_net_worth) {
           return <h1>{updated_net_worth.update_net_worth.amount}</h1>
       }
   }

   const renderSpending = () => {
       if(props.expensesReducer.expenses) {
           let total = props.expensesReducer.expenses.reduce((total, obj) => obj.amount + total,0)
           return <h1>{total}</h1>
       }
   }

    return (
        <div>
            <Header/>
            <h1>Net Worth</h1>
            {renderNetWorth()}
            <input placeholder='amount' value={netWorthInput} onChange={e => setNetWorthInput(e.target.value)}/>
            <button onClick={() => setNetWorth()}>Update</button>
            <h1>Spending</h1>
            {renderSpending()}
        </div>
    )
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps, {getExpenses, getNetWorth, updateNetWorth})(Overview)