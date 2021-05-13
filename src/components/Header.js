import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from './LogoutButton'
import { Link } from 'react-router-dom'
import logo5 from '../logos/logo5.png'

const Header = () => {
    const [menu, setMenu] = useState('none')
    const { isLoading } = useAuth0()

    if (isLoading) return <div>Loading...</div>

    const showMenu = () => {
        if(menu === 'closed' || menu === 'none') {
            setMenu('open')
        } else {
            setMenu('closed')
        }
    }

    return (
        <div className='header-container'>
            <div className='header'>
                <section className='mobile-header'>
                    <img src={logo5} className='logo5' alt='logo5'/>
                    <div className='menu-button' onClick={() => showMenu()}>
                        <div className='menu-icon'>
                            <div className='bar'></div>
                            <div className='bar'></div>
                            <div className='bar'></div>
                        </div>
                    </div>
                </section>
                <section className='desktop-header'>
                    <img src={logo5} className='logo5' alt='logo5'/>
                    <div className='horizontal-menu'>
                        <Link className='links' to='/'>Overview</Link>
                        <Link className='links' to='/month'>Month</Link>
                        <LogoutButton/>
                    </div>
                </section>
                <div className={menu === 'none' ? 'none' : menu === 'open' ? 'open' : 'closed'}>
                    <Link className='links' to='/'>Overview</Link>
                    <Link className='links bottom-link' to='/month'>Month</Link>
                    <LogoutButton/>
                </div>
            </div>
        </div>
    )
}

export default Header