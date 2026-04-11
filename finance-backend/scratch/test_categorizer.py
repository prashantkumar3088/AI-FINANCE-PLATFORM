from app.ai.auto_categorizer import auto_categorize

test_cases = [
    "Uber to office",
    "Lunch at Zomato",
    "Monthly Netflix subscription",
    "Electricity bill payment",
    "Bought medicine from pharmacy",
    "Random unknown string"
]

print("--- Auto-Categorizer Test ---")
for desc in test_cases:
    category = auto_categorize(desc)
    print(f"Description: '{desc}' -> Suggested Category: '{category}'")
