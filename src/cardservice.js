export const cardSettings = {
    'XS': {
      hours: '<10'
    },
    'S': {
      hours: '10-20'
    }, 
    'M': {
      hours: '21-50'
    }, 
    'L': {
      hours: '51-100'
    }, 
    'XL': {
      hours: '100+'
    },
    'COFFEE': {}
  };

export default {
    getAvailableCards(){
        return Object.keys(cardSettings);
    },
    getCardSettings(cardKey){
        return cardSettings[cardKey];
    },
    getHoursStr(cardKey){
        return this.getCardSettings(cardKey).hours;
    }
}

