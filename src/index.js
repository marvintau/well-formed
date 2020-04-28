import React, { useState, useRef } from 'react'

const useFSM = ({space, states, rules, formRef, initial='init'}) => {
  
  if (states[initial] === undefined){
    throw Error(`State set must includes the initial state you specified, ${initial}`);
  }

  if (rules[initial] === undefined){
    throw Error(`State transition rules must includes the initial state you specified, ${initial}`);
  }

  const [curr, setCurr] = useState(states[initial]);
  const [next, setNext] = useState(rules[initial]);
  const [hist, setHist] = useState([]);

  function valid(stateName) {
    if (!(stateName in states)){
      console.warn(`${stateName} does not appear in the state set: ${Object.keys(states)}`);
      return false;
    } else {
      for (let comp of Object.keys(states[stateName].vec)){
        if (!(comp in space)){
          console.warn(`the Component ${comp} in State ${stateName} does not appear in the space: ${Object.keys(space)}`);
          return false;
        }
      }
    }
    return true;
  }

  const proceed = (stateName) => {
    if (!valid(stateName)){
      console.warn(`invalid state name ${stateName}`);
    } else {
      setCurr(states[stateName]);
      setNext(rules[stateName]);
      setHist([...hist, stateName])
    }
  }

  return [curr, next, hist, proceed];
}

const colorToStyle = (color) => {

  return color
  ? {
    borderColor: `var(--${color})`,
    color: `var(--${color})`,
    background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), var(--${color}) `,
  }
  : {};
}

const Select = ({options, onSelect, valueKey='name', descKey="desc", defaultDesc="请选择"}) => {

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

const Input = ({name, desc}) => {
  return <input className="form-input" type="text" name={name} placeholder={desc} />
}

export default ({space, states, rules}) => {
  
  const formRef = useRef(null);

  const [{vec}, next, hist, goto] = useFSM({space, states, rules, formRef});

  console.log(hist, 'hist');

  let stateSwitch;
  if (Array.isArray(next)){

    const options = next.map(entry => {
      if (typeof entry === 'string') {
        const {enterDesc, color} = states[entry];
        return {name: entry, enterDesc, color};
      } else {
        return entry;
      }
    });

    const randKey = Math.random().toString(36).slice(2,7);

    stateSwitch=<Select key={randKey} options={options} descKey='enterDesc' onSelect={(value) => {goto(value)}} />
  } else if (typeof next === 'string') {
    const {enterDesc, color} = states[next];
    stateSwitch = <button className="form-button" style={colorToStyle(color)} onClick={() => goto(next)}>{enterDesc}</button>;
  } else if (next.name) {
    const {enterDesc, name, color} = next;
    stateSwitch = <button className="form-button" style={colorToStyle(color)} onClick={() => goto(name)}>{enterDesc}</button>;
  }

  const elems = [];
  for (let [name, {type, desc, color}] of Object.entries(space)) if(vec[name]){
    if (type === 'input') {
      elems.push(<Input key={name} {...{name, desc}} />)
    } else if (type === 'label') {
      elems.push(<div className="form-label" key={name} style={colorToStyle(color)}>{desc}</div>)
    }
  }

  return <form className="form-holder" ref={formRef}>
    {elems}
    {stateSwitch}
  </form>
}