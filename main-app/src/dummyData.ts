import { FactionRegistryFull } from "./models/DB/FactionRegistry.model";
import { User } from "./models/DB/User.model";

export const dummyUser: User = {
    email: "vlad.andrei@sdafa.com",
    id: '12',
    username: "vlandero"
}

export const dummyFactionRegistry: FactionRegistryFull = {
    registry: {
        sections: [
            { id: "1", name: "Region" },
            { id: "2", name: "Division" },
            { id: "3", name: "Team" },
            { id: "4", name: "Roster", isTeam: true },
        ],
        assignments: {
            "3": [
                { id: "coach", name: "Coach" },
                { id: "scout", name: "Scout" },
            ],
            "4": [
                { id: "main", name: "Main" },
                { id: "subs", name: "Subs" },
            ],
        },
    },
    players: [
        // Region: NA
        { user: { id: "u1", username: "Alice", email: "alice@example.com" }, sectionPath: ["NA", "Alpha", "Team Rocket"], assignmentId: "coach" },
        { user: { id: "u2", username: "Bob", email: "bob@example.com" }, sectionPath: ["NA", "Alpha", "Team Rocket", "Roster A"], assignmentId: "main" },
        { user: { id: "u3", username: "Charlie", email: "charlie@example.com" }, sectionPath: ["NA", "Alpha", "Team Rocket", "Roster A"], assignmentId: "subs" },
        { user: { id: "u7", username: "Grace", email: "grace@example.com" }, sectionPath: ["NA", "Alpha", "Team Magma", "Roster X"], assignmentId: "main" },
        { user: { id: "u8", username: "Hank", email: "hank@example.com" }, sectionPath: ["NA", "Alpha", "Team Magma", "Roster Y"], assignmentId: "subs" },
        { user: { id: "u9", username: "Ian", email: "ian@example.com" }, sectionPath: ["NA", "Beta", "Team Aqua", "Roster Z"], assignmentId: "main" },

        // Region: EU
        { user: { id: "u4", username: "Diana", email: "diana@example.com" }, sectionPath: ["EU", "Beta", "Team Phoenix"], assignmentId: "coach" },
        { user: { id: "u5", username: "Evan", email: "evan@example.com" }, sectionPath: ["EU", "Beta", "Team Phoenix", "Roster B"], assignmentId: "main" },
        { user: { id: "u6", username: "Fay", email: "fay@example.com" }, sectionPath: ["EU", "Beta", "Team Phoenix", "Roster B"], assignmentId: "subs" },
        { user: { id: "u10", username: "Jade", email: "jade@example.com" }, sectionPath: ["EU", "Gamma", "Team Hydra", "Roster Omega"], assignmentId: "main" },
        { user: { id: "u11", username: "Kyle", email: "kyle@example.com" }, sectionPath: ["EU", "Gamma", "Team Hydra", "Roster Omega"], assignmentId: "subs" }
    ]
}
