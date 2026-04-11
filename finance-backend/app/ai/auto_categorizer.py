"""
Auto-categorization using keyword matching (no ML model needed — instant, zero overhead).
Can be used when a user adds a new transaction to suggest the category.
"""

CATEGORY_KEYWORDS = {
    "Food & Dining": [
        "swiggy", "zomato", "restaurant", "cafe", "pizza", "burger", "food",
        "biryani", "starbucks", "mcdonald", "mcdonalds", "kfc", "domino",
        "dining", "lunch", "dinner", "breakfast", "meal", "eat", "chai",
        "tea", "coffee", "bakery", "hotel", "dhaba", "canteen", "tiffin"
    ],
    "Shopping": [
        "amazon", "flipkart", "myntra", "ajio", "meesho", "nykaa", "shop",
        "store", "mall", "fashion", "clothes", "clothing", "shirt", "shoes",
        "dress", "jeans", "bag", "accessories", "watch", "jewel", "cosmetics",
        "market", "bazaar", "supermart", "grocer", "grocery", "bigbasket",
        "blinkit", "zepto", "instamart", "dmart", "reliance"
    ],
    "Entertainment": [
        "netflix", "hotstar", "prime", "spotify", "youtube", "zee5", "sonyliv",
        "movie", "theatre", "cinema", "pvr", "inox", "concert", "show",
        "game", "gaming", "steam", "playstation", "xbox", "book", "kindle",
        "subscription", "streaming", "disney", "jiocinema", "ticketing"
    ],
    "Travel": [
        "uber", "ola", "rapido", "auto", "cab", "taxi", "irctc", "train",
        "flight", "air", "indigo", "spicejet", "airasia", "makemytrip",
        "goibibo", "yatra", "hotel", "oyo", "treebo", "hostel", "bus",
        "redbus", "petrol", "fuel", "gas station", "toll", "metro",
        "ticket", "transport", "travel", "trip", "journey", "commute"
    ],
    "Bills": [
        "electricity", "water", "gas", "internet", "broadband", "wifi",
        "mobile", "recharge", "postpaid", "prepaid", "phone bill", "rent",
        "maintenance", "society", "dtv", "dish", "tata sky", "jio", "airtel",
        "bsnl", "vi", "vodafone", "idea", "emi", "insurance", "premium",
        "tax", "gst", "lic"
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
        "zerodha", "groww", "angel", "upstox", "stock", "share", "bond",
        "gold", "silver", "crypto", "invest", "saving", "rd", "recurring"
    ],
}

def auto_categorize(description: str) -> str:
    """
    Suggests a category based on the transaction description using keyword matching.
    Returns the best-matching category or 'Others' if no match found.
    """
    if not description:
        return "Others"

    desc_lower = description.lower()

    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in desc_lower)
        if score > 0:
            scores[category] = score

    if not scores:
        return "Others"

    return max(scores, key=scores.get)


def batch_categorize(descriptions: list[str]) -> list[str]:
    """Categorize a list of descriptions at once."""
    return [auto_categorize(d) for d in descriptions]
