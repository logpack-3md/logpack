// ======================================================
// CONFIGURAÇÕES GERAIS E PINOS
// ======================================================
const ID_IOT = "A01"; 
const LEITURAS_META = 3;      
const rotaBaseBroker = "pedro"

// --- TEMPOS ---
const TIME_SLEEP = 10;            // Tempo dormindo (s)
const TEMPO_JANELA_SAVE = 10000;  // Tempo esperando "save" (10s)
const TEMPO_MAXIMO_CICLO = 60000; // Watchdog de segurança (60s)

// --- Credenciais ---
const WIFI_NOME = "JOAO"; 
const WIFI_SENHA = "leonardi12345";
const MQTT_BROKER = "10.0.0.118";

// --- Pinos Distância/Controle ---
const LED1 = 25;      
const LED2 = 26;      
const PIN_SAVE = 27;  
const PIN_TRIG = 33;
const PIN_ECHO = 32;

// --- Pinos e Constantes de Tensão ---
const TRANSISTOR = 13; 
const LED_PLACA = 2;   // LED extra da placa
const adcPin = 34;
const Vref = 3.3;
const ADC_MAX = 4095; 

// --- Configuração Voltagem ---
const R1 = 44000.0;
const R2 = 22000.0;
const dividerFactor = (R1 + R2) / R2; 
const fatorCorrecao = 1.09; 
const N_SAMPLES_VOLT = 50; 

// --- Módulos Globais ---
const wifiLib = require("Wifi");
const mqttLib = require("MQTT");

// --- Variáveis de Controle ---
let mqttClient = null;
let leiturasDistancia = [];       
let intervaloMedicaoDistancia;
let intervaloMedicaoVoltagem; 
let timeoutEnvio; 
let heartbeatInterval;
let timerSegurancaGlobal; 
let watchEchoID = null; 
let querSalvar = false; 

// Variável global para guardar a tensão estabilizada
let ultimaTensaoLida = 0.0;
let tensaoSaturada = false;

// ======================================================
// 1. INICIALIZAÇÃO (BOOT)
// ======================================================
function onInit() {
    // Watchdog de segurança
    if (timerSegurancaGlobal) clearTimeout(timerSegurancaGlobal);
    timerSegurancaGlobal = setTimeout(function() {
        console.log("!!! TEMPO GLOBAL ESGOTADO (60s) !!!");
        entrarEmDeepSleep();
    }, TEMPO_MAXIMO_CICLO);

    if (typeof gc === 'function') gc(); 
    
    // Configura Deep Sleep
    let esp32Flags = E.getFlags();
    esp32Flags.deepSleep = 1;
    E.setFlags(esp32Flags);

    console.log(">>> ACORDOU (BOOT)...");

    // Configura Pinos
    pinMode(LED1, "output");
    pinMode(LED2, "output");
    pinMode(PIN_TRIG, "output");
    pinMode(PIN_SAVE , "input_pullup"); 
    pinMode(TRANSISTOR, "output");
    pinMode(LED_PLACA, "output");
    pinMode(adcPin, "input");

    // LIGA TENSÃO (Imediato)
    iniciarCicloVoltagem();

    setWatch(detectingIntencaoSalvar, PIN_SAVE, {
        repeat: true, edge: "falling", debounce: 50
    });

    // Inicia Rede após 1s para o sistema estabilizar
    setTimeout(iniciarCicloRede, 1000);
}

// ======================================================
// 2. LÓGICA DE VOLTAGEM (BACKGROUND)
// ======================================================
function iniciarCicloVoltagem() {
    console.log(">>> [VOLT] Ligando Transistor...");
    digitalWrite(TRANSISTOR, 1);
    digitalWrite(LED_PLACA, 1);

    if (intervaloMedicaoVoltagem) clearInterval(intervaloMedicaoVoltagem);
    intervaloMedicaoVoltagem = setInterval(lerVoltagemBackground, 1000);
}

function lerVoltagemBackground() {
    let soma = 0;
    analogRead(adcPin); // Dummy read

    for (let i = 0; i < N_SAMPLES_VOLT; i++) {
        soma += analogRead(adcPin) * ADC_MAX;
    }
    const rawMedio = soma / N_SAMPLES_VOLT;

    if (rawMedio >= 3800) {
        tensaoSaturada = true;
        ultimaTensaoLida = 99.99; 
    } else {
        tensaoSaturada = false;
        const Vout = (rawMedio / ADC_MAX) * Vref;
        const Vin = Vout * dividerFactor * fatorCorrecao;
        ultimaTensaoLida = Vin;
    }
}

// ======================================================
// 3. CONECTIVIDADE (CICLO LIMPO - FIX ERRO 113)
// ======================================================
function iniciarCicloRede() {
    leiturasDistancia = [];
    digitalWrite(LED1, 0);
    digitalWrite(LED2, 0); 
    conectarWifi();
}

function conectarWifi() {
    // LED2 pisca rápido indicando tentativa de conexão
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(() => {
        digitalWrite(LED2, !digitalRead(LED2));
    }, 100);

    // AQUI: Removemos o getStatus() para evitar "ilusão" de conexão
    console.log(">>> [WIFI] Iniciando Ciclo Limpo (Force Disconnect)...");

    // 1. FORÇA DESCONEXÃO para matar conexões 'zumbis' e liberar socket
    wifiLib.disconnect(() => {
        
        // 2. Limpa listeners antigos
        wifiLib.removeAllListeners("connected"); //PHL
        wifiLib.removeAllListeners("disconnected"); //PHL

        // 3. Configura eventos
        wifiLib.on("connected", function() {
            console.log(">>> [WIFI] CONECTADO (IP Renovado).");
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            digitalWrite(LED2, 1); 
            
            // Pequeno delay para garantir que a stack TCP subiu
            setTimeout(conectarMQTT, 500);
        });

        wifiLib.on("disconnected", function (reason) {
            console.log("!!! WIFI CAIU. Reconectando em 3s...");
            setTimeout(() => {
                wifiLib.connect(WIFI_NOME, { password: WIFI_SENHA });
                try { wifiLib.setHostname("ESP32_do_Pedro"); } catch(e) {}
            }, 3000);
        });

        // 4. Configurações de estabilidade
        // try { wifiLib.setHostname("ESP32_do_Pedro"); } catch(e) {}; phl
        // try { wifiLib.setPowerSave(false); } catch(e) {}

        // 5. Conecta de fato após 1s de respiro
        setTimeout(() => {
            console.log("-> Enviando comando connect...");
            wifiLib.connect(WIFI_NOME, { password: WIFI_SENHA }, function(err) {
                if (err) console.log("!!! ERRO NO CONNECT:", err);
            });
                try { wifiLib.setHostname("ESP32_do_Pedro"); } catch(e) {}

        }, 1000);
    });
}

function conectarMQTT() {
    console.log(`>>> [MQTT] Conectando ao Broker ${MQTT_BROKER}...`);
    
    mqttClient = mqttLib.create(MQTT_BROKER, {
        client_id: "MQTT_ESP32_Pedro_Final" 
    });

    mqttClient.on('connected', function() {
        console.log(">>> [MQTT] CONECTADO! Iniciando sensores...");
        iniciarSensorDistancia();
    });

    // Se falhar o MQTT, tenta reconectar
    mqttClient.on('error', function(err) {
        console.log("Erro MQTT:", err);
        // Tenta reconectar em 5s se der erro de socket
        setTimeout(conectarMQTT, 5000);
    });
    
    // --- ESTA É A MÁGICA: Evento de desconexão graciosa ---
    // Quando chamarmos mqttClient.disconnect(), ele virá para cá
    mqttClient.on('disconnected', function() {
        console.log(">>> [MQTT] Desconectado Graciosamente. Buffer deve estar vazio.");
        entrarEmDeepSleep();
    });
    
    mqttClient.connect();
}


// ======================================================
// 4. SENSOR DE DISTÂNCIA
// ======================================================
function limparSensorDistancia() {
    if (intervaloMedicaoDistancia) clearInterval(intervaloMedicaoDistancia);
    if (watchEchoID) {
        clearWatch(watchEchoID);
        watchEchoID = null;
    }
    pinMode(PIN_ECHO, "input");
}

function iniciarSensorDistancia() {
    leiturasDistancia = []; 
    limparSensorDistancia(); 
    
    watchEchoID = setWatch(processarEcho, PIN_ECHO, { repeat: true, edge: "falling" });

    intervaloMedicaoDistancia = setInterval(() => {
        digitalPulse(PIN_TRIG, 1, 0.01);
        digitalWrite(LED2, !digitalRead(LED2)); 
    }, 250);
}

function processarEcho(e) {
    let duracao = e.time - e.lastTime;
    let distancia = 17000 * duracao;
    
    if (distancia < 1 || distancia > 400) return;

    leiturasDistancia.push(distancia);
    console.log(`[DIST] Leitura ${leiturasDistancia.length}: ${distancia.toFixed(1)}cm`);

    if (leiturasDistancia.length >= LEITURAS_META) {
        prepararJanelaEnvio();
    }
}

// ======================================================
// 5. ENVIO E JANELA DE TEMPO
// ======================================================
function detectingIntencaoSalvar(e) {
    console.log(">>> BOTÃO SALVAR PRESSIONADO");
    querSalvar = true; 
    digitalWrite(LED1, 1); 
    setTimeout(() => digitalWrite(LED1, 0), 200); 
}

function prepararJanelaEnvio() {
    limparSensorDistancia(); 
    digitalWrite(LED2, 0); 
    digitalWrite(LED1, 1); 
    
    console.log(`>>> AGUARDANDO ${TEMPO_JANELA_SAVE/1000}s (Estabilização)...`);
    setTimeout(realizarEnvioMQTT, TEMPO_JANELA_SAVE);
}

function realizarEnvioMQTT() {
    if (intervaloMedicaoVoltagem) clearInterval(intervaloMedicaoVoltagem);
    
    console.log(">>> PREPARANDO PACOTE MQTT...");

    if (!mqttClient || !mqttClient.connected) {
        console.log("AVISO: MQTT desconectado no inicio. Abortando.");
        entrarEmDeepSleep();
        return;
    }

    // --- DADOS (Capturados aqui para garantir escopo) ---
    // Usamos 'var' para garantir que funcione dentro dos timeouts do Espruino
    var distFinal = leiturasDistancia.length > 0 ? leiturasDistancia[leiturasDistancia.length - 1] : 0;
    var distFormatada = parseFloat(distFinal.toFixed(2));
    var voltFormatada = parseFloat(ultimaTensaoLida.toFixed(2));
    var statusTensao = tensaoSaturada ? "ERRO_SATURADO" : "OK";

    console.log(`[ENVIO] Dist: ${distFormatada}cm | Volt: ${voltFormatada}V | Botão apertado? ${querSalvar}`);

    // 1. Envia Distância
    if(mqttClient.connected) {
        mqttClient.publish(`${rotaBaseBroker}/${ID_IOT}/distancia`, distFormatada.toString());
        console.log("[DEBUG] Pkt 1 (Dist) > Enviado");
    }

    // 2. Agenda Tensão (1000ms depois)
    setTimeout(function() {
        if(mqttClient.connected) {
            console.log("-> Enviando Tensão...");
            mqttClient.publish(`${rotaBaseBroker}/${ID_IOT}/tensao`, voltFormatada.toString());
            console.log("[DEBUG] Pkt 2 (Volt) > Enviado");
        }

        // 3. Verifica botão Salvar (1000ms depois da tensão)
        setTimeout(function() {
            
            // Função interna para desligar
            function finalizarAgora() {
                console.log("-> Solicitando desconexão MQTT (Flush)...");
                if(mqttClient.connected) {
                    mqttClient.disconnect(); 
                } else {
                    entrarEmDeepSleep();
                }
                setTimeout(entrarEmDeepSleep, 3000);
            }

            // --- DIAGNÓSTICO DO ERRO ---
            if (querSalvar) {
                // O usuário QUER salvar, vamos ver se consegue
                if(mqttClient.connected) {
                    console.log("!!! ENVIANDO MAXIMO SALVO !!!"); // <--- SE ISSO NÃO APARECER, O MQTT CAIU
                    
                    mqttClient.publish(`${rotaBaseBroker}/${ID_IOT}/maximo_salvo`, distFormatada.toString());
                    
                    // Pisca LED rápido
                    for(let i=0; i<6; i++) {
                        setTimeout(() => digitalWrite(LED1, !digitalRead(LED1)), i*100);
                    }

                    console.log(">>> Aguardando 5s para garantir saída do pacote...");
                    setTimeout(function() {
                        querSalvar = false; 
                        finalizarAgora(); 
                    }, 5000); // 1 segundo de respiro
                    
                } else {
                    console.log("!!! ERRO: Botão apertado, mas MQTT caiu antes de enviar.");
                    querSalvar = false;
                    finalizarAgora();
                }
            } else {
                // Se cair aqui, o botão não funcionou ou não foi apertado
                console.log(">>> INFO: Não enviou Maximo pois 'querSalvar' é false.");
                console.log(">>> (Verifique se o botão fecha curto do pino 27 para o GND)");
                finalizarAgora();
            }

        }, 1000);
    }, 1000);
    
    timeoutEnvio = setTimeout(entrarEmDeepSleep, 15000); 
}

// ======================================================
// 6. DEEP SLEEP
// ======================================================
function entrarEmDeepSleep() {
    if (timerSegurancaGlobal) clearTimeout(timerSegurancaGlobal);
    if (timeoutEnvio) clearTimeout(timeoutEnvio);
    if (intervaloMedicaoVoltagem) clearInterval(intervaloMedicaoVoltagem);
    
    console.log(`>>> DORMINDO POR ${TIME_SLEEP}s...`);
    
    digitalWrite(LED1, 0);
    digitalWrite(LED2, 0);
    digitalWrite(PIN_TRIG, 0);
    digitalWrite(TRANSISTOR, 0);
    digitalWrite(LED_PLACA, 0);
    pinMode(adcPin, "input_pulldown"); 
    
    // Removemos o mqttClient.disconnect() daqui pois ele já foi chamado ou já caiu
    // Vamos direto para o WiFi
    
    wifiLib.disconnect(() => {
        let tempoMicrosegundos = TIME_SLEEP * 1000000;
        setTimeout(function() {
             if (typeof ESP32 !== 'undefined') ESP32.deepSleep(tempoMicrosegundos);
             else require("esp").deepSleep(tempoMicrosegundos);
        }, 500);
    });
}

// Start
setTimeout(onInit, 1000);