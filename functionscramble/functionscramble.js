document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('encodeBtn').addEventListener('click', encodeText);
    document.getElementById('decodeBtn').addEventListener('click', decodeText);
    document.getElementById('clearTextBtn').addEventListener('click', clearAllFields);
    document.getElementById('clearDecimalBtn').addEventListener('click', clearAllFields);

    // Scramble map based on the provided matrix
    // This map takes each character from the input text and replaces it with another character.
    // We will log how each character is mapped for debugging purposes.
    const scrambleMap = {
        'X': 'X', 'W': 'P', 'V': 'F', 'U': '7', 'T': 'W', 'S': 'N', 'R': 'E', 'Q': '6',
        'P': 'V', 'N': 'M', 'M': 'D', 'L': '5', 'K': 'U', 'J': 'L', 'H': 'C', 'G': '4',
        'F': 'T', 'E': 'K', 'D': 'B', 'C': '3', 'B': 'S', 'A': 'J', '9': 'A', '8': '2',
        '7': 'R', '6': 'H', '5': '9', '4': '1', '3': 'Q', '2': 'G', '1': '8', '0': '0'
    };

    // Reverse scramble map for decoding
    const reverseScrambleMap = Object.fromEntries(Object.entries(scrambleMap).map(([key, value]) => [value, key]));

    // Function to apply scramble (encode) mapping
    function scrambleText(inputText) {
        console.log("Original Text:", inputText); // Log the original text
        let scrambledResult = inputText.split('').map(char => {
            console.log(`Mapping '${char}' to '${scrambleMap[char] || char}'`); // Log each mapping
            return scrambleMap[char] || char;
        }).join('');
        console.log("Scrambled Result:", scrambledResult); // Log the final scrambled result
        return scrambledResult;
    }

    // Function to reverse scramble (decode) mapping
    function descrambleText(inputText) {
        console.log("Scrambled Text to Decode:", inputText); // Log the scrambled text
        let descrambledResult = inputText.split('').map(char => {
            console.log(`Reversing '${char}' to '${reverseScrambleMap[char] || char}'`); // Log the reverse mapping
            return reverseScrambleMap[char] || char;
        }).join('');
        console.log("Descrambled Result:", descrambledResult); // Log the final descrambled result
        return descrambledResult;
    }

    // Function to encode the input text
    function encodeText() {
        const inputText = document.getElementById('inputText').value;

        // Step 1: Apply scramble encoding
        const scrambledText = scrambleText(inputText);
        document.getElementById('scrambledText').textContent = scrambledText;
        
        // Step 2: Apply bit manipulation after scramble encoding
        const blocks = scrambledText.match(/.{1,4}/g); // Split into 4-char blocks
        console.log("Scrambled Text Blocks:", blocks); // Log blocks of scrambled text
        const encodedValues = [];
        
        blocks.forEach(block => {
            const binaryString = textToBinary(block).padEnd(32, '0'); // Convert to binary
            console.log(`Block '${block}' to Binary:`, binaryString);
            const decodedRaw = binaryString.match(/.{1,8}/g).reverse().join(''); // Reverse the binary string
            const encodedBinary = applyBitManipulation(decodedRaw);
            console.log("Encoded Binary:", encodedBinary);
            const encodedValue = parseInt(encodedBinary, 2); // Convert to decimal
            encodedValues.push(encodedValue);
        });

        console.log("Encoded Decimal Values:", encodedValues.join(', ')); // Log encoded values
        document.getElementById('encodedValue').textContent = encodedValues.join(', ');
    }

    // Function to decode the input scrambled text
    function decodeText() {
        const encodedValues = document.getElementById('inputDecimal').value.split(',').map(Number);
        let decodedText = '';
        
        encodedValues.forEach(value => {
            const encodedBinary = value.toString(2).padStart(32, '0');
            console.log(`Encoded Decimal '${value}' to Binary:`, encodedBinary); // Log the conversion of encoded value to binary
            const decodedBinary = reverseBitManipulation(encodedBinary);
            console.log("Reversed Binary:", decodedBinary);
            const decodedRaw = decodedBinary.match(/.{1,8}/g).reverse().join('');
            decodedText += decodedRaw.match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
        });
        
        decodedText = decodedText.replace(/\0/g, ''); // Remove null characters
        console.log("Decoded Text before Scramble Reversal:", decodedText);
        const descrambledText = descrambleText(decodedText);
        document.getElementById('decodedText').textContent = descrambledText;
        console.log("Final Decoded Text:", descrambledText);
    }

    // Function to clear all input and output fields
    function clearAllFields() {
        const targetId = this.id;

        if (targetId === 'clearTextBtn') {
            document.getElementById('inputText').value = ''; // Clear input text field
            document.getElementById('inputTextResult').textContent = ''; // Clear text result
            document.getElementById('encodedValue').textContent = ''; // Clear encoded value
            document.getElementById('scrambledText').textContent = ''; // Clear scrambled text
        } else if (targetId === 'clearDecimalBtn') {
            document.getElementById('inputDecimal').value = ''; // Clear decimal input field
            document.getElementById('decodedText').textContent = ''; // Clear decoded text
        }
    }

    // Function to convert text to a binary string
    function textToBinary(text) {
        const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
        console.log("Text to Binary:", binary); // Log the binary conversion
        return binary;
    }

    // Function to apply bit manipulation to the binary string
    function applyBitManipulation(binaryString) {
        if (binaryString.length !== 32) {
            throw new Error("Binary string must be exactly 32 bits long.");
        }

        const manipulatedBits = new Array(32);
        const bitMap = [0, 8, 16, 24, 1, 9, 17, 25, 2, 10, 18, 26, 3, 11, 19, 27, 4, 12, 20, 28, 5, 13, 21, 29, 6, 14, 22, 30, 7, 15, 23, 31];

        // Apply bit manipulation using the bit map
        bitMap.forEach((bitIndex, i) => {
            manipulatedBits[i] = binaryString[bitIndex];
        });

        const manipulatedBinary = manipulatedBits.join('');
        console.log("Manipulated Binary:", manipulatedBinary); // Log the manipulated binary
        return manipulatedBinary;
    }

    // Function to reverse the bit manipulation
    function reverseBitManipulation(encodedBinary) {
        if (encodedBinary.length !== 32) {
            throw new Error("Binary string must be exactly 32 bits long.");
        }

        const reversedBits = new Array(32);
        const bitMap = [0, 8, 16, 24, 1, 9, 17, 25, 2, 10, 18, 26, 3, 11, 19, 27, 4, 12, 20, 28, 5, 13, 21, 29, 6, 14, 22, 30, 7, 15, 23, 31];

        bitMap.forEach((bitIndex, i) => {
            reversedBits[bitIndex] = encodedBinary[i];
        });

        const reversedBinary = reversedBits.join('');
        console.log("Reversed Binary (Post-Decoding):", reversedBinary); // Log the reversed binary
        return reversedBinary;
    }
});
