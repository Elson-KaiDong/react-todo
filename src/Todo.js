import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from "react-bootstrap/Form";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const Todo = () => {
    const todos = [
        {
            id: 1,
            title: "Doing Laundry",
            status: "New",
            description: "Wash Clothes"
        },
        {
            id: 2,
            title: "Go to gym",
            status: "Done",
            description: "Chest workout"
        },
        {
            id: 3,
            title: "Do Revision",
            status: "In Progress",
            description: "On software development"
        },
    ]

    const [data, setData] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');

    const [editID, setEditID] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStatus, setEditStatus] = useState('');

    useEffect(()=>{
        getData();
    }, [])

    const getData = () => {
        axios.get('https://localhost:7138/api/Todo')
        .then((result) =>{
            setData(result.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleEdit =(id) => {
        handleShow();
        axios.get(`https://localhost:7138/api/Todo/${id}`)
        .then((result => {
            setEditTitle(result.data.title);
            setEditDescription(result.data.description);
            setEditStatus(result.data.status);
            setEditID(id);
        }))
        .catch((error)=>{
            toast.error(error);
        })
    }

    const handleDelete =(id) => {
        if(window.confirm("are you sure to delete this employee") == true){
            axios.delete(`https://localhost:7138/api/Todo/${id}`)
            .then((result)=>{
                if(result.status === 200)
                {
                    toast.success("Task deleted successfully");
                    getData();
                }
            })
            .catch((error)=>{
                toast.error(error);
            })
        }
    }

    const handleUpdate = (id) => {
        const url = `https://localhost:7138/api/Todo/${editID}`;
        const data = 
            {
                "id" : editID,
                "title": editTitle,
                "description": editDescription,
                "status": editStatus
            }
        axios.put(url, data)
        .then((result => {
            handleClose();
            getData();
            clear();
            toast.success("New Task has been updated.")
        }))
        .catch((error)=>{
            toast.error(error);
        })
    }

    const handleSave = () => {
        const url = "https://localhost:7138/api/Todo";
        const data = 
            {
                "title": title,
                "description": description,
                "status": status
            }
        axios.post(url, data)
        .then((result => {
            getData();
            clear();
            toast.success("New Task has been added.")
        }))
        .catch((error)=>{
            toast.error(error);
        })
    }

    const clear = () => {
        setTitle('');
        setDescription('');
        setStatus("New");
        setEditTitle('');
        setEditDescription('');
        setEditStatus("New");
        setEditID('');
    }

    const handleStatusChange =(e) => {
        setStatus(e.target.value)
    }

    return (
        <Fragment>
            <ToastContainer/>
            <Container fluid>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </Col>
                    <Col>
                        <Form.Select aria-label="Status" value={status} onChange={handleStatusChange}>
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={()=> handleSave()}>Add Task</button>
                    </Col>                    
                </Row>
            </Container>
            
            <br></br>


            <Table hover size="small" variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.title}</td>
                                        <td>{item.status}</td>
                                        <td>{item.description}</td>
                                        <td colSpan={2} >
                                            <button className="btn btn-primary" onClick={()=> handleEdit(item.id)}>Edit</button> &nbsp;
                                            <button className="btn btn-danger" onClick={()=>handleDelete(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            'Loading...'
                    }
                    
                    
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit To-Do</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row>
                <Col>
                        <input type="text" className="form-control" placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}/>
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}/>
                    </Col>
                    <Col>
                        <Form.Select aria-label="Status" value={editStatus} defaultValue={"1"} onChange={(e) => setEditStatus(e.target.value)}>
                            <option>Select Status</option>
                            <option value="1">New</option>
                            <option value="2">In Progress</option>
                            <option value="3">Done</option>
                        </Form.Select>
                    </Col>          
                </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
        
    )
}

export default Todo;