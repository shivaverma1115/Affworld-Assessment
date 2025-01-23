export type ITask = {
    userId: string;
    name: string;
    description: string;
    status: "Pending" | "Completed" | "Done";
}