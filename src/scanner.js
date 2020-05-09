import React, {useState, useEffect, useRef, createContext} from 'react';
import {Button} from 'reactstrap';

const { BrowserMultiFormatReader } = require('@zxing/library');

function initReader(){
  const codeReader = new BrowserMultiFormatReader();

  return codeReader.getVideoInputDevices()
  .then(videoInputDevices => {
    if (videoInputDevices.length <= 0){
      throw Error('没有找到摄像头');
    }
    return {
      videoDeviceID: videoInputDevices[0].deviceId,
      codeReader
    }
  })
  .catch(err => {
    console.log(err);
  })
}

function QRCodeScanner ({isShowing, desc, success}) {

  const [reader, setReader] = useState();
  const [deviceID, setDeviceID] = useState();

  const [message, setMessage] = useState();

  const videoRef = useRef(null);

  useEffect(() => {
  (async function (){
      const {videoDeviceID, codeReader} = await initReader();
      setReader(codeReader);
      setDeviceID(videoDeviceID);
  })()
  }, [reader, deviceID]);

  useEffect(() => {
    return () => {
      turnOffCamera();
    }
  }, []);

  const turnOffCamera = () => {
    const videoElem = videoRef.current;
    if (videoElem === null){
      return;
    }

    const stream = videoElem.srcObject;

    if (stream === null){
      return;
    }

    const tracks = stream.getTracks();
  
    tracks.forEach(function(track) {
      track.stop();
    });
  
    videoElem.srcObject = null;

    setMessage('请重新唤醒相机')
  }

  const decodeOnce = (codeReader, selectedDeviceId) => {

    setMessage('相机将在7秒钟后休眠');

    setTimeout(turnOffCamera, 7000);

    codeReader.decodeFromInputVideoDevice(undefined, 'video')
      .then((result) => {
        console.log(result);
        if (success !== undefined){
          success(result);
        }
      }).catch((err) => {
        setMessage(err.toString());
      })
  }

  return isShowing
  ? <div>
      <video ref={videoRef} id="video" width="200" height="200" style={{border: '1px solid gray', margin:'30px'}} />
      <Button style={{margin:'30px'}} size="lg" color="primary" onClick={() => decodeOnce(reader, deviceID)}>{desc}</Button>
      <div>{message}</div>
    </div>
  : <div></div>
}

export const ScannerContext = createContext({
  scan:() => {},
})

export const ScannerProvider = ({children}) => {

  const [inputFunc, setInputFunc] = useState(() => {});
  const [desc, setDesc] = useState('');

  const [isShowing, setShowing] = useState(false);

  const scan = (desc, func) => {
    console.log('toggle scan')
    setDesc(desc);
    setInputFunc(func);
    setShowing(true);
  }

  const success = (result) => {
    inputFunc(result);
    setShowing(false);
  }

  const values = {scan}

  return <ScannerContext.Provider {...{values}}>
    {children}
    <QRCodeScanner {...{isShowing, desc, success}} />
  </ScannerContext.Provider>
}