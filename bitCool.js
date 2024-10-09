document.addEventListener("DOMContentLoaded", function () {
    const buttonActions = {
        'encodeBtn': encodeText,
        'decodeBtn': decodeText,
        'clearTextBtn': () => clearFields('inputText', 'encodedValue', 'inputTextResult'),
        'clearDecimalBtn': () => clearFields('inputDecimal', 'decodedText'),
        'scrambleBtn': () => scrambleText('inputText', 'scrambledText'),
        'descrambleBtn': () => descrambleText('scrambledText', 'descrambledText')
    };

    Object.keys(buttonActions).forEach(id => {
        document.getElementById(id).addEventListener('click', buttonActions[id]);
    });

    function encodeText() {
        const inputText = document.getElementById('inputText').value;
        const encodedValues = inputText.match(/.{1,4}/g).map(block => {
            const binary = textToBinary(block).padEnd(32, '0').match(/.{1,8}/g).reverse().join('');
            const manipulatedBinary = applyBitManipulation(binary);
            return parseInt(manipulatedBinary, 2);
        });
        updateDisplay('encodedValue', encodedValues.join(', '), 'inputTextResult', inputText);
    }

    function decodeText() {
        const encodedValues = document.getElementById('inputDecimal').value.split(',').map(Number);
        let decodedText = encodedValues.map(value => {
            const binary = value.toString(2).padStart(32, '0');
            const reversedBinary = reverseBitManipulation(binary);
            const decodedRaw = reversedBinary.match(/.{1,8}/g).reverse().join('');
            return binaryToText(decodedRaw);
        }).join('').replace(/\0/g, '');
        updateDisplay('decodedText', decodedText);
    }

    function clearFields(inputId, displayId, extraDisplayId = '') {
        document.getElementById(inputId).value = '';
        updateDisplay(displayId, '', extraDisplayId);
        ['scrambledText', 'descrambledText'].forEach(id => document.getElementById(id).textContent = '');
    }

    function updateDisplay(fieldId, fieldValue, optionalId = '', optionalValue = '') {
        document.getElementById(fieldId).textContent = fieldValue;
        if (optionalId) document.getElementById(optionalId).textContent = optionalValue;
    }

    const textToBinary = text => text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    const binaryToText = binary => binary.match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join('');

    const bitMap = [0, 8, 16, 24, 1, 9, 17, 25, 2, 10, 18, 26, 3, 11, 19, 27, 4, 12, 20, 28, 5, 13, 21, 29, 6, 14, 22, 30, 7, 15, 23, 31];
    const applyBitManipulation = binary => bitMap.map(i => binary[i]).join('');
    const reverseBitManipulation = encodedBinary => {
        const decodedBinary = new Array(32);
        bitMap.forEach((pos, i) => decodedBinary[pos] = encodedBinary[i]);
        return decodedBinary.join('');
    };

    const scrambleMap = {
        'X': 'X', 'W': 'P', 'V': 'F', 'U': '7', 'T': 'W', 'S': 'N', 'R': 'E', 'Q': '6',
        'P': 'V', 'N': 'M', 'M': 'D', 'L': '5', 'K': 'U', 'J': 'L', 'H': 'C', 'G': '4',
        'F': 'T', 'E': 'K', 'D': 'B', 'C': '3', 'B': 'S', 'A': 'J', '9': 'A', '8': '2',
        '7': 'R', '6': 'H', '5': '9', '4': '1', '3': 'Q', '2': 'G', '1': '8', '0': '0'
    };
    const reverseScrambleMap = Object.fromEntries(Object.entries(scrambleMap).map(([key, value]) => [value, key]));

    function scrambleText(inputId, displayId) {
        const scrambledResult = document.getElementById(inputId).value.split('').map(char => scrambleMap[char] || char).join('');
        document.getElementById(displayId).textContent = scrambledResult;
    }

    function descrambleText(inputId, displayId) {
        const descrambledResult = document.getElementById(inputId).textContent.split('').map(char => reverseScrambleMap[char] || char).join('');
        document.getElementById(displayId).textContent = descrambledResult;
    }
});
