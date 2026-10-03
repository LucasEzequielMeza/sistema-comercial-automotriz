import React from 'react'

function Button({ children, className = '', ...props }) {

    return (
        <button
            type="button"
            className={`relative inline-flex items-center gap-x-1.5 rounded-md bg-[#13100F] px-3 py-1.5 text-sm font-semibold
            text-white shadow-sm hover:bg-[#26211F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-[#13100F] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button