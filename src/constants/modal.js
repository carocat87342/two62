export const NOTIFICATION = {
    BOOKED : {
        title: 'Vendor is booked!',
        icon: 'messages/group-21013.svg',
        description: 'Your payment has been received and will be held in escrow until the event is completed successfully. Assuming there are no disputes, we will pay the vendor 7 days after the event.',
        content: {
            title: 'Can we offer you more vendors for your event?',
            description: 'Let us help you find more vendors that are just right for your event',
            action: 'Show me more vendors',
            rate: true,
        },
    },
    DECLINE  : {
        title: 'The offer was rejected',
        icon: 'popups/Group 22262.svg',
        description: 'We have let the vendor know that you have decided to explore other options. Click here to tell us why this vendor was not a good fit, so we can match you with better options.',
        action: 'Tell Us Why',
        content: {
            title: 'Find another vendor',
            description: 'There are plenty more vendors on Maryoku, offering you great services at attractive rates',
            action: 'Click here to view other vendor options',
            rate: true,
        },
    },
    REQUIREMENT  : {
        title: 'Requirements update complected successfully',
        icon: 'popups/Group 22262.svg',
        description: 'The timer has been reset, you will receive new offers within 4 days',
        content:{
            action: 'Cool, Go To Booking',
            rate: false,
        },
    },
}

export const ACTION = {
    MORE_ACTIONS:{
        title: false,
        description: false,
        cancel: false,
        action: false,
    },
    NEGOTIATION: {
        title: 'Negotiation rate',
        icon: 'budget+screen/SVG/Asset%2010.svg',
        description: 'Submit the hourly or fixed rate below that you’d like to propose to Zenger Group',
        cancel: true,
        action: 'Update Vendor',
    },
    REMINDER: {
        title: 'Set a reminder',
        icon: 'Vendor Signup/Asset 522.svg',
        description: 'Want to come back to this later? We’ll send you a reminder so you never miss a deadline.',
        cancel: true,
        action: 'Done',
    },
    EVENT_CHANGE: {
        title: 'Change event details',
        icon: 'common/calendar-dark.svg',
        description: 'You can change or add event details and information.',
        cancel: true,
        action: 'Update Vendor',
    },
    COMMENT: {
        title: 'Comment',
        icon: 'responsive/Group 22880.svg',
        description: false,
        cancel: false,
        action: false
    },
    // SHARE: {
    //     title: 'Share \'Proposal\' With Your Colleague',
    //     cancel: false,
    //     action: 'Done'
    // },
    LOOK: {
        title: 'Look for something else',
        icon: 'responsive/Group 22879.svg',
        description: false,
        cancel: false,
        action: false
    }
}
