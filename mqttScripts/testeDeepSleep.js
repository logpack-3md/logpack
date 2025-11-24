
const LED = 25
const TIME_SLEEP = 5

function onInit() {
    // 1. Configura a flag para permitir o Deep Sleep
    let esp32Flags = E.getFlags();
    esp32Flags.deepSleep = 1;
    E.setFlags(esp32Flags);

    pinMode(LED, "output");
    
    console.log(">>> ACORDOU! Iniciando execução...");

    // 2. Seu loop de teste
    for (let i = 0; i < 10; i = i + 1) {
        console.log("---teste execução", {i});
    }

    // 3. Acende o LED
    digitalWrite(LED, 1);

    // 4. Agenda o sono profundo
    setTimeout(function() {
        console.log("---------------Desligando (Indo dormir)...");
        digitalWrite(LED, 0); // É bom apagar o LED antes de dormir
        
        // Conversão para microssegundos e comando de dormir
        ESP32.deepSleep(TIME_SLEEP * 1000000);
        
    }, 5000); // Espera 5 segundos acordado antes de dormir
}


