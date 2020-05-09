import React, {useState, useContext, useRef} from 'react';
import {ScannerContext} from '../scanner';

export default ({name, desc, scannerEnabled=true}) => {

    const ref = useRef(null);

    const {scan: onScan} = useContext(ScannerContext);

    return <div style={{width:'100%', position:"relative"}}>        
        <input {...{className:'form-input', type:'text', placeholder:desc, ref, name}} />
        {scannerEnabled && <div className="input-float-button" onClick={() => onScan("扫码", ref)}>扫码</div>}
    </div>
}
  