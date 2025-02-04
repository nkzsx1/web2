define(['js/constants/constants', 'Util'], function(Constants, Util){

    var isFavorite = function(knwlgIds, callBack){
        if(knwlgIds && knwlgIds.length){
            Util.ajax.postJson(Constants.AJAXURL + "/klgFavrtInfo/getFavoriteKnwlgs", {knwlgIds: knwlgIds.join(",")}, function(data){
                if(callBack){
                    callBack(data);
                }
            });
        }
    };

    return {isFavorite: isFavorite};
});