// --- Pinos ---
const LED1 = 25;
const LIGAR = 26;      // Pino 26 para o Interruptor ON/OFF
const saveMAX = 27;    // Pino 27 para o Botão "Salvar"
const TRIGGER = 33;
const ECHO = 32;

// --- Configuração dos Pinos ---
pinMode(saveMAX , "input_pulldown"); // Pino 27: Solto=LOW, Pressionado(com 3.3V)=HIGH
pinMode(LIGAR, "input_pullup");     // Pino 26: Solto=HIGH (OFF), Pressionado(com GND)=LOW (ON)
pinMode(TRIGGER, "output"); 
pinMode(ECHO, "input"); 
pinMode(LED1, "output");

// --- Variáveis de Lógica ---
let ultimaLeitura;
let erro1, erro2, erro3;
let leituraBase;
const taxaDeErro = 50; 

// --- Variáveis de Estado ---
let isAtivo = false; 
let intervaloID; 

// --- Variáveis para o botão saveMAX (Long Press) ---
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

// --- Função de Medição (Callback do ECHO) ---
function calcularDistancia(info) {
    // Esta função é chamada pelo setWatch do ECHO
    if (!isAtivo) return; // Só processa se o sistema estiver ligado
    
    let tempo = info.time - info.lastTime;
    let distancia = 17000 * tempo; 
    distancia = parseFloat(distancia.toFixed(2));

    if (distancia < 1 || distancia > 400) {
        return; // Ignora leituras fora do alcance
    }

    if (!ultimaLeitura) {
        ultimaLeitura = distancia;
        leituraBase = distancia; 
        console.log("Leitura Base Inical definida: " + distancia );
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
        console.log( distancia);
        if (mqtt) mqtt.publish("sensor/distancia", String(distancia));
        ultimaLeitura = distancia;
        erro1 = undefined;
        erro2 = undefined;
        erro3 = undefined;
        
    } else {
        // Leitura RUIM - Inicia a "limpeza de lixo"
        let logErro = "";
        if (!passouNoTesteRelativo) {
            logErro = `(Erro Relativo): ${distancia}cm`;
        }
        if (!passouNoTesteAbsoluto && leituraBase) { 
            logErro = `(Erro Absoluto): ${distancia}cm`;
            console.log(logErro);
        }
        
        if (mqtt && logErro) mqtt.publish("sensor/erro", logErro);

        if (!erro1) {
            erro1 = distancia;
        } else if (!erro2) {
            erro2 = distancia;
        } else if (!erro3) {
            erro3 = distancia;
        }
        
        const calcularDiferencaPercentual = (valor1, valor2) => {
            return (Math.abs(valor1 - valor2) / valor2) * 100;
        };

        if (
            (erro2 && calcularDiferencaPercentual(erro2, erro1) > taxaDeErro) || 
            (erro3 && calcularDiferencaPercentual(erro3, erro1) > taxaDeErro)
        ) {
            erro1 = undefined;
            erro2 = undefined;
            erro3 = undefined;
            console.log("Erros muito diferentes! Resetando os valores.");
        }
        
        else if (erro1 && erro2 && erro3) {
            distancia = (erro1 + erro2 + erro3) / 3;
            console.log(" (Média): " + distancia.toFixed(2) );
            ultimaLeitura = distancia;
            
            if (!passouNoTesteAbsoluto) {
                console.log("NOVA LEITURA BASE definida (após estabilizar): " + distancia.toFixed(2));
                leituraBase = distancia;
            }
            
            erro1 = undefined;
            erro2 = undefined;
            erro3 = undefined;
        }
    }
}

// --- Lógica do Interruptor LIGAR (setWatch) ---
// *** ESTA É A FUNÇÃO CORRIGIDA PARA O INTERRUPTOR ***
setWatch(function(e) {
    // e.state (estado do pino)
    // Pino 26 é input_pullup:
    //   Solto (Switch OFF) = HIGH = true
    //   Ligado no GND (Switch ON) = LOW = false
    
    // Nós NÃO usamos mais o toggle (isAtivo = !isAtivo)
    // Nós definimos 'isAtivo' com base no estado real do pino.
    // O sistema está ATIVO quando o pino está em LOW (false).
    isAtivo = (e.state === false);
    
    digitalWrite(LED1, isAtivo); 
    
    if (isAtivo) {
        // --- O Interruptor foi para a posição ON ---
        console.log("Sistema ATIVADO. Iniciando medições...");
        
        if (!mqtt) {
            console.log("Primeira ativação: iniciando conexão WiFi/MQTT...");
            conectarWifi(); 
        } else {
            mqtt.publish("sensor/status", "ligado");
        }

        // Inicia o pulso do sensor
        intervaloID = setInterval(() => {
            digitalPulse(TRIGGER, 1, 0.01); 
        }, 1000); 

    } else {
        // --- O Interruptor foi para a posição OFF ---
        console.log("Sistema DESATIVADO.");

        if (mqtt) {
            mqtt.publish("sensor/status", "desligado");
        }

        if (intervaloID) {
            clearInterval(intervaloID);
            intervaloID = undefined;
        }
        // Zera as variáveis de lógica
        ultimaLeitura = undefined;
        leituraBase = undefined;
        erro1 = undefined;
        erro2 = undefined;
        erro3 = undefined;
    }
    
}, LIGAR, {
    repeat: true,
    // *** A CORREÇÃO ESTÁ AQUI ***
    edge: "both", // Detecta tanto a subida (rising) quanto a descida (falling)
    debounce: 50 
});

// --- setWatch do ECHO (Uma única vez) ---
setWatch(calcularDistancia, ECHO, {
    repeat: true,
    edge: "falling" // Isso está correto para o HC-SR04
});

// --- LÓGICA DO BOTÃO saveMAX ---
// O código aqui está CORRETO. O seu problema era o HARDWARE (VIN).
// Lembre-se de mudar o fio do VIN para o 3.3V!
setWatch(function(e) {
    
    if (e.state) {
        // --- Botão PRESSIONADO (e.state = true) ---
        // (Pino 27 com pulldown foi conectado ao 3.3V)
        console.log("Botão saveMAX pressionado, segure por 5s...");
        
        saveMaxTimer = setTimeout(function() {
            console.log("Ação (5s) disparada!");
            
            let valor = ultimaLeitura;
            if (valor !== undefined) {
                console.log("maximo = " + valor);
                if (mqtt) mqtt.publish("sensor/maximo_salvo", String(valor));
            } else {
                console.log("Ainda não há uma leitura válida para salvar.");
            }
            
            saveMaxTimer = null; 
            if (ledBlinkInterval) {
                clearInterval(ledBlinkInterval);
                ledBlinkInterval = null;
            }
            digitalWrite(LED1, isAtivo); // Restaura o LED ao estado do sistema

        }, 5000); // 5 segundos

        // Inicia o pisca-pisca
        ledBlinkState = false;
        if (ledBlinkInterval) clearInterval(ledBlinkInterval);
        ledBlinkInterval = setInterval(function() {
            ledBlinkState = !ledBlinkState;
            digitalWrite(LED1, ledBlinkState);
        }, 200); 

    } else {
        // --- Botão SOLTO (e.state = false) ---
        // (Pino 27 está em pulldown, LOW)
        console.log("Botão saveMAX solto.");
        
        if (saveMaxTimer) {
            clearTimeout(saveMaxTimer);
            saveMaxTimer = null;
            console.log("Ação (5s) cancelada (botão solto antes do tempo).");
        }
        
        if (ledBlinkInterval) {
            clearInterval(ledBlinkInterval);
            ledBlinkInterval = null;
        }

        // Restaura o estado correto do LED
        digitalWrite(LED1, isAtivo);
    }
    
}, saveMAX, {
    repeat: true,
    edge: "both",
    debounce: 50
});

// --- Funções de Conectividade (Sem mudanças) ---

function conectarWifi() {
    console.log("Conectando ao WiFi: " + WIFI_NOME);
    if (typeof gc === 'function') gc(); 
    const wifi = require("Wifi");
    wifi.connect(WIFI_NOME, { password: WIFI_SENHA }, function(err) {
        if (err) {
            console.log("Erro ao conectar no WiFi:", err);
            return;
        }
        console.log("WiFi Conectado! IP:", wifi.getIP().ip);
        conectarMQTT();
    });
}

function conectarMQTT() {
    console.log("Conectando ao Broker MQTT: " + MQTT_BROKER);
    
    if (mqtt) mqtt.disconnect();
    if (typeof gc === 'function') gc(); 
    
    try {
        const MQTT = require("MQTT");
        mqtt = MQTT.create(MQTT_BROKER, {
            port: MQTT_PORT,
            username: MQTT_USER,
            password: MQTT_PASS
        });

        mqtt.on('connected', function() {
            console.log("MQTT Conectado!");
            mqtt.publish("sensor/status", isAtivo ? "ligado" : "desligado");
        });

        mqtt.on('error', function(err) {
            console.log("Erro no MQTT:", err);
            mqtt = null; 
        });
        
        mqtt.on('disconnected', function() {
            console.log("MQTT Desconectado.");
            mqtt = null;
        });

        mqtt.connect();
        
    } catch(e) {
        console.log("Falha ao criar cliente MQTT:", e);
    }
}

// --- FIM DO CÓDIGO ---
console.log("Sistema pronto. Mova o interruptor LIGAR para iniciar.");