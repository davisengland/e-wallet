import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from './LogoutButton'
import { Link } from 'react-router-dom'
import logo5 from '../logos/logo5.png'

const Header = () => {
    const { isLoading } = useAuth0()

    if (isLoading) return <div>Loading...</div>

    return (
        <div className='header-container'>
            <div className='header'>
                <img src={logo5} className='logo5' alt='logo5'/>
                <div>
                    <Link className='links' to='/'>Overview</Link>
                    <Link className='links' to='/month'>Month</Link>
                    <LogoutButton/>
                </div>
            </div>
        </div>
    )
}

export default Header