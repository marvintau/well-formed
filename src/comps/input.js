import React, {useState, useContext} from 'react';
import {ScannerContext} from '../scanner';

export default ({name, desc, scannerEnabled=true}) => {

    const [value, setValue] = useState('');

    const onChange = (e) => {
        setValue(e.target.value);
    }

    const cons = useContext(ScannerContext);
    console.log(cons, 'conte');

    return <div style={{width:'100%', position:"relative"}}>        
        <input {...{className:'form-input', type:'text', placeholder:desc, name, value, onChange}} />
        {scannerEnabled && <div className="input-float-button" onClick={() => onScan(setValue)}>扫码</div>}
    </div>
}
  