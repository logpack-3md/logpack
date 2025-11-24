// --- Pinos ---
const LED1 = 25;
const LIGAR = 14;
const saveMAX = 27;
const TRIGGER = 33;
const ECHO = 32;

// --- Configuração dos Pinos ---
pinMode(saveMAX , "input_pulldown");
pinMode(LIGAR, "input_pulldown");
pinMode(TRIGGER, "output"); 
pinMode(ECHO, "input");     
pinMode(LED1, "output");

// --- Variáveis de Lógica (Simplificadas) ---
let ultimaLeitura;
let leituraBase; 
const taxaDeErro = 50; 
// Variáveis erro1, erro2, erro3 removidas para economizar memória

// --- Variáveis de Estado ---
let isAtivo = false; 
let intervaloID;     

// --- Variáveis para o botão saveMAX ---
let saveMaxTimer = null;
let ledBlinkInterval = null;
let ledBlinkState = false;

// --- VARIÁVEIS DE CONECTIVIDADE ---
const WIFI_NOME = "JOAO"; 
const WIFI_SENHA = "leonardi12345";
const MQTT_BROKER = "10.0.0.148"; 
const MQTT_USER = ""; 
const MQTT_PASS = ""; 
const MQTT_PORT = 1883; 

let mqtt; 

// --- Função de Medição (Callback do ECHO) (Simplificada) ---
function calcularDistancia(info) {
    if (!isAtivo) return;
    
    let tempo = info.time - info.lastTime;
    let distancia = 17000 * tempo; 
    distancia = parseFloat(distancia.toFixed(2));

    if (distancia < 1 || distancia > 400) {
        return; 
    }

    if (!ultimaLeitura) {
        ultimaLeitura = distancia;
        leituraBase = distancia; 
        console.log("Base: " + distancia ); // Log reduzido
        return;
    }

    // --- LÓGICA DE ERRO COMBINADA ---
    const limiteRelativoInferior = ultimaLeitura * ( 1 - taxaDeErro / 100);
    const limiteRelativoSuperior = ultimaLeitura * ( 1 + taxaDeErro / 100);
    let limiteAbsolutoInferior = 0;
    let limiteAbsolutoSuperior = 401; 
    if (leituraBase) {
        limiteAbsolutoInferior = leituraBase * (1 - taxaDeErro / 100);
        limiteAbsolutoSuperior = leituraBase * (1 + taxaDeErro / 100);
    }
    const passouNoTesteRelativo = (distancia > limiteRelativoInferior && distancia < limiteRelativoSuperior);
    const passouNoTesteAbsoluto = (distancia >= limiteAbsolutoInferior && distancia <= limiteAbsolutoSuperior);

    
    if (passouNoTesteRelativo && passouNoTesteAbsoluto) {
        // Leitura BOA
        console.log(distancia); // Log de distância boa
        if (mqtt) mqtt.publish("sensor/distancia", String(distancia));
        ultimaLeitura = distancia;
        
    } else {
        // Leitura RUIM - Lógica de 3 erros REMOVIDA para economizar memória.
        // A leitura ruim é agora simplesmente descartada.
        let logErro = "";
        if (!passouNoTesteRelativo) logErro = `(Err Rel): ${distancia}cm`;
        if (!passouNoTesteAbsoluto && leituraBase) logErro = `(Err Abs): ${distancia}cm`;
        
        if (logErro) {
          console.log(logErro); // Log de erro
          if (mqtt) mqtt.publish("sensor/erro", logErro);
        }
    }
}

// --- Lógica do Botão LIGAR (setWatch) ---
setWatch(function(e) {
    isAtivo = !isAtivo;
    digitalWrite(LED1, isAtivo); 
    
    if (mqtt) mqtt.publish("sensor/status", isAtivo ? "ligado" : "desligado");

    if (isAtivo) {
        console.log("Sistema ATIVADO."); // Log reduzido
        intervaloID = setInterval(() => {
            digitalPulse(TRIGGER, 1, 0.01); 
        }, 1000); 

    } else {
        console.log("Sistema DESATIVADO.");
        if (intervaloID) {
            clearInterval(intervaloID);
            intervaloID = undefined;
        }
        ultimaLeitura = undefined;
        leituraBase = undefined;
    }
    
}, LIGAR, {
    repeat: true,
    edge: "rising",
    debounce: 50     
});

// --- setWatch do ECHO ---
setWatch(calcularDistancia, ECHO, {
    repeat: true,
    edge: "falling"
});

// --- LÓGICA DO BOTÃO saveMAX ---
setWatch(function(e) {
    
    if (e.state) {
        // Botão PRESSIONADO
        saveMaxTimer = setTimeout(function() {
            let valor = ultimaLeitura;
            if (valor !== undefined) {
                console.log("maximo = " + valor); // Log essencial
                if (mqtt) mqtt.publish("sensor/maximo_salvo", String(valor));
            }
            
            saveMaxTimer = null; 
            if (ledBlinkInterval) {
                clearInterval(ledBlinkInterval);
                ledBlinkInterval = null;
            }
            digitalWrite(LED1, isAtivo);
       }, 5000); 

        ledBlinkState = false;
        if (ledBlinkInterval) clearInterval(ledBlinkInterval);
        ledBlinkInterval = setInterval(function() {
            ledBlinkState = !ledBlinkState;
            digitalWrite(LED1, ledBlinkState);
       }, 200); 

    } else {
        // Botão SOLTO
        if (saveMaxTimer) {
            clearTimeout(saveMaxTimer);
            saveMaxTimer = null;
        }
        if (ledBlinkInterval) {
            clearInterval(ledBlinkInterval);
            ledBlinkInterval = null;
        }
        digitalWrite(LED1, isAtivo);
    }
    
}, saveMAX, {
    repeat: true,
    edge: "both",
    debounce: 50
});

// --- Funções de Conectividade ---

function conectarWifi() {
  console.log("Conectando WiFi: " + WIFI_NOME);
  if (typeof gc === 'function') gc(); // Otimização de Memória
  const wifi = require("Wifi");
  wifi.connect(WIFI_NOME, { password: WIFI_SENHA }, function(err) {
    if (err) {
      console.log("Erro WiFi:", err);
      return;
    }
    console.log("WiFi Conectado! IP:", wifi.getIP().ip);
    conectarMQTT();
  });
}

function conectarMQTT() {
  console.log("Conectando MQTT: " + MQTT_BROKER);
  
  if (mqtt) mqtt.disconnect();
  if (typeof gc === 'function') gc(); // Otimização de Memória
  
  try {
    const MQTT = require("MQTT");
    mqtt = MQTT.create(MQTT_BROKER, {
      port: MQTT_PORT,
      username: MQTT_USER,
      password: MQTT_PASS
    });

    mqtt.on('connected', function() {
      console.log("MQTT Conectado!");
      mqtt.publish("sensor/status", "online");
    });

    mqtt.on('error', function(err) {
      console.log("Erro MQTT:", err);
      mqtt = null; 
    });
    
    mqtt.on('disconnected', function() {
      console.log("MQTT Desconectado.");
      mqtt = null;
    });

    mqtt.connect();
    
  } catch(e) {
    console.log("Falha MQTT:", e);
  }
}

// --- Inicia a conexão ---
conectarWifi();