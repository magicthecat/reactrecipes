export const kanbanConstants = {
    statuses: [
        { status: 'blocked', name: 'Blocked' },
        { status: 'todo', name: 'To Do' },
        { status: 'in-progress', name: 'In Progress' },
        { status: 'approvals', name: 'In Approvals' },
        { status: 'done', name: 'Done' }
    ],
    priorities: [
        { priority: 1, name: 'Must Have' },
        { priority: 2, name: 'Should Have' },
        { priority: 3, name: 'Could Have' },
        { priority: 4, name: "Won't Have" }
    ]
}
