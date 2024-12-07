<template>
    <div class="xmas-decor-container">
        <div class="merry-christmas"><img  :src="imageUrl" /></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            imageUrl: require('@/assets/xmas decor.png'), // Dynamically resolves the path
        };
    }
}
</script>
<style scoped>
    .xmas-decor-container {
        pointer-events: none;
    }
    .merry-christmas {
        position: relative;
        top: -20px;
        width: 100vw;
        text-align: center;
    }
    .merry-christmas img{
        background: none;
        width: calc( max( 30vw, 300px) );
        -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 80%);
        -webkit-mask-size: cover;
        -webkit-mask-repeat: no-repeat;
        mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 80%);
        mask-size: cover;
        mask-repeat: no-repeat;
        z-index: 0;
    }
</style>