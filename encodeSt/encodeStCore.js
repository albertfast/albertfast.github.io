function textToBinary(text) {
    return text.split('').map(char => {
        const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
        console.log(`Input: ${char} ASCII: 0x${char.charCodeAt(0).toString(16).toUpperCase()} Binary: ${binary}`);
        return binary;
    }).join('');
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

    const encodedBinary = manipulatedBits.join('');
    console.log(`Encoded Binary: ${encodedBinary}`);
    return encodedBinary;
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

    const decodedBinary = reversedBits.join('');
    console.log(`Decoded Binary: ${decodedBinary}`);
    return decodedBinary;
}

function encodeText(inputText) {
    const blocks = inputText.match(/.{1,4}/g); // Create blocks of 4 characters each
    const encodedValues = [];

    blocks.forEach(block => {
        const binaryString = textToBinary(block).padEnd(32, '0');
        console.log(`Binary String: ${binaryString}`);
        const decodedRaw = binaryString.match(/.{1,8}/g).reverse().join('');
        console.log(`Decoded/Raw: ${decodedRaw}`);
        const encodedBinary = applyBitManipulation(decodedRaw);
        const encodedValue = parseInt(encodedBinary, 2);
        console.log(`Output (dec): ${encodedValue}`);
        encodedValues.push(encodedValue);
    });

    return encodedValues;
}

function decodeText(encodedValues) {
    let decodedText = '';

    encodedValues.forEach(value => {
        const encodedBinary = value.toString(2).padStart(32, '0');
        console.log(`Encoded Binary: ${encodedBinary}`);
        const decodedBinary = reverseBitManipulation(encodedBinary);
        const decodedRaw = decodedBinary.match(/.{1,8}/g).reverse().join('');
        console.log(`Decoded/Raw: ${decodedRaw}`);

        decodedText += decodedRaw.match(/.{1,8}/g).map(byte => {
            const charCode = parseInt(byte, 2);
            const char = String.fromCharCode(charCode);
            console.log(`Output: ${char} ASCII: 0x${charCode.toString(16).toUpperCase()}`);
            return charCode ? char : ''; // Avoid adding null characters
        }).join('');
    });

    return decodedText;
}
