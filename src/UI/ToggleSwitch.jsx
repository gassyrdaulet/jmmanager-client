import React from 'react'
import cl from './ToggleSwitch.module.css'

export default function ToggleSwitch({checked, onChange}) {
  return (
    <label className={cl.Switch}>
        <input checked={checked} onChange={onChange} type="checkbox" />
        <span className={cl.Slider}/>
    </label>
  )
}
