document.getElementById('encodeBtn2').addEventListener('click', encodeText2);
document.getElementById('decodeBtn2').addEventListener('click', decodeText2);

function encodeText2() {
    const inputText2 = document.getElementById('inputText2').value;
    const blocks = inputText2.match(/.{1,4}/g); // Create blocks of 4 characters each
    const encodedValues2 = [];
    
    blocks.forEach(block => {
        const binaryString = textToBinary(block).padEnd(32, '0');
        const decodedRaw = binaryString.match(/.{1,8}/g).reverse().join('');
        const encodedBinary = applyBitManipulation(decodedRaw);
        encodedValues2.push(parseInt(encodedBinary, 2));
    });
    
    document.getElementById('encodedValues2').textContent = encodedValues2.join(', ');
    document.getElementById('inputTextResult2').textContent = inputText2;
}

function decodeText2() {
    const encodedValues2 = document.getElementById('inputDecimal2').value.split(',').map(Number);
    let decodedText2 = '';
    
    encodedValues2.forEach(value => {
        const encodedBinary = value.toString(2).padStart(32, '0');
        const decodedBinary = reverseBitManipulation(encodedBinary);
        const decodedRaw = decodedBinary.match(/.{1,8}/g).reverse().join('');
        decodedText2 += decodedRaw.match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
    });
    
    decodedText2 = decodedText2.replace(/\0/g, ''); // Remove any null characters
    document.getElementById('decodedText2').textContent = decodedText2;
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
