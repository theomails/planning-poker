<template>
    <div class="app-card">
        <div class="app-card-header">
            Create Poker Room
        </div>
        <div class="app-card-body">
            <form id="create-poker-room" class="app-form">
                <div class="app-form-row app-info-bubble">
                    <p>If you want to create a Poker Room and invite others, you can create one below.</p>
                    <p><em>If you want to <b>join</b> someone else's Poker Room, please ask them for the join-room link.</em></p>
                </div>
                <div class="app-form-row">
                    <label>Your name (Room owner)</label>
                    <input type="text" disabled :value="userName"/>
                </div>
                <div class="app-form-row">
                    <label>Team name</label>
                    <input ref="teamName" key="teamName" type="text" name="teamName" v-model="teamName" 
                        @keydown.enter.prevent="createPokerRoom"
                        :class="{'app-input-error':!goodToCreateRoom}"
                    />
                </div>
                <div class="app-form-row">
                    <button @click.prevent="createPokerRoom" :disabled="!goodToCreateRoom">
                        <el-icon><CirclePlusFilled /></el-icon>
                        <span>Create Poker Room</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import pokerservice from '@/pokerservice.js'

export default {
    data(){
        return {
            userName:"",
            teamName: ""
        };
    },
    methods:{
        async createPokerRoom(){
            //Create Room
            this.$notify({
                    message: 'Creating Room..',
                    showClose: false,
                    type:'success'
                });
            
            this.$Progress.start();
            let pokerRoom = await pokerservice.createPokerRoom(this.teamName);
            this.$Progress.finish();

            //Redirect
            this.$router.push({name:'poker-room', params:{roomId: pokerRoom.roomId }});
        }
    },
    computed:{
        goodToCreateRoom(){
            return this.teamName && (this.teamName.length >= 4);
        }
    },
    mounted(){
        this.userName = pokerservice.getLocalUser()?.userName;
        if(!this.userName){
            this.$router.push( {name:'login'} );
        }else{
            this.$nextTick( ()=> this.$refs.teamName.focus() );
        }
    }
}
</script>