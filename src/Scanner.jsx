import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const Scanner = () => {
  // Referencia al contenedor de video de Quagga para acceder a la transmisión de video
  const videoRef = useRef(null);

  useEffect(() => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#scanner-container'),
        constraints: {
          facingMode: "environment"
        },
      },
      decoder: {
        readers: ["code_128_reader"],
      },
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();

      // Acceder al elemento de video generado por Quagga
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoRef.current = videoElement;
      }
    });

    Quagga.onDetected((data) => {
      console.log(data);
    });

    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, []);

  // Función para capturar la foto
  const takePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      // Aquí puedes manejar la imagen capturada, por ejemplo, mostrándola en la página o enviándola a un servidor
      // Convertir la imagen a dataURL y mostrar en consola
      const dataUrl = canvas.toDataURL('image/png');
      console.log(dataUrl);

      // Opcional: Mostrar la imagen en la página
      const img = document.createElement('img');
      img.src = dataUrl;
      document.body.appendChild(img);
    }
  };

  return (
    <div id="scanner-container" className='scanner-docs' style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div id="scanner-frame" className='scanner-frame'></div>
      <button onClick={takePhoto} style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
      }}>Tomar Foto</button>
    </div>
  );
};

export default Scanner;
