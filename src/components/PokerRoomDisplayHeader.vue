<template>
    <div class="app-game-room-header" v-if="room">
        <div class="app-game-room-details">
            <p><b>{{ room.teamName }} Team</b> Planning Poker hosted by <b>{{ room.owner?room.owner.userName:'' }}</b>
                &nbsp;&nbsp; <el-button type="primary" icon="DocumentCopy" round @click="onCopyLink" size="small"
                title="Copy Room Link">Room Link</el-button>
            </p>
            <p>Planning for Story: 
                <span v-if="room.state=='SETUP'">
                    <input class="app-inline-input" type="text" ref="txtStoryName"
                        v-model="currentStory.name"  :class="{'app-input-error':storyNameHasError}"/>
                    <!-- <span class="app-buttons"> -->
                    &nbsp;
                    <el-button-group>
                        <el-button type="primary" icon="List" round @click="onPaste">Paste</el-button>
                        <!-- <el-button type="primary" icon="Loading" round @click="onFormat">Format</el-button> -->
                    </el-button-group>
                    &nbsp;
                    <el-button type="success" round @click="onStartGame">Start Game</el-button>
                    <!-- </span> -->
                </span>
                <span v-else>
                    <b>{{ room.currentStoryName }}</b>
                    <span v-if="room.currentStoryParts && room.currentStoryParts.epic">
                        &nbsp; <a :href="jiraLink(room.currentStoryParts.epic)" target="_blank">Epic <el-icon><TopRight /></el-icon></a>
                    </span>
                    <span v-if="room.currentStoryParts && room.currentStoryParts.story">
                        &nbsp; <a :href="jiraLink(room.currentStoryParts.story)" target="_blank">Story <el-icon><TopRight /></el-icon></a>
                    </span>
                </span>
            </p>
        </div>
        <div class="app-game-room-time">
            <div class="app-game-room-time-display" v-if="room.state=='VOTING'"
                :class="{'app-time-warn':warnTime}">
                <el-icon><Clock /></el-icon> 
                &nbsp;&nbsp;&nbsp;
                <span>{{ storyElapsedTime }}</span>
            </div>
        </div>
    </div>
</template>
<script>

export default{
    props: ["room", "user"],
    data(){
        return {
            nowTime: null,
            nowTimer: null,
            warnTime: false,
            currentStory: {}
        }
    },
    methods:{
        jiraLink(cardNum){
            return 'https://redflex.atlassian.net/browse/' + cardNum;
        },
        onPaste(){
            navigator.clipboard.readText()
            .then(text => {
                this.currentStory.name = text;
                this.$notify({
                    message: 'Pasted!',
                    showClose: false,
                    type:'success'
                });
            })
            .catch(() => {
                this.$notify({
                    message: 'Unable to paste.',
                    showClose: false,
                    type:'error'
                });
            });
        },
        onCopyLink(){
            navigator.clipboard.writeText(window.location.href)
            .then(()=>{
                this.$notify({
                    message: 'Link copied!',
                    showClose: false,
                    type:'success'
                });
            })
            .catch(() => {
                this.$notify({
                    message: 'Unable to copy.',
                    showClose: false,
                    type:'error'
                });
            });
        },
        onFormat(){
            let storyName = this.currentStory.name;
            if(!storyName || storyName.length<3 || storyName.includes('[')) return;
            console.log('storyName');
            console.log(storyName);

            var regex = /(\w\w\w-\d+)?(\s+)?(\w\w\w-\d+)\s+(.+)$/gm;
            var matches = storyName.matchAll(regex);
            var parts = {};
            for(const match of matches){
                parts.epic = match[1]?match[1]:null;
                parts.story = match[3]?match[3]:null;
                parts.storyName = match[4]?match[4]:'Untitled';
            }
            console.log('parts');
            console.log(parts);
            var newStoryName = '';
            if(parts.epic && parts.epic.length>3) newStoryName += `[Epic: ${parts.epic}] `;
            if(parts.story && parts.story.length>3) newStoryName += `[Story: ${parts.story}] `;
            if(parts.storyName && parts.storyName.length>3) newStoryName += parts.storyName;
            console.log('newStoryName');
            console.log(newStoryName);
            if(newStoryName.length > 3){
                this.currentStory.name = newStoryName;
                this.currentStory.parts = parts;
            }else{
                this.currentStory.parts = {};
            }
        },
        onStartGame(){
            this.onFormat();
            this.$notify({
                    message: 'Starting game..',
                    showClose: false,
                    type:'success'
                });
            this.$emit('startGame', this.currentStory);
        },
        setNowTime(){
            this.nowTime = new Date().getTime();
            var diff = Math.abs(this.nowTime - this.room.currentStoryStartTime);
            var diffSec = Math.floor(diff/1000);
            var diffMin = Math.floor(diffSec/60);

            if(this.warnTime) return; //Already warned

            if(diffMin>=2){
                this.warnTime = true;
                this.$notify({
                    message: 'Time warning..',
                    showClose: false,
                    type:'warning'
                });   
            }
        },
        onContextChange(){
            if(this.room?.state != 'VOTING'){
                if(this.nowTimer){
                    clearInterval(this.nowTimer);
                    this.nowTimer = null;
                }
            }

            if(this.room?.state=='SETUP'){
                this.$nextTick( ()=>{ 
                    this.$refs.txtStoryName.focus();
                    this.$refs.txtStoryName.select();
                } );
            }else if(this.room?.state=='VOTING'){
                this.warnTime = false;
                if(this.nowTimer){
                    clearInterval(this.nowTimer);
                    this.nowTimer = null;
                }
                this.nowTimer = setInterval(()=>{ 
                    this.setNowTime();
                    //console.log('Setting now..');
                }, 500);
            }
        }
    },
    computed:{
        storyNameHasError(){
            return this.room.state=='SETUP' && (!this.room.currentStoryName || this.room.currentStoryName.length<4);
        },
        storyElapsedTime(){
            if(this.room.state=='VOTING' && this.room.currentStoryStartTime && this.nowTime){
                var diff = Math.abs(this.nowTime - this.room.currentStoryStartTime);
                var diffSec = Math.floor(diff/1000);
                var diffMin = Math.floor(diffSec/60);
                diffSec = diffSec % 60;
                var diffStr = `${diffMin}:${diffSec<10?'0'+diffSec:diffSec}`;
                return diffStr;
            }
            return '0:00';
        }
    },
    watch:{
        'room'(){
            this.onContextChange();
        }
    },
    mounted(){
        this.onContextChange();
    },
    components:{
        
    }
}
</script>
<style>
.app-game-room-header{
    display: flex;
    justify-content: space-between;
    gap: 10px;
}
.app-game-room-details{
    flex-grow: 1;
}
.app-game-room-details .app-buttons button{
    margin: 2px 5px;
}
.app-inline-input{
    border: 0px;
    border-bottom: 1px solid #ddd;
    outline: none;
    font-size: 1.05em;
    width: 55%;
    max-width: 700px;
    margin: 5px;
    margin-left: 0px;
}
.app-inline-input:focus{
border-bottom: 1px solid #A9C23F;
}
.app-inline-input.app-input-error, .app-inline-input.app-input-error:focus{
border-bottom: 1px solid #cc421c;
}
.app-buttons{
    display: inline-block;
}

.app-game-room-time{
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.app-time-warn{
    border: 1px solid red;
}
.app-game-room-time-display{
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
}
</style>