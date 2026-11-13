import type { CourseConfig } from "../types";

export const softwareEngineeringConfig = {
  id: "se",
  name: "Software Engineering",
  icon: "code",
  theme: "purple",
  optionalModulesPerLevel: 1,
  modules: {
    l5: {
      core: [
        {
          id: "5COSC021C",
          name: "Agile Team Project (ATP)",
          previousName: "Software Development Group Project (SDGP)",
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
          name: "Data Structures and Algorithms",
          previousName: "Algorithms: Theory, Design and Implementation",
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
          name: "Back-end Web Development",
          previousName: "Server-side Web Development",
          credits: 20,
        },
        {
          id: "5DATA001C",
          name: "Practical Machine Learning",
          previousName: "Machine Learning and Data Mining",
          credits: 20,
        },
      ],
    },
    l6: {
      core: [
        {
          id: "6COSC023C",
          legacyIds: ["6COSC023C.Y"],
          name: "Software Engineering Final Project",
          previousName: "Final Year Project (FYP)",
          credits: 40,
          mandatory: true,
        },
        {
          id: "6COSC019C",
          legacyIds: ["6COSC019C.2"],
          name: "Cyber Security",
          credits: 20,
          mandatory: true,
        },
        {
          id: "6SENG005C",
          legacyIds: ["6SENG005C.1"],
          name: "Formal Methods",
          credits: 20,
          mandatory: true,
        },
        {
          id: "6SENG006C",
          legacyIds: ["6SENG006C.1"],
          name: "Concurrent Programming",
          credits: 20,
          mandatory: true,
        },
      ],
      optional: [
        {
          id: "6COSC022C",
          legacyIds: ["6COSC022C.2"],
          name: "Distributed Systems and DevOps Engineering",
          previousName: "Advanced Server-Side Web Programming",
          credits: 20,
        },
        {
          id: "6COSC021C",
          legacyIds: ["6COSC021C.1"],
          name: "iOS Application Development",
          previousName: "Mobile Native Application Development",
          credits: 20,
        },
        {
          id: "6DATA005C",
          legacyIds: ["6DATA005C.2"],
          name: "Operational Research and Optimisation",
          credits: 20,
        },
        {
          id: "6ELEN018C", name: "Applied Robotics", credits: 20,
          legacyIds: ["6ELEN018C.1"],
        },
        {
          id: "6NTCM009C", name: "Internet of Things", credits: 20,
          legacyIds: ["6NTCM009W.2"],
        },
      ],
    },
  },
} satisfies CourseConfig;
