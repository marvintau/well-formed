import React, {useState} from 'react';

export default ({options, onSelect, valueKey='name', descKey="desc", defaultDesc="请选择"}) => {

    const [isOpen, setOpen] = useState(false);
    const [desc, setDesc] = useState(defaultDesc);
  
    return <div className="select">
      <div className="select-indicator" 
        style={{borderBottom: isOpen ? '0.5px solid gray' : ''}}
        onClick={() => {
          console.log('click1')
          setOpen(!isOpen);
        }}
      >{desc}</div>
      {isOpen && <div className="select-options">
        {options.map(({[valueKey]:value, [descKey]:desc, color}, i) => <div
          className={`select-option ${color}`}
          style={{color:`var(--${color})`}}
          key={i}
          onClick={() => {
            onSelect(value);
            setDesc(desc);
            setOpen(false);
          }}
        >{desc}</div>)}
      </div>}
    </div>
  }