import React, { useRef } from 'react'
import Select from './comps/select';
import Input from './comps/input';
import useFSM from './use-fsm';

import {ScannerProvider} from './scanner';

import {colorToStyle} from './utils';

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

  return <ScannerProvider>
    <form className="form-holder" ref={formRef}>
      {elems}
      {stateSwitch}
    </form>
  </ScannerProvider>
}