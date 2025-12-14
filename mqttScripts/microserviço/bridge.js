const mqtt = require('mqtt');
const axios = require('axios');

// ======================================================
// CONFIGURAÇÕES GERAIS
// ======================================================
const SYSTEM_ROOT_TOPIC = "pedro"; // A raiz do tópico (seu identificador geral)
const MQTT_BROKER = "mqtt://10.0.0.118";

// ======================================================
// MAPA DE ROTAS (Configure suas URLs aqui)
// ======================================================
// O script vai olhar o final do tópico e escolher a URL correspondente.
const API_ROTAS = {
    "distancia":    "http://localhost:3001/mqtt/update",    // Exemplo
    "tensao":       "http://localhost:3001/mqtt/batery",  // Exemplo
    "maximo_salvo": "http://localhost:3001/mqtt/max_storage"      // Exemplo
};

const client = mqtt.connect(MQTT_BROKER, {
    clientId: "Bridge_NodeJS_" + Math.random().toString(16).substr(2, 8)
});

console.log(`>>> Bridge iniciada. Monitorando raiz: ${SYSTEM_ROOT_TOPIC}`);

// ======================================================
// CONEXÃO E ASSINATURA
// ======================================================
client.on('connect', () => {
    console.log("--- Conectado ao Broker MQTT!");
    
    // Assina: pedro/+/+
    // O '+' é um coringa que significa "qualquer coisa nesse nível".
    // Isso pegará: pedro/A01/distancia, pedro/B02/tensao, etc.
    const topicoAssinatura = `${SYSTEM_ROOT_TOPIC}/+/+`;
    
    client.subscribe(topicoAssinatura, (err) => {
        if (!err) {
            console.log(`--- Escutando padrão: ${topicoAssinatura}`);
        }
    });
});

// ======================================================
// PROCESSAMENTO DE MENSAGENS
// ======================================================
client.on('message', async (topic, message) => {
    const msgString = message.toString();

    // 1. Quebra o tópico em partes
    // Ex: pedro/A01/distancia
    // partes[0] = "pedro"
    // partes[1] = "A01" (ID do Dispositivo)
    // partes[2] = "distancia" (Tipo de Medição)
    let partes = topic.split('/');

    // 2. Validações de Segurança
    if (partes.length !== 3) return; // Ignora tópicos que não tenham exatamente 3 partes
    if (partes[0] !== SYSTEM_ROOT_TOPIC) return; // Ignora se não começar com "pedro"

    const idDispositivo = partes[1]; // Aqui capturamos o "A01"
    const tipoMedicao = partes[2];   // Aqui capturamos "distancia", "tensao", etc.
    
    console.log(`[RECEBIDO] Dev: ${idDispositivo} | Tipo: ${tipoMedicao} | Valor: ${msgString}`);

    // 3. Verifica se existe uma rota definida para esse tipo de medição
    if (!API_ROTAS[tipoMedicao]) {
        console.log(`>>> Ignorado: Nenhuma rota de API definida para "${tipoMedicao}"`);
        return;
    }

    const urlDestino = API_ROTAS[tipoMedicao];
    const valorNumerico = parseFloat(msgString); // Converte para decimal (107.22)

    // 4. Monta o objeto para envio
    const payload = {
        
        id_dispositivo: idDispositivo, // Envia "A01"
        valor: valorNumerico,          // Envia 107.22 (number)
        // timestamp: new Date().toISOString()
    };

    // 5. Envia para a API específica
    try {
        console.log("----------",urlDestino)
        await axios.put(urlDestino, payload);
        console.log(`   >>> [SUCESSO] Enviado p/ rota: ${urlDestino}`);
    } catch (error) {
        // Tratamento de erro melhorado para mostrar detalhes se disponíveis
        // console.log(error)
        const erroMsg = error.response ? `${error.response.status} - ${error.response.statusText}` : error.message;
        console.log(`   !!! [ERRO API] Falha ao enviar para ${tipoMedicao}: ${erroMsg}`);
    }
});