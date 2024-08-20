import React from 'react'
import {createRoot} from 'react-dom/client'
import './style.css'
import AssetOverview from './AssetOverview'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <AssetOverview/>
    </React.StrictMode>
)
