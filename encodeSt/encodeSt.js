import { encode, decode } from './encodeStCore.js';

document.getElementById('encodeBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value.trim();
    if (!isNumericList(inputText)) {
        const encodedValues = encode(inputText);
        document.getElementById('encodedValue').textContent = encodedValues.join(', ');
        document.getElementById('decodedText').textContent = ''; // Clear the previous decoded text
    } else {
        alert("Input seems to be encoded values. Please use the 'Decode' button.");
    }
});

document.getElementById('decodeBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value.trim();
    if (isNumericList(inputText)) {
        const encodedValues = inputText.split(',').map(Number);
        const decodedText = decode(encodedValues);
        document.getElementById('decodedText').textContent = decodedText;
        document.getElementById('encodedValue').textContent = ''; // Clear the previous encoded value
    } else {
        alert("Input seems to be plain text. Please use the 'Encode' button.");
    }
});

function isNumericList(text) {
    return /^(\d+,?\s*)+$/.test(text);
}
