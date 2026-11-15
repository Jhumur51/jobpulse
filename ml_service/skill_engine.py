from typing import List, Dict, Any

SKILLS_DATABASE: List[Dict[str, Any]] = [
    # AI & ML
    {
        "name": "Large Language Models (LLMs)",
        "category": "AI and Machine Learning",
        "frequency": 14200,
        "historical_trajectory": [450, 580, 720, 890, 1050, 1220, 1400, 1580, 1790, 1980, 2150, 2380],
        "growth_percentage": 428.8,
        "trend_classification": "Emerging",
        "demand_index": 98.4
    },
    {
        "name": "PyTorch",
        "category": "AI and Machine Learning",
        "frequency": 28400,
        "historical_trajectory": [1900, 1980, 2100, 2220, 2300, 2410, 2480, 2550, 2620, 2700, 2780, 2860],
        "growth_percentage": 50.5,
        "trend_classification": "Emerging",
        "demand_index": 92.1
    },
    {
        "name": "Vector Databases (RAG)",
        "category": "AI and Machine Learning",
        "frequency": 9800,
        "historical_trajectory": [220, 310, 420, 550, 700, 890, 1020, 1200, 1350, 1510, 1680, 1850],
        "growth_percentage": 740.9,
        "trend_classification": "Emerging",
        "demand_index": 89.6
    },
    {
        "name": "Scikit-Learn",
        "category": "AI and Machine Learning",
        "frequency": 24100,
        "historical_trajectory": [1950, 1980, 2010, 2040, 2030, 2050, 2040, 2060, 2050, 2070, 2060, 2080],
        "growth_percentage": 6.7,
        "trend_classification": "Stable",
        "demand_index": 81.2
    },
    {
        "name": "TensorFlow",
        "category": "AI and Machine Learning",
        "frequency": 21500,
        "historical_trajectory": [2100, 2050, 2020, 1980, 1920, 1890, 1850, 1810, 1780, 1750, 1720, 1690],
        "growth_percentage": -19.5,
        "trend_classification": "Declining",
        "demand_index": 74.0
    },

    # Cloud & DevOps
    {
        "name": "Kubernetes",
        "category": "Cloud and DevOps",
        "frequency": 38900,
        "historical_trajectory": [2900, 3010, 3120, 3200, 3310, 3400, 3490, 3550, 3620, 3700, 3780, 3850],
        "growth_percentage": 32.8,
        "trend_classification": "High-Demand",
        "demand_index": 95.3
    },
    {
        "name": "Docker",
        "category": "Cloud and DevOps",
        "frequency": 46200,
        "historical_trajectory": [3700, 3750, 3810, 3850, 3900, 3940, 3990, 4030, 4080, 4120, 4160, 4200],
        "growth_percentage": 13.5,
        "trend_classification": "High-Demand",
        "demand_index": 97.8
    },
    {
        "name": "Terraform",
        "category": "Cloud and DevOps",
        "frequency": 26800,
        "historical_trajectory": [1950, 2040, 2130, 2220, 2310, 2400, 2480, 2550, 2630, 2710, 2790, 2870],
        "growth_percentage": 47.2,
        "trend_classification": "Emerging",
        "demand_index": 88.7
    },
    {
        "name": "Amazon Web Services (AWS)",
        "category": "Cloud and DevOps",
        "frequency": 54200,
        "historical_trajectory": [4300, 4380, 4450, 4510, 4590, 4650, 4710, 4780, 4850, 4920, 4990, 5060],
        "growth_percentage": 17.7,
        "trend_classification": "High-Demand",
        "demand_index": 99.1
    },

    # Programming
    {
        "name": "Python",
        "category": "Programming",
        "frequency": 62400,
        "historical_trajectory": [4800, 4920, 5050, 5180, 5300, 5420, 5550, 5680, 5800, 5920, 6050, 6180],
        "growth_percentage": 28.8,
        "trend_classification": "High-Demand",
        "demand_index": 100.0
    },
    {
        "name": "TypeScript",
        "category": "Programming",
        "frequency": 41500,
        "historical_trajectory": [3100, 3220, 3350, 3480, 3600, 3720, 3850, 3970, 4100, 4220, 4350, 4480],
        "growth_percentage": 44.5,
        "trend_classification": "Emerging",
        "demand_index": 93.6
    },
    {
        "name": "Rust",
        "category": "Programming",
        "frequency": 11200,
        "historical_trajectory": [680, 740, 810, 880, 960, 1040, 1120, 1210, 1300, 1390, 1490, 1600],
        "growth_percentage": 135.3,
        "trend_classification": "Emerging",
        "demand_index": 84.5
    },
    {
        "name": "Go (Golang)",
        "category": "Programming",
        "frequency": 25600,
        "historical_trajectory": [1850, 1940, 2030, 2120, 2210, 2300, 2390, 2480, 2570, 2660, 2750, 2850],
        "growth_percentage": 54.1,
        "trend_classification": "Emerging",
        "demand_index": 87.2
    },
    {
        "name": "Java",
        "category": "Programming",
        "frequency": 39800,
        "historical_trajectory": [3450, 3440, 3420, 3410, 3390, 3380, 3360, 3350, 3330, 3320, 3300, 3280],
        "growth_percentage": -4.9,
        "trend_classification": "Stable",
        "demand_index": 85.0
    },
    {
        "name": "PHP",
        "category": "Programming",
        "frequency": 16400,
        "historical_trajectory": [1700, 1650, 1610, 1560, 1520, 1470, 1430, 1380, 1340, 1300, 1260, 1220],
        "growth_percentage": -28.2,
        "trend_classification": "Declining",
        "demand_index": 61.4
    },

    # Web Development
    {
        "name": "React.js",
        "category": "Web Development",
        "frequency": 44300,
        "historical_trajectory": [3550, 3620, 3700, 3780, 3850, 3920, 4000, 4070, 4150, 4220, 4300, 4380],
        "growth_percentage": 23.4,
        "trend_classification": "High-Demand",
        "demand_index": 96.2
    },
    {
        "name": "Next.js",
        "category": "Web Development",
        "frequency": 24800,
        "historical_trajectory": [1600, 1720, 1850, 1980, 2120, 2260, 2400, 2550, 2700, 2860, 3020, 3190],
        "growth_percentage": 99.4,
        "trend_classification": "Emerging",
        "demand_index": 90.1
    },
    {
        "name": "Node.js",
        "category": "Web Development",
        "frequency": 37100,
        "historical_trajectory": [2950, 3020, 3090, 3160, 3230, 3300, 3370, 3440, 3510, 3580, 3650, 3720],
        "growth_percentage": 26.1,
        "trend_classification": "High-Demand",
        "demand_index": 91.5
    },

    # Data and Analytics
    {
        "name": "Apache Spark",
        "category": "Data and Analytics",
        "frequency": 22400,
        "historical_trajectory": [1700, 1760, 1820, 1880, 1940, 2000, 2060, 2120, 2180, 2240, 2300, 2360],
        "growth_percentage": 38.8,
        "trend_classification": "High-Demand",
        "demand_index": 86.8
    },
    {
        "name": "Snowflake / BigQuery",
        "category": "Data and Analytics",
        "frequency": 27900,
        "historical_trajectory": [1980, 2090, 2200, 2320, 2440, 2560, 2690, 2810, 2940, 3070, 3200, 3340],
        "growth_percentage": 68.7,
        "trend_classification": "Emerging",
        "demand_index": 92.4
    },
    {
        "name": "SQL",
        "category": "Data and Analytics",
        "frequency": 58600,
        "historical_trajectory": [4700, 4750, 4810, 4860, 4920, 4970, 5030, 5080, 5140, 5190, 5250, 5300],
        "growth_percentage": 12.8,
        "trend_classification": "High-Demand",
        "demand_index": 98.9
    },

    # Cybersecurity
    {
        "name": "Zero Trust Architecture",
        "category": "Cybersecurity",
        "frequency": 13900,
        "historical_trajectory": [780, 860, 950, 1040, 1140, 1240, 1350, 1460, 1580, 1700, 1830, 1960],
        "growth_percentage": 151.3,
        "trend_classification": "Emerging",
        "demand_index": 88.0
    },
    {
        "name": "SIEM & SOC Operations",
        "category": "Cybersecurity",
        "frequency": 19400,
        "historical_trajectory": [1500, 1540, 1580, 1620, 1660, 1700, 1740, 1780, 1820, 1860, 1900, 1940],
        "growth_percentage": 29.3,
        "trend_classification": "High-Demand",
        "demand_index": 83.5
    },

    # Business and Soft Skills
    {
        "name": "Agile / Scrum Leadership",
        "category": "Business and Soft Skills",
        "frequency": 31200,
        "historical_trajectory": [2600, 2610, 2620, 2630, 2620, 2640, 2630, 2650, 2640, 2660, 2650, 2670],
        "growth_percentage": 2.7,
        "trend_classification": "Stable",
        "demand_index": 79.2
    },
    {
        "name": "Cross-Functional Collaboration",
        "category": "Business and Soft Skills",
        "frequency": 35400,
        "historical_trajectory": [2800, 2830, 2860, 2890, 2920, 2950, 2980, 3010, 3040, 3070, 3100, 3130],
        "growth_percentage": 11.8,
        "trend_classification": "High-Demand",
        "demand_index": 86.0
    }
]

def get_skills_intelligence(category: str = None, trend: str = None, search: str = None) -> List[Dict[str, Any]]:
    skills = SKILLS_DATABASE.copy()

    if category and category != "All":
        skills = [s for s in skills if s["category"].lower() == category.lower()]

    if trend and trend != "All":
        skills = [s for s in skills if s["trend_classification"].lower() == trend.lower()]

    if search:
        s_lower = search.lower().strip()
        skills = [s for s in skills if s_lower in s["name"].lower() or s_lower in s["category"].lower()]

    return sorted(skills, key=lambda x: x["frequency"], reverse=True)

