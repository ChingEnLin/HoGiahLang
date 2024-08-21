import React from 'react'
import {createRoot} from 'react-dom/client'
import './style.css'
import AssetOverview from './Dashboard'
import Accounts from './Accounts'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <Accounts/>
    </React.StrictMode>
)
