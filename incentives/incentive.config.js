// incentive.config.js – Central configuration for incentive system
export const INCENTIVE_CATEGORIES = {
    FINANCIAL: "financial",
    PHYSICAL: "physical",
    EXPERIENCE: "experience",
    OCCASION: "occasion",
    BUSINESS: "business"
};

export const INCENTIVE_TYPES = {
    CASHBACK: "cashback",
    DISCOUNT: "discount",
    GIFT_CARD: "gift_card",
    FREE_NIGHT: "free_night",
    UPGRADE: "upgrade",
    WELCOME_DRINK: "welcome_drink",
    BREAKFAST: "breakfast",
    SPA_CREDIT: "spa_credit",
    AIRPORT_TRANSFER: "airport_transfer",
    LATE_CHECKOUT: "late_checkout",
    EARLY_CHECKIN: "early_checkin",
    BIRTHDAY_PACKAGE: "birthday_package",
    ANNIVERSARY_PACKAGE: "anniversary_package",
    CORPORATE_RATE: "corporate_rate",
    MEETING_ROOM_CREDIT: "meeting_room_credit"
};

export const INCENTIVE_WEIGHTS = {
    [INCENTIVE_CATEGORIES.FINANCIAL]: 0.3,
    [INCENTIVE_CATEGORIES.PHYSICAL]: 0.2,
    [INCENTIVE_CATEGORIES.EXPERIENCE]: 0.2,
    [INCENTIVE_CATEGORIES.OCCASION]: 0.15,
    [INCENTIVE_CATEGORIES.BUSINESS]: 0.15
};

export const FRAUD_CONFIG = {
    MAX_CASHBACK_PERCENT: 20,           // maximum cashback allowed as % of booking
    MAX_STACKABLE: 2,                    // max number of incentives that can be combined
    MAX_REDEMPTIONS_PER_MONTH: 3,
    HIGH_RISK_SCORE_THRESHOLD: 80        // if incentive score > 80, flag as high risk (example)
};

export const DEFAULT_INCENTIVES = [
    { type: INCENTIVE_TYPES.CASHBACK, category: INCENTIVE_CATEGORIES.FINANCIAL, value: 10, description: "10% cashback on booking" },
    { type: INCENTIVE_TYPES.GIFT_CARD, category: INCENTIVE_CATEGORIES.PHYSICAL, value: 20, description: "$20 gift card for local restaurant" },
    { type: INCENTIVE_TYPES.SPA_CREDIT, category: INCENTIVE_CATEGORIES.EXPERIENCE, value: 30, description: "$30 spa credit" },
    { type: INCENTIVE_TYPES.BIRTHDAY_PACKAGE, category: INCENTIVE_CATEGORIES.OCCASION, value: 15, description: "Birthday package (cake & champagne)" },
    { type: INCENTIVE_TYPES.CORPORATE_RATE, category: INCENTIVE_CATEGORIES.BUSINESS, value: 12, description: "Corporate rate discount" }
];

window.IncentiveConfig = {
    INCENTIVE_CATEGORIES,
    INCENTIVE_TYPES,
    INCENTIVE_WEIGHTS,
    FRAUD_CONFIG,
    DEFAULT_INCENTIVES
};