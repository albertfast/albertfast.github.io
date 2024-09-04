$(document).ready(function() {
    const degreeSymbol = "\u00B0";

    // Temperature conversion
    $('#toCelsius').click(function() {
        let fahrenheit = parseFloat($('#tempInput').val());
        if (!isNaN(fahrenheit)) {
            let celsius = (5 / 9) * (fahrenheit - 32);
            $('#result').text(`${fahrenheit}${degreeSymbol}F is ${celsius.toFixed(2)}${degreeSymbol}C`);
        } else {
            $('#result').text('Please enter a valid temperature.');
        }
    });

    $('#toFahrenheit').click(function() {
        let celsius = parseFloat($('#tempInput').val());
        if (!isNaN(celsius)) {
            let fahrenheit = (celsius * 9 / 5) + 32;
            $('#result').text(`${celsius}${degreeSymbol}C is ${fahrenheit.toFixed(2)}${degreeSymbol}F`);
        } else {
            $('#result').text('Please enter a valid temperature.');
        }
    });

    // Weight conversion
    $('#toKg').click(function() {
        let lbs = parseFloat($('#weightInput').val());
        if (!isNaN(lbs)) {
            let kg = lbs * 0.453592;
            $('#result').text(`${lbs} lbs is ${kg.toFixed(2)} kg`);
        } else {
            $('#result').text('Please enter a valid weight.');
        }
    });

    $('#toLbs').click(function() {
        let kg = parseFloat($('#weightInput').val());
        if (!isNaN(kg)) {
            let lbs = kg / 0.453592;
            $('#result').text(`${kg} kg is ${lbs.toFixed(2)} lbs`);
        } else {
            $('#result').text('Please enter a valid weight.');
        }
    });

    // Length conversion
    $('#toCm').click(function() {
        let inches = parseFloat($('#lengthInputInches').val());
        if (!isNaN(inches)) {
            let cm = inches * 2.54;
            $('#result').text(`${inches} inches is ${cm.toFixed(2)} cm`);
        } else {
            $('#result').text('Please enter a valid length.');
        }
    });

    $('#toFeet').click(function() {
        let inches = parseFloat($('#lengthInputInches').val());
        if (!isNaN(inches)) {
            let feet = inches / 12;
            $('#result').text(`${inches} inches is ${feet.toFixed(2)} feet`);
        } else {
            $('#result').text('Please enter a valid length.');
        }
    });

    $('#toInchCm').click(function() {
        let cm = parseFloat($('#lengthInputCm').val());
        if (!isNaN(cm)) {
            let inches = cm / 2.54;
            $('#result').text(`${cm} cm is ${inches.toFixed(2)} inches`);
        } else {
            $('#result').text('Please enter a valid length.');
        }
    });
});
