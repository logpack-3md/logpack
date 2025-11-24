// 1. Limpa tudo para não ter interferência
clearInterval();
clearWatch();
if (typeof wifiLib !== 'undefined') wifiLib.disconnect();

console.log(">>> MODO DE TESTE DE BOTÃO INICIADO <<<");
console.log(">>> Aperte o botão no pino 27 agora...");

// 2. Configura exatamente como no seu código principal
pinMode(27, "input_pulldown"); // Espera 3.3V
pinMode(25, "output"); // LED1

// 3. Monitora
setWatch(function(e) {
  console.log(">>> SINAL RECEBIDO! Estado: " + e.state);
  console.log(">>> Tensão detectada no pino!");
  // Pisca o LED1
  digitalWrite(25, 1);
  setTimeout(() => digitalWrite(25, 0), 200);
}, 27, { repeat:true, edge:"rising", debounce:50 });

// 4. Leitura direta do estado atual (para ver se não está travado)
console.log("Estado inicial do pino 27: " + digitalRead(27));