import React, { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import ProjectTable from '../components/ProjectTable';
import axios from 'axios';

const MyProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const userId = localStorage.getItem('id');
            const res = await axios.get(`http://127.0.0.1:8001/api/projects/client/?user_id=${userId}`);
            setProjects(res.data);
        };
        fetchProjects();
    }, []);

    return (
        <ClientLayout title="My Projects">
            <ProjectTable projects={projects} />
        </ClientLayout>
    );
};

export default MyProjects;
