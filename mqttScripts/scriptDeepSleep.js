
const ID_IOT = "A01"; // SETOR NAME
const LEITURAS_META = 3; // lEITURAS SEGURANÇA

// TIME DEEPSLEEP
const TIME_SLEEP = 10; 

// JANELA SAVE MQTT
const TEMPO_JANELA_SAVE = 30000; 

// SEGURANÇA GLOBAL
const TEMPO_MAXIMO_CICLO = 60000; 

// WIFI E BROKER
const WIFI_NOME = "JOAO"; 
const WIFI_SENHA = "leonardi12345";
const MQTT_BROKER = "10.0.0.148";
const MQTT_PORT = 1883; 
const MQTT_USER = ""; 
const MQTT_PASS = ""; 

const LED1 = 25;      
const LED2 = 26;      
const PIN_SAVE = 27;  
const PIN_TRIG = 33;
const PIN_ECHO = 32;

const wifiLib = require("Wifi");
const mqttLib = require("MQTT");

let mqttClient = null;
let leiturasValidas = [];       
const taxaDeErro = 50; 
let intervaloMedicao;
let timeoutEnvio; 
let wifiWatchdog; 
let heartbeatInterval;
let timerSegurancaGlobal; 

let watchEchoID = null; 
let querSalvar = false; 
let tentativasWifi = 0;

// INICIALIZAÇÃO (BOOT) ---------------------------------
function onInit() {
    if (typeof gc === 'function') gc(); 
    if (intervaloMedicao) clearInterval(intervaloMedicao);
    if (timeoutEnvio) clearTimeout(timeoutEnvio);
    if (wifiWatchdog) clearTimeout(wifiWatchdog);
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (timerSegurancaGlobal) clearTimeout(timerSegurancaGlobal);

    timerSegurancaGlobal = setTimeout(function() {
        console.log("!!! TEMPO ESGOTADO - REBOOT !!!");
        startFastReboot();
    }, TEMPO_MAXIMO_CICLO);

    if (E.enableWatchdog) E.enableWatchdog(70, true);
    
    let esp32Flags = E.getFlags();
    esp32Flags.deepSleep = 1;
    E.setFlags(esp32Flags);

    console.log(">>> ACORDOU (BOOT)...");

    pinMode(LED1, "output");
    pinMode(LED2, "output");
    pinMode(PIN_TRIG, "output");
    
    digitalWrite(LED1, 1); digitalWrite(LED2, 1);
    setTimeout(() => { digitalWrite(LED1, 0); digitalWrite(LED2, 0); }, 500);

    pinMode(PIN_SAVE , "input_pullup"); 
    setWatch(detectarIntencaoSalvar, PIN_SAVE, {
        repeat: true, edge: "falling", debounce: 50
    });

    setTimeout(iniciarCicloDoZero, 1000);
}

function iniciarCicloDoZero() {
    leiturasValidas = [];
    tentativasWifi = 0; 
    
    digitalWrite(LED1, 0);
    digitalWrite(LED2, 0); 
    
    console.log("Limpando conexões antigas...");
    
    if (mqttClient) { mqttClient.disconnect(); mqttClient = null; }
    
    wifiLib.disconnect(); 
    
    setTimeout(function() {
        conectarWifi();
    }, 2000); 
}

// REBOOT RÁPIDO ----------------------------------------------
function startFastReboot() {
    console.log("!!! REINICIANDO SISTEMA !!!");
    digitalWrite(LED1, 1); digitalWrite(LED2, 0);
    
    wifiLib.disconnect();
    setTimeout(function() { reset(); }, 500);
}


// CONECTIVIDADE ----------------------------------------------------

function conectarWifi() {
    tentativasWifi++;
    console.log(`Conectando Wifi (Tentativa ${tentativasWifi})...`);
    if (typeof gc === 'function') gc(); 

    if (heartbeatInterval) clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(() => {
        digitalWrite(LED2, !digitalRead(LED2));
    }, 100);

    if (wifiWatchdog) clearTimeout(wifiWatchdog);
    wifiWatchdog = setTimeout(function() {
        console.log("TIMEOUT: Wifi travou.");
        if (tentativasWifi > 2) startFastReboot();
        else conectarWifi(); 
    }, 20000); 
    
    wifiLib.connect(WIFI_NOME, { password: WIFI_SENHA }, function(err) {
        if (err) {
            console.log("Erro Wifi:", err);
            if (tentativasWifi < 3) {
                console.log("Tentando novamente...");
                setTimeout(conectarWifi, 4000); 
            } else {
                startFastReboot();
            }
            return;
        }
        
        // SUCESSO
        if (wifiWatchdog) clearTimeout(wifiWatchdog);
        wifiWatchdog = null;
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        digitalWrite(LED2, 1); 
        
        conectarMQTT();
    });
}

function conectarMQTT() {
    try {
        if (mqttClient) mqttClient.disconnect();
        
        mqttClient = mqttLib.create(MQTT_BROKER, {
            port: MQTT_PORT, username: MQTT_USER, password: MQTT_PASS
        });

        mqttClient.on('connected', function() {
            console.log("MQTT OK. Iniciando sensores...");
            iniciarSensores();
        });

        mqttClient.on('error', function(err) {
            console.log("Erro MQTT:", err);
            startFastReboot();
        });

        mqttClient.connect();
    } catch(e) { 
        console.log("Erro Lib MQTT:", e);
        startFastReboot();
    }
}

// SENSORES -----------------------------------------------
function limparSensores() {
    if (intervaloMedicao) clearInterval(intervaloMedicao);
    if (watchEchoID) {
        clearWatch(watchEchoID);
        watchEchoID = null;
    }
    pinMode(PIN_ECHO, "input");
}

function iniciarSensores() {
    leiturasValidas = []; 
    limparSensores(); 
    
    watchEchoID = setWatch(processarEcho, PIN_ECHO, { repeat: true, edge: "falling" });

    intervaloMedicao = setInterval(() => {
        digitalPulse(PIN_TRIG, 1, 0.01);
        digitalWrite(LED2, !digitalRead(LED2)); 
    }, 250);
}

function processarEcho(e) {
    let duracao = e.time - e.lastTime;
    let distancia = 17000 * duracao;
    
    if (distancia < 1 || distancia > 450) return;

    let ehValido = false;
    if (leiturasValidas.length === 0) {
        ehValido = true;
    } else {
        let ultima = leiturasValidas[leiturasValidas.length - 1];
        let diff = Math.abs(distancia - ultima);
        if ((diff / ultima) * 100 < taxaDeErro) ehValido = true;
        else {
             leiturasValidas = []; 
             return; 
        }
    }

    if (ehValido) {
        leiturasValidas.push(distancia);
        console.log(`L${leiturasValidas.length}: ${distancia.toFixed(1)}`);
    }

    if (leiturasValidas.length >= LEITURAS_META) {
        prepararJanelaEnvio();
    }
}

// BOTÃO SAVE E ENVIO ----------------------------------------------

function detectarIntencaoSalvar(e) {
    console.log(">>> BOTÃO SAVE APERTADO!");
    querSalvar = true; 
    digitalWrite(LED1, 1); 
    setTimeout(() => digitalWrite(LED1, 0), 150); 
}

function prepararJanelaEnvio() {
    limparSensores();
    
    digitalWrite(LED2, 0); 
    digitalWrite(LED1, 1); 
    
    console.log(`>>> AGUARDANDO ${TEMPO_JANELA_SAVE/1000}s... <<<`);
    
    
    setTimeout(realizarEnvioMQTT, TEMPO_JANELA_SAVE);
}

function realizarEnvioMQTT() {
    if (typeof gc === 'function') gc(); 
    
    if (!leiturasValidas || leiturasValidas.length === 0) {
        console.log("!!! ERRO: Sem dados. Reboot.");
        startFastReboot();
        return;
    }

    let valorFinal = leiturasValidas[LEITURAS_META - 1];
    if (valorFinal === undefined || valorFinal === null) {
         console.log("!!! ERRO: Leitura inválida.");
         startFastReboot();
         return;
    }

    let valorFormatado = parseFloat(valorFinal.toFixed(2));
    console.log(">>> Enviando agora...");

    if (mqttClient && mqttClient.connected) {
        let timestamp = Math.floor(Date.now() / 1000); 
        let payload = { val: valorFormatado, ts: timestamp };
        
        mqttClient.publish(`sensor/${ID_IOT}/distancia`, JSON.stringify(payload));
        
        if (querSalvar) {
            console.log("!!! ENVIANDO SAVE MAX !!!");
            mqttClient.publish(`sensor/${ID_IOT}/maximo_salvo`, JSON.stringify(payload));
            
            let blinkCount = 0;
            let blinkInt = setInterval(() => {
                digitalWrite(LED1, !digitalRead(LED1));
                blinkCount++;
                if(blinkCount > 6) clearInterval(blinkInt);
            }, 80);
            
            querSalvar = false; 
        }
    } else {
        console.log("AVISO: MQTT desconectado.");
    }

    timeoutEnvio = setTimeout(entrarEmDeepSleep, 1000); 
}

// DEEP SLEEP ----------------------------------------------
function entrarEmDeepSleep() {
    if (timerSegurancaGlobal) clearTimeout(timerSegurancaGlobal);
    if (timeoutEnvio) clearTimeout(timeoutEnvio);
    if (wifiWatchdog) clearTimeout(wifiWatchdog);
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (E.kickWatchdog) E.kickWatchdog();
    
    console.log(`>>> Dormindo por ${TIME_SLEEP}s...`);
    
    digitalWrite(LED1, 0);
    digitalWrite(LED2, 0);
    digitalWrite(PIN_TRIG, 0);
    
    if (mqttClient) mqttClient.disconnect();
    wifiLib.disconnect();
    
    let tempoMicrosegundos = TIME_SLEEP * 1000000;
    
    setTimeout(function() {
        if (typeof ESP32 !== 'undefined') {
            ESP32.deepSleep(tempoMicrosegundos);
        } else {
             require("esp").deepSleep(tempoMicrosegundos);
        }
    }, 200);
}

// Start
setTimeout(onInit, 500);