const mqtt = require('mqtt');
const axios = require('axios');

// Configurações
const MQTT_BROKER = "mqtt://10.0.0.148"; 
const SERVER_API = "http://localhost:3001"; 

const ROTA_BASE = "/mqtt"; 

const client = mqtt.connect(MQTT_BROKER);

console.log("Microserviço rodando - Aguardando dados");

client.on('connect', () => {
    console.log("--- Conectado ao Broker!");
    // Ler Sensor
    client.subscribe("sensor/#");
});

client.on('message', async (topic, message) => {
    const msgString = message.toString();
    console.log("Topico:", topic, "| Mensagem:", msgString);

    let partes = topic.split('/');
    

    let idDispositivo = "sensor_padrao"; 
    
    if (partes.length >= 2) {

        if(partes[1] !== 'distancia' && partes[1] !== 'maximo_salvo') {
             idDispositivo = partes[1];
        }
    }

    let tipoDado = "desconhecido";
    let valorFinal = 0;
    let rotaEspecifica = "";
    let jsonTeste = {};

    try {
        const jsonMqtt = JSON.parse(msgString);
        valorFinal = jsonMqtt.val; 

        if (topic.includes("distancia")) {
            tipoDado = "Leitura Distancia";
            rotaEspecifica = "/update"; 

            jsonTeste = {
                setorName: idDispositivo, 
                current_storage: parseInt(valorFinal)
            };

        
        } else if (topic.includes("maximo_salvo")) {
            tipoDado = "Salvamento Maximo";
            rotaEspecifica = "/max_storage"; 
            jsonTeste = {
                setorName: idDispositivo,
                max_storage: parseInt(valorFinal)
            };
        }

        
        if (rotaEspecifica !== "") {
            const urlCompleta = `${SERVER_API}${ROTA_BASE}${rotaEspecifica}`;
            
            console.log(`Tentando enviar para: ${urlCompleta}`);
            console.log(`Payload:`, jsonTeste);

            try {
                let respostaServidor = await axios.put(urlCompleta, jsonTeste);
                console.log(`✅ SUCESSO: ${tipoDado} | Status: ${respostaServidor.status}`);
                console.log(`Resposta:`, respostaServidor.data);
            } catch (error) {
                if (error.response) {
                    
                    console.log(`Erro HTTP ${error.response.status}:`);
                    console.log(error.response.data); 
                } else {
                    
                    console.log(` Erro de Conexão: ${error.message}`);
                }
            }
        }

    } catch (e) {
        console.log("Erro ao processar mensagem MQTT (JSON inválido?):", e.message);
    }
});