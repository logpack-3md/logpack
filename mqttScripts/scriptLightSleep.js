// ======================================================
// CONFIGURAÇÕES GERAIS
// ======================================================
const ID_IOT = "001"

const LEITURAS_META = 3;          
const TEMPO_DORMIR_SEGUNDOS = 10; 
const LIMITE_MAXIMO_HARDWARE = 450; 
const TEMPO_LIMITE_WIFI = 15000; // 15 segundos de watchdog para o Wi-Fi

// --- Credenciais ---
const WIFI_NOME = "JOAO"; 
const WIFI_SENHA = "leonardi12345";
const MQTT_BROKER = "10.0.0.148";
const MQTT_PORT = 1883; 
const MQTT_USER = ""; 
const MQTT_PASS = ""; 

// --- Pinos ---
const LED1 = 25;
const PIN_LIGAR = 26;  
const PIN_SAVE = 27;   // MANTIDO O PINO 27
const PIN_TRIG = 33;
const PIN_ECHO = 32;

// --- Módulos Globais ---
const wifiLib = require("Wifi");
const mqttLib = require("MQTT");

// --- Variáveis de Controle ---
let mqttClient = null;
let leiturasValidas = [];       
const taxaDeErro = 50; 
let intervaloMedicao;
let timeoutDormir; 
let timeoutEnvio; 
let isSystemOn = false; 

// --- NOVAS VARIÁVEIS DE ESTABILIDADE ---
let wifiWatchdog; 
let tentativasWifi = 0;
const MAX_TENTATIVAS = 5; 

// --- Variável Mágica para a Correção ---
let watchEchoID = null; 

// --- Lógica do Save Max ---
let querSalvar = false; 

// ======================================================
// FUNÇÕES DE UTILIDADE E CONTROLE DE ESTABILIDADE
// ======================================================

function reiniciarCicloComAtraso() {
    // 💡 LÓGICA DE RETROCESSO EXPONENCIAL
    tentativasWifi++;
    
    // Calcula o tempo de espera (5s, 10s, 20s, 30s, 30s...)
    let atraso = Math.min(30000, 5000 * Math.pow(2, tentativasWifi - 1));

    if (tentativasWifi > MAX_TENTATIVAS) {
        console.log(`!!! ${MAX_TENTATIVAS} TENTATIVAS DE CONEXÃO FALHARAM. PARANDO TUDO.`);
        desligarTudoImediatamente(); 
        return;
    }

    console.log(`>>> Falha de Conexão. Tentativa ${tentativasWifi}. Re-tentando em ${atraso / 1000}s...`);

    if(isSystemOn) timeoutDormir = setTimeout(conectarWifi, atraso);
}

function gerenciarFalhaGeral(motivo) {
    if (!isSystemOn) return;
    
    // Limpa o watchdog se ativo
    if (wifiWatchdog) clearTimeout(wifiWatchdog);
    wifiWatchdog = undefined;
    
    console.log(`ERRO CRÍTICO: ${motivo}`);
    
    // Desconecta e limpa o estado de erro
    if (mqttClient) mqttClient.disconnect();
    mqttClient = null;
    wifiLib.disconnect();
    if (typeof gc === 'function') gc();

    reiniciarCicloComAtraso();
}

// ======================================================
// FUNÇÃO DO BOTÃO SAVE
// ======================================================
function detectarIntencaoSalvar(e) {
    if (!isSystemOn) return;
    console.log(">>> Botão SAVE pressionado (GND detectado)!");
    querSalvar = true; 
    digitalWrite(LED1, 1); 
}

// ======================================================
// INICIALIZAÇÃO (BOOT)
// ======================================================
function onInit() {
    // Limpa estados
    digitalWrite(LED1, 0);
    digitalWrite(PIN_TRIG, 0);
    pinMode(LED1, "output");
    pinMode(PIN_TRIG, "output");
    
    // --- CONFIGURAÇÃO DOS BOTÕES ---
    pinMode(PIN_SAVE , "input_pullup"); 
    setWatch(detectarIntencaoSalvar, PIN_SAVE, {
        repeat: true, 
        edge: "falling", 
        debounce: 50
    });

    // Chave LIGAR
    pinMode(PIN_LIGAR, "input_pullup");
    setWatch(gerenciarEstadoChave, PIN_LIGAR, { 
        repeat: true, 
        edge: "both", 
        debounce: 100 
    });

    if (typeof gc === 'function') gc();

    // 💡 ALTERAÇÃO AQUI: FORÇA O INÍCIO IMEDIATO DO PRIMEIRO CICLO SE A CHAVE ESTIVER LIGADA
    let pinoDesligado = digitalRead(PIN_LIGAR);
    if (pinoDesligado === 0) { // 0 = LIGADO
        console.log(">>> Boot: Chave LIGADA. Iniciando primeiro ciclo Imediatamente.");
        iniciarCicloDoZero();
    } else { // 1 = DESLIGADO
        console.log(">>> Boot: Chave DESLIGADA. Permanecendo em STANDBY.");
    }
}

// ======================================================
// FUNÇÃO MESTRE DA CHAVE
// ======================================================
function gerenciarEstadoChave() {
    let pinoDesligado = digitalRead(PIN_LIGAR); // 1 = OFF, 0 = ON

    if (pinoDesligado === 0) {
        // --- LIGAR ---
        if (!isSystemOn) {
            console.log(">>> CHAVE LIGADA. Iniciando...");
            iniciarCicloDoZero();
        }
    } else {
        // --- DESLIGAR ---
        if (isSystemOn) {
            console.log(">>> CHAVE DESLIGADA. Parando...");
            desligarTudoImediatamente();
        }
    }
}

function desligarTudoImediatamente() {
    isSystemOn = false;
    
    // Limpeza de Timers
    if (intervaloMedicao) clearInterval(intervaloMedicao);
    if (timeoutDormir) clearTimeout(timeoutDormir);
    if (timeoutEnvio) clearTimeout(timeoutEnvio);
    if (wifiWatchdog) clearTimeout(wifiWatchdog); // Limpa watchdog se ativo
    intervaloMedicao = undefined;
    wifiWatchdog = undefined;

    // Limpeza Específica do Watch do Sensor
    if (watchEchoID) {
        clearWatch(watchEchoID);
        watchEchoID = null;
    }
    
    // Hardware Off
    digitalWrite(LED1, 0);
    digitalWrite(PIN_TRIG, 0);
    pinMode(PIN_ECHO, "input"); 
    
    // Wifi Off
    if (mqttClient) mqttClient.disconnect();
    mqttClient = null;
    wifiLib.disconnect(); 
    
    // Limpeza Final de Memória
    if (typeof gc === 'function') gc();
    
    console.log(">>> SISTEMA EM STANDBY.");
}

function iniciarCicloDoZero() {
    isSystemOn = true;
    leiturasValidas = [];
    querSalvar = false;
    digitalWrite(LED1, 1); 
    
    // NOVO: Reseta o contador de tentativas
    tentativasWifi = 0; 

    console.log("Resetando conexões...");
    wifiLib.disconnect(); 
    
    // Força limpeza de memória ANTES de tentar conectar
    if (typeof gc === 'function') gc(); 
    
    setTimeout(function() {
        if (!isSystemOn) return; 
        conectarWifi();
    }, 1000);
}

// ======================================================
// CONECTIVIDADE (COM WATCHDOG)
// ======================================================
function conectarWifi() {
    if (!isSystemOn) return;
    
    // 1. Limpa qualquer watchdog antigo
    if (wifiWatchdog) clearTimeout(wifiWatchdog);
    
    // 2. 💡 Inicia o Watchdog
    wifiWatchdog = setTimeout(function() {
        // Se este timer disparar, significa que a conexão travou
        gerenciarFalhaGeral("Tempo limite do Wi-Fi excedido (Watchdog)");
    }, TEMPO_LIMITE_WIFI);

    console.log("Conectando Wifi...");
    
    wifiLib.connect(WIFI_NOME, { password: WIFI_SENHA }, function(err) {
        if (!isSystemOn) return; 
        
        // 3. Cancela o Watchdog (Houve um retorno)
        if (wifiWatchdog) clearTimeout(wifiWatchdog);
        wifiWatchdog = undefined;

        if (err) {
            console.log("Erro no módulo Wifi:", err);
            gerenciarFalhaGeral("Erro no módulo Wi-Fi: " + err);
            return;
        }
        
        // Sucesso! Zera o contador de falhas e segue
        tentativasWifi = 0; 
        conectarMQTT();
    });
}

function conectarMQTT() {
    if (!isSystemOn) return;
    
    try {
        if (mqttClient) mqttClient.disconnect();

        mqttClient = mqttLib.create(MQTT_BROKER, {
            port: MQTT_PORT, username: MQTT_USER, password: MQTT_PASS
        });

        mqttClient.on('connected', function() {
            if (!isSystemOn) { mqttClient.disconnect(); return; }
            console.log("MQTT Conectado. Iniciando leitura...");
            iniciarSensores();
        });

        mqttClient.on('error', function(err) {
            console.log("Erro MQTT", err);
            mqttClient = null;
            // Se cair o MQTT, trata como falha geral
            gerenciarFalhaGeral("Erro no MQTT: " + err);
        });

        mqttClient.connect();
    } catch(e) { console.log("Erro MQTT Lib", e); }
}

// ======================================================
// SENSORES
// ======================================================
function iniciarSensores() {
    if (!isSystemOn) return;
    
    leiturasValidas = []; 
    pinMode(PIN_ECHO, "input");
    
    if (watchEchoID) {
        clearWatch(watchEchoID);
        watchEchoID = null;
    }
    
    watchEchoID = setWatch(processarEcho, PIN_ECHO, { repeat: true, edge: "falling" });

    if (intervaloMedicao) clearInterval(intervaloMedicao);
    
    intervaloMedicao = setInterval(() => {
        if (!isSystemOn) { clearInterval(intervaloMedicao); return; }
        digitalPulse(PIN_TRIG, 1, 0.01);
        if (!querSalvar) digitalWrite(LED1, !digitalRead(LED1));
    }, 250);
}

function processarEcho(e) {
    if (!isSystemOn) return;
    let duracao = e.time - e.lastTime;
    let distancia = 17000 * duracao;
    
    // Filtros
    if (distancia < 1 || distancia > LIMITE_MAXIMO_HARDWARE) {
        console.log(">>> Leitura Ruim (" + distancia.toFixed(0) + "). Reset.");
        leiturasValidas = []; 
        return;
    }

    let ehValido = false;
    if (leiturasValidas.length === 0) {
        ehValido = true;
    } else {
        let ultima = leiturasValidas[leiturasValidas.length - 1];
        let diff = Math.abs(distancia - ultima);
        let porcentagemErro = (diff / ultima) * 100;
        
        if (porcentagemErro < taxaDeErro) ehValido = true;
        else {
            console.log(`>>> Instável (${distancia.toFixed(0)}). Reset.`);
            leiturasValidas = []; 
            return; 
        }
    }

    if (ehValido) {
        leiturasValidas.push(distancia);
        console.log(`L${leiturasValidas.length}: ${distancia.toFixed(1)}`);
    }

    if (leiturasValidas.length >= LEITURAS_META) {
        prepararEnvioEDormir();
    }
}

// ======================================================
// ENVIO E FINALIZAÇÃO
// ======================================================
function prepararEnvioEDormir() {
    if (intervaloMedicao) clearInterval(intervaloMedicao);
    
    if (watchEchoID) {
        clearWatch(watchEchoID);
        watchEchoID = null;
    }
    
    // Limpeza de memória ANTES de alocar a string JSON
    if (typeof gc === 'function') gc(); 
    
    let valorFinal = leiturasValidas[LEITURAS_META - 1];
    let valorFormatado = parseFloat(valorFinal.toFixed(2));

    console.log(">>> Enviando: " + valorFormatado);

    if (mqttClient) {
        let timestamp = Math.floor(Date.now() / 1000); 
        let payload = { val: valorFormatado, ts: timestamp };
        
        mqttClient.publish(`sensor/${ID_IOT}/distancia`, JSON.stringify(payload));
        
        if (querSalvar) {
            console.log("!!! ENVIANDO FLAG SAVE MAX !!!");
            mqttClient.publish(`sensor/${ID_IOT}/maximo_salvo`, String(valorFormatado));
            querSalvar = false; 
        }
    }

    // Tempo de espera segurança de 3 segundos para a transmissão
    timeoutEnvio = setTimeout(cicloConcluido, 3000); 
}

function cicloConcluido() {
    if (!isSystemOn) return; 

    console.log(`Dormindo (Esperando) ${TEMPO_DORMIR_SEGUNDOS}s para o próximo ciclo...`); // 💡 ALTERAÇÃO AQUI

    // Desliga hardware e Wifi AGORA (economia de energia)
    digitalWrite(LED1, 0);
    digitalWrite(PIN_TRIG, 0);
    // 💡 ALTERAÇÃO: Desconecta o MQTT e o WiFi para liberar memória
    if (mqttClient) mqttClient.disconnect();
    mqttClient = null;
    wifiLib.disconnect();
    
    // Limpeza de memória antes de entrar no timeout de sono
    if (typeof gc === 'function') gc(); 
    
    // Define o temporizador para a próxima chamada APÓS o tempo de descanso
    timeoutDormir = setTimeout(function() {
        if (digitalRead(PIN_LIGAR) === 0) {
            console.log(">>> Acordando. Reiniciando Conexão e Leituras..."); // 💡 MENSAGEM AJUSTADA
            iniciarCicloDoZero(); 
        } else {
            console.log(">>> Chave OFF. Fim.");
            desligarTudoImediatamente();
        }
    }, TEMPO_DORMIR_SEGUNDOS * 1000);
}

// Inicia
setTimeout(onInit, 1500);