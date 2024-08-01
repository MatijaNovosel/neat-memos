import { Project } from "@/models/kanban";

export const KANBAN_PROJECTS: Project[] = [
  {
    columns: [
      {
        cards: [
          {
            id: 122,
            name: "Card 1",
            tags: [
              { id: 1, content: "Media", color: "#e69d54" },
              { id: 2, content: "Movies", color: "#e91e63" }
            ],
            description: "Description",
            cover: {
              color: "#1fba28"
            }
          },
          {
            id: 233,
            name: "Card 2",
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            cover: {
              imageUrl:
                "https://i0.wp.com/nftartwithlauren.com/wp-content/uploads/2023/11/laurenmcdonaghpereiraphoto_A_field_of_blooming_sunflowers_und_40d30d23-9ecd-489f-a2b9-5a8f7293af9a_0.png?fit=1024%2C574&ssl=1"
            }
          },
          {
            id: 344,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 3"
          },
          {
            id: 16662,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 4"
          },
          {
            id: 231603,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 5"
          },
          {
            id: 34121654,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 6"
          },
          {
            id: 34455433,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 7"
          },
          {
            id: 166620000,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 8"
          },
          {
            id: 2310006033,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 9"
          },
          {
            id: 341216540001,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 10"
          }
        ],
        id: 152,
        name: "Column 1"
      },
      {
        cards: [
          {
            id: 133,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 1"
          },
          {
            id: 212,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 2"
          },
          {
            id: 377,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 3"
          }
        ],
        id: 268,
        name: "Column 2"
      },
      {
        cards: [
          {
            id: 12,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 1"
          },
          {
            id: 2991,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 2"
          },
          {
            id: 33,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 3"
          }
        ],
        id: 34,
        name: "Column 3"
      },
      {
        cards: [
          {
            id: 166,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 1"
          },
          {
            id: 206,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 2"
          },
          {
            id: 306,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 3"
          }
        ],
        id: 454,
        name: "Column 4"
      }
    ],
    id: 1224,
    name: "Project 1"
  },
  {
    columns: [
      {
        cards: [
          {
            id: 1242,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 1"
          },
          {
            id: 552,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 2"
          },
          {
            id: 3146,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 3"
          }
        ],
        id: 1235,
        name: "Column 1"
      },
      {
        cards: [
          {
            id: 1235,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 1"
          },
          {
            id: 2878,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 2"
          },
          {
            id: 388,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 3"
          }
        ],
        id: 232523,
        name: "Column 2"
      },
      {
        cards: [
          {
            id: 1567,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 1"
          },
          {
            id: 2423,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 2"
          },
          {
            id: 3111,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 3"
          }
        ],
        id: 398,
        name: "Column 3"
      },
      {
        cards: [
          {
            id: 1986,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 1"
          },
          {
            id: 2654,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 2"
          },
          {
            id: 3324,
            tags: [{ id: 1, content: "Media", color: "#e69d54" }],
            name: "Card 3"
          }
        ],
        id: 4234,
        name: "Column 4"
      }
    ],
    id: 2555,
    name: "Project 2"
  }
];
