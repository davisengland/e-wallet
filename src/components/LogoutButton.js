import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router-dom'

const LogoutButton = () => {
    let history = useHistory()
    const { logout } = useAuth0()

    // const logoutFn = () => {
    //     logout()
    //     history.push('/landing')
    // }

    return (
        <Button onClick={() => logout()}>Logout</Button>
    )
}

export default LogoutButton