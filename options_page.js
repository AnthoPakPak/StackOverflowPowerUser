window.onload = function() {


    // Saves options to chrome.storage
    function save_options() {
        var betterAnswerEnabled = document.getElementById('betterAnswerEnabled').checked;
        var noAnswerEnabled = document.getElementById('noAnswerEnabled').checked;
        var autoScrollFirstAnswerEnabled = document.getElementById('autoScrollFirstAnswerEnabled').checked;
        var showSidebarEnabled = document.getElementById('showSidebarEnabled').checked;
        var navigationArrowKeysEnabled = document.getElementById('navigationArrowKeysEnabled').checked;
        var autoExpandVotesCountEnabled = document.getElementById('autoExpandVotesCountEnabled').checked;
        var hideStackOverflowLeftSidebar = document.getElementById('hideStackOverflowLeftSidebar').checked;
        chrome.storage.sync.set({
            betterAnswerEnabled: betterAnswerEnabled,
            noAnswerEnabled: noAnswerEnabled,
            autoScrollFirstAnswerEnabled: autoScrollFirstAnswerEnabled,
            showSidebarEnabled: showSidebarEnabled,
            navigationArrowKeysEnabled: navigationArrowKeysEnabled,
            autoExpandVotesCountEnabled: autoExpandVotesCountEnabled,
            hideStackOverflowLeftSidebar: hideStackOverflowLeftSidebar
        }, function() {
            // Update status to let user know options were saved.
            // var status = document.getElementById('status');
            // status.textContent = 'Options saved.';
            // setTimeout(function() {
            //     status.textContent = '';
            // }, 750);
            show_confirmation();
        });
    }

    function show_confirmation()//enregistrer les options, fonction appelée par le click sur le bouton
    {
        //console.log('function: save');

        //alert('Options saved !');
        document.getElementById('confirmation').innerHTML = "Options saved !";
        var x = setInterval(function() {
            document.getElementById('confirmation').innerHTML = "";
            clearInterval(x);
        }, 2000);
        return false;
    }

    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    function restore_options() {
        // Use default value color = 'red' and likesColor = true.
        chrome.storage.sync.get({
            betterAnswerEnabled: true,
            noAnswerEnabled: true,
            autoScrollFirstAnswerEnabled: false,
            showSidebarEnabled: true,
            navigationArrowKeysEnabled: true,
            autoExpandVotesCountEnabled: true,
            hideStackOverflowLeftSidebar: true
        }, function(items) {
            document.getElementById('betterAnswerEnabled').checked = items.betterAnswerEnabled;
            document.getElementById('noAnswerEnabled').checked = items.noAnswerEnabled;
            document.getElementById('autoScrollFirstAnswerEnabled').checked = items.autoScrollFirstAnswerEnabled;
            document.getElementById('showSidebarEnabled').checked = items.showSidebarEnabled;
            document.getElementById('navigationArrowKeysEnabled').checked = items.navigationArrowKeysEnabled;
            document.getElementById('autoExpandVotesCountEnabled').checked = items.autoExpandVotesCountEnabled;
            document.getElementById('hideStackOverflowLeftSidebar').checked = items.hideStackOverflowLeftSidebar;
        });
    }
    restore_options();
    document.getElementById('saveButton').addEventListener('click', save_options);

};