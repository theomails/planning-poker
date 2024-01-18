<template>
    <div class="app-pp-table-area" ref="app-pp-table-area">
        <div class="app-pp-user" v-for="user in room.users?room.users:[]" :key="user.userId" ref="app-user-cards">
            <div class="app-pp-user-card" :class="{'app-pp-user-card-ready':userHasMadeSelection(user.userId), 'app-pp-user-card-revealed':room.state=='SUMMARY'}">
                <div v-if="(room.state=='SUMMARY') && room.currentStorySelectedCards[user.userId]">
                    <el-icon v-if="room.currentStorySelectedCards[user.userId]=='COFFEE'" class="app-pp-user-card-coffee"><CoffeeCup /></el-icon>
                    <span v-else>
                        <b>{{ room.currentStorySelectedCards[user.userId] }}</b><br/>
                        {{ cardHoursStr(room.currentStorySelectedCards[user.userId]) }}
                    </span>
                </div>
            </div>
            <span class="app-pp-user-name">{{ user.userName }}</span>
        </div>
        <div class="app-pp-table" ref="app-pp-table">

            <template v-if="room.state=='VOTING'">
                <el-popconfirm popper-class="app-popper" title="Are you sure you want to reveal cards for all?" width="350px" @confirm="onRevealCards">
                    <template #reference>
                        <el-button type="primary" round>Reveal Cards</el-button>
                    </template>
                </el-popconfirm>
            </template>

            <el-button type="primary" v-if="room.state=='SUMMARY'" @click="onStartNewGame" round>Start New Game</el-button>

        </div>
    </div>
</template>
<script>
import seatsservice from "@/seatsservice.js"
import cardservice from "@/cardservice";

export default {
    props: ['room', 'user'],
    data(){
        return{

        };
    },
    methods:{
        onRevealCards(){
            this.$emit('actionClicked', 'REVEAL');
        },
        onStartNewGame(){
            this.$emit('actionClicked', 'START_NEW');
        },
        userHasMadeSelection(userId){
            return this.room.currentStorySelectedCards[userId]?true:false;
        },
        cardHoursStr(cardKey){
            return cardservice.getHoursStr(cardKey);
        },
        schedulePlaceUsers(){
            this.$nextTick(()=>{
                console.log('Placing (tick)');
                this.placeUsers();
            });
            setTimeout(()=>{
                console.log('Placing (1500ms)');
                this.placeUsers();
            }, 1500);
        },
        placeUsers(){
            if(!this.room || !this.room.users || this.room.users==0){
                console.log('ABORT room users');
                return;
            }

            //Get ready with target number of seats and a sample user card
            let targetNumUsers = this.room.users.length<8?8:this.room.users.length;
            let firstUserCard = this.$refs['app-user-cards'][0];

            var iterationForLog = 1;
            var reasonForLog = '';
            reasonForLog='First try';
            var positionsMap = this.getAvailablePositions(iterationForLog++, reasonForLog);
            if(!positionsMap) {
                console.log('ABORT positionsMap');
                return;
            }
            //IF we have too many positions, increase width till we have just enough or less
            //Initially, user card will be smaller than table, or user card size will be considered as 10x10 if missing.
            //So, lot of positions will be generated. Then we have to increase width to optimize.
            while(Object.keys(positionsMap).length > targetNumUsers){
                console.log('TOO MANY positions');
                firstUserCard.style.width = (firstUserCard.getBoundingClientRect().width * 1.5) + 'px';
                reasonForLog=`Too many positions (width is: ${firstUserCard.style.width}). Increasing width..`;
                positionsMap = this.getAvailablePositions(iterationForLog++, reasonForLog);
                console.log('TMP FIXED');
                this.updateUserCardsInUI(positionsMap, firstUserCard);
            }
            //If we have just enough positions or less, decrease the width
            while(Object.keys(positionsMap).length < targetNumUsers){
                console.log('NOT ENOUGH positions');
                firstUserCard.style.width = (firstUserCard.getBoundingClientRect().width * 0.8) + 'px';
                reasonForLog=`Not enough positions (width is: ${firstUserCard.style.width}). Decrease width..`;
                positionsMap = this.getAvailablePositions(iterationForLog++, reasonForLog);
                console.log('NEP FIXED');
                this.updateUserCardsInUI(positionsMap, firstUserCard);
            }
            //By the end, we go down and go up to land just at right number of positions, or a little more.
            this.updateUserCardsInUI(positionsMap, firstUserCard);
        },
        /** This is called to apply some of the available positions to the actually existing users */
        updateUserCardsInUI(positionsMap, firstUserCard){
            console.log('UPDATING positions');
            this.$refs['app-user-cards'].forEach((userCard, cardIdx)=>{
                let positions = positionsMap[cardIdx+1];
                if(positions){
                    userCard.style.left = positions[0] + 'px';
                    userCard.style.top = positions[1] + 'px';
                    userCard.style.width = firstUserCard.getBoundingClientRect().width + 'px';
                    userCard.style.height = firstUserCard.getBoundingClientRect().height + 'px';
                    console.log(`Position ${cardIdx+1} of ${Object.keys(positionsMap).length}`);
                    console.log(`Updating card ${cardIdx} to ${userCard.style.left},${userCard.style.top}`);
                }else{
                    //console.log('Not enough positions this time');
                }
            });
        },
        /** 
         * This is called after sample/first user card size is set/changed, so that positions can be re-calculated.
         * This internally calls a service method to calculate all "whole" positions around the table. 
         * The calculation is done by finding out how many "user card sized positions" are available on each side of the table.
         * This works based on the size of the first/sample user card. 
         * That first/sample user card size can be changed externally, and this method called again, to find new positions. 
         */
        getAvailablePositions(iterationForLog, reasonForLog){
            console.log('getAvailablePositions: ' + iterationForLog + ' Reason: ' + reasonForLog);
            if(iterationForLog>50) {
                console.log('Too many iterations: Abort.');
                return;
            }

            let table = this.$refs['app-pp-table'];
            if(this.$refs['app-user-cards'].length<1) {
                console.log('ABORT no user cards');
                return;
            }
            let tableArea = this.$refs['app-pp-table-area'];

            let sampleUserCard = this.$refs['app-user-cards'][0];
            if(!sampleUserCard) {
                console.log('ABORT no sample card');
                return;
            }

            return seatsservice.getAvailableSeatPositions(tableArea, table, sampleUserCard);
        }
    },
    watch:{
        /**
         * Whenever room details changes, place users again
         * Things which change in the room are:
         *     users - someone enters room
         *     user selects a card size
         *     room status changes
         *     result / summary / histo changes
         */
         'room.currentStoryName'(){
            console.log('Room Story Name changed');
            this.schedulePlaceUsers();
        },
        'room.state'(){
            console.log('Page State changed');
            this.schedulePlaceUsers();
        },
        'room.users'(){
            console.log('Users in room changed');
            this.schedulePlaceUsers();
        }
    },
    mounted(){
        window.addEventListener("resize", this.placeUsers);
        this.schedulePlaceUsers();
    },
    unmounted() {
        window.removeEventListener("resize", this.placeUsers);
    }
}
</script>
<style>
.el-popconfirm{
    white-space: pre-line;
    word-break: break-word;
}

.app-pp-table-area{
    height: 100%;
    padding: 120px 10px;
    position: relative;
}
.app-pp-table{
    width: calc(80%-200px);
    min-width: 120px;
    max-width: 400px;
    height: 20%;
    min-height: 120px;
    margin: auto;

    border: 3px solid #b3be7c;
    border-radius: 50px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;

    display: flex;
    align-items: center;
    justify-content: center;
}
.app-pp-user{
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;

    text-align: center;
    font-size: 11pt;
    font-weight: bold;
}
.app-pp-user > *{
    margin: 5px;
}
.app-pp-user-card{
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    width:50px;
    height:60px;
    padding: 5px;
    font-size: 0.8em;
    background-color: #d3d4cc;
    border-radius: 5px;
}
.app-pp-user-card-ready{
    background-color: #b3be7c;
}
.app-pp-user-card-revealed{
    border: 1px solid #b3be7c;
    background-color: white;
}
.app-pp-user-card-coffee{
    color: brown;
    font-size: 1.2em;
}
.app-popper{
    padding: 12px 9px;
}
.app-popper *{
    font-size: 11pt;
    font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>