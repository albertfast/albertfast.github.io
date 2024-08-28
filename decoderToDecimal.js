document.getElementById('encodeBtn1').addEventListener('click', encodeText1);
document.getElementById('clearTextBtn1').addEventListener('click', clearText1);

function encodeText1() {
    const inputText1 = document.getElementById('inputText1').value;
    const blocks = inputText1.match(/.{1,4}/g); // Create blocks of 4 characters each
    const encodedValues1 = [];
    
    blocks.forEach(block => {
        const binaryString1 = textToBinary(block).padEnd(32, '0');
        const decodedRaw1 = binaryString1.match(/.{1,8}/g).reverse().join('');
        const encodedBinary1 = applyBitManipulation(decodedRaw1);
        encodedValues1.push(parseInt(encodedBinary1, 2));
    });
    
    document.getElementById('binaryString1').textContent = blocks.map(block => textToBinary(block).padEnd(32, '0')).join(' ');
    document.getElementById('decodedRaw1').textContent = blocks.map(block => textToBinary(block).padEnd(32, '0').match(/.{1,8}/g).reverse().join('')).join(' ');
    document.getElementById('encodedValue1').textContent = encodedValues1.join(', ');
    document.getElementById('encodedBinary1').textContent = encodedValues1.map(value => value.toString(2).padStart(32, '0')).join(' ');
}

function decodeText1() {
    const encodedValues1 = document.getElementById('encodedValue1').textContent.split(',').map(Number);
    let decodedText1 = '';
    
    encodedValues1.forEach(value => {
        const encodedBinary1 = value.toString(2).padStart(32, '0');
        const decodedBinary = reverseBitManipulation(encodedBinary1);
        const decodedRaw1 = decodedBinary.match(/.{1,8}/g).reverse().join('');
        decodedText1 += decodedRaw1.match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
    });
    
    decodedText1 = decodedText1.replace(/\0/g, ''); // Remove any null characters
    document.getElementById('decodedText1').textContent = decodedText1;
}

function clearText1() {
    document.getElementById('inputText1').value = '';
    document.getElementById('binaryString1').textContent = '';
    document.getElementById('decodedRaw1').textContent = '';
    document.getElementById('encodedValue1').textContent = '';
    document.getElementById('encodedBinary1').textContent = '';
    document.getElementById('decodedText1').textContent = '';
}

function textToBinary(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
}

function applyBitManipulation(binaryString) {
    const bitMap = [0, 8, 16, 24, 1, 9, 17, 25, 2, 10, 18, 26, 3, 11, 19, 27, 4, 12, 20, 28, 5, 13, 21, 29, 6, 14, 22, 30, 7, 15, 23, 31];
    const manipulatedBits = bitMap.map(bitIndex => binaryString[bitIndex]);
    return manipulatedBits.join('');
}

function reverseBitManipulation(encodedBinary) {
    const bitMap = [0, 8, 16, 24, 1, 9, 17, 25, 2, 10, 18, 26, 3, 11, 19, 27, 4, 12, 20, 28, 5, 13, 21, 29, 6, 14, 22, 30, 7, 15, 23, 31];
    const reversedBits = bitMap.map((bitIndex, i) => encodedBinary[bitIndex]);
    return reversedBits.join('');
}
