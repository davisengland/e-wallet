import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { useAuth0 } from '@auth0/auth0-react'
import Header from './Header'
import { useQuery, useMutation, gql } from '@apollo/client'
import { updateNetWorth, getNetWorth } from '../redux/reducers/netWorthReducer'
import { getExpenses } from '../redux/reducers/expensesReducer'
import { Navbar, Button } from 'react-bootstrap'
import { Doughnut } from 'react-chartjs-2'

const GET_PROFILE = gql`
    query Profile($sub_id:String) {
        profile(sub_id:$sub_id){
            sub_id
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

const Overview = (props) => {

    const [netWorthInput, setNetWorthInput] = useState('')
    let today = new Date()

    const { user } = useAuth0()

    const { data:profile_data } = useQuery(GET_PROFILE, { variables: {sub_id: user.sub}})

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
       let currency = props.netWorthReducer.netWorth.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
       return <h1>${currency}</h1>
   }

   const renderSpending = () => {
       let total = props.expensesReducer.expenses.reduce((total, obj) => obj.amount + total,0)
       return <h1>${total}</h1>
    }

    const labelsArr = []
    const amountsArr = []
    
    props.expensesReducer.expenses.map((elem, i) => {
        if(!labelsArr.includes(elem.category)) {
            return (
                labelsArr.push(elem.category),
                amountsArr.push(elem.amount)
            )
        } else {
            let index = labelsArr.findIndex(e => e === elem.category)
            let val = amountsArr[index]
            return (
                amountsArr.splice(index, 1, (val + elem.amount))
            )
        }
    })

    return (
        <div>
            <Navbar>
                <Header/>
            </Navbar>
            <section className='overview'>
                <div className='first-container container'>
                    <h1>Net Worth</h1>
                    {renderNetWorth()}
                    <input placeholder='amount' value={netWorthInput} onChange={e => setNetWorthInput(e.target.value)}/>
                    <Button onClick={() => setNetWorth()}>Update</Button>
                </div>
                <div className='second-container container'>
                    <h1>Spending</h1>
                    {renderSpending()}
                    <div className='doughnut-container'>
                        <Doughnut
                            data={{
                                labels: labelsArr,
                                datasets: [{
                                    data: amountsArr,
                                    backgroundColor: [
                                        'rgba(40,167,69,255)',
                                        'rgba(0,123,255,255)',
                                        'rgba(220,54,68,255)',
                                        'rgba(255,193,7,255)',
                                        'rgb(134, 203, 150)',
                                        'rgb(156, 202, 252)'
                                    ],
                                    hoverBackgroundColor: [
                                        'rgba(40,167,69,255)',
                                        'rgba(0,123,255,255)',
                                        'rgba(220,54,68,255)',
                                        'rgba(255,193,7,255)',
                                        'rgb(134, 203, 150)',
                                        'rgb(156, 202, 252)'
                                    ],
                                    hoverOffset: 4
                                }]
                            }}
                            className='doughnut'
                            />
                    </div>
                </div>
            </section>
        </div>
    )
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps, {getExpenses, getNetWorth, updateNetWorth})(Overview)