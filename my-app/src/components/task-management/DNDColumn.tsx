import React from "react";
import { Task } from "@/interface/interFace";
import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface DNDColumnProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    handleDeleteTask: (taskId: string) => void;
}

const DNDColumn: React.FC<DNDColumnProps> = ({ tasks, setTasks, handleDeleteTask }) => {
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(result.source.index, 1);

        // Update the task's status based on the destination droppableId
        movedTask.status = result.destination.droppableId as Task["status"];
        updatedTasks.splice(result.destination.index, 0, movedTask);

        // Update the tasks state
        setTasks(updatedTasks);
    };

    const renderTasks = (status: Task["status"]) =>
        tasks
            .filter((task) => task.status === status)
            .map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            p={4}
                            m={2}
                            borderRadius="md"
                            bg={
                                status === "Pending"
                                    ? "yellow.100"
                                    : status === "Completed"
                                        ? "blue.100"
                                        : "green.100"
                            }
                            shadow="sm"
                        >
                            <Text fontWeight="bold" mb={2}>
                                {task.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={4}>
                                {task.description}
                            </Text>
                            <Button
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleDeleteTask(task._id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    )}
                </Draggable>
            ));

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <HStack gap={4} w="full" align="stretch">
                {["Pending", "Completed", "Done"].map((status) => (
                    <Droppable key={status} droppableId={status}>
                        {(provided) => (
                            <Box
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                flex="1"
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                shadow="lg"
                                bg="gray.50"
                            >
                                <Heading
                                    size="md"
                                    mb={4}
                                    textAlign="center"
                                    color={
                                        status === "Pending"
                                            ? "yellow.500"
                                            : status === "Completed"
                                                ? "blue.500"
                                                : "green.500"
                                    }
                                >
                                    {status}
                                </Heading>
                                {renderTasks(status as Task["status"])}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                ))}
            </HStack>
        </DragDropContext>
    );
};

export default DNDColumn;
