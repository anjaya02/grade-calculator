import type { CourseConfig } from "../types";

export const softwareEngineeringConfig = {
  name: "Software Engineering",
  icon: "code",
  theme: "purple",
  optionalModulesPerLevel: 1,
  modules: {
    l5: {
      core: [
        {
          id: "5COSC021C",
          name: "Software Development Group Project (SDGP)",
          credits: 20,
          mandatory: true,
        },
        {
          id: "5COSC019C",
          name: "Object Oriented Programming",
          credits: 20,
          mandatory: true,
        },
        {
          id: "5SENG003C",
          name: "Algorithms: Theory, Design and Implementation",
          credits: 20,
          mandatory: true,
        },
        {
          id: "5COSC020C",
          name: "Database Systems",
          credits: 20,
          mandatory: true,
        },
        {
          id: "5SENG007C",
          name: "Software Engineering Principles and Practice",
          credits: 20,
          mandatory: true,
        },
      ],
      optional: [
        { id: "5ELEN018C", name: "Robotic Principles", credits: 20 },
        {
          id: "5COSC023C",
          name: "Mobile Application Development",
          credits: 20,
        },
        { id: "5ELEN016C", name: "Operating Systems", credits: 20 },
        {
          id: "5COSC024C",
          name: "Server-side Web Development",
          credits: 20,
        },
        {
          id: "5DATA001C",
          name: "Machine Learning and Data Mining",
          credits: 20,
        },
      ],
    },
    l6: {
      core: [
        {
          id: "6COSC023C.Y",
          name: "Final Year Project (FYP)",
          credits: 40,
          mandatory: true,
        },
        {
          id: "6COSC019C.2",
          name: "Cyber Security",
          credits: 20,
          mandatory: true,
        },
        {
          id: "6SENG005C.1",
          name: "Formal Methods",
          credits: 20,
          mandatory: true,
        },
        {
          id: "6SENG006C.1",
          name: "Concurrent Programming",
          credits: 20,
          mandatory: true,
        },
      ],
      optional: [
        {
          id: "6COSC022C.2",
          name: "Advanced Server-Side Web Programming",
          credits: 20,
        },
        {
          id: "6COSC021C.1",
          name: "Mobile Native Application Development",
          credits: 20,
        },
        {
          id: "6DATA005C.2",
          name: "Operational Research and Optimization",
          credits: 20,
        },
        { id: "6ELEN018C.1", name: "Applied Robotics", credits: 20 },
        { id: "6NTCM009W.2", name: "Internet of Things", credits: 20 },
      ],
    },
  },
} satisfies CourseConfig;
