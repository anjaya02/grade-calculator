import type { CourseConfig } from "../types";

export const computerScienceConfig = {
  name: "Computer Science",
  icon: "book",
  theme: "indigo",
  optionalModulesPerLevel: 2,
  modules: {
    l5: {
      core: [
        {
          id: "5COSC019C",
          name: "Object Oriented Programming",
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
          id: "5COSC022C",
          name: "Client-Server Architectures",
          credits: 20,
          mandatory: true,
        },
        {
          id: "5COSC021C",
          name: "Software Development Group Project (SDGP)",
          credits: 20,
          mandatory: true,
        },
      ],
      optional: [
        {
          id: "5COSC026C",
          name: "Advanced Client-side Development",
          credits: 20,
        },
        {
          id: "5COSC023C",
          name: "Mobile Application Development",
          credits: 20,
        },
        {
          id: "5COSC024C",
          name: "Server-side Web Development",
          credits: 20,
        },
        { id: "5COSC025C", name: "HCI & User Experience", credits: 20 },
        {
          id: "5MMCS007C",
          name: "3D Interactive Media Development",
          credits: 20,
        },
        {
          id: "5CCGD013C",
          name: "XR & Multimodal Interaction",
          credits: 20,
        },
        {
          id: "5BUIS020C",
          name: "Information Technology Security",
          credits: 20,
        },
        {
          id: "5SENG003C",
          name: "Algorithms: Theory, Design and Implementation",
          credits: 20,
        },
        {
          id: "5DATA001C",
          name: "Machine Learning and Data Mining",
          credits: 20,
        },
        { id: "5CCGD011C", name: "Game Engine Architecture", credits: 20 },
        {
          id: "5CCGD010C",
          name: "Maths and Physics for Games",
          credits: 20,
        },
        { id: "5ELEN018C", name: "Robotic Principles", credits: 20 },
        { id: "5ELEN018C-2", name: "Sensors & Signals", credits: 20 },
      ],
    },
    l6: {
      core: [
        {
          id: "6COSC023C",
          name: "Final Year Project (FYP)",
          credits: 40,
          mandatory: true,
        },
        {
          id: "6COSC020C",
          name: "Applied AI",
          credits: 20,
          mandatory: true,
        },
        {
          id: "6COSC019C",
          name: "Cyber Security",
          credits: 20,
          mandatory: true,
        },
      ],
      optional: [
        {
          id: "6COSC021C",
          name: "Mobile Native Application Development",
          credits: 20,
        },
        {
          id: "6COSC022C",
          name: "Advanced Server-side Web Programming",
          credits: 20,
        },
        {
          id: "6MMCS009C",
          name: "Usability Testing and Evaluation",
          credits: 20,
        },
        {
          id: "6MMCS008C",
          name: "Advanced Interactive Media Development",
          credits: 20,
        },
        {
          id: "6MARK027C",
          name: "Digital Marketing, Social Media and Web Analytics",
          credits: 20,
        },
        {
          id: "6BUIS019C",
          name: "Strategic Management of Information Systems",
          credits: 20,
        },
        {
          id: "6BUIS018C",
          name: "Information Driven Entrepreneurship and Enterprise",
          credits: 20,
        },
        {
          id: "6DATA005C",
          name: "Operational Research and Optimisation",
          credits: 20,
        },
        { id: "6CCGD002C", name: "Game AI", credits: 20 },
        {
          id: "6MMCS006C",
          name: "Advanced Interactive Media Development",
          credits: 20,
        },
        { id: "6ELEN018C", name: "Applied Robotics", credits: 20 },
        { id: "6NTCM009W", name: "Internet of Things", credits: 20 },
      ],
    },
  },
} satisfies CourseConfig;
