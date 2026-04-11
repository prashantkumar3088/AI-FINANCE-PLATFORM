"""
Auto-categorization using keyword matching (no ML model needed — instant, zero overhead).
Can be used when a user adds a new transaction to suggest the category.
"""

# High-priority brand keywords
BRAND_KEYWORDS = {
    "Food & Dining": ["swiggy", "zomato", "starbucks", "mcdonald", "kfc", "domino", "pizza hut", "burger king"],
    "Shopping": ["amazon", "flipkart", "myntra", "ajio", "meesho", "nykaa", "dmart", "reliance"],
    "Entertainment": ["netflix", "hotstar", "spotify", "youtube", "steam", "playstation", "xbox", "disney"],
    "Transportation": ["uber", "ola", "rapido", "irctc", "indigo", "spicejet", "airasia"],
    "Bills": ["airtel", "jio", "bsnl", "vodafone", "idea", "lic", "tata sky"],
    "Savings & Investment": ["zerodha", "groww", "angel", "upstox"]
}

CATEGORY_KEYWORDS = {
    "Food & Dining": [
        "restaurant", "cafe", "pizza", "burger", "food",
        "biryani", "dining", "lunch", "dinner", "breakfast", "meal", "eat", "chai",
        "tea", "coffee", "bakery", "hotel", "dhaba", "canteen", "tiffin"
    ],
    "Shopping": [
        "shop", "store", "mall", "fashion", "clothes", "clothing", "shirt", "shoes",
        "dress", "jeans", "bag", "accessories", "watch", "jewel", "cosmetics",
        "market", "bazaar", "supermart", "grocer", "grocery", "bigbasket",
        "blinkit", "zepto", "instamart"
    ],
    "Entertainment": [
        "prime", "zee5", "sonyliv", "movie", "theatre", "cinema", "pvr", "inox", "concert", "show",
        "game", "gaming", "book", "kindle", "subscription", "streaming", "jiocinema", "ticketing"
    ],
    "Transportation": [
        "auto", "cab", "taxi", "train", "flight", "air", "makemytrip",
        "goibibo", "yatra", "hotel", "oyo", "treebo", "hostel", "bus",
        "redbus", "petrol", "fuel", "gas station", "toll", "metro",
        "ticket", "transport", "travel", "trip", "journey", "commute"
    ],
    "Bills": [
        "electricity", "water", "gas", "internet", "broadband", "wifi",
        "mobile", "recharge", "postpaid", "prepaid", "phone bill", "rent",
        "maintenance", "society", "dtv", "dish", "emi", "insurance", "premium",
        "tax", "gst"
    ],
    "Health": [
        "doctor", "hospital", "clinic", "pharmacy", "medicine", "medic",
        "tablet", "injection", "test", "lab", "diagnostic", "scan", "mri",
        "apollo", "fortis", "max health", "gym", "fitness", "yoga", "health",
        "dental", "physiotherapy", "ayurvedic", "wellness", "medical"
    ],
    "Education": [
        "school", "college", "tuition", "fee", "course", "udemy", "coursera",
        "book", "stationery", "coaching", "exam", "upsc", "gmat", "gre",
        "jee", "neet", "skill", "learning", "workshop", "training", "class"
    ],
    "Savings & Investment": [
        "mutual fund", "sip", "fd", "fixed deposit", "ppf", "epf", "nps",
        "stock", "share", "bond", "gold", "silver", "crypto", "invest", "saving", "rd", "recurring"
    ],
}

def auto_categorize(description: str) -> str:
    """
    Suggests a category based on the transaction description using weighted keyword matching.
    Priority given to brand matches.
    """
    if not description:
        return "Others"

    desc_lower = description.lower()

    scores = {}

    # 1. Check Brands (Weight = 5)
    for category, keywords in BRAND_KEYWORDS.items():
        if any(kw in desc_lower for kw in keywords):
            scores[category] = scores.get(category, 0) + 5

    # 2. Check General Keywords (Weight = 1)
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in desc_lower)
        if score > 0:
            scores[category] = scores.get(category, 0) + score

    if not scores:
        return "Others"

    # Return the category with the highest score
    return max(scores, key=scores.get)


def batch_categorize(descriptions: list[str]) -> list[str]:
    """Categorize a list of descriptions at once."""
    return [auto_categorize(d) for d in descriptions]
