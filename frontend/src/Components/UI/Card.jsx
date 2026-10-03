import React from 'react'

function Card({children, className}) {

    return (
        <div className={`bg-white p-6 rounded-md text-[#1C1917] ${className || ''}`}>
            {children}
        </div>
    )
}

export default Card