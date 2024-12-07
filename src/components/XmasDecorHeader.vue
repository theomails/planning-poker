<template>
    <div class="xmas-decor-container">
        <div class="holiday-container" id="holidayEffects"></div>
    </div>
</template>
<script>
export default {
    methods: {
        createConfetti() {
            const colors = ['#DC143C', '#006400', '#FFFFFF']; // Red, Green, White
            const container = document.getElementById('holidayEffects');
            
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Randomize position, color, and rotation
            confetti.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            container.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                container.removeChild(confetti);
            }, 4000);
        },
        createSnowflakes() {
            const container = document.getElementById('holidayEffects');
            
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.textContent = '❄';
            
            // Randomize position and drift
            snowflake.style.left = `${Math.random() * (window.innerWidth - 90)}px`;
            snowflake.style.animationDuration = `${5 + Math.random() * 2}s`;
            
            container.appendChild(snowflake);
            
            // Remove snowflake after animation
            setTimeout(() => {
                container.removeChild(snowflake);
            }, 5000);
        },
        createStars() {
            const container = document.getElementById('holidayEffects');
            
            const star = document.createElement('div');
            star.classList.add('star');
            star.textContent = '★';
            
            // Randomize position and twinkle
            star.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
            star.style.animationDuration = `${1.5 + Math.random()}s`;
            
            container.appendChild(star);
            
            // Remove star after animation
            setTimeout(() => {
                container.removeChild(star);
            }, 3000);
        }
    },
    mounted(){
        setInterval(this.createConfetti, 300);
        setInterval(this.createSnowflakes, 500);
        setInterval(this.createStars, 1000);
    }
}
</script>
<style>
    .xmas-decor-container {
        pointer-events: none;
    }
    .holiday-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 30vh;
    }
    @keyframes christmas-glow {
        0% {
            color: #d6fab8;
            transform: translateX(-50%) scale(1);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        100% {
            color: #d6fab8;
            transform: translateX(-50%) scale(1.05);
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
    }
    .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        opacity: 1;
        animation: fall-and-fade 4s linear infinite;
    }
    .snowflake {
        position: absolute;
        font-size: 38px;
        color: white;
        text-shadow: 0 0 5px rgba(255,255,255,0.7);
        animation: fall-and-fade 5s linear infinite;
    }
    .star {
        position: absolute;
        font-size: 26px;
        color: yellow;
        animation: fall-and-fade 1.5s ease-in-out infinite alternate;
    }
    @keyframes fall-and-fade {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(20vh) rotate(360deg);
            opacity: 0;
        }
    }
</style>