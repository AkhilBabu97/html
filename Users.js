import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import * as Icon from "react-bootstrap-icons";
import Swal from "sweetalert2";
import CONFIG from "../config";
import RemoteService from "../utils/RemoteService";

class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="modal" id="exampleModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {this.props.title}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={this.props.closeModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Email(props) {
  if (!props.mail) {
    return <td>Not Available </td>;
  }
  return <td>{props.mail}</td>;
}

function Accesslevel(props) {
  if (props.level === "LINEMANAGER") {
    return (
      <td>
        {" "}
        <span className="badge bg-secondary">{props.level} </span>
      </td>
    );
  } else if (props.level === "APPROVER") {
    return (
      <td>
        {" "}
        <span className="badge bg-success">{props.level}</span>
      </td>
    );
  } else if (props.level === "REVIEWER") {
    return (
      <td>
        {" "}
        <span className="badge bg-warning text-dark">{props.level}</span>
      </td>
    );
  }
  return (
    <td>
      {" "}
      <span className="badge bg-dark">{props.level}</span>
    </td>
  );
}

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalTitle: "",
      tableData: []
    };
  }
  async componentDidMount() {
    try {
      let data = await RemoteService("GET", CONFIG.USERS_URL);

      this.setState({
        tableData: data
      });
      console.log(data);
    } catch (error) {
      console.log("Error: ", error);
      Swal.fire({
        title: "Error",
        type: "error",
        text: `Unable to fetch Users data. Please contact Admin.`
      });
    }
  }

  showModal(modalTitle) {
    this.setState({
      modalTitle: modalTitle
    });
    document.getElementById("exampleModal").style.display = "block";
    document.getElementById("exampleModal").style.backgroundColor =
      "rgba(0,0,0,0.6)";
  }

  closeModal() {
    document.getElementById("exampleModal").style.display = "none";
    document.getElementById("exampleModal").style.backgroundColor =
      "rgba(0,0,0)";
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="container mt-2">
          <div className="table-responsive">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm float-right"
              onClick={() => this.showModal("Add User")}
            >
              <Icon.PlusCircle className="mb-1" />
              Add new user{" "}
            </button>
            <table className="table ">
              <thead className="table-light">
                <tr>
                  <th>Username</th>
                  <th>Access Level</th>
                  <th>E-Mail</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.tableData.length > 0 &&
                  this.state.tableData.map((list, i) => (
                    <tr key={i}>
                      <td> {list["USERNAME"]}</td>
                      <Accesslevel level={list["ACCESSLEVEL"].toUpperCase()} />
                      <Email mail={list["Email"]} />
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm mr-4"
                          onClick={() => this.showModal("Edit User")}
                        >
                          <Icon.PencilSquare className="mb-1" />
                          Edit{" "}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm "
                          onClick={() => this.showModal("Remove User")}
                        >
                          <Icon.Trash className="mb-1" />
                          Remove{" "}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Modal title={this.state.modalTitle} closeModal={this.closeModal} />
      </React.Fragment>
    );
  }
}

export default Users;
