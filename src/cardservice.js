//The Below Spaces are Very Important. Numeric keys don't work!!.
export const cardSettings = {
    'SP 1': {
      hours: '1-10h'
    },
    'SP 2': {
      hours: '11-20h'
    }, 
    'SP 3': {
      hours: '21-30h'
    }, 
    'SP 5': {
      hours: '31-50h'
    }, 
    'SP 8': {
      hours: '51-75h'
    }, 
    'SP 13': {
      hours: '76-100h'
    },
    'COFFEE': {}
  };

export default {
    getAvailableCards(){
        return Object.keys(cardSettings);
    },
    getCardSettings(cardKey){
      console.log('cardKey ' + cardKey);
        return cardSettings[cardKey]?cardSettings[cardKey]:{};
    },
    getHoursStr(cardKey){
        return this.getCardSettings(cardKey).hours;
    }
}

