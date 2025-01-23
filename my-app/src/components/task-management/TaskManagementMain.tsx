"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Input,
    Textarea,
    VStack,
    Heading,
    Text,
    HStack,
} from "@chakra-ui/react";
import { Task } from "@/interface/interFace";
import { toast } from "react-toastify";
import axios from 'axios';
import useGlobalContext from "@/hook/use-context";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const TaskManagementMain = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskInfo, setTaskInfo] = useState<Task>({
        _id: '',
        name: '',
        description: '',
        status: 'Pending',
    });
    const { user } = useGlobalContext();

    const handleAddTask = async () => {
        console.log(taskInfo)
        if (!taskInfo.name || !taskInfo.description) {
            toast.warning("All fields are required");
            return;
        }
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}tasks/add`, {
                taskInfo,
                user
            });
            console.log(response)
            if (response.status === 200) {
                setTaskInfo({
                    ...taskInfo,
                    name: '',
                    description: '',
                    status: 'Pending',
                });
                handleGetTasks();
                toast.success("Task added successfully");
            }
        } catch (error) {
            console.error("Error adding task:", error);
            toast.error("Failed to add task");
        }
    };

    const handleGetTasks = async () => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}tasks/${user._id}`)
            .then((res) => {
                console.log(res);
                setTasks(res.data.tasks)
            })
            .catch((err) => console.log(err))
    }

    const handleDeleteTask = async (taskId: string) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}tasks/${taskId}`)
            .then((res) => {
                console.log(res)
                setTasks((ele) => ele.filter((task) => task._id !== taskId));
                toast.success(res.data.message)
            })
            .catch((err) => {
                console.log(err)
            })
    };


    useEffect(() => {
        handleGetTasks();
    }, []);

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
        <VStack gap={[2, 4, 8]} p={2} align="stretch" bg="gray.50" minH="100vh" maxW={['90%', '50%', '60%']} mx={'auto'}>
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
                        value={taskInfo.name}
                        onChange={(e) => setTaskInfo({ ...taskInfo, 'name': e.target.value })}
                        bg="gray.100"
                        borderColor="teal.500"
                        border="1px solid gray"
                        px={3}
                        required
                    />
                    <Textarea
                        placeholder="Task Description"
                        value={taskInfo.description}
                        onChange={(e) => setTaskInfo({ ...taskInfo, 'description': e.target.value })}
                        bg="gray.100"
                        borderColor="teal.500"
                        border="1px solid gray"
                        px={3}
                        required
                    />
                    <Button
                        bg="teal"
                        w="full"
                        onClick={handleAddTask}
                        size="lg"
                        color="white"
                    >
                        Add Task
                    </Button>
                </VStack>
            </Box>

            {/* <DNDColumn tasks={tasks} setTasks={setTasks} handleDeleteTask={handleDeleteTask} /> */}


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
