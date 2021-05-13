import React from 'react'
import LoginButton from './LoginButton'
import SignupButton from './SignupButton'
import logo6 from '../logos/logo6.png'

const Landing = () => {

    return (
        <div className='landing'>
            <img src={logo6} alt='logo6' className='logo6'/>
            <div className='button-container'>
                <LoginButton className='buttons'/>
                <SignupButton className='buttons'/>
            </div>
        </div>
    )
}

export default Landing