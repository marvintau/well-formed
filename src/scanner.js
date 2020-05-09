import React, {useState, useEffect, useRef, createContext} from 'react';

const { BrowserMultiFormatReader } = require('@zxing/library');

function initReader(){
  // console.log('initialized')
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

  const readerRef = useRef({});
  const videoRef = useRef(null);

  const [message, setMessage] = useState('');

  useEffect(() => {
    (async function (){
        const {videoDeviceID, codeReader} = await initReader();
        Object.assign(readerRef.current, {deviceID: videoDeviceID, reader: codeReader});
    })();
  }, []);

  const closeReader = () => {
    const videoElem = videoRef.current;
    if (videoElem === null){
      return;
    }

    console.log('video track stopped');

    const stream = videoElem.srcObject;

    if (stream === null){
      return;
    }

    const tracks = stream.getTracks();
  
    tracks.forEach(function(track) {
      track.stop();
    });
  
    console.log('video track stopped');

    videoElem.srcObject = null;

    setMessage('请重新唤醒相机')
  }

  const decodeOnce = () => {

    const {reader} = readerRef.current;

    setMessage('相机将在7秒钟后休眠');

    setTimeout(closeReader, 7000);

    reader.decodeOnceFromVideoDevice(undefined, 'video')
      .then((result) => {
        console.log(result);
        if (success !== undefined){
          success(result);
        }
      }).catch((err) => {
        setMessage(err.toString());
      })
  }

  if(!isShowing){
    console.log('not showing closing')
    closeReader();
  }

  return isShowing
  ? <div>
      <video ref={videoRef} id="video" width="200" height="200" style={{border: '1px solid gray', margin:'30px'}} />
      <button style={{margin:'30px'}} onClick={() => decodeOnce()}>{desc}</button>
      <div>{message}</div>
    </div>
  : <div></div>
}

export const ScannerContext = createContext({
  scan:() => {},
})

export const ScannerProvider = ({children}) => {

  const [inputRef, setInputRef] = useState(() => {});
  const [desc, setDesc] = useState('');

  const [isShowing, setShowing] = useState(false);

  const scan = (desc, ref) => {
    setDesc(desc);
    setInputRef(ref);
    setShowing(true);
  }

  const success = (result) => {
    inputRef.current.value = result.text;
    setShowing(false);
  }

  const value = {scan}

  return <ScannerContext.Provider {...{value}}>
    {children}
    <QRCodeScanner {...{isShowing, desc, success}} />
  </ScannerContext.Provider>
}