import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { useAuth0 } from '@auth0/auth0-react'
import Header from './Header'
import { useQuery, useMutation, gql } from '@apollo/client'
import { update_worth } from '../redux/reducers/worthReducer'

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

const Overview = (props) => {

    // useEffect(() => {
    //     if(net_worth) {
    //         props.update_worth(net_worth.get_worth.amount)
    //     }
    // })
    // const [worth, setWorth] = useState(0)
    const [worthInput, setWorthInput] = useState('')

    const { user, isAuthenticated } = useAuth0()

    const { loading:loading_profile, data:profile_data } = useQuery(GET_PROFILE, { variables: {sub_id: user.sub}})

    const { loading:loading_worth, data:net_worth } = useQuery(GET_NET_WORTH, { variables: {sub_id: user.sub, amount: 0}})

    const [updateNetWorth, {loading:updating_worth, data:updated_data}] = useMutation(UPDATE_NET_WORTH)

    const handleClick = () => {
        props.update_worth(worthInput)
        console.log(props.worthReducer.worth)
        updateNetWorth({variables: {sub_id: user.sub, amount: +worthInput}})
        setWorthInput('')
    }

   const renderNetWorth = () => {
       if(net_worth) {
           return <h1>{net_worth.get_worth.amount}</h1>
       }
   }

    return (
        <div>
            <Header/>
            <h1>Net Worth</h1>
            {renderNetWorth()}
            <input placeholder='net worth' value={worthInput} onChange={e => setWorthInput(e.target.value)}/>
            <button onClick={() => handleClick()}>Add</button>
        </div>
    )
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps, {update_worth})(Overview)