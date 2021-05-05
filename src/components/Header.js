import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import SignupButon from './SignupButon'
import LogoutButton from './LogoutButton'

const Header = () => {
    const { isLoading } = useAuth0()

    if (isLoading) return <div>Loading...</div>


    return (
        <div>
            <LogoutButton/>
        </div>
    )
}

export default Header