<template>
    <div class="app-point-cards-area">
        <p>Choose one of the Story card sizes!</p>
        <div class="app-point-cards-list">
            <div class="app-point-card" v-for="pcard in availableCards" :key="pcard"
                    @click="selectPoint(pcard)" 
                    :class="{'app-point-card-selected':isThisSelectedByCurrentUser(pcard), 'app-point-card-nomore':iHaveMadeASelection}"
                    >
                <el-icon v-if="pcard=='COFFEE'" class="app-point-card-coffee"><CoffeeCup /></el-icon>
                <p v-else>
                    <b>{{ pcard }}</b><br/>
                    {{ cardHoursStr(pcard) }}
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import cardservice from '@/cardservice';
export default{
    props: ["room", "user"],
    data(){
        return {
            
        }
    },
    methods:{
        selectPoint(pcard){
            console.log("selectPoint(pcard)");
            this.$emit('cardSelected', pcard);
        },
        isThisSelectedByCurrentUser(pcard){
            return this.user && (pcard==this.room.currentStorySelectedCards[this.user.userId]);
        },
        cardHoursStr(cardKey){
            return cardservice.getHoursStr(cardKey);
        }
    },
    computed:{
        iHaveMadeASelection(){
            if(this.user && this.room.currentStorySelectedCards[this.user.userId]) return true;
            else return false;
        },
        availableCards(){
            return cardservice.getAvailableCards();
        }
    },
    mounted(){},
    components:{
        
    }
}
</script>
<style>
.app-point-cards-area{
    text-align: center;
    margin-bottom:20px;
}
.app-point-cards-list{
    display: flex;
    justify-content: center;
}
.app-point-card{
    padding: 10px;
    margin: 5px;

    width:38px;
    height:56px;
    cursor: pointer;
    font-size: 0.8em;

    border: 1px solid #b3be7c;
    border-radius: 6px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.app-point-card:hover{
    background-color: #d0d8a7;
}
.app-point-card.app-point-card-nomore:hover{
    background: none;
}
.app-point-card-selected, 
.app-point-card-selected:hover,
.app-point-card-selected.app-point-card-nomore:hover{
    background-color: #b3be7c;
}
.app-point-card-coffee{
    color: brown;
    font-size: 1.2em;
}
</style>