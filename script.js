// Espera a página carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', function () {

    const cardRegex = {
        'Elo': '^(?:40117[89]|431274|438935|451416|457393|45763[12]|504175|506699|5067[0-6]\\d|50677[0-8]|509\\d{3}|627780|636297|636368|65003[1-3]|65003[5-9]|65004\\d|65005[0-1]|6504[0-3]\\d|65048[5-9]|65049\\d|6505[0-2]\\d|65053[0-8]|65054[1-9]|6505[5-9]\\d|65070\\d|65071[0-8]|65072[0-7]|6509[0-6]\\d|65097[0-8]|65165[2-9]|6516[6-7]\\d|65500\\d|65501\\d|65502[1-9]|6550[3-4]\\d|65505[0-8])\\d{10,13}$',
        'Hipercard': '^(?:606282|384100|384140|384160)\\d{10}(?:\\d{3})?$',
        'Aura': '^50\\d{14,17}$',
        'Diners Club': '^3(?:0[0-59]|[689]\\d)\\d{11,16}$',
        'JCB': '^35(?:2[89]|[3-8]\\d)\\d{12,15}$',
        'Discover': '^6(?:011|5\\d{2}|4[4-9]\\d|22(12[6-9]|1[3-9]\\d|[2-8]\\d{2}|9[01]\\d|92[0-5]))\\d{10,13}$',
        'American Express': '^3[47]\\d{13}$',
        'MasterCard': '^((5[1-5]\\d{2})|(222[1-9]|22[3-9]\\d|2[3-6]\\d{2}|27[01]\\d|2720))\\d{12}$',
        'Visa': '^4\\d{12}(?:\\d{3}|\\d{6})?$'
    };

    const cardLogos = {
        'Visa': 'images/visa.png',
        'MasterCard': 'images/mastercard.png',
        'American Express': 'images/american-express.png',
        'Discover': 'images/discover.png',
        'Diners Club': 'images/diners-club.png',
        'JCB': 'images/jcb.png',
        'Elo': 'images/elo.png',
        'Aura': 'images/aura.png',
        'Hipercard': 'images/hipercard.png'
    };
    
    // O algoritmo de Luhn 
    function luhnCheck(numStr) {
        if (!/^\d+$/.test(numStr)) return false;
        let sum = 0;
        let shouldDouble = false;
        for (let i = numStr.length - 1; i >= 0; i--) {
            let digit = parseInt(numStr.charAt(i));
            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
    }

    // Obtendo referências aos elementos da interface
    const cardNumberInput = document.getElementById('cardNumber');
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    const cardLogoImg = document.getElementById('cardLogo');

    // Função que encapsula a lógica de validação e identificação
    function validateAndIdentifyCard() {
        const cardNumber = cardNumberInput.value.replace(/[\s-]/g, '');

        if (cardNumber.length < 4) {
            resultDiv.style.display = 'none';
            cardLogoImg.style.display = 'none';
            return;
        }

        if (!/^\d+$/.test(cardNumber)) {
            resultText.textContent = 'Apenas números são permitidos.';
            resultDiv.className = 'error';
            resultDiv.style.display = 'flex';
            cardLogoImg.style.display = 'none';
            return;
        }

        let identifiedBrand = null;
        for (const brand in cardRegex) {
            const regex = new RegExp(cardRegex[brand]);
            if (regex.test(cardNumber)) {
                identifiedBrand = brand;
                break;
            }
        }

        if (identifiedBrand) {
            const isValidLuhn = luhnCheck(cardNumber);
            
            if (isValidLuhn) {
                resultText.textContent = `Bandeira: ${identifiedBrand} (Válido)`;
                resultDiv.className = 'success';
            } else {
                resultText.textContent = `Bandeira: ${identifiedBrand} (Inválido)`;
                resultDiv.className = 'error';
            }
            
            if (cardLogos[identifiedBrand]) {
                cardLogoImg.src = cardLogos[identifiedBrand];
                cardLogoImg.style.display = 'inline-block';
            }
        } else {
            resultText.textContent = 'Bandeira desconhecida.';
            resultDiv.className = 'error';
            cardLogoImg.style.display = 'none';
        }

        resultDiv.style.display = 'flex';
    }

    // O listener 
    cardNumberInput.addEventListener('input', validateAndIdentifyCard);
});