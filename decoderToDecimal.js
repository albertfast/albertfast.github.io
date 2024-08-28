let inputText1 = '';
let binaryString1 = '';
let decodedRaw1 = '';
let encodedValue1 = [];
let encodedBinary1 = '';
let decodedText1 = '';

function handleInputChange1(event) {
    inputText1 = event.target.value;
}

function textToBinary(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
}

function applyBitManipulation(binaryString1) {
    if (binaryString1.length !== 32) {
        throw new Error("Binary string must be exactly 32 bits long.");
    }

    const manipulatedBits = new Array(32);
    const bitMap = [
        0, 8, 16, 24,    // Rearrange the first byte to the beginning
        1, 9, 17, 25,    
        2, 10, 18, 26,   
        3, 11, 19, 27,   
        4, 12, 20, 28,   
        5, 13, 21, 29,   
        6, 14, 22, 30,   
        7, 15, 23, 31    
    ];

    bitMap.forEach((bitIndex, i) => {
        manipulatedBits[i] = binaryString1[bitIndex];
    });

    return manipulatedBits.join('');
}

function reverseBitManipulation(encodedBinary1) {
    if (encodedBinary1.length !== 32) {
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
        reversedBits[bitIndex] = encodedBinary1[i];
    });

    return reversedBits.join('');
}

function encodeText1() {
    const blocks = inputText1.match(/.{1,4}/g); // Create blocks of 4 characters
    const encodedValues = [];

    blocks.forEach(block => {
        const binaryString1 = textToBinary(block).padEnd(32, '0');
        document.getElementById('binaryString1').textContent = binaryString1;

        const decodedRaw1 = binaryString1.match(/.{1,8}/g).reverse().join('');
        document.getElementById('decodedRaw1').textContent = decodedRaw1;

        const encodedBinary1 = applyBitManipulation(decodedRaw1);
        document.getElementById('encodedBinary1').textContent = encodedBinary1;

        encodedValues.push(parseInt(encodedBinary1, 2));
    });

    encodedValue1 = encodedValues;
    document.getElementById('encodedValue1').textContent = encodedValues.join(', ');
}

function decodeText1() {
    let decodedTextResult = '';

    encodedValue1.forEach(value => {
        const encodedBinary1 = value.toString(2).padStart(32, '0');
        const decodedBinary = reverseBitManipulation(encodedBinary1);
        const decodedRaw1 = decodedBinary.match(/.{1,8}/g).reverse().join('');
        decodedTextResult += decodedRaw1.match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
    });

    decodedText1 = decodedTextResult;
    document.getElementById('decodedText1').textContent = decodedText1;
    console.log('Decoded Text:', decodedText1);
}
