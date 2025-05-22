'use client';

import React from 'react';

const About: React.FC = () => {
  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Ikhanoba Michael Shaka</h1>
          <p className="text-gray-600 dark:text-gray-300">Network, Software & Cloud Engineer</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Summary</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Versatile engineer with expertise in network infrastructure, software development, and cloud technologies. 
            Skilled in designing and implementing robust network solutions, developing scalable applications, and 
            managing cloud infrastructure. Strong background in system optimization and security best practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Network Engineering</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>TCP/IP Networking</li>
                <li>Network Security</li>
                <li>Router & Switch Configuration</li>
                <li>Network Protocols</li>
                <li>WAN/LAN Design</li>
                <li>VPNs & Firewalls</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Software Development</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Python</li>
                <li>JavaScript/TypeScript</li>
                <li>React & Next.js</li>
                <li>Node.js</li>
                <li>RESTful APIs</li>
                <li>Git Version Control</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Cloud & DevOps</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>AWS Services</li>
                <li>Cloud Infrastructure</li>
                <li>Docker & Containerization</li>
                <li>CI/CD Pipelines</li>
                <li>Infrastructure as Code</li>
                <li>Cloud Security</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Experience</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Network & Cloud Engineer</h3>
              <p className="text-gray-600 dark:text-gray-400">Professional Experience • 2023 - Present</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Design and implement secure network infrastructures using industry best practices</li>
                <li>Configure and maintain network equipment including routers, switches, and firewalls</li>
                <li>Deploy and manage cloud infrastructure on AWS platform</li>
                <li>Implement network security measures and monitoring solutions</li>
                <li>Develop automation scripts for network management and monitoring</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Software Engineer</h3>
              <p className="text-gray-600 dark:text-gray-400">Parallel Experience • 2023 - Present</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Develop full-stack applications using modern frameworks and technologies</li>
                <li>Implement RESTful APIs and microservices architectures</li>
                <li>Create responsive web applications with React and Next.js</li>
                <li>Write efficient Python scripts for automation and data processing</li>
                <li>Practice DevOps methodologies including CI/CD and Infrastructure as Code</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Education</h2>
          <div>
            <h3 className="font-semibold">Computer Science</h3>
            <p className="text-gray-600 dark:text-gray-400">Federal University of Technology Minna • 2020 - 2024</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Focus on Network Engineering and Software Development</li>
              <li>Relevant coursework in Cloud Computing and System Administration</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Certifications & Training</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>• Network+ Certification</p>
            <p>• AWS Cloud Practitioner</p>
            <p>• Various Professional Training in Network Security and Cloud Technologies</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Projects</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Portfolio OS Interface</h3>
              <p className="text-gray-700 dark:text-gray-300">
                A unique portfolio website that mimics different operating systems, showcasing full-stack development 
                skills using Next.js, TypeScript, and modern web technologies. Features include dynamic window 
                management, responsive design, and cross-platform compatibility.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Network Monitoring Dashboard</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Developed a comprehensive network monitoring solution using Python and React, integrating with 
                various networking protocols and providing real-time analytics and alerts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Cloud Infrastructure Automation</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Created automated deployment pipelines for cloud infrastructure using AWS Services, 
                implementing Infrastructure as Code principles and security best practices.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
