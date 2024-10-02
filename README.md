# Bit Manipulation Encoder/Decoder

## Overview

This project is a **Bit Manipulation Encoder/Decoder** web application that allows users to encode and decode text using a custom scramble map and bit manipulation techniques. The app is built using HTML, CSS, and JavaScript and demonstrates character scrambling and binary-based encoding.

## Table of Contents
- [About](#about)
- [Features](#features)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

### About
The **Bit Manipulation Encoder/Decoder** is an interactive web-based application that converts input text into a scrambled version, followed by bit manipulation to further encode it. Users can input a decimal value representing the encoded text and decode it back to its original form.

This project demonstrates basic cryptographic principles like substitution ciphers and binary manipulation. It can serve as a learning tool for understanding how data encoding and decoding work at a lower level.

### Features
- **Custom Scramble Map:** Each character in the input is mapped to a new character using a predefined substitution cipher.
- **Bit Manipulation:** After scrambling, the binary representation of the text is manipulated to further obfuscate the data.
- **Encode Text:** Converts input text into scrambled and encoded binary.
- **Decode Text:** Converts the scrambled and encoded decimal back to its original form.
- **Clear Functionality:** Allows users to reset input and output fields.
- **Responsive UI:** Simple and responsive user interface for easy interaction.

### How It Works
- **Scramble Map:** The input text is passed through a substitution cipher (scramble map), where each character is replaced by another based on a predefined key-value mapping.
  - Example: `'A' -> 'J'`, `'B' -> 'S'`, `'C' -> 'D'`.
  
- **Binary Encoding:** After the text is scrambled, it is converted into its binary form, where each character is represented as an 8-bit binary string. The binary string is then manipulated by rearranging the bits.

- **Bit Manipulation:** The binary string undergoes a custom bit manipulation based on a predefined bit map, scrambling the bit positions for additional encoding security.

- **Decoding:** The process is reversed by first decoding the binary string back to text after reversing the bit manipulation, and then using the reverse scramble map to return the original text.

### Usage

#### Encoder
1. Enter the text you want to encode in the **Input Text** field.
2. Click the **Encode** button.
3. The app will display:
   - **Scrambled Text:** The text after the scramble map is applied.
   - **Encoded Value:** A decimal representation of the scrambled binary.

#### Decoder
1. Enter the encoded decimal value in the **Input Decimal** field.
2. Click the **Decode** button.
3. The app will display:
   - **Decoded Text:** The original text decoded from the input decimal.

#### Clear Fields
- Click the **Clear** buttons to reset the input and output fields.

### Technologies
- **HTML5:** Structure and layout.
- **CSS3:** Styling and layout adjustments.
- **JavaScript (Vanilla):** Core functionality for encoding, decoding, and bit manipulation.
- **Bootstrap (Optional):** For quick styling and layout (if added).

### Contributing
Contributions are welcome! Feel free to submit issues, fork the repository, and create pull requests. Please make sure to update tests as appropriate.

### License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
