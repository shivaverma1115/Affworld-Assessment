"use client";

import React, { useState } from "react";
import {
    Box,
    Button,
    Input,
    Textarea,
    VStack,
    HStack,
    Heading,
    Text,
} from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Task } from "@/interface/interFace";
import { toast } from "react-toastify";

const TaskManagementMain = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");

    // Add a new task
    const handleAddTask = () => {
        if (!taskName || !taskDescription) {
            toast.warning("All fields are required");
            return;
        }
        setTasks((prevTasks) => [
            ...prevTasks,
            {
                id: Date.now().toString(),
                name: taskName,
                description: taskDescription,
                status: "Pending",
            },
        ]);
        setTaskName("");
        setTaskDescription("");
        toast.success("Task added successfully");
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        toast.success("Task deleted successfully");
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(result.source.index, 1);
        movedTask.status = result.destination.droppableId as Task["status"];
        updatedTasks.splice(result.destination.index, 0, movedTask);
        setTasks(updatedTasks);
    };

    const renderTasks = (status: Task["status"]) =>
        tasks
            .filter((task) => task.status === status)
            .map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
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
                                onClick={() => handleDeleteTask(task.id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    )}
                </Draggable>
            ));

    return (
        <VStack gap={8} p={2} align="stretch" bg="gray.50" minH="100vh"maxW={['30vw','50%','60%']} mx={'auto'}>
            <Box
                w="full"
                maxW="lg"
                p={6}
                borderWidth="1px"
                borderRadius="md"
                shadow="lg"
                bg="white"
            >
                <Heading size="lg" mb={6} color="teal.600" textAlign="center">
                    Task Management System
                </Heading>
                <VStack gap={4}>
                    <Input
                        placeholder="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        bg="gray.100"
                        borderColor="teal.500"
                        border={'1px solid gray'}
                        px={3}
                    />
                    <Textarea
                        placeholder="Task Description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        bg="gray.100"
                        borderColor="teal.500"
                        border={'1px solid gray'}
                        px={3}
                    />
                    <Button
                        bg="teal"
                        w="full"
                        onClick={handleAddTask}
                        size="lg"
                        color={'white'}
                    >
                        Add Task
                    </Button>
                </VStack>
            </Box>

            <DragDropContext onDragEnd={handleDragEnd}>
                <HStack gap={2} w="full" align="stretch" >
                    {["Pending", "Completed", "Done"].map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided) => (
                                <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    flex="1"
                                    p={2}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    shadow="lg"
                                    bg="white"
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
        </VStack>
    );
};

export default TaskManagementMain;
