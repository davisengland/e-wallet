import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from './LogoutButton'
import { Link } from 'react-router-dom'

const Header = () => {
    const { isLoading } = useAuth0()

    if (isLoading) return <div>Loading...</div>

    return (
        <div>
            <LogoutButton/>
            <Link to='/'>Overview</Link>
            <Link to='/month'>Month</Link>
        </div>
    )
}

export default Header