import React, { useState, useEffect } from "react";
import pbl_logo from './assets/img/pbl_logo.png';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "./Headerstaff.js";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function StaffItem() {
  let navigate = useNavigate();
  let location = useLocation();
  

  const [materialMeta, setMaterialMeta] = useState();
  const [materialRowsData, setMaterialData] = useState();


  const getMaterialTable = () => {
    const parameters = {
      cinema: sessionStorage.getItem("EmployeeCinema"),
      department: sessionStorage.getItem("EmployeeDepartment")
    }
    fetch("http://localhost:3001/admin/listMaterial",{
            method: "post", //통신방법
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parameters),
        })
        .then((res) => res.json())
        .then((res) => {
            console.log("res:" + res);
            console.log("res.data: " + res['data']);
            if(res['status']){
               setMaterialMeta(res['data'].metaData );
               setMaterialData(res['data'].rows);
            }
        })
        .catch((err) => {
            console.log(err);
        });
  }



  const initData = () => {
    getMaterialTable();
    return;
  }

  useEffect(()=> initData(), []);
  var cinema = sessionStorage.getItem("EmployeeCinema");
  var dept = sessionStorage.getItem("EmployeeDepartment");

  return (
    
    <>
    <Header state={location.state}/>
      
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">{cinema} 지점의 {dept} 대시보드입니다.</Card.Title>
                <p className="card-category">
                  시설물 목록
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  {makeTableHead(materialMeta)}
                  {makeDataRows(materialRowsData)}
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}


function makeTableHead(list){
  if(!list || list.length==0){
    return (<thead>
      <tr>
        Data not found!
      </tr>
    </thead>)
  }
  return (
    <thead>
      <tr>
        {list.map((data) => (
          <th className="border-0">{data.name}</th>
        ))}
      </tr>
    </thead>);
}

function makeDataRows(data) {
if(!data || data.length==0){
  return (<tbody>
    <tr>
      Data not found!
    </tr>
  </tbody>);
}
return (
  <tbody>
    {data.map((row) => (
      <tr>
        {row.map((e) => (
          <td>{e}</td>
        ))}
      </tr>
    ))}
  </tbody>);

}

export default StaffItem;
