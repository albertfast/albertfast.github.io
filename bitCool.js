document.getElementById('encodeBtn').addEventListener('click', encodeText);
document.getElementById('decodeBtn').addEventListener('click', decodeText);
document.getElementById('clearTextBtn').addEventListener('click', clearAllFields);
document.getElementById('clearDecimalBtn').addEventListener('click', clearAllFields);

// Function to encode the input text
function encodeText() {
    const inputText = document.getElementById('inputText').value;
    const blocks = inputText.match(/.{1,4}/g); // Create blocks of 4 characters each
    const encodedValues = [];
    
    blocks.forEach(block => {
        const binaryString = textToBinary(block).padEnd(32, '0');
        console.log(`Block: ${block}`);
        console.log(`Binary (before manipulation): ${binaryString}`);

        const decodedRaw = binaryString.match(/.{1,8}/g).reverse().join('');
        console.log(`Decoded Raw (reversed bytes): ${decodedRaw}`);

        const encodedBinary = applyBitManipulation(decodedRaw);
        encodedValues.push(parseInt(encodedBinary, 2));
    });
    
    document.getElementById('encodedValue').textContent = encodedValues.join(', ');
    document.getElementById('inputTextResult').textContent = inputText;
}

// Function to decode the input decimal values
function decodeText() {
    const encodedValues = document.getElementById('inputDecimal').value.split(',').map(Number);
    let decodedText = '';
    
    encodedValues.forEach(value => {
        const encodedBinary = value.toString(2).padStart(32, '0');
        console.log(`Encoded Decimal: ${value}`);
        console.log(`Encoded Binary: ${encodedBinary}`);

        const decodedBinary = reverseBitManipulation(encodedBinary);
        console.log(`Decoded Binary (before reversing bytes): ${decodedBinary}`);

        const decodedRaw = decodedBinary.match(/.{1,8}/g).reverse().join('');
        console.log(`Decoded Raw (after reversing bytes): ${decodedRaw}`);

        decodedText += decodedRaw.match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
    });
    
    decodedText = decodedText.replace(/\0/g, ''); // Remove any null characters
    document.getElementById('decodedText').textContent = decodedText;
}

// Function to clear all input and output fields
function clearAllFields() {
    const targetId = this.id; // Get the ID of the clicked button

    if (targetId === 'clearTextBtn') {
        document.getElementById('inputText').value = '';
        document.getElementById('inputTextResult').textContent = '';
        document.getElementById('encodedValue').textContent = '';
    } else if (targetId === 'clearDecimalBtn') {
        document.getElementById('inputDecimal').value = '';
        document.getElementById('decodedText').textContent = '';
    }
}

// Function to convert text to a binary string
function textToBinary(text) {
    const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');  // Convert each character to binary
    console.log(`Text to Binary Conversion: '${text}' -> '${binary}'`);
    return binary;
}

// Function to apply bit manipulation to the binary string
function applyBitManipulation(binaryString) {
    if (binaryString.length !== 32) {
        throw new Error("Binary string must be exactly 32 bits long.");
    }

    const manipulatedBits = new Array(32);
    const bitMap = [0, 8, 16, 24, 1, 9, 17, 25, 2, 10, 18, 26, 3, 11, 19, 27, 4, 12, 20, 28, 5, 13, 21, 29, 6, 14, 22, 30, 7, 15, 23, 31];

    console.log(`BitMap: ${bitMap}`);

    // Apply the bit manipulation using the bit map
    bitMap.forEach((bitIndex, i) => {
        manipulatedBits[i] = binaryString[bitIndex];
        console.log(`Mapping bit ${bitIndex} from original position to ${i} -> ${binaryString[bitIndex]}`);
    });

    const encodedBinary = manipulatedBits.join('');
    console.log(`After Bit Manipulation: ${encodedBinary}`);
    return encodedBinary;
}

// Function to reverse the bit manipulation
function reverseBitManipulation(encodedBinary) {
    if (encodedBinary.length !== 32) {
        throw new Error("Binary string must be exactly 32 bits long.");
    }

    const reversedBits = new Array(32);
    const bitMap = [0, 8, 16, 24, 1, 9, 17, 25, 2, 10, 18, 26, 3, 11, 19, 27, 4, 12, 20, 28, 5, 13, 21, 29, 6, 14, 22, 30, 7, 15, 23, 31];

    console.log(`BitMap for Reverse: ${bitMap}`);

    // Reverse the bit manipulation using the bit map
    bitMap.forEach((bitIndex, i) => {
        reversedBits[bitIndex] = encodedBinary[i];
        console.log(`Reversing bit ${i} from manipulated position to ${bitIndex} -> ${encodedBinary[i]}`);
    });

    const decodedBinary = reversedBits.join('');
    console.log(`After Reversing Bit Manipulation: ${decodedBinary}`);
    return decodedBinary;
}
