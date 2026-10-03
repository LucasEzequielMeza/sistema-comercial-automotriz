import React from 'react'

function Label({children, htmlFor}) {

    return (
        <label className="block text-sm font-medium text-[#1C1917]" htmlFor={htmlFor}>
            {children}
        </label>
    )
}

export default Label