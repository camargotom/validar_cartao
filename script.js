/* script.js */

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
        'Visa': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
        'MasterCard': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
        'American Express': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg',
        'Discover': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg',
        'Diners Club': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Diners_Club_Logo3.svg',
        'JCB': 'https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg',
        'Elo': 'https://upload.wikimedia.org/wikipedia/commons/d/da/Elo_card_association_logo_-_black_text.svg'
    };

    function luhnCheck(numStr) {
        if (!/^\d+$/.test(numStr)) {
            return false;
        }

        let sum = 0;
        let shouldDouble = false;
        for (let i = numStr.length - 1; i >= 0; i--) {
            let digit = parseInt(numStr.charAt(i));

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
    }

    const validateBtn = document.getElementById('validateBtn');
    const cardNumberInput = document.getElementById('cardNumber');
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    const cardLogoImg = document.getElementById('cardLogo');

    validateBtn.addEventListener('click', function () {
        const cardNumber = cardNumberInput.value.replace(/[\s-]/g, '');

        resultDiv.style.display = 'none';
        cardLogoImg.style.display = 'none';

        if (cardNumber.length === 0) {
            resultText.textContent = 'Por favor, digite o número do cartão.';
            resultDiv.className = 'error';
            resultDiv.style.display = 'flex';
            return;
        }
        if (!/^\d+$/.test(cardNumber)) {
            resultText.textContent = 'Inválido: O número deve conter apenas dígitos.';
            resultDiv.className = 'error';
            resultDiv.style.display = 'flex';
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
                resultText.textContent = `Bandeira: ${identifiedBrand} (Número Válido)`;
                resultDiv.className = 'success';
            } else {
                resultText.textContent = `Bandeira: ${identifiedBrand} (Número Inválido)`;
                resultDiv.className = 'error';
            }

            if (cardLogos[identifiedBrand]) {
                cardLogoImg.src = cardLogos[identifiedBrand];
                cardLogoImg.style.display = 'inline-block';
            }
        } else {
            resultText.textContent = 'Inválido ou Bandeira desconhecida.';
            if (cardNumber.length < 13 || cardNumber.length > 19) {
                resultText.textContent += ' Comprimento incorreto.';
            }
            resultDiv.className = 'error';
        }
        resultDiv.style.display = 'flex';
    });
});