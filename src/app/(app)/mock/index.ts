
import { arrayToTree } from "@src/app/utils";
import bookmarks from "./bookmarks.json";
import type { DDBookmarkTreeNode } from "@src/hooks/useBookmarkStore";
import type { Bookmarks } from "webextension-polyfill";


export const BOOKMARKS: Bookmarks.BookmarkTreeNode[] = bookmarks;

export const FOLDER_MARKDOWN = `# Quick Access
## Frequently Used
## Recently Added
# Work/Career
## Job Search
### Resumes & Cover Letters
### Interview Tips
## Professional Development
### Online Courses
### Certifications
## Networking
### LinkedIn Resources
### Professional Associations
# Personal Development
## Learning
### Online Learning Platforms
### Educational Resources
## Mindfulness & Well-being
### Meditation
### Self-Help Resources
## Skills Development
### Soft Skills
### Hard Skills
# Entertainment
## Movies & TV Shows
### Streaming Services
### Reviews & Recommendations
## Music
### Playlists
### Music Discovery
## Books
### Book Recommendations
### Reading Lists
# News & Current Affairs
## World News
## Technology News
## Health News
# Health & Wellness
## Nutrition
### Healthy Recipes
### Meal Planning
## Fitness
### Workout Plans
### Fitness Apps
## Mental Health
### Resources & Support
### Articles
# Finance & Investment
## Personal Finance
### Budgeting Tools
### Saving Strategies
## Investing
### Stock Market Resources
### Cryptocurrency
## Financial News
### Market Analysis
### Economic Trends
# Technology & Science
## Emerging Technologies
### AI & Machine Learning
### Blockchain
## Science News
### Research Articles
### Scientific Journals
## Tech Reviews
### Gadgets
### Software
# Arts & Culture
## Visual Arts
### Art History
### Contemporary Artists
## Music & Performing Arts
### Concerts & Events
### Music Theory
## Literature
### Poetry
### Literary Criticism
# Social & Community
## Volunteering
### Local Opportunities
### Online Volunteering
## Community Resources
### Local Events
### Support Groups
## Social Media
### Best Practices
### Tools & Resources
# Travel & Exploration
## Travel Guides
### Destinations
### Travel Tips
## Travel Planning
### Itinerary Planning
### Budgeting for Travel
## Cultural Experiences
### Festivals
### Local Customs
# Miscellaneous
## Other Resources
## Unsorted Bookmarks
## Personal Projects
`
const filteredCategory = FOLDER_MARKDOWN.split('\n');
// .filter(item => item.startsWith('#'));
// console.log('filteredCategory', filteredCategory);
export const FOLDER_TREE = arrayToTree(filteredCategory,);
// console.log('FOLDER_TREE', FOLDER_TREE);

export const TAGS = []

// 技能点分类
export const skillsCategory = [
    "学习力",
    "创造力",
    "社交力",
    "咨询力",
    "好奇心",
    "探索欲"
]


