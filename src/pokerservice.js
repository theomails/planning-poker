import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import db from '@/firebase.js'

export default {
    getNewRandomPart(){
        return parseInt(Math.random() * 10000, 10);
    },
    createLocalUser(userName){
        console.log('POKER SERVICE :: createLocalUser ' + userName);
        let userObjStr = localStorage.getItem("vm-pp-user");
        let userObj = userObjStr ? JSON.parse(userObjStr) : null;

        let userId = userObj?.userId ? userObj.userId : (this.getNewRandomPart() + "-" + Date.now());
        userObj = { userId, userName };
        //Sync
        localStorage.setItem("vm-pp-user", JSON.stringify(userObj));
        //DB - Fire and forget
        setDoc(doc(db, 'users', userId), userObj);
    },
    getLocalUser(){
        console.log('POKER SERVICE :: getLocalUser');
        //Sync
        let userObjStr = localStorage.getItem("vm-pp-user");
        let userObj = userObjStr?JSON.parse(userObjStr):null;

        if(userObj){
            //DB - Fire and forget
            getDoc(doc(db, 'users', userObj.userId)).then((docSnap)=>{
                if (docSnap.exists()) {
                    console.log(docSnap.data())
                } else {
                    console.log('User does not exist in DB! Saving it')
                    //DB - Fire and forget
                    setDoc(doc(db, 'users', userObj.userId), userObj);
                }
            });
        }
        return userObj;
    },
    async createPokerRoom(teamName){
        console.log('POKER SERVICE :: creatPokerRoom ' + teamName);
        let roomId = this.getNewRandomPart() + "-" + Date.now();
        let localUser = this.getLocalUser();

        let roomObj = { roomId, 
            teamName, 
            owner: localUser, 
            users:[localUser],
            state: 'SETUP', /** SETUP / VOTING / SUMMARY */
            currentStoryName: null,
            currentStoryNameParts: null,
            currentStoryStartTime: null,
            currentStorySelectedCards:{}
        };
        
        //Store and wait
        await setDoc(doc(db, 'rooms', roomId), roomObj);
        return roomObj;
    },
    async getPokerRoomAfterJoining(roomId, userObj){
        console.log('POKER SERVICE :: getPokerRoomAfterJoining ' + roomId + ' userObj.userId ' + userObj.userId);
        
        let docSnap = await getDoc(doc(db, 'rooms', roomId));
        let roomObj = docSnap.data();
        if(roomObj.roomId == roomId){
            let matchingUser = roomObj.users.find( user => { return user.userId == userObj.userId } );
            if(matchingUser){
                console.log('User already in room');
                matchingUser.userName =userObj.userName;
            }else{
                console.log('Pushing current user in room users, as not found');
                roomObj.users.push(userObj);
            }
            
            //Copy necessary
            let partRoomObj = {};
            partRoomObj.users = roomObj.users;
            console.log('Users payload');
            console.log(partRoomObj);

            //Save by merge, wait
            await setDoc(doc(db, 'rooms', roomObj.roomId), partRoomObj, { merge: true });
            docSnap = await getDoc(doc(db, 'rooms', roomObj.roomId));
            roomObj = docSnap.data();
            console.log('Final room');
            console.log(roomObj);
            return roomObj;
        }else{
            return null;
        }
    },
    async startGameInRoom(roomObj, currentStory){
        console.log('POKER SERVICE :: startGameInRoom roomObj.roomId, currentStory.storyName ' + roomObj.roomId + ', ' + currentStory.storyName);
        
        //Assign necessary
        let partRoomObj = {};
        partRoomObj.currentStoryName = currentStory.name;
        partRoomObj.currentStoryParts = currentStory.parts?currentStory.parts:null;
        partRoomObj.currentStoryStartTime = new Date().getTime();
        partRoomObj.currentStorySelectedCards = {};
        partRoomObj.state = 'VOTING';
        
        //Save by merge, wait
        await setDoc(doc(db, 'rooms', roomObj.roomId), partRoomObj, { merge: true });
        let docSnap = await getDoc(doc(db, 'rooms', roomObj.roomId));
        roomObj = docSnap.data();
        return roomObj;
    },
    async revealWithSummaryGameInRoom(roomObj){
        console.log('POKER SERVICE :: revealWithSummaryGameInRoom roomObj.roomId ' + roomObj.roomId);
        
        //Assign necessary
        let partRoomObj = {};
        partRoomObj.state = 'SUMMARY';
        
        //Save by merge, wait
        await setDoc(doc(db, 'rooms', roomObj.roomId), partRoomObj, { merge: true });
        let docSnap = await getDoc(doc(db, 'rooms', roomObj.roomId));
        roomObj = docSnap.data();
        return roomObj;
    },
    async startSetupGameInRoom(roomObj){
        console.log('POKER SERVICE :: startSetupGameInRoom roomObj.roomId ' + roomObj.roomId);
        
        //Assign necessary
        let partRoomObj = {};
        partRoomObj.state = 'SETUP';

        //Save by merge, wait
        await setDoc(doc(db, 'rooms', roomObj.roomId), partRoomObj, { merge: true });
        let docSnap = await getDoc(doc(db, 'rooms', roomObj.roomId));
        roomObj = docSnap.data();
        return roomObj;
    },
    async selectDeselectCardForCurrentUserGameInRoom(roomObj, userObj, pcard){
        console.log('POKER SERVICE :: selectDeselectCardForCurrentUserGameInRoom roomObj.roomId, userObj.userId, pcard' 
        + `${roomObj.roomId}, ${userObj.userId}, ${pcard}`);

        //Load
        let docSnap = await getDoc(doc(db, 'rooms', roomObj.roomId));
        roomObj = docSnap.data();

        //Change
        if(roomObj.currentStorySelectedCards[userObj.userId] == pcard){
            console.log('Existing selection removed');
            delete roomObj.currentStorySelectedCards[userObj.userId];
        }else{
            console.log('Selection placed');
            roomObj.currentStorySelectedCards[userObj.userId] = pcard;
        }        

        //Copy necessary
        let partRoomObj = {};
        partRoomObj.currentStorySelectedCards = roomObj.currentStorySelectedCards;

        //Save by merge, wait
        await setDoc(doc(db, 'rooms', roomObj.roomId), partRoomObj, { merge: true });
        docSnap = await getDoc(doc(db, 'rooms', roomObj.roomId));
        roomObj = docSnap.data();
        return roomObj;
    },
    listenToRoom(roomObj, roomChangeCallback){
        console.log(roomChangeCallback);
        onSnapshot(doc(db, 'rooms', roomObj.roomId), (snap) => {
            roomChangeCallback(snap.data());
          })
    }
};