import { forwardRef } from 'react'
import React from 'react'

export const Input = forwardRef((props, ref) => {

    return (
        <input ref={ref}
            className="bg-white border border-[#D6D3D1] rounded-md px-3 py-2 block my-2 w-full text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#13100F]"
            {...props}
        />
    );
});

export default Input