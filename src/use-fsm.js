import {useState} from 'react';

export default ({space, states, rules, formRef, initial='init'}) => {
  
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
  