document.getElementById('encodeBtn').addEventListener('click', encodeText);
document.getElementById('decodeBtn').addEventListener('click', decodeText);

function encodeText() {
    const inputText = document.getElementById('inputText').value;
    const blocks = inputText.match(/.{1,4}/g); // Create blocks of 4 characters each
    const encodedValues = [];
    
    blocks.forEach(block => {
        const binaryString = textToBinary(block).padEnd(32, '0');
        document.getElementById('binaryString').textContent = binaryString;
    
        // Calculate Decoded/Raw by reversing the order of bytes
        const decodedRaw = binaryString.match(/.{1,8}/g).reverse().join('');
        document.getElementById('decodedRaw').textContent = decodedRaw;
    
        const encodedBinary = applyBitManipulation(decodedRaw);
        document.getElementById('encodedBinary').textContent = encodedBinary;
    
        encodedValues.push(parseInt(encodedBinary, 2));
    });
    
    document.getElementById('encodedValue').textContent = encodedValues.join(', ');
}

function decodeText() {
    const encodedValues = document.getElementById('encodedValue').textContent.split(',').map(Number);
    let decodedText = '';
    
    encodedValues.forEach(value => {
        // Convert each encoded integer back to a 32-bit binary string
        const encodedBinary = value.toString(2).padStart(32, '0');
    
        // Reverse the bit manipulation to get the original binary string
        const decodedBinary = reverseBitManipulation(encodedBinary);
    
        // Convert the binary string back to the original text
        const decodedRaw = decodedBinary.match(/.{1,8}/g).reverse().join('');
        decodedText += decodedRaw.match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
    });
    
    document.getElementById('decodedText').textContent = decodedText;
}

function textToBinary(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
}

function applyBitManipulation(binaryString) {
    if (binaryString.length !== 32) {
        throw new Error("Binary string must be exactly 32 bits long.");
    }

    const manipulatedBits = new Array(32);
    const bitMap = [
        0, 8, 16, 24,    
        1, 9, 17, 25,    
        2, 10, 18, 26,   
        3, 11, 19, 27,   
        4, 12, 20, 28,   
        5, 13, 21, 29,   
        6, 14, 22, 30,   
        7, 15, 23, 31    
    ];

    bitMap.forEach((bitIndex, i) => {
        manipulatedBits[i] = binaryString[bitIndex];
    });

    return manipulatedBits.join('');
}

function reverseBitManipulation(encodedBinary) {
    if (encodedBinary.length !== 32) {
        throw new Error("Binary string must be exactly 32 bits long.");
    }

    const reversedBits = new Array(32);
    const bitMap = [
        0, 8, 16, 24,    
        1, 9, 17, 25,    
        2, 10, 18, 26,   
        3, 11, 19, 27,   
        4, 12, 20, 28,   
        5, 13, 21, 29,   
        6, 14, 22, 30,   
        7, 15, 23, 31    
    ];

    bitMap.forEach((bitIndex, i) => {
        reversedBits[bitIndex] = encodedBinary[i];
    });

    return reversedBits.join('');
}
