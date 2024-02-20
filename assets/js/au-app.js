var auapp = (function(){

    let timeInterval = null;
    let dateInterval = null;
    let textMsgFieldInterval = null;

    // Utilities
    function mobileCheck() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        
        return check;
    }

    function checkPhoneSize() {
        let defaultSize = 'phone-4';

        let params = new URLSearchParams(location.search);
        let phoneSize = params.get('phone-size');

        if(phoneSize != null && (['phone-1', 'phone-2', 'phone-3', 'phone-5', 'iphone-11-promax', 'iphone-x']).includes(phoneSize)) {
            $(`.${defaultSize}`).addClass(phoneSize).removeClass(defaultSize);
        }

        if(mobileCheck()) {
            $('.h-screen').removeClass('h-screen');
            $('.overlays-containern').removeClass('h-full');
        }
    }

    function displayTime() {
        let time = (new Date()).toLocaleTimeString(undefined, {
            hour:   '2-digit',
            minute: '2-digit',
        });

        time = time.split(' ');
        time = time[0] ?? '12:00';
        $('.iphone-navbar .time').html(time);
        
    }

    function displayDate() {
        let weekday = (new Date()).toLocaleDateString(undefined, {
            weekday: 'short'
        });

        $('.homescreen .calendar-day').html(weekday);

        let month = (new Date()).toLocaleDateString(undefined, {
            month: 'short'
        });

        $('.homescreen .calendar-month').html(month);

        let date = (new Date()).toLocaleDateString(undefined, {
            day: 'numeric'
        });

        $('.homescreen .calendar-date').html(date);
        
    }

    function initIcons() {
        feather.replace();
    }

    // Screen/App Switcher
    function switchApp(appId = null, element = null) {
        let currentAppId = $('.display .artboard.active').attr('id');
        if(appId == null && element != null) {
            appId = $(element).data('screen-id');
        }

        if(appId !== '') {
            $('.display .artboard').removeClass('active');
            $('.display .artboard').addClass('hidden');

            $(`#${appId}`).removeClass('hidden');
            $(`#${appId}`).addClass('active');
        }

        switch(appId) {
            case 'contacts-app':
                displayContacts();
            break;
            case 'messages-app--msg':
                // Open message if there's a message id param
                // let messageId = getSearchParamsValue('message-id');
                // if(messageId !== null) {
                //     openMessageThread(messageId);
                // }

                $('.message-body').scrollTop($('.message-body')[0].scrollHeight);
                checkMessageTextFieldHeight();
            break;
            case 'messages-app--home':
                if(currentAppId === 'messages-app--msg') {
                    closeMessageThread($('#messages-app--msg'));
                }

                displayMessagesList();
                displayContacts();
            break;
            case 'photos-app':
                displayPhotos();
            break;
            default:
                if(currentAppId === 'messages-app--msg' && (appId !== 'messages-app--msg' && appId !== '')) {
                    closeMessageThread($('#messages-app--msg'));
                    clearInterval(textMsgFieldInterval);
                }
            break;
        }
    }

    function appSwitcher(event) {
        switchApp(null, $(this));
    }

    function checkCurrentPage() {
        let screen = getSearchParamsValue('screen');

        if(screen != null) {
            switchApp(screen);
        }
    }

    function getSearchParamsValue(param) {
        let params = new URLSearchParams(location.search);
        return params.get(param);
    }

    // Overlays
    function showOverlay(overlayId = null, element = null) {
        if(overlayId == null && element != null) {
            overlayId = $(element).data('overlay-id');
        }

        if(overlayId !== '') {
            $('.overlays-container .overlays').removeClass('active');
            $('.overlays-container .overlays').addClass('hidden');
            $('.overlays-container').removeClass('hidden');

            $(`#${overlayId}`).removeClass('hidden');
            $(`#${overlayId}`).addClass('active');
        }

        switch(overlayId) {
            case 'messages-app--msg-settings':
                displayMessageSettings();
            break;
            case 'messages-app--chat-settings':
                displayChatSettings();
            break;
            case 'messages-app--msg-choose-photo':
                displayPhotos('messages-app--msg-choose-photo');
            break;
        }
    }

    function hideOverlay(event) {
        if($(event.target).hasClass('overlay-btn') || $(this).hasClass('overlay-btn')) {
            event.preventDefault();
            return false;
        }

        if($(event.target).hasClass('hide-overlay-btn') == false && $(this).hasClass('hide-overlay-btn') == false
                && $(event.target).hasClass('overlays') == false) {
            event.preventDefault();

            return false;
        }


        let overlayTriggers = [
            $(event.target).hasClass('hide-overlay-btn'),
            $(event.target).hasClass('overlays'),
            $(this).hasClass('hide-overlay-btn'),
            $(this).hasClass('overlays')
        ];

        if(overlayTriggers.includes(true) == false) {
            event.preventDefault();
            return false;
        }

        let index   = overlayTriggers.indexOf(true);
        let element = $(event.target);

        if([0, 2].includes(index)) {
            overlayId = $(event.target).data('overlay-id');
            if($(event.target).data('overlay-id') == undefined) {
                overlayId = $(event.target).parent().data('overlay-id');
            }

            element = $('#' + overlayId);
        }

        if([1, 3].includes(index)) {
            element = $(this);
        }

        if($(element).hasClass('overlays')) {
            let close = true;
            if($(element).data('close-onclick') != undefined && [1, 3].includes(index)) {
                close = $(element).data('close-onclick');
            }

            if(close == true || close == 'true') {
                $(element).removeClass('active');
                $(element).addClass('hidden');
                $(element).parent().addClass('hidden');
            }
        }
    }

    function hideOverlayById(overlayId) {
        $(`#${overlayId}`).removeClass('active');
        $(`#${overlayId}`).addClass('hidden');
        $(`#${overlayId}`).parent().addClass('hidden');
    }

    function overlaySwitcher(event) {
        showOverlay(null, $(this));
    }

    // Contacts
    function createSampleContacts() {
        let contacts = [
            {
                'contact-id': null,
                'contact-icon': 'assets/imgs/iphone/contacts/sample-icon.png',
                'contact-name': 'Noah'
            },
            {
                'contact-id': null,
                'contact-icon': 'assets/imgs/iphone/contacts/sample-icon.png',
                'contact-name': 'Eunho'
            }
        ];

        let existingContacts = localStorage.getItem('contacts') ?? JSON.stringify({});
            existingContacts = JSON.parse(existingContacts);

        let index = 0;
        let newContacts = existingContacts;

        let createSampleContactsInterval = setInterval(function() {
            if(index > (contacts.length - 1)) {
                newContacts = JSON.stringify(newContacts);
                localStorage.setItem('contacts', newContacts);

                clearInterval(createSampleContactsInterval);
                return;
            }

            let contact = contacts[index] ?? null;
            if(contact != null) {
                contact['contact-id'] = Date.now();
                newContacts[contact['contact-id']] = contact;
            }

            index++;
        }, 1000);
    }

    function displayContacts() {
        // Replace this with contacts loaded from local storage
        let contacts = localStorage.getItem('contacts') ?? JSON.stringify({});
        contacts = JSON.parse(contacts);

        // Sort contacts alphabetically
        let sortedContacts = [];
        let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        $.each(alphabet, function(i, letter) {
            $.each(contacts, function(j, contact) {
                if(contact['contact-name'][0] == letter.toUpperCase()) {
                    sortedContacts[letter.toUpperCase()] = sortedContacts[letter.toUpperCase()] ?? [];
                    sortedContacts[letter.toUpperCase()].push(contact);
                }
            });
        });

        // Hide empty state by default
        $('.contact-list-empty').addClass('hidden');

        // Empty list first
        let cloneItems = $('.contacts-app .contacts-list .clone-item').clone();
        $('.contacts-app .contacts-list').html('');
        $('.contacts-app .contacts-list').append(cloneItems);

        cloneItems = $('.new-msg-options .contacts-list .clone-item').clone();
        $('.new-msg-options .contacts-list').html('');
        $('.new-msg-options .contacts-list').append(cloneItems);

        // Display contacts
        $.each(Object.keys(sortedContacts), function(i, key) {
            let sortedContact = sortedContacts[key] ?? [];
            
            $.each(sortedContact, function(j, contact) {
                let contactElem;

                // New Message - Contacts List
                contactElem = $('.new-msg-options .contacts-list .clone-item').clone();
                $(contactElem).removeClass('clone-item');
                $(contactElem).removeClass('hidden');

                let contactIcon = $(contactElem).find('.contacts-icon').find('img');
                $(contactIcon).attr('src', null);
                $(contactIcon).attr('src', contact['contact-icon'] ?? contact['contact-photo']);

                $(contactElem).find('.contacts-icon').html('');
                $(contactElem).find('.contacts-icon').append(contactIcon);

                $(contactElem).find('.contact-name').html(contact['contact-name']);

                $('.new-msg-options .contacts-list').append(contactElem);
                $(contactElem).attr('data-contact-id', contact['contact-id']);
                $(contactElem).on('click', onClickOfMessageThread);

                // Contacts
                let contactHeader = $('.contacts-app .contacts-list .header.clone-item').clone();

                $(contactHeader).removeClass('clone-item');
                $(contactHeader).removeClass('hidden');
                $(contactHeader).html(key.toUpperCase());
                $('.contacts-app .contacts-list').append(contactHeader);

                contactElem = null;
                contactElem = $('.contacts-app .contacts-list .contact-name.clone-item').clone();

                $(contactElem).removeClass('clone-item');
                $(contactElem).removeClass('hidden');

                $(contactElem).html(contact['contact-name']);
                $(contactElem).attr('data-contact-id', contact['contact-id']);

                $('.contacts-app .contacts-list').append(contactElem);
            });
        });

        // Show empty state if contact list is empty
        $('.contact-list-empty').addClass('hidden');
        if(Object.keys(contacts).length === 0 || Object.keys(contacts).length === undefined) {
            $('.contact-list-empty').removeClass('hidden');
        }

        // Display main contact
        $('#contacts-app .owner-card').addClass('hidden');

        let mainContactId = localStorage.getItem('main-account-id');
        if(mainContactId != null) {
            let mainContact = getContactDetails(mainContactId);

            $('#contacts-app .owner-card .contacts-icon').find('img').attr('src', mainContact['contact-photo']);
            $('#contacts-app .owner-card .contact-name').html(mainContact['contact-name']);
            $('#contacts-app .owner-card').removeClass('hidden');
        }
    }

    function getContactDetails(contactId) {
        let contacts = localStorage.getItem('contacts') ?? JSON.stringify({});
        contacts = JSON.parse(contacts);
        
        return contacts[contactId] ?? null;
    }

    function addNewContact(event) {
        // Get photo link, name, nickname
        let inputs     = $('.new-contact-form .new-contact-form-input');
        let newContact = {};

        // Get inputs
        $.each(inputs, function(i, input) {
            let name = $(input).attr('name');

            if($(input).val() == undefined || $(input).val() == null || $(input).val() == "") {
                return false;
            }

            newContact[name] = $(input).val();

            // Clear values
            $(input).val(null);
        });

        if(Object.keys(newContact).length !== inputs.length) {
            return false;
        }

        // Other infos
        newContact['contact-id']   = Date.now();
        newContact['contact-name'] = newContact['first-name'] + ' ' + newContact['last-name'];

        // Convert main-account value to bool
        newContact['main-account'] = newContact['main-account'] == 'yes' ? true : false;

        // Store new contact
        let existingContacts = localStorage.getItem('contacts') ?? JSON.stringify({});
            existingContacts = JSON.parse(existingContacts);

        existingContacts[newContact['contact-id']] = newContact;
        existingContacts = JSON.stringify(existingContacts);
        localStorage.setItem('contacts', existingContacts);

        // Store main account's id
        if(newContact['main-account']) {
            localStorage.setItem('main-account-id', newContact['contact-id']);
        }

        // Clear photo preview
        $('#new-contact-photo-preview').attr('src', 'assets/imgs/iphone/contacts/sample-icon.png');

        // Go back to Contacts App
        switchApp('contacts-app');
    }

    function previewContactPhoto(event) {
        let contactPhotoInputId = $(this).data('photo-input');
        let contactPhotoLink    = $(`#${contactPhotoInputId}`).val();

        let contactPhotoPrevId  = $(this).data('photo-preview');
        $(`#${contactPhotoPrevId}`).attr('src', contactPhotoLink);
    }

    // Photos
    function displayPhotos(container = 'photos-app') {
        let photos = localStorage.getItem('photos') ?? JSON.stringify({});
        photos = JSON.parse(photos);

        let cloneItems = $(`#${container} .photo-gallery`).find('.clone-item').clone();
        $(`#${container} .photo-gallery`).html('');
        $(`#${container} .photo-gallery`).append(cloneItems);

        $.each(photos, function(i, photo) {
            let photoDisplay = $(`#${container} .photo-gallery`).find('.clone-item').clone();

            $(photoDisplay).attr('data-photo-id', i);
            $(photoDisplay).attr('data-selected-photo', false);

            $(photoDisplay).find('img').attr('src', photo);
            $(photoDisplay).find('img').attr('data-photo-id', i);
            $(photoDisplay).removeClass('clone-item');
            $(photoDisplay).removeClass('hidden');

            $(`#${container} .photo-gallery`).append(photoDisplay);
            $(`#${container} .photo-gallery`).find('.send-photo-btn').on('click', function() {
                if(container == 'messages-app--msg-choose-photo') {
                    $(`#${container} .photo-gallery`).find('.selected-photo').addClass('hidden');
                    $(`#${container} .photo-gallery`).find('.send-photo-btn').attr('data-selected-photo', 'false');

                    $(this).find('.selected-photo').removeClass('hidden');
                    $(this).attr('data-selected-photo', 'true');

                }
            });
        });

        $(`#${container}`).find('.choose-photo-btn').on('click', function() {
            let selectedPhoto   =  $(`#${container} .photo-gallery`).find('[data-selected-photo="true"');
            let selectedPhotoId = $(selectedPhoto).data('photo-id');

            sendMessage(getPhotoFromGallery(selectedPhotoId), 'image');
            hideOverlayById(container);
        });
        
    }

    // Messages
    function showMessageTapbackOverlay(chatId) {
        let message     = getMessage(chatId);
        showOverlay('messages-app--msg-tapback');

        let messageBody     = $('#messages-app--msg .message-body').clone();
        let reactComponents = $('#messages-app--msg-tapback .message-body').parent().find('.react-components').clone();
        let options         = $('#messages-app--msg-tapback .tapback-options').parent().clone();

        $('#messages-app--msg-tapback .message-body').html('');
        $('#messages-app--msg-tapback .message-body').append(options);
        $('#messages-app--msg-tapback .message-body').find('.overlay-btn').on('click', overlaySwitcher);
        $('#messages-app--msg-tapback .message-body').find('.show-react-bbl-btn').on('click', showReactBubble);

        $('#messages-app--msg-tapback .message-body').find('.show-react-bbl-btn').attr('data-chat-id', chatId);
        $('#messages-app--msg-tapback .message-body').find('.display-chat-settings-btn').attr('data-chat-id', chatId);

        let reactId     = message['sender'];
        let reactBubble = $(reactComponents).find(`.${reactId}-react-bbl`);

        $.each($(messageBody).children(), function(i, stackedMessages) {
            let cloneStack = $(stackedMessages).clone();
            $(cloneStack).html('');

            $.each($(stackedMessages).children(), function(j, child) {
                let reactWrapper = null;
                let reactImg     = null;

                if($(child).hasClass('react-wrapper')) {
                    reactWrapper = child;
                    child        = $(reactWrapper).find('p');
                    reactImg     = $(reactWrapper).find('img');
                }

                if($(child).data('chat-id') !== chatId) {
                    return;
                }

                if($(child).hasClass('react-wrapper')) {
                    reactWrapper = child;
                    child        = $(reactWrapper).find('p');
                    reactImg     = $(reactWrapper).find('img');
                }

                $(child).removeClass('no-tail');
                
                // Used to wrap the react bubble
                let childWrapper = $('<div class="react-bbl-wrapper w-full flex justify-start"></div>');
                if(message['sender'] == 'from-me') {
                    childWrapper = $('<div class="react-bbl-wrapper w-full flex justify-end"></div>');
                }

                // If chat bubble is currently clicked, enclose with a wrapper
                if($(child).data('chat-id') == chatId) {
                    if(reactWrapper != null) {
                        $(reactWrapper).append(child);
                        $(cloneStack).append(reactWrapper);
                    } else {
                        $(childWrapper).append(child);
                        $(cloneStack).append(childWrapper);
                    }

                    $('#messages-app--msg-tapback').attr('data-current-chat-id', chatId);

                    // Append clones stack on message to get position & height
                    $('#messages-app--msg-tapback .message-body').prepend(cloneStack);

                    // Fix alignment of dialog box base on sender of chat
                    $('#messages-app--msg-tapback .tapback-options').parent().addClass('justify-end');
                    if(message['sender'] == 'from-them') {
                        $('#messages-app--msg-tapback .tapback-options').parent().removeClass('justify-end');
                        $('#messages-app--msg-tapback .tapback-options').parent().addClass('justify-start');
                    }

                    // Add chat bubble to react selection overlay
                    let chatPreview = $(reactWrapper ?? childWrapper).clone();
                    $('#messages-app--msg-tapback-react .chat-bubble-container').html('');
                    $('#messages-app--msg-tapback-react .chat-bubble-container').append(chatPreview);

                    $('.react-select').attr('data-chat-id', chatId);
                } else {
                    $(cloneStack).append(child);
                }
            });
        });
    }

    function checkMessageTextFieldHeight() {
        if($('.artboard.active').attr('id') === 'messages-app--msg') {
            let textfield = $('#message-textfield');
            if($(textfield).data('init-height') == undefined) {
                $(textfield).data('init-height', $(textfield).height());
            }

            textMsgFieldInterval = setInterval(function() {
                let currentHeight = $(textfield).height();

                if(currentHeight > $(textfield).data('init-height')) {
                    $('.message-textfield-container').removeClass('rounded-full');
                    $('.message-textfield-container').addClass('rounded-xl');
                    $(textfield).removeClass('rounded-full');
                    $(textfield).addClass('rounded-xl');
                } else {
                    $('.message-textfield-container').removeClass('rounded-xl');
                    $('.message-textfield-container').addClass('rounded-full');
                    $(textfield).removeClass('rounded-xl');
                    $(textfield).addClass('rounded-full');
                }
            }, 500);
        }
    }

    function onMessageTextFieldFocus() {
        $('.sender-switcher').removeClass('hidden');
        $('.send-message-btn').removeClass('hidden');
        $('.send-audio-message-btn').addClass('hidden');
        $('.message-body').scrollTop($('.message-body')[0].scrollHeight);

        if(mobileCheck() == false) {
            // $('.keyboard-container').removeClass('hidden');
            // $('#keyboard').data('keyboard-state', 'up');
        }
    }

    function onMessageTextFieldFocusOut() {
        if($('.message-textfield').val() == '') {
            if($('#sender-switcher').is(":hover") == false && $('#keyboard').data('keyboard-state') == 'down') {
                $('.sender-switcher').addClass('hidden');
                $('.send-message-btn').addClass('hidden');
                $('.send-audio-message-btn').removeClass('hidden');
            }
        }
    }

    function messagesSenderSwitcher() {
        if($('.sender-switcher').data('sender') == 'from-me') {
            $('.sender-switcher').removeClass('from-me');
            $('.sender-switcher').addClass('from-them');
            $('.sender-switcher').data('sender', 'from-them');

            $('.sender-switcher').attr('title', "they're the sender");
        } else {
            $('.sender-switcher').removeClass('from-them');
            $('.sender-switcher').addClass('from-me');
            $('.sender-switcher').data('sender', 'from-me');

            $('.sender-switcher').attr('title', "you're the sender");
        }
    }

    function getMessage(chatId) {
        let contactId = $('#messages-app--msg').data('current-message-thread');
        if(contactId == undefined || contactId == null) {
            return;
        }

        let messages  = localStorage.getItem('messages') ?? JSON.stringify({});
        messages = JSON.parse(messages);

        return messages[contactId].thread[chatId] ?? null;
    }

    function displayMessagesList() {
        let messages = localStorage.getItem('messages') ?? JSON.stringify({});
        messages = JSON.parse(messages);

        // Dipslay pinned messages (Coming Soon)
        let messageListContainer = $('#messages-app--home .pin-messages');
        let cloneItems           = $('#messages-app--home .pin-messages').find('.clone-item').clone();

        $(messageListContainer).html('');
        $(messageListContainer).append(cloneItems);

        let pinnedCount = 0;
        $.each(messages, function(i, message) {
            if(message['is-pinned'] == true) {
                let messagePin = $(messageListContainer).find('.clone-item').last().clone();

                $(messagePin).removeClass('hidden');
                $(messagePin).removeClass('clone-item');

                message['contact']['contact-icon'] = message['contact']['contact-icon'] ?? (message['contact']['contact-photo'] ?? null);
                $(messagePin).find('.contacts-icon').find('img').attr('src', message['contact']['contact-icon']);
                $(messagePin).find('.contact-name').html(message['contact']['nickname'] ?? message['contact']['contact-name']);

                $(messagePin).attr('data-message-id', message['contact']['contact-id']);
                $(messagePin).attr('data-contact-id', message['contact']['contact-id']);

                // Append to message list container
                $(messageListContainer).append(messagePin);
                $(messagePin).on('click', onClickOfMessageThread);

                pinnedCount++;
            }
        });

        $(messageListContainer).addClass('mt-3 mb-5');
        if(pinnedCount == 0) {
            $(messageListContainer).removeClass('mt-3 mb-5');
        }

        // Messages List
        // Clear message list on every call of displayMessagesList
        messageListContainer = $('#messages-app--home .messages-list');
        cloneItems           = $('#messages-app--home .messages-list').find('.clone-item').clone();

        $(messageListContainer).html('');
        $(messageListContainer).append(cloneItems);

        // Display messages on list
        $.each(messages, function(i, message) {
            if(message['is-pinned'] == false) {
                let messageList = $(messageListContainer).find('.clone-item').last().clone();
                $(messageList).removeClass('hidden');
                $(messageList).removeClass('clone-item');

                message['contact']['contact-icon'] = message['contact']['contact-icon'] ?? (message['contact']['contact-photo'] ?? null);
                $(messageList).find('.contacts-icon').find('img').attr('src', message['contact']['contact-icon']);
                $(messageList).find('.contact-name').html(message['contact']['nickname'] ?? message['contact']['contact-name']);
                $(messageList).find('.message-preview').html(message['preview-message'] ?? 'No messages yet');

                // Default time
                let time     = (new Date()).toLocaleTimeString(undefined, {
                    hour:   '2-digit',
                    hour12:  true,
                    minute: '2-digit',
                });

                $(messageList).find('.message-date span').html(message['last-message-time'] ?? time);
                $(messageList).find('.pin-message').attr('data-message-id', message['contact']['contact-id']);
                $(messageList).find('.pin-message').on('click', pinMessage);

                $(messageList).find('.delete-message').attr('data-message-id', message['contact']['contact-id']);
                $(messageList).find('.delete-message').on('click', deleteMessageThread);

                $(messageList).attr('data-message-id', message['contact']['contact-id']);
                $(messageList).find('.message-swipe').attr('data-message-id', message['contact']['contact-id']);
                $(messageList).attr('data-contact-id', message['contact']['contact-id']);
                $(messageList).find('.message-swipe').attr('data-contact-id', message['contact']['contact-id']);

                // Append to message list container
                $(messageListContainer).append(messageList);
                $(messageList).find('.message-swipe').on('click', onClickOfMessageThread);
            }
        });
    }

    function displayMessageSettings() {
        let messageId = $('#messages-app--msg').data('current-message-thread');
        if(messageId == undefined || messageId == null) {
            return;
        }

        let messages = localStorage.getItem('messages') ?? JSON.stringify({});
        messages = JSON.parse(messages);

        let messageThread = messages[messageId] ?? null;
        if(messageThread == null) {
            hideOverlayById('messages-app--msg-settings');
        }

        messageThread['contact']['contact-icon'] = messageThread['contact']['contact-icon'] ?? messageThread['contact']['contact-photo'];
        $('#messages-app--msg-settings .contacts-icon img').attr('src', messageThread['contact']['contact-icon']);
        $('#messages-app--msg-settings .btn-preview-photo').on('click', previewContactPhoto);

        let nickname = messageThread['contact']['nickname'] ?? null;
        $('#messages-app--msg-settings .message-nickname').val(nickname);

        if(messageThread['is-pinned']) {
            $('#messages-app--msg-settings .pin-message-setting').val('yes').change();
        }

        let defaultFontSize = localStorage.getItem('font-size') ?? 16;
        $('#messages-app--msg-settings .font-size').val(defaultFontSize);

        $('#messages-app--msg-settings .delete-message').attr('data-message-id', messageId);
        $('#messages-app--msg-settings .delete-message').on('click', deleteMessageThread);

        $('#messages-app--msg-settings .message-save-settings').attr('data-message-id', messageId);
        $('#messages-app--msg-settings .message-save-settings').on('click', function() {
            let messageId = $('#messages-app--msg').data('current-message-thread');
            if(messageId == undefined || messageId == null) {
                return;
            }

            let messages = localStorage.getItem('messages') ?? JSON.stringify({});
            messages = JSON.parse(messages);
    
            let messageThread = messages[messageId] ?? null;
            if(messageThread == null) {
                hideOverlayById('messages-app--msg-settings');
            }

            // Save changes in Pin Message
            let isPinned = $('#messages-app--msg-settings .pin-message-setting').val();
            isPinned = isPinned == "yes" ? true : false;
            messageThread['is-pinned'] = isPinned;

            messages[messageId] = messageThread;
            messages            = JSON.stringify(messages);
            localStorage.setItem('messages', messages);

            let fontSize = $('#messages-app--msg-settings .font-size').val();
            localStorage.setItem('font-size', fontSize);
            initSettings();

            // Apply custom photo and nickname
            let customPhoto    = $('#message-photo').val();
            let customNickname = $('#messages-app--msg-settings .message-nickname').val();

            $('#messages-app--msg .message-name span').html(customNickname);
            if(customPhoto != '') {
                $('#messages-app--msg .contacts-icon img').attr('src', customPhoto);
            }

            // Close message settings
            hideOverlayById('messages-app--msg-settings');
        });
    }

    function displayChatSettings() {
        let chatId  = $('#messages-app--msg-tapback .display-chat-settings-btn').attr('data-chat-id');
        let message = getMessage(chatId);

        // Display chat settings
        $('#messages-app--chat-settings .chat-content').removeClass('hidden');
        $('#messages-app--chat-settings .chat-content').html(message['content']);
        
        message['type'] = message['type'] ?? 'text';
        if(message['type'] == 'image') {
            $('#messages-app--chat-settings .chat-content').addClass('hidden');
        }

        let delivered = message['content'] ? 'yes' : 'no';
        let read      = message['read'] ? 'yes' : 'no';
        let readAt    = message['read-at'] != null ? message['read-at'] : null;

        $('#messages-app--chat-settings .delivered-chat-setting').val(delivered).change();
        $('#messages-app--chat-settings .read-chat-setting').val(read).change();
        $('#messages-app--chat-settings .read-at-chat-setting').val(readAt).change();

        // Delete the chat bubble
        $('#messages-app--chat-settings .delete-chat').attr('data-chat-id', chatId);
        $('#messages-app--chat-settings .delete-chat').on('click', function() {
            let chatId    = $(this).data('chat-id');
            let chat      = getMessage(chatId);
            let messageId = chat['message-thread-id'];

            let messages  = localStorage.getItem('messages') ?? JSON.stringify({});
            messages      = JSON.parse(messages);

            let message   = messages[messageId] ?? null;
            if(message != null) {
                delete message['thread'][chatId];

                messages[messageId] = message;
                messages = JSON.stringify(messages);
                localStorage.setItem('messages', messages);

                hideOverlayById('messages-app--chat-settings');
                openMessageThread(messageId);
            }
        });

        $('#messages-app--chat-settings .chat-save-settings').attr('data-chat-id', chatId);
        $('#messages-app--chat-settings .chat-save-settings').on('click', function() {
            let chatId    = $(this).data('chat-id');
            let chat      = getMessage(chatId);
            let messageId = chat['message-thread-id'];

            let messages = localStorage.getItem('messages') ?? JSON.stringify({});
            messages = JSON.parse(messages);

            if(chat != null) {
                chat['content']   = $('#messages-app--chat-settings .chat-content').val();
                chat['delivered'] = $('#messages-app--chat-settings .delivered-chat-setting').val();
                chat['delivered'] = chat['delivered'] == 'yes' ? true : false;
                chat['read']      = $('#messages-app--chat-settings .read-chat-setting').val();
                chat['read']      = chat['read'] == 'yes' ? true : false;
                chat['read-at']   = $('#messages-app--chat-settings .read-at-chat-setting').val();

                messages[messageId]['thread'][chatId] = chat;
                messages = JSON.stringify(messages);
                localStorage.setItem('messages', messages);

                hideOverlayById('messages-app--chat-settings');
                openMessageThread(messageId);
            }
        });
    }

    function onClickOfMessageThread(event) {
        let contactId = $(this).data('contact-id');
        openMessageThread(contactId);
    }

    function openMessageThread(contactId) {
        let messages = localStorage.getItem('messages') ?? JSON.stringify({});
        messages = JSON.parse(messages);

        let contact = getContactDetails(contactId);
        if(contact === null) {
            return;
        }

        let messageThread = messages[contactId] ?? null;
        if(messageThread == null) {
            messageThread = createMessageThread(contact, messages);
        }
        
        if(messageThread !== null) {
            let hideOverlayBtn = $('#messages-app--new-msg-options .hide-overlay-btn');

            if(hideOverlayBtn[0] !== null && $('#messages-app--new-msg-options').hasClass('hidden') == false) {
                $(hideOverlayBtn).click();
            }

            $('#messages-app--msg').attr('data-current-message-thread', contactId);
            if(getSearchParamsValue('screen') !== 'messages-app--msg') {
                switchApp('messages-app--msg');
            }

            displayChatBubbles(messageThread);

            // Update header
            contact['contact-icon'] = contact['contact-icon'] ?? contact['contact-photo'];
            $('#messages-app--msg .contacts-icon').find('img').attr('src', contact['contact-icon']);
            $('#messages-app--msg .message-name span').html(contact['nickname'] ?? contact['contact-name']);
        }
    }

    function createMessageThread(contact, messages) {
        messages[contact['contact-id']] = {
            'contact': contact,
            'preview-message': null,
            'last-message-date': null,
            'last-message-time': null,
            'thread': {},
            'is-pinned': false,
        };

        let newMessage = messages[contact['contact-id']];
        messages = JSON.stringify(messages);
        localStorage.setItem('messages', messages);

        console.log('Creates new thread of message!');
        return newMessage;
    }

    function displayChatBubbles(messageThread) {
        let cloneItems = $('#messages-app--msg').find('.message-body').find('.clone-item').clone();

        $('#messages-app--msg').find('.message-body').html('');
        $('#messages-app--msg').find('.message-body').append(cloneItems);

        $.each(messageThread.thread ?? {}, function(i, bubble) {
            displayChatBubble(bubble);
        });

        $('.message-body').scrollTop($('.message-body')[0].scrollHeight);
    }

    function pinMessage(event) {
        let messages = localStorage.getItem('messages') ?? JSON.stringify({});
        messages = JSON.parse(messages);

        let messageId = $(this).data('message-id');
        let message = messages[messageId] ?? null;

        if(message != null) {
            message['is-pinned'] = true;
            messages[messageId] = message;
            messages = JSON.stringify(messages);
            localStorage.setItem('messages', messages);
        }

        displayMessagesList();
    }

    function deleteMessageThread(event) {
        let messages = localStorage.getItem('messages') ?? JSON.stringify({});
        messages = JSON.parse(messages);

        let messageId = $(this).data('message-id');
        let message = messages[messageId] ?? null;

        if(message != null) {
            delete messages[messageId];

            messages = JSON.stringify(messages);
            localStorage.setItem('messages', messages);
        }
        
        displayMessagesList();
    }

    function onSendMessage(event) {
        sendMessage($('.message-textfield').val(), 'text');
    }

    function sendMessage(content = null, type = 'text') {
        if(content == null) {
            return;
        }

        let sender   = $('.sender-switcher').data('sender');
        let date     = (new Date()).toLocaleDateString(undefined, {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
        let time     = (new Date()).toLocaleTimeString(undefined, {
            hour:   '2-digit',
            hour12:  true,
            minute: '2-digit',
        });

        let messageThreadId = $('#messages-app--msg').data('current-message-thread');
        if(messageThreadId == undefined || messageThreadId == null) {
            return;
        }

        let bubble = {
            'id': Date.now(),
            'message-thread-id': messageThreadId,
            'sender': sender,
            'content': content,
            'date': date,
            'time': time,
            'delivered': false,
            'read': false,
            'read-at': null,
            'reacts': {
                'from-me': null,
                'from-them': null,
            },
            'reply': false,
            'reply-to': null,
            'type': type
        };

        // Store and display chat bubble
        storeChatBubble(messageThreadId, bubble);
        displayChatBubble(bubble);

        // Clear text field
        if(type ==='text') {
            $('#messages-app--msg #message-textfield').val('');
        }
    }

    function storeChatBubble(messageThreadId, bubble) {
        let messages = localStorage.getItem('messages') ?? JSON.stringify({});
        messages = JSON.parse(messages);

        let messageThread = messages[messageThreadId] ?? null;
        if(messageThread !== null) {
            messageThread['thread'][bubble['id']] = bubble;
            messageThread['last-message-date'] = bubble['date'];
            messageThread['last-message-time'] = bubble['time'];
            messageThread['preview-message']   = bubble['content'];

            bubble['type'] = bubble['type'] ?? 'text';
            if(bubble['type'] == 'image') {
                messageThread['preview-message'] = 'Attachment: 1';
            }
        }

        messages[messageThreadId] = messageThread;
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    function displayChatBubble(bubble, messageBody = null) {
        let cloneItemIds = {
            'from-me': 'stacked-messages-from-me',
            'from-them': 'stacked-messages-from-them'
        };

        // Clone stacked messages element
        let cloneItemId      = cloneItemIds[bubble['sender']];
        let stackedMessages  = $(`.messages-app--msg .message-body .${cloneItemId}.clone-item`).clone();
        $(stackedMessages).removeClass('clone-item');
        $(stackedMessages).removeClass('hidden');

        // Use latest stacked messages if there's any
        let lastStackedMsgs  = $(`.messages-app--msg .message-body .stacked-messages`).last();
        if($(lastStackedMsgs).hasClass('clone-item') == false && $(lastStackedMsgs).hasClass(cloneItemId)) {
            stackedMessages = null;
            stackedMessages = lastStackedMsgs;
        }

        // Create a bubble
        let bubbleElement = $("<p>");
        $(bubbleElement).addClass(bubble['sender']);
        $(bubbleElement).attr('data-chat-id', bubble['id']);

        bubble['type'] = bubble['type'] ?? 'text';
        if(bubble['type'] == 'text') {
            $(bubbleElement).html(bubble['content']);
        }

        if(bubble['type'] == 'image') {
            if(bubble['content'] == null) {
                return false;
            }

            let image = $("<img />");
            $(image).attr('src', bubble['content']);

            $(bubbleElement).append(image);
            $(bubbleElement).addClass('image').addClass('no-tail');
        }

        // Remove tail of previous chat buble
        if($(stackedMessages).find('p').length > 0) {
            let bubbleCount = $(stackedMessages).find('p').length;
            let prevBubble  = $(stackedMessages).find('p')[bubbleCount - 1];

            $(prevBubble).addClass('no-tail');
        }

        // Append reacts
        let react     = getReactToDisplay(bubble).react;
        let reactFrom = getReactToDisplay(bubble).reactFrom;

        let reactWrapper = null;
        if(react !== null) {
            reactWrapper = displayBubbleReact(bubble, bubbleElement, react, reactFrom);

            // Add to message body
            $(stackedMessages).append(reactWrapper);
            $('.messages-app--msg .message-body').append(stackedMessages);
            $('.messages-app--msg .message-body').scrollTop($('.message-body')[0].scrollHeight);

            // Reposition react icons base on bubble's width
            repositionBubbleReact(bubble, bubbleElement, reactWrapper);
        } else {
            // Add to message body
            $(stackedMessages).append(bubbleElement);
            $('.messages-app--msg .message-body').append(stackedMessages);
            $('.messages-app--msg .message-body').scrollTop($('.message-body')[0].scrollHeight);
        }

        if($(bubbleElement).height() > 20 && $(bubbleElement).height() <= 40) {
            if((bubble['width'] ?? null) == null) {
                let bubbleWidth    = $(bubbleElement).width();
                let minWidth       = bubbleWidth / 2;
                minWidth           = minWidth + (minWidth / 2);

                let randomBblWidth = Math.floor(Math.random() * (bubbleWidth - minWidth + 1)) + minWidth;
                bubble['width']    = randomBblWidth;
                storeChatBubble(bubble['message-thread-id'], bubble);

                $(bubbleElement).attr('style', `width: ${randomBblWidth}px!important;`);
            } else {
                let bubbleWidth = bubble['width'] ?? $(bubbleElement).width();
                $(bubbleElement).attr('style', `width: ${bubbleWidth}px!important;`);
            }

            if(react !== null && reactWrapper !== null) {
                // Reposition react icons base on bubble's width
                repositionBubbleReact(bubble, bubbleElement, reactWrapper);
            }
        } 


        if(bubble['sender'] == 'from-me' && bubble['delivered']) {
            let bubbleParent = $(bubbleElement).parent();
            if($(bubbleElement).parent().hasClass('react-wrapper')) {
                bubbleParent = $(bubbleElement).parent().parent();
            }

            if($(bubbleParent).hasClass('stacked-messages-from-me')) {
                if(bubble['read'] == true) {
                    $(bubbleParent).append('<small class="delivered-tag font-semibold text-gray-400 text-right"> Read </small>');
                } else {
                    $(bubbleParent).append('<small class="delivered-tag font-semibold ios-primary-color text-right"> Delivered </small>');
                }
            }
        }
    }

    function getReactToDisplay(bubble) {
        let react = bubble['reacts']['from-me'] ?? bubble['reacts']['from-them'];
        let reactFrom = bubble['reacts']['from-me'] != null ? 'from-me' : null;
        reactFrom = bubble['reacts']['from-them'] != null ? 'from-them' : reactFrom;

        return {
            'react': react,
            'reactFrom': reactFrom,
        };
    }

    function getPhotoFromGallery(photoId) {
        let photos = localStorage.getItem('photos') ?? JSON.stringify({});
        photos = JSON.parse(photos);

        return photos[photoId] ?? null;
    }

    function displayBubbleReact(bubble, bubbleElement, react, reactFrom) {
        let reactWrapper = $('<div class="react-wrapper flex mt-4 justify-start" style="position: relative;">');
        if(bubble['sender'] == 'from-me') {
            reactWrapper = $('<div class="react-wrapper flex mt-4 justify-end" style="position: relative;">');
        }

        let reactIcon     = $('<img class="react-icon" />');
        let iconImageRoot = "assets/imgs/iphone/messages/";
        let reactIconImg  = iconImageRoot.concat(getReactIcon(react, bubble['sender'], reactFrom));

        $(reactIcon).attr('src', reactIconImg);
        $(reactIcon).attr('data-chat-id', bubble['id']);
        $(reactIcon).attr('data-react', react);
        $(reactIcon).attr('data-react-from', reactFrom);

        $(reactWrapper).append(reactIcon);
        $(reactWrapper).append(bubbleElement);

        return reactWrapper;
    }

    function repositionBubbleReact(bubble, bubbleElement, reactWrapper) {
        let reactIcon  = $(reactWrapper).find('.react-icon');
        let width      = $(bubbleElement).innerWidth() - 15;
        let height     = ($(bubbleElement).innerHeight() - $(reactIcon).innerHeight()) / 3;
        console.log("Height: " + height);
        console.log("Width: " + width);

        if(bubble['sender'] == 'from-me') {
            $(reactIcon).attr('style', `right: ${width}px!important; top: -${height}px!important;`);
        }

        if(bubble['sender'] == 'from-them') {
            $(reactIcon).attr('style', `left: ${width}px!important; top: -${height}px!important;`);
        }

        if(mobileCheck()) {
            console.log("Device is mobile. Repositioning reacts on chat bubbles.");

            height = ($(reactIcon).innerHeight() / 2) - 2;
            console.log("Height: " + height);
            console.log("Width: " + width);

            // if(height < 2) {
            //     height = $(bubbleElement).innerHeight() / 2;
            //     console.log("Height lower than 2px... Changed to: " + height);
            // }

            if(bubble['sender'] == 'from-me') {
                $(reactIcon).attr('style', `right: ${width}px!important; top: -${height}px!important;`);
            }
    
            if(bubble['sender'] == 'from-them') {
                $(reactIcon).attr('style', `left: ${width}px!important; top: -${height}px!important;`);
            }
        }
    }

    function updateChatBubbleReact(event) {
        let chatId  = $(this).data('chat-id');
        let message = getMessage(chatId);

        let reactFrom = $(this).data('chat-react-from');
        let react     = $(this).data('react');

        if($(this).hasClass('btn-remove-react') == false) {
            message['reacts'][reactFrom] = react;
        } else {
            message['reacts']['from-me']   = null;
            message['reacts']['from-them'] = null;
        }

        let messages  = localStorage.getItem('messages') ?? JSON.stringify({});
        messages = JSON.parse(messages);

        let messageThread = messages[message['message-thread-id']] ?? null;
        messageThread['thread'][chatId] = message;

        messages[message['message-thread-id']] = messageThread;

        messages = JSON.stringify(messages);
        localStorage.setItem('messages', messages);

        hideOverlayById('messages-app--msg-tapback-react');

        // Update chat bubble ui to display react
        let bubbleElement = $('#messages-app--msg [data-chat-id="' + chatId + '"]').clone();        
        let bblWrapper    = $('#messages-app--msg [data-chat-id="' + chatId + '"]').parent();

        if($(this).hasClass('btn-remove-react') == false) {
            if($(bblWrapper).hasClass('react-wrapper')) {
                bubbleElement = bubbleElement[1];
            }

            let reactWrapper  = displayBubbleReact(message, bubbleElement, react, reactFrom);

            // Replace the current react wrapper
            if($(bblWrapper).hasClass('react-wrapper')) {
                $(bblWrapper).replaceWith(reactWrapper);
            } else {
                // Replace chat bubble with react wrapper
                $('#messages-app--msg [data-chat-id="' + chatId + '"]').replaceWith(reactWrapper);
            }

            repositionBubbleReact(message, bubbleElement, reactWrapper);
        } else {
            if($(bblWrapper).hasClass('react-wrapper')) {
                if(bubbleElement.length > 1) {
                    bubbleElement = bubbleElement[1];
                }

                $(bblWrapper).replaceWith(bubbleElement);
            }
        }
    }

    function getReactIcon(react, bubbleSender, reactFrom, systemTheme = 'light') {
        let reactIcons = {
            'heart': {
                'from-me': {
                    'from-me': 'heart-react-for-self-[system-theme].png',
                    'from-them': 'heart-react-from-them-[system-theme].png',
                },
                'from-them': {
                    'from-me': 'heart-react-for-them-[system-theme].png',
                    'from-them': 'heart-react-for-themselve-[system-theme].png',
                }
            },
            'like': {
                'from-me': {
                    'from-me': 'like-react-for-self-[system-theme].png',
                    'from-them': 'like-react-from-them-[system-theme].png',
                },
                'from-them': {
                    'from-me': 'like-react-for-them-[system-theme].png',
                    'from-them': 'like-react-for-themselve-[system-theme].png',
                }
            },
            'dislike': {
                'from-me': {
                    'from-me': 'dislike-react-for-self-[system-theme].png',
                    'from-them': 'dislike-react-from-them-[system-theme].png',
                },
                'from-them': {
                    'from-me': 'dislike-react-for-them-[system-theme].png',
                    'from-them': 'dislike-react-for-themselve-[system-theme].png',
                }
            },
            'haha': {
                'from-me': {
                    'from-me': 'haha-react-for-self-[system-theme].png',
                    'from-them': 'haha-react-from-them-[system-theme].png',
                },
                'from-them': {
                    'from-me': 'haha-react-for-them-[system-theme].png',
                    'from-them': 'haha-react-for-themselve-[system-theme].png',
                }
            },
            'emphasize': {
                'from-me': {
                    'from-me': 'emphasize-react-for-self-[system-theme].png',
                    'from-them': 'emphasize-react-from-them-[system-theme].png',
                },
                'from-them': {
                    'from-me': 'emphasize-react-for-them-[system-theme].png',
                    'from-them': 'emphasize-react-for-themselve-[system-theme].png',
                }
            },
            'question': {
                'from-me': {
                    'from-me': 'question-react-for-self-[system-theme].png',
                    'from-them': 'question-react-from-them-[system-theme].png',
                },
                'from-them': {
                    'from-me': 'question-react-for-them-[system-theme].png',
                    'from-them': 'question-react-for-themselve-[system-theme].png',
                }
            }
        };

        let reactIcon = reactIcons[react][bubbleSender][reactFrom] ?? '';
        reactIcon = reactIcon.replace('[system-theme]', systemTheme);

        return reactIcon;
    }

    function showReactBubble(event) {
        // Hide options
        $('#messages-app--msg-tapback .tapback-options').parent().addClass('hidden');

        // Get chat info
        let chatId  = $(this).data('chat-id');
        let message = getMessage(chatId);

        // Clone react bubble
        let messageBody     = $('#messages-app--msg .message-body');
        let reactComponents = $('#messages-app--msg-tapback .message-body').parent().find('.react-components').clone();

        let reactId         = message['sender'];
        let reactBubble     = $(reactComponents).find(`.${reactId}-react-bbl`);

        $('#messages-app--msg-tapback .react-bbl-wrapper').prepend(reactBubble);
        $('#messages-app--msg-tapback .react-bbl-wrapper').children().first().attr('style', `margin-top: -52px!important;`);

        $('#messages-app--msg-tapback .react-wrapper').prepend(reactBubble);
        $('#messages-app--msg-tapback .react-wrapper').children().first().attr('style', `margin-top: -84px!important;`);

        $('#messages-app--msg-tapback .close-tapback-overlay').on('click', function() {
            $('#messages-app--msg-tapback .tapback-options').parent().removeClass('hidden');
        });
    }

    function closeMessageThread(element) {
        $(element).attr('data-current-message-thread', null);
        let cloneItems = $(element).find('.message-body').find('.clone-item').clone();

        $(element).find('.message-body').html('');
        $(element).find('.message-body').append(cloneItems);
    }

    function exportMessage(event) {
        let exportBtnId = $(this).data('export-id');
        let exportBtn   = $('#screen').find(exportBtnId).clone();

        $('#screen').find(exportBtnId).remove();

        html2canvas(document.querySelector("#screen")).then(canvas => {
            canvas.toBlobHD(function(blob) {
                let date = Date.now();
                saveAs(blob, `export-${date}.png`); 
            });
        });

        let exportContainer = $(this).data('export-container');
        $(exportContainer).append(exportBtn);
        $(exportBtn).on('click', exportMessage);
    }

    // Events & Initialization
    function bindEvents() {
        $('.app-icon').on('click', appSwitcher);
        $('.overlay-btn').on('click', overlaySwitcher);
        $('.overlays').on('click', hideOverlay);
        $('.hide-overlay-btn').on('click', hideOverlay);

        $('.new-contact-save-btn').on('click', addNewContact);
        $('.btn-preview-photo').on('click', previewContactPhoto);

        $('.new-msg-contact').on('click', onClickOfMessageThread);
        $('.message-textfield').on('focus', onMessageTextFieldFocus);
        $('.message-textfield').on('focusout', onMessageTextFieldFocusOut);
        $('.sender-switcher').on('click', messagesSenderSwitcher);
        $('.send-message-btn').on('click', onSendMessage);
        $('.react-select').on('click', updateChatBubbleReact);
        $('.show-react-bbl-btn').on('click', showReactBubble);

        $('.export-message-btn').on('click', exportMessage);

        $('#upload-photo').on('change', function() {
            const imgPath = document.querySelector('input[type=file]').files[0];
            const reader  = new FileReader();

            reader.addEventListener("load", function () {
                // Convert image file to base64 string and save to localStorage
                console.log("Store Photo: " + $('#upload-photo').data('store-photo-on-gallery'));
                if($('#upload-photo').data('data-store-photo-on-gallery') == true) {
                    let photoId = Date.now();

                    let photos  = localStorage.getItem('photos') ?? JSON.stringify({});
                    photos = JSON.parse(photos);

                    photos[photoId] = reader.result;
                    photos = JSON.stringify(photos);
                    localStorage.setItem("photos", photos);

                    return;
                }

                sendMessage(reader.result, 'image');
            }, false);
            
            if(imgPath) {
                reader.readAsDataURL(imgPath);
            }

            $('#upload-photo').attr('data-store-photo-on-gallery', true);
        });

        $('.upload-photo-and-send').on('click', function() {
            $('#upload-photo').attr('data-store-photo-on-gallery', false);
            $('#upload-photo').click();

            hideOverlayById('messages-app--msg-options');
        });

        $(document).click(function(event) {
            let bubbleElement = $(event.target);
            if($(event.target).hasClass('from-them') == false || $(event.target).hasClass('from-me') == false) {
                bubbleElement = $(event.target).parent();
            }

            if($(bubbleElement).hasClass('from-them') || $(bubbleElement).hasClass('from-me')) {
                if($(bubbleElement).hasClass('sender-switcher') == false) {
                    let chatId = $(bubbleElement).data('chat-id');

                    showMessageTapbackOverlay(chatId);
                }
            }
        });
    }

    function initSettings() {
        let fontSize = localStorage.getItem('font-size') ?? 16;
        $('body').attr('style', `font-size: ${fontSize}px!important`);
    }

    function init() {
        initIcons();
        initSettings();

        displayTime();
        timeInterval = setInterval(displayTime, 6000);

        displayDate();
        dateInterval = setInterval(displayDate, 43200000);

        checkPhoneSize();
        checkCurrentPage();
        bindEvents();
    }

    return {
        init: init,
        mobileCheck: mobileCheck,
        createSampleContacts: createSampleContacts
    }
})();