function showMessageTapbackOverlay(chatId) {
    let message     = getMessage(chatId);
    showOverlay('messages-app--msg-tapback');

    let messageBody     = $('#messages-app--msg .message-body').clone();
    let reactComponents = $('#messages-app--msg-tapback .message-body').parent().find('.react-components').clone();
    // $('#messages-app--msg-tapback .message-body').html('');

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
                $(child).addClass('no-tail');
                $(child).attr('style', 'background-color: transparent!important;');
                $(child).html('&nbsp;');
            } else {
                $(child).removeClass('no-tail');
            }

            // Used to wrap the react bubble
            let childWrapper = $('<div class="react-bbl-wrapper w-full flex justify-start"></div>');
            if(message['sender'] == 'from-me') {
                childWrapper = $('<div class="react-bbl-wrapper w-full flex justify-end"></div>');
            }

            // Append react icon if there's any before appending chat bubble
            if(reactImg != null) {
                $(childWrapper).append(reactImg);
            }
            $(childWrapper).append(child);

            // If chat bubble is currently clicked, enclose with a wrapper
            if($(child).data('chat-id') == chatId) {
                $(cloneStack).append(childWrapper);
            } else {
                $(cloneStack).append(child);
            }

            if($(child).data('chat-id') == chatId) {
                // Append clones stack on message to get position & height
                $('#messages-app--msg-tapback .message-body').append(cloneStack);

                // Position of chat bubble
                let posX = $(child).position().left;
                let posY = $(child).position().top;

                // $('#messages-app--msg-tapback .message-body').scrollTop(posY);

                // 2024-02-19: Cannot be clicked so I'll just make an overlay menu
                // Append react bubbles
                // let height = $(child).innerHeight() + 8;
                // $(reactBubble).attr('style', `margin-top: -${height}px!important;`);

                // // User's react to current chat bubble
                // $(reactBubble).attr('data-chat-id', chatId);
                // $(reactBubble).attr('data-chat-react-from', 'from-me');
                // // $(reactBubble).prepend('<small class="font-semibold ios-primary-color"> React from You </small>');
                // $(childWrapper).prepend(reactBubble);

                // The contact's react bubble
                // let contactReactBubble = $(reactBubble).clone();
                // height = height - 20;

                // $(contactReactBubble).attr('style', `margin-top: ${height}px!important;`);
                // $(contactReactBubble).addClass('flip-vertical');
                // $(contactReactBubble).attr('data-chat-react-from', 'from-them');
                // $(contactReactBubble).find('small').html('React from Them');
                // $(childWrapper).append(contactReactBubble);
                
                // Add listeners
                // $(reactBubble).on('click', updateChatBubbleReact);
                // $(contactReactBubble).on('click', updateChatBubbleReact);

                // Remove clonestack
                // $('#messages-app--msg-tapback .message-body').remove(cloneStack);
            }
        });

        // $('#messages-app--msg-tapback .message-body').append(cloneStack);
    });
}

function updateChatBubbleReact(event) {
    let chatId  = $(this).data('chat-id');
    let message = getMessage(chatId);

    var posX = $(this).position().left,
        posY = $(this).position().top;

    posX = (event.pageX - posX);
    posY = (event.pageY - posY);

    console.log(posX, posY);
    console.log(event);

    let reactCoordinates = {
        'from-me': {
            'heart': {
                left: 340,
                right: 364,
            },
            'like': {
                left: 385,
                right: 410,
            },
            'dislike': {
                left: 427,
                right: 451,
            },
            'haha': {
                left: 468,
                right: 496,
            },
            'emphasize': {
                left: 515,
                right: 535,
            },
            'question': {
                left: 555,
                right: 575,
            }
        },
        'from-them': {
            'heart': {
                left: 340,
                right: 364,
            },
            'like': {
                left: 385,
                right: 410,
            },
            'dislike': {
                left: 427,
                right: 451,
            },
            'haha': {
                left: 468,
                right: 496,
            },
            'emphasize': {
                left: 515,
                right: 535,
            },
            'question': {
                left: 555,
                right: 575,
            }
        }
    };

    let reactFrom = $(this).data('chat-react-from');
    $.each(reactCoordinates[message['sender']] ?? '', function(react, coordinates) {
        console.log(posX >= coordinates.left);
        console.log(posX <= coordinates.right);

        if(posX >= coordinates.left && posX <= coordinates.right) {
            // 1: sender: from-me = your own chat bubble
            // 2: sender: from-them = their chat bubble
            // Will add an edit setting to display the react from the sender
            message['reacts'][reactFrom] = react;

            let messages  = localStorage.getItem('messages') ?? JSON.stringify({});
            messages = JSON.parse(messages);

            let messageThread = messages[message['message-thread-id']] ?? null;
            messageThread['thread'][chatId] = message;

            messages[message['message-thread-id']] = messageThread;

            messages = JSON.stringify(messages);
            localStorage.setItem('messages', messages);

            hideOverlayById('messages-app--msg-tapback');

            // Update chat bubble ui to display react
            let bubbleElement = $('#messages-app--msg [data-chat-id="' + chatId + '"]').clone();
            let bblWrapper    = $('#messages-app--msg [data-chat-id="' + chatId + '"]').parent();

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
            return false;
        }
    });
}