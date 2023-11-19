export default {
    getAvailableSeatPositions(tableAreaEl, tableEl, userCardEl){
        //Available places
        let tableWidth = tableEl.getBoundingClientRect().width;
        let tableHeight = tableEl.getBoundingClientRect().height;
        let tableLeft = tableEl.getBoundingClientRect().left - tableAreaEl.getBoundingClientRect().left;
        let tableTop = tableEl.getBoundingClientRect().top - tableAreaEl.getBoundingClientRect().top;
        console.log(`INPUTS ${tableWidth} ${tableHeight} ${tableLeft} ${tableTop}`);

        if(!userCardEl) {
            console.log('ABORT userCardEl');
            return;
        }

        //Needed places
        let userCardWidth = userCardEl.getBoundingClientRect().width;
        let userCardHeight = userCardEl.getBoundingClientRect().height;
        userCardWidth = userCardWidth<5?5:userCardWidth;
        userCardHeight = userCardHeight<5?5:userCardHeight;

        let hcards = parseInt(tableWidth/userCardWidth, 10);
        hcards = (isNaN(hcards) || hcards<1)?1:hcards;
        let vcards = parseInt(tableHeight/userCardHeight, 10);
        vcards = (isNaN(vcards) || vcards<1)<1?1:vcards;
        console.log('For this sample user card size, we can fit these many cards (hor, vert): ' + hcards + ', ' + vcards);

        let hspace = hcards>1?(tableWidth-userCardWidth*hcards)/(hcards-1):10; //Min spacing, when only one card
        let vspace = vcards>1?(tableHeight-userCardHeight*vcards)/(vcards-1):10;

        let positionsMap = {};
        for(var i=0; i<hcards;i++){
            let topSeatNum = i; 
            let topPos = [ tableLeft + i*userCardWidth + i*hspace , tableTop - 10 - userCardHeight ];

            let bottomSeatNum = 2*hcards + vcards - i - 1; 
            let bottomPos = [ tableLeft + i*userCardWidth + i*hspace, tableTop + tableHeight + 10 ];

            this.abortForNan(topPos);
            this.abortForNan(bottomPos);
            positionsMap[topSeatNum] = topPos;
            positionsMap[bottomSeatNum] = bottomPos;
        }
        for(i=0; i<vcards;i++){
            let rightSeatNum = hcards + i; 
            let rightPos = [ tableLeft + tableWidth + 10, tableTop + i*userCardHeight + i*vspace ];
            /*
            console.log(tableLeft);
            console.log(tableWidth);
            console.log(tableTop );
            console.log(i);
            console.log(vspace);
            console.log(userCardHeight);
            */

            let leftSeatNum = 2*hcards + 2*vcards - i - 1; 
            let leftPos = [ tableLeft - 10 - userCardWidth, tableTop + i*userCardHeight + i*vspace ];

            this.abortForNan(rightPos);
            this.abortForNan(leftPos);
            positionsMap[rightSeatNum] = rightPos;
            positionsMap[leftSeatNum] = leftPos;
        }
        
        let seatCount = Object.keys(positionsMap).length;
        let seatsToShiftCount = parseInt(hcards/2, 10);
        let newPositionsMap = {};
        for(i=0;i<seatCount;i++){
            let newPos = (i + seatCount - seatsToShiftCount) % seatCount + 1;
            newPositionsMap[newPos] = positionsMap[i];
        }

        console.log('newPositionsMap');
        console.log(newPositionsMap)
        return newPositionsMap;
    },
    abortForNan(pos){
        if(isNaN(pos[0]) || isNaN(pos[1])){
            console.log(pos);
            throw new Error('Nan in pos');
        }
    }
}