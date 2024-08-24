// Import or define the encodeText and decodeText functions here
function test(name, fn) {
    try {
        fn();
        console.log(`✔️  ${name}`);
    } catch (error) {
        console.error(`❌  ${name}`);
        console.error(error);
    }
}

test('should encode and decode "tacocat" correctly', function() {
    const input = "tacocat";
    const encoded = encodeText(input);  // Using encodeText function
    const decoded = decodeText(encoded);  // Using decodeText function
    expect(decoded).toEqual(input);
});

test('should encode and decode an empty string correctly', function() {
    const input = "";
    const encoded = encodeText(input);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(input);
});

test('should encode and decode a string with special characters correctly', function() {
    const input = "!@#$%^&*()_+";
    const encoded = encodeText(input);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(input);
});

test('should encode and decode a string with numbers correctly', function() {
    const input = "1234567890";
    const encoded = encodeText(input);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(input);
});

test('should encode and decode a string with mixed case correctly', function() {
    const input = "AbCdEfGhIjK";
    const encoded = encodeText(input);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(input);
});

test('should encode and decode a palindrome string correctly', function() {
    const input = "madam";
    const encoded = encodeText(input);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(input);
});

test('should encode and decode a long string correctly', function() {
    const input = "This is a longer string to test the encoding and decoding functions over larger inputs.";
    const encoded = encodeText(input);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(input);
});

test('should encode and decode a string with spaces correctly', function() {
    const input = "This is a string with spaces";
    const encoded = encodeText(input);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(input);
});

test('should encode and decode a string with newline characters correctly', function() {
    const input = "This is a string\nwith newline\ncharacters.";
    const encoded = encodeText(input);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(input);
});

test('should encode and decode a string with tabs correctly', function() {
    const input = "This\tis\ta\tstring\twith\ttabs.";
    const encoded = encodeText(input);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(input);
});

test('should encode and decode a string with unicode characters correctly', function() {
    const input = "𝔘𝔫𝔦𝔠𝔬𝔡𝔢";
    const encoded = encodeText(input);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(input);
});


function expect(result) {
    return {
        toEqual(expected) {
            if (result !== expected) {
                throw new Error(`Expected ${expected}, but got ${result}`);
            }
        }
    };
}

function debugTest() {
    // Ask the user to select the input type: String (S) or Integer (I)
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Choose input type: S (String) or I (Integer): ", function(inputType) {
        inputType = inputType.toUpperCase();

        if (inputType === "S") {
            rl.question("Enter the text you want to encode: ", function(inputText) {
                console.log("Input String:", inputText);
                const encodedValues = encodeText(inputText);
                console.log("Encoded Values (Decimal):", encodedValues.join(', '));
                rl.close();
            });
        } else if (inputType === "I") {
            rl.question("Enter the encoded decimal values (comma-separated): ", function(inputDecimals) {
                console.log("Input Decimal:", inputDecimals);
                const decodedText = decodeText(inputDecimals.split(',').map(Number));
                console.log("Decoded Text:", decodedText);
                rl.close();
            });
        } else {
            console.log("Invalid input. Please enter 'S' or 'I'.");
            rl.close();
        }
    });
}

// Define your encoding/decoding functions here (without DOM interactions)

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
        console.log(`Encoded Value: ${encodedValue}`);
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
        console.log(`Decoded Binary: ${decodedBinary}`);
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

// Include the bit manipulation functions (applyBitManipulation, reverseBitManipulation) here

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

// Start the debugging process
debugTest();
