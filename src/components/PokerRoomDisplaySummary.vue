<template>
    <div class="app-point-stats-area">
        <div class="app-point-cards-list">
            <div class="app-stat-card-set" v-for="pcard in Object.keys(selectedCardsHisto)" :key="pcard" >
                <div class="app-stat-card-bar">
                    <div class="app-stat-card-bar-nofill"></div>
                    <div class="app-stat-card-bar-fill" :style="{height: selectedCardsVotePerc[pcard]+'%'}"></div>
                </div>
                <div class="app-stat-card"  >
                    <el-icon v-if="pcard=='COFFEE'" class="app-point-card-coffee"><CoffeeCup /></el-icon>
                    <p v-else>
                        <b>{{ pcard }}</b><br/>
                        {{ cardHoursStr(pcard) }}
                    </p>
                </div>
                <div class="app-stat-vote-txt">
                    {{ selectedCardsHisto[pcard] }} votes
                </div>
            </div>
        </div>
        <div class="app-aggreement-wrapper">
            <el-progress type="circle" :percentage="selectedCardsHistoStats.maxVotesPcardAgreementPerc" :color="agreementColors" :width="85" >
                <template #default="{ percentage }">
                    <span class="percentage-label" style="font-size: 1.6em">{{ percentage }}%</span>
                    <br/><span class="percentage-label">Agreement</span>
                </template>
            </el-progress>
        </div>
    </div>
</template>
<script>
import cardservice from '@/cardservice.js'

export default{
    props: ["selectedCards"],
    data(){
        return {
            agreementColors: [
                { color: '#f56c6c', percentage: 20 },
                { color: '#e6a23c', percentage: 40 },
                { color: '#5cb87a', percentage: 60 },
                { color: '#1989fa', percentage: 80 },
                { color: '#6f7ad3', percentage: 100 }
            ]
        }
    },
    methods:{
        cardHoursStr(cardKey){
            return cardservice.getHoursStr(cardKey);
        }
    },
    computed:{
        availableCards(){
            return cardservice.getAvailableCards();
        },
        selectedCardsHisto(){
            const selectedCardsHisto = {};
            Object.keys(this.selectedCards).forEach((key)=>{
                if(this.selectedCards[key]?.length && this.selectedCards[key].length>0){
                    let pcard = this.selectedCards[key];
                    let val = selectedCardsHisto[pcard]
                    val = val?val:0;
                    val++;
                    selectedCardsHisto[pcard] = val;
                }
            });

            let sortedSelectedCardsHisto = {};
            let orderedCards = this.availableCards;
            orderedCards.forEach((pcard)=>{
                if(selectedCardsHisto[pcard]){
                    sortedSelectedCardsHisto[pcard] = selectedCardsHisto[pcard];
                }
            });
            console.log('sortedSelectedCardsHisto');
            console.log(sortedSelectedCardsHisto);
            return sortedSelectedCardsHisto;
        },
        selectedCardsHistoStats(){
            let maxVotes = 0;
            let maxVotesPcard = null;
            let totalVotes = 0;
            let maxVotesPcardAgreementPerc = 0;
            Object.keys(this.selectedCardsHisto).forEach((pcard)=>{
                totalVotes += this.selectedCardsHisto[pcard];

                if(pcard == 'COFFEE') return;
                if(this.selectedCardsHisto[pcard] > maxVotes){
                    maxVotes = this.selectedCardsHisto[pcard];
                    maxVotesPcard = pcard;
                }
            });
            maxVotesPcardAgreementPerc = totalVotes==0?0:parseInt(maxVotes * 100 / totalVotes);
            console.log('{ maxVotes, maxVotesPcard, totalVotes, maxVotesPcardAgreementPerc }');
            console.log({ maxVotes, maxVotesPcard, totalVotes, maxVotesPcardAgreementPerc });
            return { maxVotes, maxVotesPcard, totalVotes, maxVotesPcardAgreementPerc };
        },
        selectedCardsVotePerc(){
            let totalVotes = this.selectedCardsHistoStats.totalVotes;
            let selectedCardsVotePerc = {};
            Object.keys(this.selectedCardsHisto).forEach((pcard)=>{
                selectedCardsVotePerc[pcard] = parseInt(this.selectedCardsHisto[pcard]/totalVotes*100, 10);
            });
            return selectedCardsVotePerc;
        }
    },
    mounted(){},
    components:{
        
    }
}
</script>
<style>
.app-point-stats-area{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}
.app-aggreement-wrapper{
    margin-left: 45px;

    display: flex;
    flex-direction: column;
    align-items: center;
}
.app-stat-card-set{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
}
.app-stat-card{
    padding: 10px;
    margin: 5px;

    width:66px;
    height:50px;
    font-size: 0.8em;
    text-align: center;

    border: 1px solid #b3be7c;
    border-radius: 6px;
    background-color: white;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;    
}
.app-stat-card-bar{
    width: 5px;
    height: 0.5in;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #ccc;

    display: inline-flex;
    flex-direction: column;
}
.app-stat-card-bar > *{
    width: 100%;
    flex-grow: 1;
}
.app-stat-card-bar-fill{
    background-color: #b3be7c;
}
</style>