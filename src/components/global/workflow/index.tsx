"use client";
import React, { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Search,
  Settings,
  Headphones,
  Laptop,
  ChevronLeft,
  Plus,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const WorkflowEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const actions = [
    {
      icon: <Monitor className="w-5 h-5" />,
      title: "AI",
      description:
        "Use the power of AI to summarize, respond, create and much more.",
    },
    {
      icon: <Laptop className="w-5 h-5" />,
      title: "Email",
      description: "Send and email to a user",
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "Discord",
      description: "Post messages to your discord server",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Custom Webhook",
      description:
        "Connect any app that has an API key and send data to your application.",
    },
  ];

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#3B82F6" },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#3B82F6" },
          },
          eds
        )
      ),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const title = event.dataTransfer.getData("nodeName");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type: "default",
        position,
        data: {
          label: (
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>{title}</span>
              </div>
            </div>
          ),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragStart = (event, nodeType, nodeName) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("nodeName", nodeName);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-16 border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <Link href={"/chat"}>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </Link>
        <div className="w-8 h-[1px] bg-gray-200" />
        {["home", "workflow", "settings", "apps"].map((item, index) => (
          <button key={index} className="p-2 hover:bg-gray-100 rounded-lg">
            <div className="w-5 h-5 bg-gray-600 rounded" />
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 p-6 bg-white">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Save</Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Publish
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg h-[calc(100vh-120px)]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-gray-200 p-4">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Actions</span>
            <span className="text-gray-500">Settings</span>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input className="pl-9" placeholder="Quick Search" />
          </div>

          <div className="space-y-2">
            {actions.map((action, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 cursor-move transition-colors"
                draggable
                onDragStart={(event) =>
                  onDragStart(event, "default", action.title)
                }
              >
                <div className="flex items-center space-x-3">
                  {action.icon}
                  <div>
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;
