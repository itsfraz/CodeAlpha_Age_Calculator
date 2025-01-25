function calculateAge() {
    const day = parseInt(document.getElementById('day').value);
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);
    
    // Basic input validation
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        showResult("Please fill in all fields", true);
        clearStats();
        return;
    }

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    // Validate date
    if (!isValidDate(day, month, year) || birthDate > today) {
        showResult("Please enter a valid date of birth", true);
        clearStats();
        return;
    }
    
    const age = getAgeDetails(birthDate, today);
    const zodiac = getZodiacSign(month, day);
    const nextBirthday = getNextBirthday(birthDate, today);
    
    showResult(`Your age is: ${age.years} years`, false);
    showStats(age, nextBirthday);
    showZodiac(zodiac);
}
document.getElementById('month').addEventListener('change', function() {
    this.style.color = this.value ? 'var(--text-color)' : '#666';
    if (this.value) document.getElementById('year').focus();
});

document.getElementById('day').addEventListener('input', function(e) {
    if (this.value.length >= this.maxLength) {
        document.getElementById('month').focus();
    }
});

function isValidDate(day, month, year) {
    // Check for 4-digit year
    if (year < 1000 || year > 9999) return false;
    
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year;
}


function getAgeDetails(birthDate, today) {
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
        months--;
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    
    return { years, months, days, totalDays };
}

function getNextBirthday(birthDate, today) {
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = nextBirthday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
        date: nextBirthday.toLocaleDateString(),
        daysLeft: diffDays
    };
}

function getZodiacSign(month, day) {
    const zodiac = [
        { sign: "♒ Aquarius", date: [1, 20] },
        { sign: "♓ Pisces", date: [2, 19] },
        { sign: "♈ Aries", date: [3, 21] },
        { sign: "♉ Taurus", date: [4, 20] },
        { sign: "♊ Gemini", date: [5, 21] },
        { sign: "♋ Cancer", date: [6, 21] },
        { sign: "♌ Leo", date: [7, 23] },
        { sign: "♍ Virgo", date: [8, 23] },
        { sign: "♎ Libra", date: [9, 23] },
        { sign: "♏ Scorpio", date: [10, 23] },
        { sign: "♐ Sagittarius", date: [11, 22] },
        { sign: "♑ Capricorn", date: [12, 22] }
    ];
    
    return zodiac.find(z => (month === z.date[0] && day >= z.date[1]) || 
                          (month === z.date[0] + 1 && day < z.date[1]))?.sign || "♑ Capricorn";
}

function showResult(message, isError) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.className = isError ? 'error' : 'success';
}

function showStats(age, nextBirthday) {
    const statsHTML = `
        <div class="stat-box">
            <div class="stat-value">${age.totalDays}</div>
            <div>Total Days Lived</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${age.months}</div>
            <div>Months</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${nextBirthday.daysLeft}</div>
            <div>Days to Next Birthday</div>
        </div>
    `;
    
    document.getElementById('stats').innerHTML = statsHTML;
}

function showZodiac(zodiac) {
    document.getElementById('zodiac').innerHTML = `
        <h3>Your Zodiac Sign</h3>
        <div class="zodiac-sign">${zodiac}</div>
    `;
}

function clearStats() {
    document.getElementById('stats').innerHTML = '';
    document.getElementById('zodiac').innerHTML = '';
}

// Input validation and auto-advance
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function(e) {
        if (this.id === 'year') {
            // Enforce 4-digit year
            const value = this.value.replace(/\D/g, '');
            if (value.length > 4) {
                this.value = value.slice(0,4);
            } else {
                this.value = value;
            }
            
            // Auto-advance after 4 digits
            if (this.value.length === 4) {
                this.blur();
            }
        } else {
            // Existing validation for day/month
            const max = parseInt(this.max) || Infinity;
            const min = parseInt(this.min) || 0;
            const maxLength = parseInt(this.maxLength) || 2;
            const value = this.value.trim();
            
            if (value === '') return;
            
            const numericValue = parseInt(value);
            if (isNaN(numericValue)) {
                this.value = '';
                return;
            }
            
            if (numericValue > max) this.value = max;
            if (numericValue < min) this.value = min;
        }
        
        // Auto-advance to next input
        if (this.value.length >= maxLength) {
            const next = this.nextElementSibling?.querySelector('input, select');
            if (next) next.focus();
        }
    });
});