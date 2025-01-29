<template>
    <div class="valentine-decor-container">
        <div class="holiday-container" id="holidayEffects"></div>
    </div>
</template>
<script>
export default {
    methods: {
        createHearts() {
            const colors = ['#FF69B4', '#FF1493', '#DC143C']; // Pink, Deep Pink, Crimson
            const container = document.getElementById('holidayEffects');
            
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.textContent = '❤';
            
            // Randomize position, color, and size
            heart.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.fontSize = `${20 + Math.random() * 20}px`;
            
            container.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                container.removeChild(heart);
            }, 4000);
        },
        createBubbles() {
            const container = document.getElementById('holidayEffects');
            
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            bubble.textContent = '💭';
            
            // Randomize position and drift
            bubble.style.left = `${Math.random() * (window.innerWidth - 90)}px`;
            
            container.appendChild(bubble);
            
            // Remove bubble after animation
            setTimeout(() => {
                container.removeChild(bubble);
            }, 5000);
        },
        createSparkles() {
            const container = document.getElementById('holidayEffects');
            
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            sparkle.textContent = '✨';
            
            // Randomize position and twinkle
            sparkle.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
            
            container.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                container.removeChild(sparkle);
            }, 3000);
        }
    },
    mounted(){
        setInterval(this.createHearts, 300);
        setInterval(this.createBubbles, 500);
        setInterval(this.createSparkles, 1000);
    }
}
</script>
<style>
    .valentine-decor-container {
        pointer-events: none;
    }
    .holiday-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 30vh;
    }
    .heart {
        position: absolute;
        font-size: 24px;
        animation: fall-and-fade 4s linear infinite;
    }
    .bubble {
        position: absolute;
        font-size: 38px;
        color: lightblue;
        animation: fall-and-fade 5s linear infinite;
    }
    .sparkle {
        position: absolute;
        font-size: 26px;
        color: gold;
        animation: fall-and-fade 1.5s ease-in-out infinite alternate;
    }
    @keyframes fall-and-fade {
        0% {
            transform: translateY(-5vh) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(13vh) scale(1.2);
            opacity: 0;
        }
    }
</style>
