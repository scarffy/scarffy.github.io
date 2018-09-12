function DoExampleLoginWithCustomID(){
    PlayFab.settings.titleId = document.getElementById("titleId").value;
    var loginRequest = {
<<<<<<< HEAD
<<<<<<< HEAD
=======
        // Currently, you need to look up the correct format for this object in the API-docs:
        // https://api.playfab.com/documentation/Client/method/LoginWithCustomID
>>>>>>> dd3a8cb9cd3d94ef12947f6098e86abd0eba479f
=======
        // Currently, you need to look up the correct format for this object in the API-docs:
        // https://api.playfab.com/documentation/Client/method/LoginWithCustomID
>>>>>>> dd3a8cb9cd3d94ef12947f6098e86abd0eba479f
        TitleId: PlayFab.settings.titleId,
        CustomId: document.getElementById("customId").value,
        CreateAccount: true
    };
<<<<<<< HEAD
<<<<<<< HEAD
    PlayFabClientSDK.LoginWithCustomID(loginRequest, LoginCallBack);
}

var LoginCallBack = function(result,error){
    if(result !== null){
        document.getElementById("resultOutput").innerHTML = "Congratulations, you made your first successful API Call!";
    }else if (error !== null){
        document.getElementById("resultOutput").innerHTML =
        "Something went wrong with your first API call. \n" +
        "Here's some debug information:\n" +
        PlayFab.GenerateErrorReport(error);
    }
}
=======
=======
>>>>>>> dd3a8cb9cd3d94ef12947f6098e86abd0eba479f

    PlayFabClientSDK.LoginWithCustomID(loginRequest, LoginCallback);
}

var LoginCallback = function (result, error) {
    if (result !== null) {
        document.getElementById("resultOutput").innerHTML = "Congratulations, you made your first successful API call!";
    } else if (error !== null) {
        document.getElementById("resultOutput").innerHTML =
            "Something went wrong with your first API call.\n" +
            "Here's some debug information:\n" +
            PlayFab.GenerateErrorReport(error);
    }
}
<<<<<<< HEAD
>>>>>>> dd3a8cb9cd3d94ef12947f6098e86abd0eba479f
=======
>>>>>>> dd3a8cb9cd3d94ef12947f6098e86abd0eba479f
