const moneyFromat =function (value){
  return value.split('.')[0];
};

const messageFilter =function (value){
	if(value==""||value==undefined){
		return '-'
	}else{
		return value
	}
   
};

const sexTag =function (value){
	if(value==0){
		return '男'
	}else if(value==1){
		return '女'
	}else {
		return '保密'
	}
   
};



export default {
    moneyFromat,
    messageFilter,
    sexTag
}