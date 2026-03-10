import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { TV_IP, TV_TOKEN, TV_NAME } from '@env';

const SamsungRemote = () => {
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState('Desconectado');

  const connect = () => {
    // Importante: Usar WSS e a porta 8002
    const url = `wss://${TV_IP}:8002/api/v2/channels/samsung.remote.control?name=${TV_NAME}&token=${TV_TOKEN}`;
    
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setStatus('Conectado!');
      setWs(socket);
    };

    socket.onmessage = (e) => {
      console.log('Mensagem da TV:', e.data);
    };

    socket.onerror = (e) => {
      setStatus('Erro na conexão');
      console.log(e.message);
    };

    socket.onclose = () => setStatus('Conexão fechada');
  };

  const pressKey = (key) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const payload = {
        method: 'ms.remote.control',
        params: {
          Cmd: 'Click',
          DataOfCmd: key,
          Option: 'false',
          TypeOfRemote: 'SendRemoteKey'
        }
      };
      ws.send(JSON.stringify(payload));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <Text>Status: {status}</Text>
      <Button title="Conectar" onPress={connect} />
      <Button title="Volume -" onPress={() => pressKey('KEY_VOLDOWN')} color="red" />
      <Button title="Volume +" onPress={() => pressKey('KEY_VOLUP')} color="blue" />
    </View>
  );
};

export default SamsungRemote;